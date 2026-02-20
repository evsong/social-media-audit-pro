"use client";

import { useState } from "react";
import { PlatformTabs } from "./PlatformTabs";

export function AuditForm() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!platform) {
      setError("Please select a platform");
      return;
    }
    let name = username.trim().replace(/^@/, "");
    // Extract username from URLs like https://x.com/user, https://instagram.com/user
    try {
      const url = new URL(name.startsWith("http") ? name : `https://${name}`);
      if (/(?:x|twitter|instagram|tiktok)\.com/.test(url.hostname)) {
        name = url.pathname.split("/").filter(Boolean)[0] || name;
      }
    } catch { /* not a URL, use as-is */ }
    if (!name) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    window.location.href = `/audit/loading?platform=${platform}&username=${encodeURIComponent(name)}`;
  }

  return (
    <div className="max-w-lg mx-auto">
      <PlatformTabs selected={platform} onSelect={setPlatform} />
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 shadow-[0_0_60px_rgba(13,148,136,0.15)]">
        <div className="flex items-center gap-2 flex-1 px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm py-3 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-[#0d9488] to-[#0dc8aa] hover:from-[#0f766e] hover:to-[#0d9488] rounded-lg text-white text-sm font-semibold transition-all shrink-0 disabled:opacity-50"
        >
          {loading ? "Auditing..." : "Audit Now"}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
