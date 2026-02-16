"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Plan } from ".prisma/client";
import { HealthScore } from "@/components/audit/HealthScore";
import { AccountCard } from "@/components/audit/AccountCard";
import { GradeBreakdown } from "@/components/audit/GradeBreakdown";
import { SuggestionList } from "@/components/audit/SuggestionList";
import { LockedSection } from "@/components/audit/LockedSection";
import { AISuggestionList } from "@/components/audit/AISuggestionList";
import { AIScoreCard } from "@/components/audit/AIScoreCard";
import { BestTimeGrid } from "@/components/audit/BestTimeGrid";
import { GrowthTrend } from "@/components/audit/GrowthTrend";
import { FakeFollowerCard } from "@/components/audit/FakeFollowerCard";
import { DownloadButton } from "@/components/audit/DownloadButton";
import { RemainingAudits } from "@/components/ui/RemainingAudits";
import type { AIScoreResult } from "@/lib/suggestions/ai";
import type { BestTimeResult } from "@/lib/analysis/best-time";
import type { GrowthTrendResult } from "@/lib/analysis/growth-trend";
import type { FakeFollowerResult } from "@/lib/analysis/fake-followers";

interface AuditData {
  healthScore: number;
  healthGrade: string;
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
  auditId?: string;
  userPlan?: Plan;
  aiSuggestions?: string[];
  aiScoring?: AIScoreResult;
  bestTimes?: BestTimeResult;
  growthTrend?: GrowthTrendResult;
  fakeFollowers?: FakeFollowerResult;
}

export default function AuditReportPage() {
  const params = useParams<{ platform: string; username: string }>();
  const [data, setData] = useState<AuditData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const key = `audit:${params.platform}:${params.username}`;
    const idKey = `auditId:${params.platform}:${params.username}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      setData(parsed);
      sessionStorage.removeItem(key);
      // Persist auditId for refresh
      if (parsed.auditId) sessionStorage.setItem(idKey, parsed.auditId);
      return;
    }

    // Refresh: fetch existing report by ID (no re-audit)
    const savedId = sessionStorage.getItem(idKey);
    if (savedId) {
      fetch(`/api/audit/${savedId}`)
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) { setError(json.error || "Report not found"); return; }
          setData(json);
        })
        .catch(() => setError("Network error"));
      return;
    }

    // Fallback: shared link or direct visit — run audit
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: params.platform, username: params.username }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Failed to load audit"); return; }
        setData(json);
        if (json.auditId) sessionStorage.setItem(idKey, json.auditId);
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

  const plan = data.userPlan;

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
          <div className="flex items-center gap-4">
            {data.auditId && <DownloadButton auditId={data.auditId} userPlan={plan} />}
            <a href="/" className="text-sm text-gray-400 hover:text-white transition">New Audit</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <HealthScore score={data.healthScore} grade={data.healthGrade} />
          <AccountCard profile={data.profile} platform={params.platform} />
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-4">Score Breakdown</h2>
          <GradeBreakdown grades={data.grades} />
        </div>

        {data.suggestions.length > 0 && (
          <SuggestionList suggestions={data.suggestions} />
        )}

        {/* AI Suggestions — PRO+ unlocked, FREE locked */}
        {data.aiSuggestions ? (
          <AISuggestionList suggestions={data.aiSuggestions} />
        ) : (
          <LockedSection
            title="AI-Powered Suggestions"
            description="Get personalized, AI-generated recommendations tailored to your account."
            userPlan={plan}
            feature="ai_suggestions"
          />
        )}

        {/* AI Content Analysis — PRO+ unlocked, FREE locked */}
        {data.aiScoring ? (
          <AIScoreCard data={data.aiScoring} />
        ) : (
          <LockedSection
            title="AI Content Analysis"
            description="Get AI-powered content quality, brand consistency, and audience alignment ratings."
            userPlan={plan}
            feature="ai_suggestions"
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <LockedSection
            title="Growth Trend"
            description="Track engagement trajectory and estimated monthly growth rate."
            userPlan={plan}
            feature="growth_trend"
          >
            {data.growthTrend && <GrowthTrend data={data.growthTrend} />}
          </LockedSection>

          <LockedSection
            title="Best Time to Post"
            description="Discover when your audience is most active for maximum engagement."
            userPlan={plan}
            feature="best_time"
          >
            {data.bestTimes && <BestTimeGrid data={data.bestTimes} />}
          </LockedSection>
        </div>

        <LockedSection
          title="Fake Follower Detection"
          description="Estimate the percentage of authentic followers and identify risk factors."
          userPlan={plan}
          feature="fake_follower_detection"
        >
          {data.fakeFollowers && <FakeFollowerCard data={data.fakeFollowers} />}
        </LockedSection>

        {/* Competitor Compare link */}
        <LockedSection
          title="Competitor Compare"
          description="Compare your account side-by-side with up to 2 competitors."
          userPlan={plan}
          feature="competitor_compare"
        >
          <a
            href={`/compare/${params.platform}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-sm text-white font-medium transition"
          >
            Compare with competitors →
          </a>
        </LockedSection>

        <RemainingAudits remaining={data.remaining} isAnonymous={data.isAnonymous} />
      </div>
    </main>
  );
}
