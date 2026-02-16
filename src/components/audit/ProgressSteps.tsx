"use client";

import { useEffect, useState } from "react";

const steps = [
  "Fetching profile data...",
  "Analyzing posts...",
  "Calculating scores...",
  "Generating insights...",
];

export function ProgressSteps() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
            i < current
              ? "bg-[#0d9488] text-white"
              : i === current
              ? "bg-[#0d9488]/20 text-[#1de4c3] animate-pulse border border-[#0d9488]"
              : "bg-white/5 text-gray-600 border border-white/10"
          }`}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-sm transition-colors ${
            i <= current ? "text-white" : "text-gray-600"
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
