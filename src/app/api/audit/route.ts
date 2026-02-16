import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers/factory";
import { ProfileNotFoundError } from "@/lib/providers/types";
import type { Platform } from "@/lib/providers/types";
import { calculateScore } from "@/lib/scoring/calculator";
import { generateTemplateSuggestions } from "@/lib/suggestions/templates";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
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

  // Cache check — cached results don't count toward limits
  const key = cacheKey(platform, username);
  const cached = cacheGet<Record<string, unknown>>(key);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // User/anonymous rate limit
  const session = await auth();
  let userId: string | null = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      userId = user.id;
      const userCheck = await checkUserLimit(user.id, prisma);
      if (!userCheck.allowed) {
        return NextResponse.json(
          { error: userCheck.message, remaining: 0 },
          { status: 429 }
        );
      }
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

    // Persist to DB
    const report = await prisma.auditReport.create({
      data: {
        userId,
        platform,
        username,
        healthScore: scoreResult.healthScore,
        grades: JSON.parse(JSON.stringify(scoreResult.grades)),
        suggestions: JSON.parse(JSON.stringify(suggestions)),
        rawData: JSON.parse(JSON.stringify({ profile, posts })),
      },
    });

    // Increment rate limit counter
    if (!userId) incrementAnonymousCount(ip);

    const response = {
      platform,
      profile,
      healthScore: scoreResult.healthScore,
      healthGrade: scoreResult.healthGrade,
      grades: scoreResult.grades,
      suggestions,
      cached: false,
      auditId: report.id,
    };

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
