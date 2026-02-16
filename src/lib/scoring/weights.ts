import type { Platform } from "../providers/types";

export interface PlatformWeights {
  engagement: number;
  frequency: number;
  contentMix: number;
  bio: number;
  followerQuality: number;
  hashtags: number;
}

const weights: Record<Platform, PlatformWeights> = {
  instagram: {
    engagement: 25,
    frequency: 15,
    contentMix: 20,
    bio: 10,
    followerQuality: 20,
    hashtags: 10,
  },
  tiktok: {
    engagement: 30,
    frequency: 25,
    contentMix: 10,
    bio: 10,
    followerQuality: 15,
    hashtags: 10,
  },
  x: {
    engagement: 30,
    frequency: 25,
    contentMix: 10,
    bio: 15,
    followerQuality: 15,
    hashtags: 5,
  },
};

export function getWeights(platform: Platform): PlatformWeights {
  return weights[platform];
}
