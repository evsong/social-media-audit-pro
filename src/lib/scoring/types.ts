export interface DimensionScore {
  score: number; // 0-100
  grade: string; // A, B+, etc.
}

export interface EngagementScore extends DimensionScore {
  rate: number;
}

export interface FrequencyScore extends DimensionScore {
  postsPerMonth: number;
}

export interface ContentMixScore extends DimensionScore {
  types: Record<string, number>;
}

export interface BioScore extends DimensionScore {
  checks: Record<string, boolean>;
}

export interface FollowerQualityScore extends DimensionScore {
  ratio: number;
}

export interface HashtagScore extends DimensionScore {
  avgPerPost: number;
}

export interface GradeBreakdown {
  engagement: EngagementScore;
  frequency: FrequencyScore;
  contentMix: ContentMixScore;
  bio: BioScore;
  followerQuality: FollowerQualityScore;
  hashtags: HashtagScore;
}

export interface ScoreResult {
  healthScore: number;
  healthGrade: string;
  grades: GradeBreakdown;
}
