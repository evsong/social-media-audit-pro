"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProgressSteps } from "@/components/audit/ProgressSteps";

function AuditLoader() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const called = useRef(false);

  const platform = params.get("platform");
  const username = params.get("username");

  useEffect(() => {
    if (!platform || !username || called.current) return;
    called.current = true;

    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, username }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Audit failed");
          return;
        }
        sessionStorage.setItem(`audit:${platform}:${username}`, JSON.stringify(data));
        router.replace(`/audit/${platform}/${data.profile?.username || username}`);
      })
      .catch(() => setError("Network error. Please try again."));
  }, [platform, username, router]);

  if (!platform || !username) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Missing platform or username.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Auditing @{username}</h1>
        <p className="text-sm text-gray-500">This usually takes a few seconds</p>
      </div>
      <ProgressSteps />
      {error && (
        <div className="text-center">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <a href="/" className="text-[#1de4c3] text-sm hover:underline">← Back to home</a>
        </div>
      )}
    </main>
  );
}

export default function AuditLoadingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </main>
    }>
      <AuditLoader />
    </Suspense>
  );
}
