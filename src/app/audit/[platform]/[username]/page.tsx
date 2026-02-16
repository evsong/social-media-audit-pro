export default function AuditReport() {
  // TODO: fetch real data from API based on params
  return (
    <main className="pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8">
          ← New Audit
        </a>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {/* Account Info */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold">N</div>
              <div>
                <div className="font-semibold">@nike</div>
                <div className="text-xs text-gray-400">Instagram</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="font-bold text-lg">302M</div><div className="text-[10px] text-gray-500 uppercase">Followers</div></div>
              <div><div className="font-bold text-lg">1,847</div><div className="text-[10px] text-gray-500 uppercase">Posts</div></div>
              <div><div className="font-bold text-lg">214</div><div className="text-[10px] text-gray-500 uppercase">Following</div></div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(13,148,136,0.12)]">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Overall Health Score</div>
            <div className="text-6xl font-extrabold text-[#1de4c3]">85</div>
            <div className="text-xs text-gray-500">/ 100</div>
            <div className="mt-2 px-3 py-1 rounded-full bg-[#0d9488]/15 text-[#1de4c3] text-xs font-semibold">Excellent</div>
          </div>

          {/* Grades */}
          <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Grade Breakdown</div>
            <div className="space-y-3">
              {[["Engagement","A"],["Posting Frequency","A-"],["Content Mix","B+"],["Bio Completeness","A"],["Hashtag Usage","B"]].map(([k,v])=>(
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{k}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${v.startsWith("A")?"bg-emerald-500/20 text-emerald-400":"bg-yellow-500/20 text-yellow-400"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0f766e] to-[#0d9488] p-8 text-center">
          <h3 className="font-bold text-xl mb-2">Want the full picture?</h3>
          <p className="text-[#c7fff3]/70 text-sm mb-5">Unlock growth trends, best posting times, competitor analysis, and AI suggestions.</p>
          <button className="px-6 py-2.5 bg-white text-[#0f766e] rounded-lg text-sm font-semibold hover:bg-gray-100 transition">Upgrade to Pro — $29.99/mo</button>
        </div>
      </div>
    </main>
  );
}
