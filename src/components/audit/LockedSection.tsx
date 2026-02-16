"use client";

import type { Plan } from ".prisma/client";
import { canAccessFeature, type Feature } from "@/lib/plan-gate";
import type { ReactNode } from "react";

export function LockedSection({
  title,
  description,
  userPlan,
  feature,
  children,
}: {
  title: string;
  description: string;
  userPlan?: Plan;
  feature?: Feature;
  children?: ReactNode;
}) {
  const unlocked = userPlan && feature ? canAccessFeature(userPlan, feature) : false;

  if (unlocked && children) {
    return (
      <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] z-10 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <p className="text-sm text-gray-300 font-medium">
          {feature && (feature === "competitor_compare" || feature === "fake_follower_detection")
            ? "Upgrade to Agency to unlock"
            : "Upgrade to Pro to unlock"}
        </p>
        <a href="/#pricing" className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-white text-xs font-semibold transition">
          {feature && (feature === "competitor_compare" || feature === "fake_follower_detection")
            ? "View Agency Plan"
            : "Upgrade — $5.99/mo"}
        </a>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="h-32 bg-white/5 rounded-lg" />
    </div>
  );
}
