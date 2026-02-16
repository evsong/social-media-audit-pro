import type { Platform, ProfileData } from "../providers/types";
import type { ScoreResult } from "../scoring/types";

export async function generateAISuggestions(
  platform: Platform,
  profile: ProfileData,
  scoreResult: ScoreResult
): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return ["AI suggestions unavailable. Please configure OPENAI_API_KEY."];

  const { grades } = scoreResult;
  const weakest = Object.entries(grades)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 3)
    .map(([dim]) => dim);

  const prompt = `You are a social media strategist. Analyze this ${platform} account and provide 3-5 specific, actionable suggestions.

Account: @${profile.username}
Followers: ${profile.followers.toLocaleString()}
Engagement Rate: ${grades.engagement.rate}%
Posts/Month: ${grades.frequency.postsPerMonth}
Content Types: ${Object.entries(grades.contentMix.types).map(([t, n]) => `${t}: ${n}`).join(", ")}
Health Score: ${scoreResult.healthScore}/100
Weakest Areas: ${weakest.join(", ")}

Provide 3-5 concise, actionable suggestions. Each should be 1-2 sentences. Focus on the weakest areas.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!res.ok) return ["AI suggestions temporarily unavailable."];

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";

  return content
    .split("\n")
    .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line: string) => line.length > 10);
}
