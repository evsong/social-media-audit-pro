import type { Platform, PostData } from "../../providers/types";
import type { FrequencyScore } from "../types";
import { scoreToGrade } from "../grades";

type Tier = "small" | "medium" | "large" | "mega" | "ultra";

function getFollowerTier(followers: number): Tier {
  if (followers >= 10_000_000) return "ultra";
  if (followers >= 1_000_000) return "mega";
  if (followers >= 100_000) return "large";
  if (followers >= 10_000) return "medium";
  return "small";
}

// Large accounts don't need to post as frequently to maintain presence
const thresholds: Record<Platform, Record<Tier, { excellent: number; good: number; fair: number }>> = {
  x: {
    small:  { excellent: 20, good: 12, fair: 4 },
    medium: { excellent: 16, good: 10, fair: 4 },
    large:  { excellent: 12, good: 8,  fair: 3 },
    mega:   { excellent: 10, good: 6,  fair: 2 },
    ultra:  { excellent: 8,  good: 4,  fair: 2 },
  },
  instagram: {
    small:  { excellent: 12, good: 8, fair: 4 },
    medium: { excellent: 10, good: 6, fair: 3 },
    large:  { excellent: 8,  good: 5, fair: 2 },
    mega:   { excellent: 6,  good: 4, fair: 2 },
    ultra:  { excellent: 4,  good: 3, fair: 1 },
  },
  tiktok: {
    small:  { excellent: 15, good: 8, fair: 4 },
    medium: { excellent: 12, good: 6, fair: 3 },
    large:  { excellent: 10, good: 5, fair: 2 },
    mega:   { excellent: 8,  good: 4, fair: 2 },
    ultra:  { excellent: 6,  good: 3, fair: 1 },
  },
};

export function scoreFrequency(posts: PostData[], platform?: Platform, _totalPosts?: number, followers?: number): FrequencyScore {
  if (posts.length === 0) {
    return { score: 0, grade: "F", postsPerMonth: 0 };
  }

  // Extrapolate from time span
  const timestamps = posts.map((p) => new Date(p.timestamp).getTime()).sort((a, b) => a - b);
  const spanMs = timestamps[timestamps.length - 1] - timestamps[0];
  const spanDays = spanMs / (24 * 60 * 60 * 1000);

  let postsPerMonth: number;
  if (spanDays < 1) {
    postsPerMonth = posts.length;
  } else {
    postsPerMonth = Math.round((posts.length / spanDays) * 30);
  }

  const p = platform || "instagram";
  const tier = getFollowerTier(followers || 0);
  const { excellent, good, fair } = thresholds[p][tier];

  let score: number;
  if (postsPerMonth >= excellent) {
    score = 90 + Math.min(10, ((postsPerMonth - excellent) / excellent) * 10);
  } else if (postsPerMonth >= good) {
    score = 70 + ((postsPerMonth - good) / (excellent - good)) * 20;
  } else if (postsPerMonth >= fair) {
    score = 60 + ((postsPerMonth - fair) / (good - fair)) * 10;
  } else {
    score = Math.max(0, (postsPerMonth / fair) * 60);
  }

  score = Math.round(Math.min(100, score));
  return { score, grade: scoreToGrade(score), postsPerMonth };
}
