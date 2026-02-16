import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers/factory";
import { ProfileNotFoundError } from "@/lib/providers/types";
import type { Platform } from "@/lib/providers/types";
import { calculateScore } from "@/lib/scoring/calculator";
import { canAccessFeature } from "@/lib/plan-gate";

const VALID_PLATFORMS: Platform[] = ["instagram", "tiktok", "x"];

export async function POST(req: NextRequest) {
  // Auth check — compare is PRO+ only
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !canAccessFeature(user.plan, "competitor_compare")) {
    return NextResponse.json({ error: "Upgrade to Pro to use competitor compare" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.platform || !Array.isArray(body?.usernames) || body.usernames.length < 2 || body.usernames.length > 3) {
    return NextResponse.json({ error: "Provide platform and 2-3 usernames" }, { status: 400 });
  }

  const platform = body.platform as Platform;
  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  const usernames: string[] = body.usernames.map((u: string) =>
    u.replace(/^@/, "").trim().toLowerCase()
  );

  try {
    const provider = getProvider(platform);

    const results = await Promise.all(
      usernames.map(async (username) => {
        const [profile, posts] = await Promise.all([
          provider.fetchProfile(username),
          provider.fetchPosts(username, 12),
        ]);
        const scoreResult = calculateScore(platform, profile, posts);
        return {
          username,
          healthScore: scoreResult.healthScore,
          healthGrade: scoreResult.healthGrade,
          grades: scoreResult.grades,
        };
      })
    );

    return NextResponse.json({ platform, results });
  } catch (err) {
    if (err instanceof ProfileNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("Compare error:", err);
    return NextResponse.json({ error: "Failed to compare. Please try again." }, { status: 500 });
  }
}
