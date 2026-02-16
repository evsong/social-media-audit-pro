import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers/factory";
import { ProfileNotFoundError } from "@/lib/providers/types";
import type { Platform } from "@/lib/providers/types";
import { calculateScore } from "@/lib/scoring/calculator";
import { generateTemplateSuggestions } from "@/lib/suggestions/templates";
import { generateAIAnalysis } from "@/lib/suggestions/ai";
import type { AIScoreResult } from "@/lib/suggestions/ai";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
import { isPremium } from "@/lib/plan-gate";
import { analyzeBestTimes } from "@/lib/analysis/best-time";
import { analyzeGrowthTrend } from "@/lib/analysis/growth-trend";
import { analyzeFakeFollowers } from "@/lib/analysis/fake-followers";
import type { Plan } from ".prisma/client";
import {
  checkGlobalRateLimit,
  checkAnonymousLimit,
  incrementAnonymousCount,
  checkUserLimit,
} from "@/lib/rate-limit";

const VALID_PLATFORMS: Platform[] = ["instagram", "tiktok", "x"];

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Global rate limit
  const globalCheck = checkGlobalRateLimit(ip);
  if (!globalCheck.allowed) {
    return NextResponse.json(
      { error: globalCheck.message },
      { status: 429, headers: { "Retry-After": String(globalCheck.retryAfter || 60) } }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.platform || !body?.username) {
    return NextResponse.json({ error: "Missing platform or username" }, { status: 400 });
  }

  const platform = body.platform as Platform;
  const username = body.username.replace(/^@/, "").trim().toLowerCase();

  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  // Determine user plan first (needed for plan-aware caching)
  const session = await auth();
  let userId: string | null = null;
  let userPlan: Plan = "FREE";

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      userId = user.id;
      userPlan = user.plan;
    }
  }

  // Cache check — cached results don't count toward limits
  const key = cacheKey(platform, username, userPlan);
  const cached = cacheGet<Record<string, unknown>>(key);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // User/anonymous rate limit
  if (userId) {
    const userCheck = await checkUserLimit(userId, userPlan, prisma);
    if (!userCheck.allowed) {
      return NextResponse.json(
        { error: userCheck.message, remaining: 0 },
        { status: 429 }
      );
    }
  } else {
    const anonCheck = checkAnonymousLimit(ip);
    if (!anonCheck.allowed) {
      return NextResponse.json({ error: anonCheck.message }, { status: 429 });
    }
  }

  // Fetch data from provider
  try {
    const provider = getProvider(platform);
    const [profile, posts] = await Promise.all([
      provider.fetchProfile(username),
      provider.fetchPosts(username, 12),
    ]);

    // Score
    const scoreResult = calculateScore(platform, profile, posts);

    // Suggestions
    const suggestions = generateTemplateSuggestions(scoreResult.grades);

    // Premium analysis (run in parallel if PRO+)
    let aiSuggestions: string[] | undefined;
    let aiScoring: AIScoreResult | undefined;
    let bestTimes: ReturnType<typeof analyzeBestTimes> | undefined;
    let growthTrend: ReturnType<typeof analyzeGrowthTrend> | undefined;
    let fakeFollowers: ReturnType<typeof analyzeFakeFollowers> | undefined;

    if (isPremium(userPlan)) {
      const [aiResult, bt, gt, ff] = await Promise.all([
        generateAIAnalysis(platform, profile, posts, scoreResult).catch(() => ({ suggestions: [] as string[], scoring: undefined })),
        Promise.resolve(analyzeBestTimes(posts)),
        Promise.resolve(analyzeGrowthTrend(posts)),
        Promise.resolve(analyzeFakeFollowers(profile, posts)),
      ]);
      aiSuggestions = aiResult.suggestions.length > 0 ? aiResult.suggestions : undefined;
      aiScoring = aiResult.scoring;
      bestTimes = bt;
      growthTrend = gt;
      fakeFollowers = ff;
    }

    // Persist to DB
    const report = await prisma.auditReport.create({
      data: {
        userId,
        platform,
        username,
        healthScore: scoreResult.healthScore,
        grades: JSON.parse(JSON.stringify(scoreResult.grades)),
        suggestions: JSON.parse(JSON.stringify(suggestions)),
        rawData: JSON.parse(JSON.stringify({
          profile, posts,
          ...(aiSuggestions && { aiSuggestions }),
          ...(aiScoring && { aiScoring }),
          ...(bestTimes && { bestTimes }),
          ...(growthTrend && { growthTrend }),
          ...(fakeFollowers && { fakeFollowers }),
        })),
      },
    });

    // Increment rate limit counter
    if (!userId) incrementAnonymousCount(ip);

    const response: Record<string, unknown> = {
      platform,
      profile,
      healthScore: scoreResult.healthScore,
      healthGrade: scoreResult.healthGrade,
      grades: scoreResult.grades,
      suggestions,
      cached: false,
      auditId: report.id,
      userPlan,
    };

    if (aiSuggestions) response.aiSuggestions = aiSuggestions;
    if (aiScoring) response.aiScoring = aiScoring;
    if (bestTimes) response.bestTimes = bestTimes;
    if (growthTrend) response.growthTrend = growthTrend;
    if (fakeFollowers) response.fakeFollowers = fakeFollowers;

    // Cache result
    cacheSet(key, response);

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof ProfileNotFoundError) {
      return NextResponse.json({ error: `Profile not found: @${username}` }, { status: 404 });
    }
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Failed to complete audit. Please try again." }, { status: 500 });
  }
}
