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
  } else {
    // Instagram and X
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
