import type { Platform, PostData } from "../../providers/types";
import type { FrequencyScore } from "../types";
import { scoreToGrade } from "../grades";

const thresholds: Record<Platform, { excellent: number; good: number; fair: number }> = {
  x:         { excellent: 20, good: 12, fair: 4 },
  instagram: { excellent: 12, good: 8,  fair: 4 },
  tiktok:    { excellent: 15, good: 8,  fair: 4 },
};

export function scoreFrequency(posts: PostData[], platform?: Platform, totalPosts?: number): FrequencyScore {
  if (posts.length === 0) {
    return { score: 0, grade: "F", postsPerMonth: 0 };
  }

  // Extrapolate from time span instead of simple counting
  const timestamps = posts.map((p) => new Date(p.timestamp).getTime()).sort((a, b) => a - b);
  const spanMs = timestamps[timestamps.length - 1] - timestamps[0];
  const spanDays = spanMs / (24 * 60 * 60 * 1000);

  let postsPerMonth: number;
  if (spanDays < 1) {
    postsPerMonth = posts.length;
  } else {
    postsPerMonth = Math.round((posts.length / spanDays) * 30);
  }

  // Use profile total posts as a floor estimate for very active accounts
  // If someone has 97K total posts, our 12-post sample likely underestimates
  if (totalPosts && totalPosts > 1000) {
    // Conservative estimate: assume account is ~5 years old minimum
    const floorEstimate = Math.round(totalPosts / (5 * 12));
    if (floorEstimate > postsPerMonth) {
      postsPerMonth = Math.round((postsPerMonth + floorEstimate) / 2);
    }
  }

  const { excellent, good, fair } = thresholds[platform || "instagram"];

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
