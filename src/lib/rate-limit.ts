import type { PrismaClient } from ".prisma/client";
import type { Plan } from ".prisma/client";
import { getMonthlyAuditLimit } from "./plan-gate";

const globalRateLimit = new Map<string, number[]>(); // IP -> timestamps
const dailyAuditLimit = new Map<string, number>(); // IP -> count (resets daily)

const GLOBAL_LIMIT = 3; // requests per minute
const GLOBAL_WINDOW = 60 * 1000; // 1 minute

let lastDailyReset = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

function resetDailyIfNeeded() {
  if (Date.now() - lastDailyReset > DAY_MS) {
    dailyAuditLimit.clear();
    lastDailyReset = Date.now();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  message?: string;
  remaining?: number;
  retryAfter?: number;
}

export function checkGlobalRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const timestamps = globalRateLimit.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < GLOBAL_WINDOW);

  if (recent.length >= GLOBAL_LIMIT) {
    const oldest = recent[0];
    const retryAfter = Math.ceil((oldest + GLOBAL_WINDOW - now) / 1000);
    return { allowed: false, message: "Too many requests. Please slow down.", retryAfter };
  }

  recent.push(now);
  globalRateLimit.set(ip, recent);
  return { allowed: true, remaining: GLOBAL_LIMIT - recent.length };
}

export function checkAnonymousLimit(ip: string): RateLimitResult {
  resetDailyIfNeeded();
  const count = dailyAuditLimit.get(ip) || 0;

  if (count >= 1) {
    return { allowed: false, message: "Daily limit reached. Sign up for more audits." };
  }

  return { allowed: true, remaining: 1 - count };
}

export function incrementAnonymousCount(ip: string): void {
  resetDailyIfNeeded();
  const count = dailyAuditLimit.get(ip) || 0;
  dailyAuditLimit.set(ip, count + 1);
}

export async function checkUserLimit(
  userId: string,
  plan: Plan,
  prisma: PrismaClient
): Promise<RateLimitResult> {
  const limit = getMonthlyAuditLimit(plan);
  if (!isFinite(limit)) return { allowed: true };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await prisma.auditReport.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  if (count >= limit) {
    return {
      allowed: false,
      message: plan === "FREE"
        ? `Monthly limit reached (${limit}). Upgrade to Pro for more.`
        : `Monthly limit reached (${limit}). Upgrade to Agency for unlimited.`,
    };
  }

  return { allowed: true, remaining: limit - count };
}
