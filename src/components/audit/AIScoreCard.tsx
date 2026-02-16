import type { AIScoreResult } from "@/lib/suggestions/ai";

const gradeColor: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-teal-400",
  C: "text-yellow-400",
  D: "text-red-400",
};

const dimLabels: Record<string, string> = {
  contentQuality: "Content Quality",
  brandConsistency: "Brand Consistency",
  audienceAlignment: "Audience Alignment",
};

export function AIScoreCard({ data }: { data: AIScoreResult }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-lg">AI Content Analysis</h3>
        <span className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
          AI
        </span>
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <span className={`text-4xl font-bold ${gradeColor[data.grade] || "text-gray-400"}`}>
          {data.grade}
        </span>
        <span className="text-sm text-gray-400">{data.summary}</span>
      </div>

      <div className="space-y-3">
        {Object.entries(data.dimensions).map(([key, dim]) => (
          <div key={key} className="flex items-start gap-3">
            <span className={`text-sm font-bold w-6 shrink-0 ${gradeColor[dim.grade] || "text-gray-400"}`}>
              {dim.grade}
            </span>
            <div className="text-sm">
              <span className="text-gray-300 font-medium">{dimLabels[key] || key}</span>
              <span className="text-gray-500 ml-2">— {dim.comment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
