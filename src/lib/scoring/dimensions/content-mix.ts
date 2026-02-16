import type { Platform, PostData } from "../../providers/types";
import type { ContentMixScore } from "../types";
import { scoreToGrade } from "../grades";

export function scoreContentMix(
  platform: Platform,
  posts: PostData[]
): ContentMixScore {
  const types: Record<string, number> = {};
  for (const post of posts) {
    const t = post.type || "unknown";
    types[t] = (types[t] || 0) + 1;
  }

  const uniqueTypes = Object.keys(types).length;
  let score: number;

  if (platform === "tiktok") {
    // TikTok is video-only, base score B. Bonus for duets/stitches.
    score = 75;
    if (types["duet"] || types["stitch"]) {
      score = 90;
    }
  } else if (platform === "x") {
    // X is text-first — text-only is normal, not a penalty
    if (uniqueTypes >= 3) {
      score = 95;
    } else if (uniqueTypes === 2) {
      score = 85;
    } else {
      score = 75; // text-only is fine on X
    }
  } else {
    // Instagram — content diversity matters most
    if (uniqueTypes >= 3) {
      score = 92;
    } else if (uniqueTypes === 2) {
      score = 75;
    } else {
      score = 60;
    }
  }

  if (posts.length === 0) score = 0;

  score = Math.round(Math.min(100, score));
  return { score, grade: scoreToGrade(score), types };
}
