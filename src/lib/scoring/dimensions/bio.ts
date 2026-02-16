import type { Platform, ProfileData } from "../../providers/types";
import type { BioScore } from "../types";
import { scoreToGrade } from "../grades";

export function scoreBio(platform: Platform, profile: ProfileData): BioScore {
  const checks: Record<string, boolean> = {
    avatar: !!profile.avatar,
    bio: !!profile.bio && profile.bio.length > 0,
    externalUrl: !!profile.externalUrl,
  };

  if (platform === "instagram") {
    checks.highlights = !!profile.highlights;
  }
  if (platform === "x") {
    checks.pinnedTweet = !!profile.pinnedTweet;
  }

  const total = Object.keys(checks).length;
  const passed = Object.values(checks).filter(Boolean).length;
  const ratio = passed / total;

  let score: number;
  if (ratio === 1) {
    score = 95;
  } else if (ratio >= 0.75) {
    score = 80;
  } else if (ratio >= 0.5) {
    score = 65;
  } else {
    score = Math.round(ratio * 60);
  }

  return { score, grade: scoreToGrade(score), checks };
}
