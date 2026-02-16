import type { Platform, ProfileData, PostData } from "../providers/types";
import type { ScoreResult } from "../scoring/types";

export interface AIScoreResult {
  grade: string;
  summary: string;
  dimensions: {
    contentQuality: { grade: string; comment: string };
    brandConsistency: { grade: string; comment: string };
    audienceAlignment: { grade: string; comment: string };
  };
}

async function callClaude(prompt: string, maxTokens = 500): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "");
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-6";

  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.content?.[0]?.text || null;
}

export async function generateAIScoring(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[],
  scoreResult: ScoreResult
): Promise<AIScoreResult | undefined> {
  const captions = posts
    .slice(0, 8)
    .map((p, i) => `${i + 1}. [${p.type}] ${(p.caption || "").slice(0, 120)}`)
    .join("\n");

  const prompt = `Analyze this ${platform} account's content strategy. Return ONLY valid JSON, no markdown.

Account: @${profile.username} (${profile.followers.toLocaleString()} followers)
Bio: ${profile.bio || "empty"}
Health Score: ${scoreResult.healthScore}/100

Recent posts:
${captions}

Return this exact JSON structure:
{"grade":"<A|B|C|D>","summary":"<one sentence overall assessment>","dimensions":{"contentQuality":{"grade":"<A|B|C|D>","comment":"<one sentence>"},"brandConsistency":{"grade":"<A|B|C|D>","comment":"<one sentence>"},"audienceAlignment":{"grade":"<A|B|C|D>","comment":"<one sentence>"}}}

Grading guide:
- contentQuality: Are posts informative, engaging, well-crafted? Do they provide value?
- brandConsistency: Is there a clear voice/theme? Do posts feel cohesive?
- audienceAlignment: Does content match what the follower base likely wants?`;

  const text = await callClaude(prompt, 300);
  if (!text) return undefined;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return undefined;
    return JSON.parse(jsonMatch[0]) as AIScoreResult;
  } catch {
    return undefined;
  }
}

export async function generateAISuggestions(
  platform: Platform,
  profile: ProfileData,
  scoreResult: ScoreResult
): Promise<string[]> {
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

  const content = await callClaude(prompt, 500);
  if (!content) return ["AI suggestions temporarily unavailable."];

  return content
    .split("\n")
    .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line: string) => line.length > 10);
}
