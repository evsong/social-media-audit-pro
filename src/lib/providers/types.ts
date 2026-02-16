export type Platform = "instagram" | "tiktok" | "x";

export interface ProfileData {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  externalUrl?: string;
  // Platform-specific
  highlights?: boolean; // Instagram
  pinnedTweet?: string; // X
  likes?: number; // TikTok total likes
  videos?: number; // TikTok
}

export interface PostData {
  id: string;
  type: string; // image|video|reel|carousel|text|thread
  likes: number;
  comments: number;
  timestamp: string;
  caption?: string;
  hashtags: string[];
  // Platform-specific
  views?: number; // TikTok, X
  shares?: number; // TikTok
  saves?: number; // TikTok
  retweets?: number; // X
  quotes?: number; // X
  bookmarks?: number; // X
  impressions?: number; // X
  replies?: number; // X
}

export interface Provider {
  fetchProfile(username: string): Promise<ProfileData>;
  fetchPosts(username: string, limit: number): Promise<PostData[]>;
}

export class ProfileNotFoundError extends Error {
  constructor(platform: Platform, username: string) {
    super(`Profile not found: ${username} on ${platform}`);
    this.name = "ProfileNotFoundError";
  }
}

export class ProviderError extends Error {
  constructor(platform: Platform, message: string) {
    super(`[${platform}] ${message}`);
    this.name = "ProviderError";
  }
}
