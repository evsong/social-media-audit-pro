import type { Provider, ProfileData, PostData } from "./types";
import { ProfileNotFoundError, ProviderError } from "./types";

const RAPIDAPI_HOST = "instagram-scraper-api2.p.rapidapi.com";

async function rapidApiFetch(path: string) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new ProviderError("instagram", "RAPIDAPI_KEY not configured");

  const res = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ProviderError("instagram", `API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export class InstagramProvider implements Provider {
  async fetchProfile(username: string): Promise<ProfileData> {
    const data = await rapidApiFetch(`/v1/info?username_or_id_or_url=${encodeURIComponent(username)}`);
    if (!data?.data) throw new ProfileNotFoundError("instagram", username);

    const d = data.data;
    return {
      username: d.username || username,
      displayName: d.full_name || "",
      avatar: d.profile_pic_url_hd || d.profile_pic_url || "",
      bio: d.biography || "",
      followers: d.follower_count || 0,
      following: d.following_count || 0,
      posts: d.media_count || 0,
      isVerified: d.is_verified || false,
      externalUrl: d.external_url || undefined,
      highlights: (d.highlight_reel_count || 0) > 0,
    };
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    const data = await rapidApiFetch(`/v1.2/posts?username_or_id_or_url=${encodeURIComponent(username)}`);
    if (!data?.data?.items) return [];

    const items = data.data.items.slice(0, limit);
    return items.map((item: Record<string, unknown>) => {
      const caption = (item.caption as Record<string, unknown>)?.text as string || "";
      const hashtagMatches = caption.match(/#[\w\u00C0-\u024F]+/g) || [];

      let type = "image";
      if (item.media_type === 2 || item.video_url) type = "video";
      if (item.product_type === "clips") type = "reel";
      if (item.carousel_media) type = "carousel";

      return {
        id: String(item.pk || item.id || ""),
        type,
        likes: (item.like_count as number) || 0,
        comments: (item.comment_count as number) || 0,
        timestamp: item.taken_at
          ? new Date((item.taken_at as number) * 1000).toISOString()
          : new Date().toISOString(),
        caption,
        hashtags: hashtagMatches.map((h: string) => h.slice(1)),
      };
    });
  }
}
