"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
          </div>
          <span className="font-bold text-lg tracking-tight">AuditPro</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="/#features" className="hover:text-white transition">Features</a>
          <a href="/#pricing" className="hover:text-white transition">Pricing</a>
          {status === "loading" ? (
            <div className="w-20 h-9" />
          ) : session?.user ? (
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
              <span className="text-xs text-gray-500 truncate max-w-[160px]">{session.user.email}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-xs transition">
                Sign Out
              </button>
            </div>
          ) : (
            <a href="/auth/signin" className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-white text-sm font-medium transition">Sign In</a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0A1628]/95 backdrop-blur-xl px-4 py-4 space-y-3 text-sm">
          <a href="/#features" className="block text-gray-400 hover:text-white transition" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="/#pricing" className="block text-gray-400 hover:text-white transition" onClick={() => setMenuOpen(false)}>Pricing</a>
          {session?.user ? (
            <>
              <a href="/dashboard" className="block text-gray-400 hover:text-white transition" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
              <button onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }} className="w-full text-left text-gray-400 hover:text-white transition">
                Sign Out
              </button>
            </>
          ) : (
            <a href="/auth/signin" className="block px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-white text-sm font-medium text-center transition" onClick={() => setMenuOpen(false)}>Sign In</a>
          )}
        </div>
      )}
    </nav>
  );
}
