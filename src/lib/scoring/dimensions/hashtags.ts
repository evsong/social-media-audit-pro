import type { Platform, PostData } from "../../providers/types";
import type { HashtagScore } from "../types";
import { scoreToGrade } from "../grades";

export function scoreHashtags(posts: PostData[], platform?: Platform): HashtagScore {
  if (posts.length === 0) {
    return { score: 0, grade: "D", avgPerPost: 0 };
  }

  const totalHashtags = posts.reduce((sum, p) => sum + p.hashtags.length, 0);
  const avgPerPost = Math.round((totalHashtags / posts.length) * 10) / 10;

  let score: number;
  if (avgPerPost >= 5 && avgPerPost <= 15) {
    score = 92;
  } else if (avgPerPost >= 1 && avgPerPost < 5) {
    score = 75;
  } else if (avgPerPost > 15 && avgPerPost <= 30) {
    score = 70;
  } else if (avgPerPost > 30) {
    score = 55;
  } else {
    // 0 hashtags — platform-specific base score
    if (platform === "x") score = 70;
    else if (platform === "instagram") score = 55;
    else score = 50;
  }

  score = Math.round(Math.min(100, score));
  return { score, grade: scoreToGrade(score), avgPerPost };
}
