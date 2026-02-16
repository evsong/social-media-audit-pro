import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const RAPIDAPI_HOST = "tiktok-api23.p.rapidapi.com";

async function rapidApiFetch(path: string) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new ProviderError("tiktok", "RAPIDAPI_KEY not configured");

  const res = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("tiktok", `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class TikTokProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await rapidApiFetch(`/api/user/info?uniqueId=${encodeURIComponent(username)}`);
    if (!data?.userInfo?.user) throw new ProfileNotFoundError("tiktok", username);

    const user = data.userInfo.user;
    const stats = data.userInfo.stats || {};
    return {
      username: user.uniqueId || username,
      displayName: user.nickname || "",
      avatar: user.avatarLarger || user.avatarMedium || "",
      bio: user.signature || "",
      followers: stats.followerCount || 0,
      following: stats.followingCount || 0,
      posts: stats.videoCount || 0,
      isVerified: user.verified || false,
      likes: stats.heartCount || 0,
      videos: stats.videoCount || 0,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    // Posts API requires secUid — fetch it from user info first
    const userInfo = await rapidApiFetch(`/api/user/info?uniqueId=${encodeURIComponent(username)}`);
    const secUid = userInfo?.userInfo?.user?.secUid;
    if (!secUid) return [];

    const data = await rapidApiFetch(`/api/user/posts?secUid=${encodeURIComponent(secUid)}&count=${limit}`);
    // Posts endpoint with secUid wraps response under data.itemList
    const items = data?.itemList || data?.data?.itemList;
    if (!items) return [];

    return items.slice(0, limit).map((item: Record<string, unknown>) => {
      const desc = (item.desc as string) || "";
      const hashtagMatches = desc.match(/#[\w\u00C0-\u024F]+/g) || [];
      const stats = (item.stats as Record<string, number>) || {};

      let type = "video";
      if (item.duetInfo) type = "duet";
      if (item.stickersOnItem) type = "stitch";

      return {
        id: String(item.id || ""),
        type,
        likes: stats.diggCount || 0,
        comments: stats.commentCount || 0,
        views: stats.playCount || 0,
        shares: stats.shareCount || 0,
        saves: stats.collectCount || 0,
        timestamp: item.createTime
          ? new Date((item.createTime as number) * 1000).toISOString()
          : new Date().toISOString(),
        caption: desc,
        hashtags: hashtagMatches.map((h: string) => h.slice(1)),
      };
    });
  }
}
