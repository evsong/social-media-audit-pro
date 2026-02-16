import type { GrowthTrendResult } from "@/lib/analysis/growth-trend";

const ARROWS: Record<GrowthTrendResult["direction"], string> = {
  growing: "↑",
  stable: "→",
  declining: "↓",
};

const COLORS: Record<GrowthTrendResult["direction"], string> = {
  growing: "text-green-400",
  stable: "text-yellow-400",
  declining: "text-red-400",
};

function MiniSparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const w = 200;
  const h = 40;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-[#1de4c3]"
      />
    </svg>
  );
}

export function GrowthTrend({ data }: { data: GrowthTrendResult }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-3xl font-bold ${COLORS[data.direction]}`}>
          {ARROWS[data.direction]}
        </span>
        <div>
          <p className="text-sm font-medium capitalize">{data.direction}</p>
          <p className="text-xs text-gray-500">
            {data.monthlyGrowthRate > 0 ? "+" : ""}
            {data.monthlyGrowthRate}% est. monthly
          </p>
        </div>
        <span className="ml-auto px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 uppercase">
          {data.confidence} confidence
        </span>
      </div>
      <MiniSparkline values={data.recentEngagements} />
    </div>
  );
}
