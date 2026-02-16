export function AISuggestionList({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-lg">AI-Powered Suggestions</h3>
        <span className="px-2 py-0.5 bg-gradient-to-r from-[#0d9488] to-[#1de4c3] rounded-full text-[10px] font-bold uppercase tracking-wider">
          AI
        </span>
      </div>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="text-[#1de4c3] mt-0.5 shrink-0">✦</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
