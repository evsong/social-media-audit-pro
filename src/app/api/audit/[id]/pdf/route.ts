import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLastY(doc: any): number {
  return doc.lastAutoTable?.finalY ?? 140;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.auditReport.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const grades = report.grades as Record<string, { score: number; grade: string; [k: string]: unknown }>;
  const suggestions = report.suggestions as string[];
  const raw = report.rawData as Record<string, unknown> | null;
  const profile = raw?.profile as Record<string, unknown> | undefined;
  const aiSuggestions = raw?.aiSuggestions as string[] | undefined;
  const aiScoring = raw?.aiScoring as { grade: string; summary: string; dimensions: Record<string, { grade: string; comment: string }> } | undefined;
  const bestTimes = raw?.bestTimes as { topSlots?: { day: number; hour: number; label: string; score: number }[] } | undefined;
  const growthTrend = raw?.growthTrend as { direction: string; monthlyGrowthRate: number; confidence: string } | undefined;
  const fakeFollowers = raw?.fakeFollowers as { authenticPercent: number; confidence: string; riskFactors: string[] } | undefined;

  const doc = new jsPDF();

  // ── Header ──
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136);
  doc.text("AuditPro Report", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`${report.platform} / @${report.username}`, 20, 33);
  doc.text(`Generated: ${report.createdAt.toISOString().split("T")[0]}`, 20, 39);

  if (profile) {
    const followers = Number(profile.followers || 0);
    const following = Number(profile.following || 0);
    const posts = Number(profile.posts || 0);
    doc.text(`Followers: ${followers.toLocaleString()}  |  Following: ${following.toLocaleString()}  |  Posts: ${posts.toLocaleString()}`, 20, 45);
  }

  // ── Health Score ──
  doc.setFontSize(48);
  doc.setTextColor(30, 30, 30);
  doc.text(String(report.healthScore), 20, 72);
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("/ 100  Health Score", 55, 72);

  // ── Grade Breakdown ──
  const dimensionLabels: Record<string, string> = {
    engagement: "Engagement",
    frequency: "Frequency",
    contentMix: "Content Mix",
    bio: "Bio & Profile",
    followerQuality: "Follower Quality",
    hashtags: "Hashtags",
  };

  const tableData = Object.entries(grades).map(([key, val]) => [
    dimensionLabels[key] || key,
    String(val.score),
    val.grade,
  ]);

  autoTable(doc, {
    startY: 82,
    head: [["Dimension", "Score", "Grade"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [13, 148, 136] },
    styles: { fontSize: 10 },
  });

  let y = getLastY(doc) + 12;

  // ── Template Suggestions ──
  y = ensureSpace(doc, y, 30);
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Suggestions", 20, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  for (const s of suggestions) {
    y = ensureSpace(doc, y, 15);
    const lines = doc.splitTextToSize(`• ${s}`, 170);
    doc.text(lines, 20, y);
    y += lines.length * 4.5 + 2;
  }

  // ── AI Suggestions (PRO) ──
  if (aiSuggestions && aiSuggestions.length > 0) {
    y = ensureSpace(doc, y, 30);
    y += 6;
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237); // violet
    doc.text("AI-Powered Suggestions", 20, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    for (const s of aiSuggestions) {
      y = ensureSpace(doc, y, 15);
      const lines = doc.splitTextToSize(`> ${s}`, 170);
      doc.text(lines, 20, y);
      y += lines.length * 4.5 + 2;
    }
  }

  // ── AI Content Analysis (PRO) ──
  if (aiScoring) {
    y = ensureSpace(doc, y, 50);
    y += 6;
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text("AI Content Analysis", 20, y);
    y += 8;

    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    doc.text(`Grade: ${aiScoring.grade}`, 20, y);
    y += 6;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const summaryLines = doc.splitTextToSize(aiScoring.summary, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 4.5 + 4;

    const dimLabels: Record<string, string> = {
      contentQuality: "Content Quality",
      brandConsistency: "Brand Consistency",
      audienceAlignment: "Audience Alignment",
    };

    for (const [key, dim] of Object.entries(aiScoring.dimensions)) {
      y = ensureSpace(doc, y, 12);
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`${dim.grade}  ${dimLabels[key] || key}`, 20, y);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const commentLines = doc.splitTextToSize(dim.comment, 150);
      doc.text(commentLines, 38, y + 5);
      y += 5 + commentLines.length * 4.5 + 2;
    }
  }

  // ── Growth Trend (PRO) ──
  if (growthTrend) {
    y = ensureSpace(doc, y, 25);
    y += 6;
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text("Growth Trend", 20, y);
    y += 8;

    const arrow = growthTrend.direction === "growing" ? "(+)" : growthTrend.direction === "declining" ? "(-)" : "(=)";
    const pct = typeof growthTrend.monthlyGrowthRate === "number" ? `${growthTrend.monthlyGrowthRate}%` : "N/A";
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(`${arrow} ${growthTrend.direction}  |  ${pct} est. monthly  |  ${growthTrend.confidence} confidence`, 20, y);
    y += 8;
  }

  // ── Best Time to Post (PRO) ──
  if (bestTimes?.topSlots && bestTimes.topSlots.length > 0) {
    y = ensureSpace(doc, y, 30);
    y += 6;
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text("Best Time to Post", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    for (let i = 0; i < Math.min(3, bestTimes.topSlots.length); i++) {
      const slot = bestTimes.topSlots[i];
      doc.text(`#${i + 1}  ${slot.label || `Day${slot.day} ${String(slot.hour).padStart(2, "0")}:00`}`, 20, y);
      y += 6;
    }
    y += 2;
  }

  // ── Fake Follower Detection (PRO) ──
  if (fakeFollowers) {
    y = ensureSpace(doc, y, 30);
    y += 6;
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text("Fake Follower Detection", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(`${fakeFollowers.authenticPercent}% estimated authentic followers  (${fakeFollowers.confidence} confidence)`, 20, y);
    y += 7;

    if (fakeFollowers.riskFactors.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      for (const rf of fakeFollowers.riskFactors) {
        y = ensureSpace(doc, y, 10);
        doc.text(`[!] ${rf}`, 20, y);
        y += 5;
      }
    }
  }

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text("Generated by AuditPro — social-media-audit-pro.vercel.app", 20, 290);
    doc.text(`Page ${i} of ${pageCount}`, 170, 290);
  }

  const buffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="auditpro-${report.platform}-${report.username}.pdf"`,
    },
  });
}
