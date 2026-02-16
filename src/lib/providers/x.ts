import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const RAPIDAPI_HOST = "twitter-x.p.rapidapi.com";

async function rapidApiFetch(path: string, params?: Record<string, string>) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new ProviderError("x", "RAPIDAPI_KEY not configured");

  const url = new URL(`https://${RAPIDAPI_HOST}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("x", `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class XProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await rapidApiFetch("/user/details", { username });
    const user = data?.data?.user?.result;
    if (!user) throw new ProfileNotFoundError("x", username);

    const legacy = user.legacy || {};
    return {
      username: legacy.screen_name || username,
      displayName: legacy.name || "",
      avatar: legacy.profile_image_url_https?.replace("_normal", "_400x400") || "",
      bio: legacy.description || "",
      followers: legacy.followers_count || 0,
      following: legacy.friends_count || 0,
      posts: legacy.statuses_count || 0,
      isVerified: user.is_blue_verified || false,
      externalUrl: legacy.url || undefined,
      pinnedTweet: legacy.pinned_tweet_ids_str?.[0] || undefined,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    // First get rest_id from user details
    const userData = await rapidApiFetch("/user/details", { username });
    const restId = userData?.data?.user?.result?.rest_id;
    if (!restId) return [];

    const totalPosts = userData?.data?.user?.result?.legacy?.statuses_count || 0;

    let tweets = await this._parseTweets(restId, limit);

    // Retry once if API returned 0 tweets but account has posts
    if (tweets.length === 0 && totalPosts > 0) {
      await new Promise((r) => setTimeout(r, 500));
      tweets = await this._parseTweets(restId, limit);
    }

    return tweets;
  }

  private async _parseTweets(restId: string, limit: number): Promise<PostData[]> {
    const data = await rapidApiFetch("/user/tweets", {
      user_id: restId,
      limit: String(Math.min(limit, 20)),
    });

    const instructions = data?.data?.user?.result?.timeline?.timeline?.instructions || [];
    const tweets: PostData[] = [];

    for (const inst of instructions) {
      const entries = inst.entries || (inst.entry ? [inst.entry] : []);
      for (const entry of entries) {
        if (tweets.length >= limit) break;
        const tweetResult = entry?.content?.itemContent?.tweet_results?.result;
        const legacy = tweetResult?.legacy;
        if (!legacy?.full_text) continue;

        // Skip retweets for scoring accuracy
        if (legacy.full_text.startsWith("RT @")) continue;

        const text = legacy.full_text as string;
        const hashtags = (legacy.entities?.hashtags || []).map((h: { text: string }) => h.text);
        const media = legacy.entities?.media || [];

        let type = "text";
        if (media.length > 0) {
          const mediaType = media[0].type;
          if (mediaType === "video" || mediaType === "animated_gif") type = "video";
          else if (mediaType === "photo") type = "image";
        }
        if (text.includes("🧵") || text.startsWith("1/")) type = "thread";

        tweets.push({
          id: legacy.id_str || String(tweetResult.rest_id || ""),
          type,
          likes: legacy.favorite_count || 0,
          comments: legacy.reply_count || 0,
          replies: legacy.reply_count || 0,
          retweets: legacy.retweet_count || 0,
          quotes: legacy.quote_count || 0,
          bookmarks: legacy.bookmark_count || 0,
          impressions: Number(tweetResult.views?.count) || 0,
          timestamp: legacy.created_at
            ? new Date(legacy.created_at).toISOString()
            : new Date().toISOString(),
          caption: text,
          hashtags,
        });
      }
    }

    return tweets.slice(0, limit);
  }
}
