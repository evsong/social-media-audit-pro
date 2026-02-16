import type { ProfileData } from "../../providers/types";
import type { FollowerQualityScore } from "../types";
import { scoreToGrade } from "../grades";

export function scoreFollowerQuality(profile: ProfileData): FollowerQualityScore {
  const { followers, following } = profile;

  if (followers === 0) {
    return { score: 0, grade: "D", ratio: 0 };
  }

  const ratio = Math.round((followers / Math.max(following, 1)) * 100) / 100;

  let score: number;
  if (followers >= 10000) {
    if (ratio > 10) score = 95;
    else if (ratio > 2) score = 85;
    else if (ratio > 1) score = 70;
    else score = 50;
  } else {
    // Smaller accounts: more lenient
    if (ratio > 5) score = 92;
    else if (ratio > 1.5) score = 80;
    else if (ratio > 0.8) score = 68;
    else score = 45;
  }

  score = Math.round(Math.min(100, score));
  return { score, grade: scoreToGrade(score), ratio };
}
