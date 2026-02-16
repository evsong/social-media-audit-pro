import type { Platform, ProfileData, PostData } from "../providers/types";
import type { ScoreResult } from "./types";
import { getWeights } from "./weights";
import { scoreToGrade } from "./grades";
import { scoreEngagement } from "./dimensions/engagement";
import { scoreFrequency } from "./dimensions/frequency";
import { scoreContentMix } from "./dimensions/content-mix";
import { scoreBio } from "./dimensions/bio";
import { scoreFollowerQuality } from "./dimensions/followers";
import { scoreHashtags } from "./dimensions/hashtags";

export function calculateScore(
  platform: Platform,
  profile: ProfileData,
  posts: PostData[]
): ScoreResult {
  const weights = getWeights(platform);

  const engagement = scoreEngagement(platform, profile, posts);
  const frequency = scoreFrequency(posts, platform, profile.posts, profile.followers);
  const contentMix = scoreContentMix(platform, posts);
  const bio = scoreBio(platform, profile);
  const followerQuality = scoreFollowerQuality(profile);
  const hashtags = scoreHashtags(posts, platform);

  // Weighted base score
  const baseScore =
    (engagement.score * weights.engagement +
      frequency.score * weights.frequency +
      contentMix.score * weights.contentMix +
      bio.score * weights.bio +
      followerQuality.score * weights.followerQuality +
      hashtags.score * weights.hashtags) /
    100;

  // Influence bonus — large accounts with real engagement deserve credit
  let influenceBonus = 0;
  if (profile.followers >= 100_000_000) influenceBonus = 8;
  else if (profile.followers >= 10_000_000) influenceBonus = 5;
  else if (profile.followers >= 1_000_000) influenceBonus = 3;

  const healthScore = Math.round(Math.min(100, baseScore + influenceBonus));

  return {
    healthScore,
    healthGrade: scoreToGrade(healthScore),
    grades: { engagement, frequency, contentMix, bio, followerQuality, hashtags },
  };
}
