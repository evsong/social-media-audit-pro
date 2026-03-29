"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStep("code");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send code. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("email-otp", {
        email: email.trim(),
        code: code.trim(),
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Invalid or expired code. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
          </div>
          <span className="font-bold text-lg">AuditPro</span>
        </a>

        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8">
          <h1 className="text-xl font-bold text-center mb-2">Sign in to AuditPro</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            {step === "email"
              ? "Enter your email to receive a verification code"
              : `We sent a 6-digit code to ${email}`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
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
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm text-gray-400 mb-1.5">Verification Code</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl font-mono tracking-[0.3em] placeholder-gray-500 outline-none focus:border-[#0d9488] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full py-2.5 bg-gradient-to-r from-[#0d9488] to-[#0dc8aa] hover:from-[#0f766e] hover:to-[#0d9488] rounded-lg text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(""); }}
                className="w-full text-sm text-gray-500 hover:text-gray-300 transition"
              >
                Use a different email
              </button>
            </form>
          )}

          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          <a href="/" className="text-[#1de4c3] hover:underline">&larr; Back to home</a>
        </p>
      </div>
    </main>
  );
}
