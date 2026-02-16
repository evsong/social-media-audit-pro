interface CompareEntry {
  username: string;
  healthScore: number;
  healthGrade: string;
  grades: Record<string, { score: number; grade: string }>;
}

const DIMENSION_LABELS: Record<string, string> = {
  engagement: "Engagement",
  frequency: "Frequency",
  contentMix: "Content Mix",
  bio: "Bio & Profile",
  followerQuality: "Follower Quality",
  hashtags: "Hashtags",
};

function gradeColor(grade: string): string {
  const letter = grade.charAt(0);
  if (letter === "A") return "text-green-400";
  if (letter === "B") return "text-teal-400";
  if (letter === "C") return "text-yellow-400";
  return "text-red-400";
}

export function CompareTable({
  entries,
  platform,
}: {
  entries: CompareEntry[];
  platform: string;
}) {
  const dimensions = Object.keys(DIMENSION_LABELS);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-2 text-gray-500 font-medium">Metric</th>
            {entries.map((e) => (
              <th key={e.username} className="text-center py-3 px-2 font-medium">
                @{e.username}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5">
            <td className="py-3 px-2 text-gray-400">Health Score</td>
            {entries.map((e) => (
              <td key={e.username} className="text-center py-3 px-2">
                <span className="text-lg font-bold">{e.healthScore}</span>
                <span className={`ml-1 text-xs ${gradeColor(e.healthGrade)}`}>{e.healthGrade}</span>
              </td>
            ))}
          </tr>
          {dimensions.map((dim) => (
            <tr key={dim} className="border-b border-white/5">
              <td className="py-2.5 px-2 text-gray-400">{DIMENSION_LABELS[dim]}</td>
              {entries.map((e) => {
                const g = e.grades[dim];
                return (
                  <td key={e.username} className="text-center py-2.5 px-2">
                    {g ? (
                      <>
                        <span className="text-gray-300">{g.score}</span>
                        <span className={`ml-1 text-xs ${gradeColor(g.grade)}`}>{g.grade}</span>
                      </>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
