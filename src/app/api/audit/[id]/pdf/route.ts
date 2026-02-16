import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.auditReport.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const grades = report.grades as Record<string, { score: number; grade: string }>;
  const suggestions = report.suggestions as string[];

  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136); // teal
  doc.text("AuditPro Report", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`${report.platform} / @${report.username}`, 20, 33);
  doc.text(`Generated: ${report.createdAt.toISOString().split("T")[0]}`, 20, 39);

  // Health Score
  doc.setFontSize(48);
  doc.setTextColor(30, 30, 30);
  doc.text(String(report.healthScore), 20, 65);
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("/ 100  Health Score", 55, 65);

  // Grade breakdown table
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
    startY: 75,
    head: [["Dimension", "Score", "Grade"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [13, 148, 136] },
    styles: { fontSize: 10 },
  });

  // Suggestions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY: number = (doc as any).lastAutoTable?.finalY ?? 140;
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Suggestions", 20, finalY + 15);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  let y = finalY + 25;
  for (const s of suggestions) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(`• ${s}`, 170);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 3;
  }

  const buffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="auditpro-${report.platform}-${report.username}.pdf"`,
    },
  });
}
