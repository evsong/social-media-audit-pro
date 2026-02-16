import type { Platform, PostData, ProfileData } from "../../providers/types";
import type { EngagementScore } from "../types";
import { scoreToGrade } from "../grades";

type Tier = "small" | "medium" | "large" | "mega" | "ultra";

function getFollowerTier(followers: number): Tier {
  if (followers >= 10_000_000) return "ultra";
  if (followers >= 1_000_000) return "mega";
  if (followers >= 100_000) return "large";
  if (followers >= 10_000) return "medium";
  return "small";
}

const baselines: Record<Platform, Record<Tier, { a: number; b: number; c: number }>> = {
  instagram: {
    small:  { a: 3,   b: 1,    c: 0.5  },
    medium: { a: 2,   b: 0.7,  c: 0.3  },
    large:  { a: 1.2, b: 0.4,  c: 0.15 },
    mega:   { a: 0.8, b: 0.25, c: 0.08 },
    ultra:  { a: 0.4, b: 0.12, c: 0.04 },
  },
  tiktok: {
    small:  { a: 8, b: 4,   c: 2   },
    medium: { a: 6, b: 3,   c: 1.5 },
    large:  { a: 4, b: 2,   c: 0.8 },
    mega:   { a: 3, b: 1.5, c: 0.5 },
    ultra:  { a: 2, b: 0.8, c: 0.3 },
  },
  x: {
    small:  { a: 1.5, b: 0.5,  c: 0.2  },
    medium: { a: 1.0, b: 0.3,  c: 0.1  },
    large:  { a: 0.5, b: 0.15, c: 0.05 },
    mega:   { a: 0.3, b: 0.1,  c: 0.03 },
    ultra:  { a: 0.1, b: 0.03, c: 0.01 },
  },
};

export function scoreEngagement(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[]
): EngagementScore {
  if (profile.followers === 0 || posts.length === 0) {
    return { score: 0, grade: "D", rate: 0 };
  }

  const totalEngagement = posts.reduce(
    (sum, p) => sum + p.likes + p.comments + (p.shares || 0) + (p.retweets || 0),
    0
  );
  const avgEngagement = totalEngagement / posts.length;
  const rate = (avgEngagement / profile.followers) * 100;

  const tier = getFollowerTier(profile.followers);
  const { a, b, c } = baselines[platform][tier];
  let score: number;

  if (rate >= a) {
    score = 90 + Math.min(10, ((rate - a) / a) * 10);
  } else if (rate >= b) {
    score = 70 + ((rate - b) / (a - b)) * 20;
  } else if (rate >= c) {
    score = 60 + ((rate - c) / (b - c)) * 10;
  } else {
    score = Math.max(0, (rate / c) * 60);
  }

  score = Math.round(Math.min(100, score));
  // Keep enough precision for ultra accounts (0.008% shouldn't round to 0%)
  const roundedRate = rate < 0.1
    ? Math.round(rate * 10000) / 10000
    : Math.round(rate * 100) / 100;
  return { score, grade: scoreToGrade(score), rate: roundedRate };
}
