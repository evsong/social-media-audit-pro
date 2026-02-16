import type { FakeFollowerResult } from "@/lib/analysis/fake-followers";

function Gauge({ percent }: { percent: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color =
    percent >= 80 ? "#10b981" : percent >= 60 ? "#eab308" : "#ef4444";

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-white text-lg font-bold">
        {percent}%
      </text>
    </svg>
  );
}

export function FakeFollowerCard({ data }: { data: FakeFollowerResult }) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <Gauge percent={data.authenticPercent} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">
            Estimated Authentic Followers
          </p>
          <p className="text-xs text-gray-500 mb-3">
            {data.confidence} confidence
          </p>
          <ul className="space-y-1.5">
            {data.riskFactors.map((f, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5 shrink-0">⚠</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
