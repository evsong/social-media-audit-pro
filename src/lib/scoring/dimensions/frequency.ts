import type { PostData } from "../../providers/types";
import type { FrequencyScore } from "../types";
import { scoreToGrade } from "../grades";

export function scoreFrequency(posts: PostData[]): FrequencyScore {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentPosts = posts.filter((p) => new Date(p.timestamp).getTime() >= thirtyDaysAgo);
  const postsPerMonth = recentPosts.length;

  let score: number;
  if (postsPerMonth > 12) {
    score = 90 + Math.min(10, (postsPerMonth - 12) * 2);
  } else if (postsPerMonth >= 8) {
    score = 70 + ((postsPerMonth - 8) / 4) * 20;
  } else if (postsPerMonth >= 4) {
    score = 60 + ((postsPerMonth - 4) / 4) * 10;
  } else {
    score = Math.max(0, postsPerMonth * 15);
  }

  score = Math.round(Math.min(100, score));
  return { score, grade: scoreToGrade(score), postsPerMonth };
}
