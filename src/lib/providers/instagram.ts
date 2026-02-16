import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const RAPIDAPI_HOST = "instagram120.p.rapidapi.com";

async function rapidApiPost(path: string, body: Record<string, string>) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new ProviderError("instagram", "RAPIDAPI_KEY not configured");

  const res = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("instagram", `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class InstagramProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await rapidApiPost("/api/instagram/userInfo", { username });
    const user = data?.result?.[0]?.user;
    if (!user) throw new ProfileNotFoundError("instagram", username);

    return {
      username: user.uniqueId || user.username || username,
      displayName: user.full_name || "",
      avatar: user.hd_profile_pic_url_info?.url || user.profile_pic_url || "",
      bio: user.biography || user.signature || "",
      followers: user.follower_count || 0,
      following: user.following_count || 0,
      posts: user.media_count || 0,
      isVerified: user.is_verified || false,
      externalUrl: user.external_url || undefined,
      highlights: user.has_highlight_reels || false,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    const data = await rapidApiPost("/api/instagram/posts", { username });
    const edges = data?.result?.edges;
    if (!edges) return [];

    return edges.slice(0, limit).map((edge: Record<string, unknown>) => {
      const node = edge.node as Record<string, unknown>;
      const caption = (node.caption as Record<string, unknown>)?.text as string || "";
      const hashtagMatches = caption.match(/#[\w\u00C0-\u024F]+/g) || [];

      let type = "image";
      const mediaType = node.media_type as number;
      const productType = node.product_type as string;
      if (mediaType === 2 || node.video_versions) type = "video";
      if (productType === "clips") type = "reel";
      if (mediaType === 8 || node.carousel_media) type = "carousel";

      return {
        id: String(node.pk || node.id || ""),
        type,
        likes: (node.like_count as number) || 0,
        comments: (node.comment_count as number) || 0,
        timestamp: node.taken_at
          ? new Date((node.taken_at as number) * 1000).toISOString()
          : new Date().toISOString(),
        caption,
        hashtags: hashtagMatches.map((h: string) => h.slice(1)),
      };
    });
  }
}
