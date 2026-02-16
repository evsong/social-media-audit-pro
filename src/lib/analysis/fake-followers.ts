import type { ProfileData, PostData } from "../providers/types";

export interface FakeFollowerResult {
  authenticPercent: number; // 0-100
  confidence: "low" | "medium" | "high";
  riskFactors: string[];
}

export function analyzeFakeFollowers(
  profile: ProfileData,
  posts: PostData[]
): FakeFollowerResult {
  const riskFactors: string[] = [];
  let suspicionScore = 0; // 0-100, higher = more fake

  // 1. Engagement-to-follower ratio
  if (profile.followers > 0 && posts.length > 0) {
    const avgLikes = posts.reduce((s, p) => s + p.likes, 0) / posts.length;
    const engagementRate = (avgLikes / profile.followers) * 100;

    if (engagementRate < 0.5 && profile.followers > 10000) {
      suspicionScore += 30;
      riskFactors.push("Very low engagement rate relative to follower count");
    } else if (engagementRate < 1 && profile.followers > 5000) {
      suspicionScore += 15;
      riskFactors.push("Below-average engagement rate for account size");
    }
  }

  // 2. Follower/following ratio
  if (profile.following > 0) {
    const ratio = profile.followers / profile.following;
    if (ratio < 0.1 && profile.followers > 1000) {
      suspicionScore += 20;
      riskFactors.push("Following far more accounts than followers — possible follow-back scheme");
    }
  }
  if (profile.followers > 100000 && profile.following > 5000) {
    suspicionScore += 10;
    riskFactors.push("High following count unusual for large accounts");
  }

  // 3. Comment-to-like ratio (low comments with high likes = suspicious)
  if (posts.length > 0) {
    const avgLikes = posts.reduce((s, p) => s + p.likes, 0) / posts.length;
    const avgComments = posts.reduce((s, p) => s + p.comments, 0) / posts.length;
    if (avgLikes > 100 && avgComments > 0) {
      const commentRatio = avgComments / avgLikes;
      if (commentRatio < 0.005) {
        suspicionScore += 20;
        riskFactors.push("Extremely low comment-to-like ratio suggests inauthentic engagement");
      } else if (commentRatio < 0.01) {
        suspicionScore += 10;
        riskFactors.push("Low comment-to-like ratio may indicate purchased likes");
      }
    }
  }

  // 4. Round follower numbers (e.g. exactly 10000)
  const followerStr = profile.followers.toString();
  if (profile.followers >= 1000 && followerStr.endsWith("000")) {
    suspicionScore += 5;
    riskFactors.push("Suspiciously round follower count");
  }

  const authenticPercent = Math.max(0, Math.min(100, 100 - suspicionScore));
  const confidence: FakeFollowerResult["confidence"] =
    posts.length >= 10 ? "high" : posts.length >= 5 ? "medium" : "low";

  if (riskFactors.length === 0) {
    riskFactors.push("No significant risk factors detected");
  }

  return { authenticPercent, confidence, riskFactors };
}
