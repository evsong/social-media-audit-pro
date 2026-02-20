"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("resend", {
        email: email.trim(),
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = "/auth/verify";
      } else {
        setError("Failed to send login link. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
          </div>
          <span className="font-bold text-lg">AuditPro</span>
        </a>

        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-center mb-2">Sign in to AuditPro</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Get 5 free audits per month with an account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 outline-none focus:border-[#0d9488] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#0d9488] to-[#0dc8aa] hover:from-[#0f766e] hover:to-[#0d9488] rounded-lg text-white text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}

          <p className="text-xs text-gray-600 text-center mt-4">
            No password needed. We&apos;ll email you a login link.
          </p>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          <a href="/" className="text-[#1de4c3] hover:underline">← Back to home</a>
        </p>
      </div>
    </main>
  );
}
