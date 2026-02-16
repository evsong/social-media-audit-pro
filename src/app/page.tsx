import { AuditForm } from "@/components/landing/AuditForm";

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#1de4c3] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/></svg>
            </div>
            <span className="font-bold text-lg tracking-tight">AuditPro</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="/auth/signin" className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg text-white text-sm font-medium transition">Sign In</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0d9488]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 text-xs text-[#1de4c3] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1de4c3] animate-pulse" />
            Free audit — no login required
          </div>
          <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-5">
            Audit your social media{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1de4c3] to-[#06b6d4]">
              in 60 seconds
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Get a health score, engagement analysis, and actionable insights for
            your Instagram, TikTok, or X account.
          </p>

          <AuditForm />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-bold text-3xl mb-14">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Enter your profile", desc: "Paste a username or profile URL from Instagram, TikTok, or X." },
              { step: "2", title: "We analyze", desc: "Our engine scans engagement, content mix, posting patterns, and more." },
              { step: "3", title: "Get your report", desc: "Receive a health score with grades, benchmarks, and AI-powered tips." },
            ].map((s) => (
              <div key={s.step} className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-xs text-[#1de4c3] font-semibold mb-2">STEP {s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-3xl mb-14">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <PriceCard title="Free" price="$0" period="forever" features={["3 audits per month","Health score + grades","Basic engagement data","Template suggestions"]} />
            <PriceCard title="Pro" price="$5.99" period="per month" popular features={["30 audits per month","AI deep suggestions","Growth trends","Best time to post","PDF export"]} />
            <PriceCard title="Agency" price="$99" period="per month" features={["Unlimited audits","Everything in Pro","Competitor compare","Fake follower detection","White-label reports"]} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-sm">AuditPro</span>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Blog</a>
          </div>
          <div className="text-xs text-gray-600">© 2026 AuditPro</div>
        </div>
      </footer>
    </main>
  );
}

function PriceCard({ title, price, period, features, popular }: {
  title: string; price: string; period: string; features: string[]; popular?: boolean;
}) {
  return (
    <div className={`bg-[rgba(255,255,255,0.04)] backdrop-blur border rounded-2xl p-6 flex flex-col ${popular ? "border-[#0d9488]/40 shadow-[0_0_30px_rgba(13,148,136,0.12)] relative" : "border-white/10"}`}>
      {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0d9488] rounded-full text-xs font-semibold">Popular</div>}
      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">{title}</div>
      <div className="text-3xl font-bold mb-1">{price}</div>
      <div className="text-gray-500 text-sm mb-6">{period}</div>
      <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
        {features.map((f) => <li key={f} className="flex items-center gap-2"><span className="text-[#1de4c3]">✓</span>{f}</li>)}
      </ul>
      <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${popular ? "bg-gradient-to-r from-[#0d9488] to-[#0dc8aa]" : "border border-white/10 hover:bg-white/5"}`}>
        {title === "Agency" ? "Contact Sales" : popular ? "Upgrade to Pro" : "Get Started"}
      </button>
    </div>
  );
}
