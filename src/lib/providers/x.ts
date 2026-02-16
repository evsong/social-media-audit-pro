import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const BASE_URL = "https://api.tweetapi.com/tw-v2";

async function tweetApiFetch(path: string, params?: Record<string, string>) {
  const key = process.env.TWEETAPI_KEY;
  if (!key) throw new ProviderError("x", "TWEETAPI_KEY not configured");

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { "X-API-Key": key },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("x", `TweetAPI error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class XProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await tweetApiFetch("/user/by-username", { username });
    const user = data?.data;
    if (!user) throw new ProfileNotFoundError("x", username);

    return {
      username: user.username || username,
      displayName: user.name || "",
      avatar: user.avatar?.replace("_normal", "_400x400") || "",
      bio: user.bio || "",
      followers: user.followerCount || 0,
      following: user.followingCount || 0,
      posts: user.tweetCount || 0,
      isVerified: user.isBlueVerified || false,
      externalUrl: user.website || undefined,
      pinnedTweet: user.pinnedTweetIds?.[0] || undefined,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    // Step 1: get userId from profile
    const profileData = await tweetApiFetch("/user/by-username", { username });
    const userId = profileData?.data?.id;
    if (!userId) return [];

    // Step 2: fetch tweets
    const data = await tweetApiFetch("/user/tweets", { userId });
    const tweets = data?.data;
    if (!Array.isArray(tweets)) return [];

    const posts: PostData[] = [];
    for (const t of tweets) {
      if (posts.length >= limit) break;
      if (t.type === "retweet") continue; // skip retweets for scoring accuracy

      const text = t.text || "";
      const media = t.media || [];
      let type = "text";
      if (media.length > 0) {
        const m = media[0];
        if (m.type === "video" || m.type === "animated_gif") type = "video";
        else if (m.type === "photo") type = "image";
      }
      if (text.includes("🧵") || text.startsWith("1/")) type = "thread";

      posts.push({
        id: t.id || "",
        type,
        likes: t.likeCount || 0,
        comments: t.replyCount || 0,
        replies: t.replyCount || 0,
        retweets: t.retweetCount || 0,
        quotes: t.quoteCount || 0,
        bookmarks: t.bookmarkCount || 0,
        impressions: t.viewCount || 0,
        timestamp: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
        caption: text,
        hashtags: (t.hashtags || []).map((h: { text?: string; tag?: string }) => h.text || h.tag || ""),
      });
    }

    return posts;
  }
}
