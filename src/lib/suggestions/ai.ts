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

export interface AIAnalysisResult {
  suggestions: string[];
  scoring?: AIScoreResult;
}

export async function generateAIAnalysis(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[],
  scoreResult: ScoreResult
): Promise<AIAnalysisResult> {
  const { grades } = scoreResult;
  const weakest = Object.entries(grades)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 3)
    .map(([dim]) => dim);

  const captions = posts
    .slice(0, 8)
    .map((p, i) => `${i + 1}. [${p.type}] ${(p.caption || "").slice(0, 120)}`)
    .join("\n");

  const prompt = `You are a social media strategist. Analyze this ${platform} account and return ONLY valid JSON, no markdown.

Account: @${profile.username} (${profile.followers.toLocaleString()} followers)
Bio: ${profile.bio || "empty"}
Engagement Rate: ${grades.engagement.rate}%
Posts/Month: ${grades.frequency.postsPerMonth}
Content Types: ${Object.entries(grades.contentMix.types).map(([t, n]) => `${t}: ${n}`).join(", ")}
Health Score: ${scoreResult.healthScore}/100
Weakest Areas: ${weakest.join(", ")}

Recent posts:
${captions || "(no recent posts)"}

Return this exact JSON:
{"suggestions":["<suggestion 1>","<suggestion 2>","<suggestion 3>","<suggestion 4>","<suggestion 5>"],"scoring":{"grade":"<A|B|C|D>","summary":"<one sentence overall assessment>","dimensions":{"contentQuality":{"grade":"<A|B|C|D>","comment":"<one sentence>"},"brandConsistency":{"grade":"<A|B|C|D>","comment":"<one sentence>"},"audienceAlignment":{"grade":"<A|B|C|D>","comment":"<one sentence>"}}}

Rules:
- suggestions: 3-5 concise, actionable suggestions (1-2 sentences each). Focus on weakest areas.
- scoring.grade: Overall content strategy grade
- contentQuality: Are posts informative, engaging, well-crafted?
- brandConsistency: Is there a clear voice/theme? Do posts feel cohesive?
- audienceAlignment: Does content match what the follower base likely wants?`;

  const text = await callClaude(prompt, 700);
  if (!text) return { suggestions: ["AI suggestions temporarily unavailable."] };

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { suggestions: ["AI suggestions temporarily unavailable."] };
    const parsed = JSON.parse(jsonMatch[0]) as { suggestions?: string[]; scoring?: AIScoreResult };
    return {
      suggestions: (parsed.suggestions || []).filter((s: string) => s.length > 10),
      scoring: parsed.scoring,
    };
  } catch {
    return { suggestions: ["AI suggestions temporarily unavailable."] };
  }
}

// Keep individual exports for backward compatibility if needed
export async function generateAIScoring(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[],
  scoreResult: ScoreResult
): Promise<AIScoreResult | undefined> {
  const result = await generateAIAnalysis(platform, profile, posts, scoreResult);
  return result.scoring;
}

export async function generateAISuggestions(
  platform: Platform,
  profile: ProfileData,
  scoreResult: ScoreResult
): Promise<string[]> {
  // Fallback — only used if called independently
  const { grades } = scoreResult;
  const weakest = Object.entries(grades)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 3)
    .map(([dim]) => dim);

  const prompt = `You are a social media strategist. Provide 3-5 specific, actionable suggestions for this ${platform} account.

Account: @${profile.username}, ${profile.followers.toLocaleString()} followers
Engagement: ${grades.engagement.rate}%, Posts/Month: ${grades.frequency.postsPerMonth}
Health Score: ${scoreResult.healthScore}/100, Weakest: ${weakest.join(", ")}

Return 3-5 concise suggestions (1-2 sentences each).`;

  const content = await callClaude(prompt, 400);
  if (!content) return ["AI suggestions temporarily unavailable."];

  return content
    .split("\n")
    .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line: string) => line.length > 10);
}
