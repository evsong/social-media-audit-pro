"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CompareTable } from "@/components/audit/CompareTable";

interface CompareEntry {
  username: string;
  healthScore: number;
  healthGrade: string;
  grades: Record<string, { score: number; grade: string }>;
}

export default function ComparePage() {
  const params = useParams<{ platform: string }>();
  const [usernames, setUsernames] = useState(["", ""]);
  const [results, setResults] = useState<CompareEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSlot = () => {
    if (usernames.length < 3) setUsernames([...usernames, ""]);
  };

  const submit = async () => {
    const filtered = usernames.map((u) => u.trim()).filter(Boolean);
    if (filtered.length < 2) {
      setError("Enter at least 2 usernames");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: params.platform, usernames: filtered }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Compare failed");
        return;
      }
      setResults(json.results);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <nav className="sticky top-0 z-50 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
            </div>
            <span className="font-bold text-sm">AuditPro</span>
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-white transition">New Audit</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Competitor Compare</h1>
          <p className="text-sm text-gray-500 capitalize">{params.platform}</p>
        </div>

        <div className="space-y-3">
          {usernames.map((u, i) => (
            <input
              key={i}
              type="text"
              placeholder={`@username ${i + 1}`}
              value={u}
              onChange={(e) => {
                const next = [...usernames];
                next[i] = e.target.value;
                setUsernames(next);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#0d9488]"
            />
          ))}
          {usernames.length < 3 && (
            <button onClick={addSlot} className="text-sm text-[#1de4c3] hover:underline">
              + Add another
            </button>
          )}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="px-6 py-3 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-50 rounded-xl text-sm font-semibold transition"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {results && (
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
            <CompareTable entries={results} platform={params.platform} />
          </div>
        )}
      </div>
    </main>
  );
}
