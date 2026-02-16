"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HealthScore } from "@/components/audit/HealthScore";
import { AccountCard } from "@/components/audit/AccountCard";
import { GradeBreakdown } from "@/components/audit/GradeBreakdown";
import { SuggestionList } from "@/components/audit/SuggestionList";
import { LockedSection } from "@/components/audit/LockedSection";
import { RemainingAudits } from "@/components/ui/RemainingAudits";

interface AuditData {
  healthScore: number;
  grade: string;
  profile: {
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    posts: number;
    isVerified: boolean;
  };
  grades: Record<string, { score: number; grade: string; [key: string]: unknown }>;
  suggestions: string[];
  remaining: number;
  isAnonymous: boolean;
}

export default function AuditReportPage() {
  const params = useParams<{ platform: string; username: string }>();
  const [data, setData] = useState<AuditData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const key = `audit:${params.platform}:${params.username}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      sessionStorage.removeItem(key);
      return;
    }

    // Fallback: call API directly (e.g. shared link or page refresh)
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: params.platform, username: params.username }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Failed to load audit");
          return;
        }
        setData(json);
      })
      .catch(() => setError("Network error"));
  }, [params.platform, params.username]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-400">{error}</p>
        <a href="/" className="text-[#1de4c3] text-sm hover:underline">← Back to home</a>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading report...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <nav className="sticky top-0 z-50 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
            </div>
            <span className="font-bold text-sm">AuditPro</span>
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-white transition">New Audit</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <HealthScore score={data.healthScore} grade={data.grade} />
          <AccountCard profile={data.profile} platform={params.platform} />
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-4">Score Breakdown</h2>
          <GradeBreakdown grades={data.grades} />
        </div>

        {data.suggestions.length > 0 && (
          <SuggestionList suggestions={data.suggestions} />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <LockedSection
            title="Growth Trend"
            description="Track follower growth over the past 90 days with weekly breakdowns."
          />
          <LockedSection
            title="Best Time to Post"
            description="Discover when your audience is most active for maximum engagement."
          />
        </div>

        <RemainingAudits remaining={data.remaining} isAnonymous={data.isAnonymous} />
      </div>
    </main>
  );
}
