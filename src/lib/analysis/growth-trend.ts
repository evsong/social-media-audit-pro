import type { PostData } from "../providers/types";

export interface GrowthTrendResult {
  direction: "growing" | "stable" | "declining";
  monthlyGrowthRate: number; // percentage, e.g. 5.2
  recentEngagements: number[]; // engagement values from oldest to newest
  confidence: "low" | "medium" | "high";
}

export function analyzeGrowthTrend(posts: PostData[]): GrowthTrendResult {
  if (posts.length < 4) {
    return { direction: "stable", monthlyGrowthRate: 0, recentEngagements: [], confidence: "low" };
  }

  // Sort posts oldest first
  const sorted = [...posts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const engagements = sorted.map(
    (p) => p.likes + p.comments * 2 + (p.shares || 0) * 3
  );

  // Split into halves: older vs newer
  const mid = Math.floor(engagements.length / 2);
  const olderAvg = engagements.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
  const newerAvg = engagements.slice(mid).reduce((a, b) => a + b, 0) / (engagements.length - mid);

  // Estimate growth rate
  let growthRate = 0;
  if (olderAvg > 0) {
    growthRate = ((newerAvg - olderAvg) / olderAvg) * 100;
  }

  // Determine time span for monthly normalization
  const firstDate = new Date(sorted[0].timestamp).getTime();
  const lastDate = new Date(sorted[sorted.length - 1].timestamp).getTime();
  const spanMonths = Math.max((lastDate - firstDate) / (30 * 24 * 60 * 60 * 1000), 0.5);
  const monthlyRate = growthRate / spanMonths;

  const direction: GrowthTrendResult["direction"] =
    monthlyRate > 3 ? "growing" : monthlyRate < -3 ? "declining" : "stable";

  const confidence: GrowthTrendResult["confidence"] =
    posts.length >= 10 ? "high" : posts.length >= 6 ? "medium" : "low";

  return {
    direction,
    monthlyGrowthRate: Math.round(monthlyRate * 10) / 10,
    recentEngagements: engagements,
    confidence,
  };
}
