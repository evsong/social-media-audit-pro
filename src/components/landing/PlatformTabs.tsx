"use client";

import { useState } from "react";

const platforms = [
  { id: "instagram" as const, label: "Instagram", icon: "📷" },
  { id: "tiktok" as const, label: "TikTok", icon: "🎵" },
  { id: "x" as const, label: "X / Twitter", icon: "𝕏" },
];

export function PlatformTabs({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (platform: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {platforms.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === p.id
              ? "bg-[#0d9488] text-white shadow-lg shadow-[#0d9488]/20"
              : "bg-[rgba(255,255,255,0.04)] border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
          }`}
        >
          <span>{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}
