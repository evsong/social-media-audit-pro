import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreToGrade } from "@/lib/scoring/grades";

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
  if (report.userId) {
    const user = await prisma.user.findUnique({ where: { id: report.userId } });
    if (user) userPlan = user.plan;
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
    aiSuggestions: raw?.aiSuggestions,
    aiScoring: raw?.aiScoring,
    bestTimes: raw?.bestTimes,
    growthTrend: raw?.growthTrend,
    fakeFollowers: raw?.fakeFollowers,
  });
}
