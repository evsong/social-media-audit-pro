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
  const frequency = scoreFrequency(posts, platform);
  const contentMix = scoreContentMix(platform, posts);
  const bio = scoreBio(platform, profile);
  const followerQuality = scoreFollowerQuality(profile);
  const hashtags = scoreHashtags(posts, platform);

  const healthScore = Math.round(
    (engagement.score * weights.engagement +
      frequency.score * weights.frequency +
      contentMix.score * weights.contentMix +
      bio.score * weights.bio +
      followerQuality.score * weights.followerQuality +
      hashtags.score * weights.hashtags) /
      100
  );

  return {
    healthScore,
    healthGrade: scoreToGrade(healthScore),
    grades: { engagement, frequency, contentMix, bio, followerQuality, hashtags },
  };
}
