import type { Plan } from ".prisma/client";

export type Feature =
  | "ai_suggestions"
  | "best_time"
  | "growth_trend"
  | "pdf_export"
  | "competitor_compare"
  | "fake_follower_detection";

const ACCESS: Record<Feature, Plan[]> = {
  ai_suggestions: ["PRO", "AGENCY"],
  best_time: ["PRO", "AGENCY"],
  growth_trend: ["PRO", "AGENCY"],
  pdf_export: ["PRO", "AGENCY"],
  competitor_compare: ["AGENCY"],
  fake_follower_detection: ["AGENCY"],
};

export function canAccessFeature(plan: Plan, feature: Feature): boolean {
  return ACCESS[feature].includes(plan);
}

export function isPremium(plan: Plan): boolean {
  return plan === "PRO" || plan === "AGENCY";
}

const MONTHLY_LIMITS: Record<Plan, number> = {
  FREE: 3,
  PRO: 30,
  AGENCY: Infinity,
};

export function getMonthlyAuditLimit(plan: Plan): number {
  return MONTHLY_LIMITS[plan];
}
