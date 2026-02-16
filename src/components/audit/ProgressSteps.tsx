"use client";

import { useEffect, useState } from "react";

const steps = [
  { label: "Fetching profile data...", duration: "~2s" },
  { label: "Analyzing posts...", duration: "~3s" },
  { label: "Calculating scores...", duration: "~1s" },
  { label: "Generating AI insights...", duration: "~8s" },
];

export function ProgressSteps({ isPro = false }: { isPro?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const visibleSteps = isPro ? steps : steps.slice(0, 3);
  const estimatedTotal = isPro ? 15 : 6;

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Step 0→1 at 2s, 1→2 at 5s, 2→3 at 6s
    const delays = isPro ? [2000, 5000, 6000] : [2000, 4000];
    const timers = delays.map((ms, i) =>
      setTimeout(() => setCurrent(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [isPro]);

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {visibleSteps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            i < current
              ? "bg-[#0d9488] text-white"
              : i === current
              ? "bg-[#0d9488]/20 text-[#1de4c3] animate-pulse border border-[#0d9488]"
              : "bg-white/5 text-gray-600 border border-white/10"
          }`}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-sm transition-colors flex-1 ${
            i <= current ? "text-white" : "text-gray-600"
          }`}>
            {step.label}
          </span>
          {i === current && (
            <span className="text-[10px] text-gray-500 tabular-nums">{step.duration}</span>
          )}
        </div>
      ))}

      <div className="pt-2 text-center">
        <span className="text-xs text-gray-500 tabular-nums">
          {elapsed}s / ~{estimatedTotal}s
        </span>
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden max-w-[200px] mx-auto">
          <div
            className="h-full bg-gradient-to-r from-[#0d9488] to-[#1de4c3] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(95, (elapsed / estimatedTotal) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
