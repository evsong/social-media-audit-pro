const gradeColors: Record<string, string> = {
  A: "#0d9488", "A-": "#0d9488",
  "B+": "#22c55e", B: "#22c55e", "B-": "#84cc16",
  "C+": "#eab308", C: "#eab308", "C-": "#f97316",
  D: "#ef4444", F: "#dc2626",
};

export function GradeCard({
  label,
  grade,
  score,
  detail,
}: {
  label: string;
  grade: string;
  score: number;
  detail: string;
}) {
  const color = gradeColors[grade] || "#6b7280";

  return (
    <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>{grade}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
  );
}

export function GradeBreakdown({ grades }: { grades: Record<string, { score: number; grade: string; [key: string]: unknown }> }) {
  const labels: Record<string, { label: string; detailFn: (g: Record<string, unknown>) => string }> = {
    engagement: { label: "Engagement Rate", detailFn: (g) => `${g.rate}% engagement` },
    frequency: { label: "Posting Frequency", detailFn: (g) => `${g.postsPerMonth} posts/month` },
    contentMix: { label: "Content Mix", detailFn: (g) => {
      const types = g.types as Record<string, number> | undefined;
      return types ? `${Object.keys(types).length} content types` : "";
    }},
    bio: { label: "Bio Completeness", detailFn: (g) => {
      const checks = g.checks as Record<string, boolean> | undefined;
      if (!checks) return "";
      const passed = Object.values(checks).filter(Boolean).length;
      return `${passed}/${Object.keys(checks).length} checks passed`;
    }},
    followerQuality: { label: "Follower Quality", detailFn: (g) => {
      const r = g.ratio as number;
      if (r >= 1_000_000) return `${(r / 1_000_000).toFixed(1)}M:1 ratio`;
      if (r >= 1_000) return `${(r / 1_000).toFixed(1)}K:1 ratio`;
      return `${r}:1 ratio`;
    }},
    hashtags: { label: "Hashtag Usage", detailFn: (g) => `${g.avgPerPost} avg/post` },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(grades).map(([key, g]) => {
        const config = labels[key];
        if (!config) return null;
        return (
          <GradeCard
            key={key}
            label={config.label}
            grade={g.grade}
            score={g.score}
            detail={config.detailFn(g as Record<string, unknown>)}
          />
        );
      })}
    </div>
  );
}
