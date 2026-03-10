import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreToGrade } from "@/lib/scoring/grades";
import { getUserRemaining } from "@/lib/rate-limit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.auditReport.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const raw = report.rawData as Record<string, unknown> | null;

  // Resolve user plan
  let userPlan = "FREE";
  let remaining: number | null = 0;
  const isAnonymous = !report.userId;
  if (report.userId) {
    const user = await prisma.user.findUnique({ where: { id: report.userId } });
    if (user) {
      userPlan = user.plan;
      const currentRemaining = await getUserRemaining(user.id, user.plan, prisma);
      remaining = Number.isFinite(currentRemaining) ? currentRemaining : null;
    }
  } else {
    remaining = 0;
  }

  return NextResponse.json({
    platform: report.platform,
    healthScore: report.healthScore,
    healthGrade: scoreToGrade(report.healthScore),
    grades: report.grades,
    suggestions: report.suggestions,
    profile: raw?.profile,
    auditId: report.id,
    userPlan,
    remaining,
    isAnonymous,
    aiSuggestions: raw?.aiSuggestions,
    aiScoring: raw?.aiScoring,
    bestTimes: raw?.bestTimes,
    growthTrend: raw?.growthTrend,
    fakeFollowers: raw?.fakeFollowers,
  });
}
