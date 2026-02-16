import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const BASE_URL = "https://api.x.com/2";

async function xApiFetch(path: string, params?: Record<string, string>) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) throw new ProviderError("x", "X_BEARER_TOKEN not configured");

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("x", `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class XProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await xApiFetch(`/users/by/username/${encodeURIComponent(username)}`, {
      "user.fields": "description,profile_image_url,public_metrics,verified,url,pinned_tweet_id",
    });

    if (!data?.data) throw new ProfileNotFoundError("x", username);

    const user = data.data;
    const metrics = user.public_metrics || {};
    return {
      username: user.username || username,
      displayName: user.name || "",
      avatar: user.profile_image_url?.replace("_normal", "_400x400") || "",
      bio: user.description || "",
      followers: metrics.followers_count || 0,
      following: metrics.following_count || 0,
      posts: metrics.tweet_count || 0,
      isVerified: user.verified || false,
      externalUrl: user.url || undefined,
      pinnedTweet: user.pinned_tweet_id || undefined,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    // First get user ID
    const userData = await xApiFetch(`/users/by/username/${encodeURIComponent(username)}`);
    if (!userData?.data?.id) return [];

    const userId = userData.data.id;
    const data = await xApiFetch(`/users/${userId}/tweets`, {
      max_results: String(Math.min(limit, 100)),
      "tweet.fields": "public_metrics,created_at,entities,attachments",
      "media.fields": "type",
      expansions: "attachments.media_keys",
    });

    if (!data?.data) return [];

    const mediaMap = new Map<string, string>();
    if (data.includes?.media) {
      for (const m of data.includes.media) {
        mediaMap.set(m.media_key, m.type);
      }
    }

    return data.data.slice(0, limit).map((tweet: Record<string, unknown>) => {
      const text = (tweet.text as string) || "";
      const entities = tweet.entities as Record<string, unknown[]> | undefined;
      const hashtags = (entities?.hashtags as Array<{ tag: string }>) || [];
      const metrics = (tweet.public_metrics as Record<string, number>) || {};

      const mediaKeys = ((tweet.attachments as Record<string, string[]>)?.media_keys) || [];
      let type = "text";
      for (const key of mediaKeys) {
        const mediaType = mediaMap.get(key);
        if (mediaType === "video" || mediaType === "animated_gif") { type = "video"; break; }
        if (mediaType === "photo") type = "image";
      }
      if (text.includes("🧵") || text.startsWith("1/")) type = "thread";

      return {
        id: String(tweet.id || ""),
        type,
        likes: metrics.like_count || 0,
        comments: metrics.reply_count || 0,
        replies: metrics.reply_count || 0,
        retweets: metrics.retweet_count || 0,
        quotes: metrics.quote_count || 0,
        bookmarks: metrics.bookmark_count || 0,
        impressions: metrics.impression_count || 0,
        timestamp: (tweet.created_at as string) || new Date().toISOString(),
        caption: text,
        hashtags: hashtags.map((h) => h.tag),
      };
    });
  }
}
