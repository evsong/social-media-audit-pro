export default function DocsPage() {
  return (
    <main className="pt-24 pb-16 max-w-3xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-2">Documentation</h1>
      <p className="text-gray-400 mb-10">Everything you need to get started with AuditPro.</p>

      <Section title="Quick Start">
        <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm">
          <li>Go to <a href="/" className="text-[#1de4c3] hover:underline">the homepage</a> and select a platform (Instagram, TikTok, or X).</li>
          <li>Enter a username or paste a profile URL (e.g. <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs">https://x.com/username</code>).</li>
          <li>Click <strong>Audit Now</strong>. Your report generates in about 15 seconds.</li>
          <li>Review your health score, grade breakdown, and AI-powered suggestions.</li>
        </ol>
      </Section>

      <Section title="Understanding Your Report">
        <p className="text-gray-300 text-sm mb-3">Each audit produces a comprehensive report with:</p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <Item text="Health Score (0–100) — overall account performance rating" />
          <Item text="Grade Breakdown — individual scores for engagement, consistency, content mix, and growth" />
          <Item text="Suggestions — actionable tips to improve your social media presence" />
          <Item text="AI Insights (Pro) — deep analysis powered by AI with personalized recommendations" />
          <Item text="Best Time to Post (Pro) — optimal posting schedule based on your audience activity" />
          <Item text="Growth Trends (Pro) — historical performance tracking" />
          <Item text="Competitor Compare (Agency) — side-by-side analysis with competitors" />
        </ul>
      </Section>

      <Section title="Supported Platforms">
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Instagram", desc: "Public profiles and posts" },
            { name: "TikTok", desc: "Public profiles and videos" },
            { name: "X (Twitter)", desc: "Public profiles and tweets" },
          ].map(p => (
            <div key={p.name} className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl p-4">
              <div className="font-semibold text-sm mb-1">{p.name}</div>
              <div className="text-xs text-gray-500">{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Plans & Limits">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b border-white/10 text-gray-400">
              <th className="py-2 pr-4">Feature</th><th className="py-2 pr-4">Free</th><th className="py-2 pr-4">Pro</th><th className="py-2">Agency</th>
            </tr></thead>
            <tbody className="text-gray-300">
              {[
                ["Audits per month", "3", "30", "Unlimited"],
                ["Health score & grades", "✓", "✓", "✓"],
                ["AI suggestions", "—", "✓", "✓"],
                ["PDF export", "—", "✓", "✓"],
                ["Competitor compare", "—", "—", "✓"],
                ["Fake follower detection", "—", "—", "✓"],
              ].map(([f, ...vals]) => (
                <tr key={f} className="border-b border-white/5">
                  <td className="py-2 pr-4">{f}</td>
                  {vals.map((v, i) => <td key={i} className="py-2 pr-4">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="FAQ">
        <div className="space-y-4">
          <QA q="Do I need an account to use AuditPro?" a="No. You can run free audits without signing up. Creating an account lets you save audit history and track progress over time." />
          <QA q="Is my data safe?" a="Yes. We only analyze publicly available profile data. We never ask for your social media passwords. See our Privacy Policy for details." />
          <QA q="How accurate are the scores?" a="Scores are based on industry benchmarks for engagement rates, posting frequency, content diversity, and growth patterns. They provide directional guidance, not absolute metrics." />
          <QA q="Can I cancel my subscription?" a="Yes, anytime. We offer a 7-day full refund guarantee on all paid plans." />
        </div>
      </Section>

      <Section title="Need Help?">
        <p className="text-gray-300 text-sm">
          Email us at <a href="mailto:support@socialmediaaudittool.online" className="text-[#1de4c3] hover:underline">support@socialmediaaudittool.online</a>. We typically respond within 24 hours on business days.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Item({ text }: { text: string }) {
  return <li className="flex items-start gap-2"><span className="text-[#1de4c3] mt-0.5">✓</span>{text}</li>;
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <div className="font-medium text-sm mb-1">{q}</div>
      <div className="text-gray-400 text-sm">{a}</div>
    </div>
  );
}
