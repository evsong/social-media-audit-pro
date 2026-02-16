import type { Platform, PostData, ProfileData } from "../../providers/types";
import type { EngagementScore } from "../types";
import { scoreToGrade } from "../grades";

const baselines: Record<Platform, { a: number; b: number; c: number }> = {
  instagram: { a: 3, b: 1, c: 0.5 },
  tiktok: { a: 8, b: 4, c: 2 },
  x: { a: 1.5, b: 0.5, c: 0.2 },
};

export function scoreEngagement(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[]
): EngagementScore {
  if (profile.followers === 0 || posts.length === 0) {
    return { score: 0, grade: "D", rate: 0 };
  }

  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments, 0);
  const avgEngagement = totalEngagement / posts.length;
  const rate = (avgEngagement / profile.followers) * 100;

  const { a, b, c } = baselines[platform];
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
  return { score, grade: scoreToGrade(score), rate: Math.round(rate * 100) / 100 };
}
