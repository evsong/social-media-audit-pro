export function SuggestionList({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur border border-white/10 rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4">Suggestions</h3>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="text-[#1de4c3] mt-0.5 shrink-0">→</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
