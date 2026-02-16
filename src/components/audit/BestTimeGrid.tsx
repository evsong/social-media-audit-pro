import type { BestTimeResult } from "@/lib/analysis/best-time";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function cellColor(value: number): string {
  if (value === 0) return "bg-white/5";
  if (value < 0.25) return "bg-teal-900/40";
  if (value < 0.5) return "bg-teal-700/50";
  if (value < 0.75) return "bg-teal-500/60";
  return "bg-teal-400/70";
}

export function BestTimeGrid({ data }: { data: BestTimeResult }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div>
      {data.topSlots.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {data.topSlots.map((slot, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-[#0d9488]/20 border border-[#0d9488]/40 rounded-lg text-sm text-[#1de4c3] font-medium"
            >
              #{i + 1} {slot.label}
            </span>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex gap-px mb-1">
            <div className="w-10 shrink-0" />
            {hours.filter((_, i) => i % 3 === 0).map((h) => (
              <div key={h} className="text-[10px] text-gray-500 text-center" style={{ width: `${100 / 8}%` }}>
                {h.toString().padStart(2, "0")}
              </div>
            ))}
          </div>
          {DAY_LABELS.map((day, d) => (
            <div key={d} className="flex gap-px mb-px items-center">
              <div className="w-10 shrink-0 text-[10px] text-gray-500">{day}</div>
              {hours.map((h) => (
                <div
                  key={h}
                  className={`flex-1 h-5 rounded-sm ${cellColor(data.grid[d][h])} transition-colors`}
                  title={`${day} ${h}:00 — ${Math.round(data.grid[d][h] * 100)}%`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-500">
        <span>Low</span>
        <div className="flex gap-px">
          <div className="w-4 h-3 rounded-sm bg-white/5" />
          <div className="w-4 h-3 rounded-sm bg-teal-900/40" />
          <div className="w-4 h-3 rounded-sm bg-teal-700/50" />
          <div className="w-4 h-3 rounded-sm bg-teal-500/60" />
          <div className="w-4 h-3 rounded-sm bg-teal-400/70" />
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
