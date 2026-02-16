import type { Provider, ProfileData, PostData, Platform } from "./types";

const MOCK_PROFILES: Record<Platform, (username: string) => ProfileData> = {
  instagram: (username) => ({
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatar: "",
    bio: "📸 Content Creator | 🌍 Traveler | 💡 Sharing ideas daily",
    followers: 1_240_000,
    following: 892,
    posts: 1_347,
    isVerified: true,
    externalUrl: `https://example.com/${username}`,
    highlights: true,
  }),
  tiktok: (username) => ({
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatar: "",
    bio: "🎬 Making videos | 🔥 10M+ views",
    followers: 3_500_000,
    following: 245,
    posts: 412,
    isVerified: true,
    likes: 89_000_000,
    videos: 412,
  }),
  x: (username) => ({
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatar: "",
    bio: "Thoughts, ideas, and occasional hot takes.",
    followers: 850_000,
    following: 1_203,
    posts: 24_500,
    isVerified: true,
    pinnedTweet: "1234567890",
  }),
};

function mockPosts(platform: Platform, count: number): PostData[] {
  const now = Date.now();
  const day = 86_400_000;

  return Array.from({ length: count }, (_, i) => {
    const daysAgo = Math.floor(i * 2.5);
    const likes = Math.floor(Math.random() * 50_000) + 500;
    const comments = Math.floor(likes * (0.02 + Math.random() * 0.05));
    const types: Record<Platform, string[]> = {
      instagram: ["image", "reel", "carousel", "image", "reel"],
      tiktok: ["video", "video", "video", "duet", "video"],
      x: ["text", "image", "text", "thread", "text"],
    };
    const typeList = types[platform];

    const base: PostData = {
      id: `mock_${i}`,
      type: typeList[i % typeList.length],
      likes,
      comments,
      timestamp: new Date(now - daysAgo * day).toISOString(),
      caption: `Sample post #${i + 1} with some content #trending #viral`,
      hashtags: ["trending", "viral", "content"],
    };

    if (platform === "tiktok") {
      base.views = likes * (15 + Math.floor(Math.random() * 30));
      base.shares = Math.floor(likes * 0.1);
      base.saves = Math.floor(likes * 0.05);
    }
    if (platform === "x") {
      base.retweets = Math.floor(likes * 0.3);
      base.quotes = Math.floor(likes * 0.05);
      base.bookmarks = Math.floor(likes * 0.08);
      base.impressions = likes * (20 + Math.floor(Math.random() * 40));
      base.replies = comments;
    }

    return base;
  });
}

export class MockProvider implements Provider {
  constructor(private platform: Platform) {}

  async fetchProfile(username: string): Promise<ProfileData> {
    return MOCK_PROFILES[this.platform](username);
  }

  async fetchPosts(username: string, limit: number): Promise<PostData[]> {
    return mockPosts(this.platform, limit);
  }
}
