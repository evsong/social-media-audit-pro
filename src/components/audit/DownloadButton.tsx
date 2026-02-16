"use client";

import type { Plan } from ".prisma/client";
import { canAccessFeature } from "@/lib/plan-gate";

export function DownloadButton({
  auditId,
  userPlan,
}: {
  auditId: string;
  userPlan?: Plan;
}) {
  const unlocked = userPlan ? canAccessFeature(userPlan, "pdf_export") : false;

  if (!unlocked) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-500 cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Download PDF — Pro
      </button>
    );
  }

  return (
    <a
      href={`/api/audit/${auditId}/pdf`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-sm text-white font-medium transition"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download PDF
    </a>
  );
}
