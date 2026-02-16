# Scoring Engine

## ADDED Requirements

### Requirement: REQ-SE-001 Platform-Specific Weighted Scoring

The system SHALL calculate a health score (0-100) using weighted dimensions with platform-specific weights.

**Instagram weights:** Engagement 25%, Frequency 15%, ContentMix 20%, Bio 10%, FollowerQuality 20%, Hashtags 10%
**TikTok weights:** Engagement 30%, Frequency 25%, ContentMix 10%, Bio 10%, FollowerQuality 15%, Hashtags 10%
**X weights:** Engagement 30%, Frequency 25%, ContentMix 10%, Bio 15%, FollowerQuality 15%, Hashtags 5%

#### Scenario: Calculate Instagram health score
- Given an Instagram profile with engagement rate 2.5%, 10 posts/30d, 2 content types, complete bio, healthy follower ratio, 8 hashtags avg
- When calculateScore("instagram", profileData, postsData) is called
- Then return healthScore between 70-85 and grades object with 6 dimensions

#### Scenario: All weights sum to 100%
- Given any platform
- When weights are loaded for that platform
- Then sum of all dimension weights equals 100

### Requirement: REQ-SE-002 Engagement Rate Calculation

The system SHALL calculate engagement rate as avg(likes + comments) / followers * 100 from the most recent 12 posts.

**Platform baselines:**
- Instagram: A >3%, B 1-3%, C 0.5-1%, D <0.5%
- TikTok: A >8%, B 4-8%, C 2-4%, D <2%
- X: A >1.5%, B 0.5-1.5%, C 0.2-0.5%, D <0.2%

#### Scenario: High engagement Instagram account
- Given 12 posts averaging 9000 likes + 300 comments, 300000 followers
- When engagement rate is calculated
- Then rate = 3.1%, grade = "A"

#### Scenario: Zero followers edge case
- Given 0 followers
- When engagement rate is calculated
- Then return rate = 0, grade = "D"

### Requirement: REQ-SE-003 Posting Frequency Score

The system SHALL score posting frequency based on posts in the last 30 days.

**All platforms:** A >12, B 8-12, C 4-7, D <4

#### Scenario: Active poster
- Given 15 posts in last 30 days
- When frequency is scored
- Then grade = "A", dimensionScore >= 90

### Requirement: REQ-SE-004 Content Diversity Score

The system SHALL score content type diversity from recent posts.

**Instagram:** A = 3+ types (photo/video/reel/carousel), B = 2 types, C = 1 type
**TikTok:** Always scores B (video-only platform), bonus for duets/stitches
**X:** A = 3+ types (text/image/video/thread), B = 2 types, C = 1 type

#### Scenario: Instagram with diverse content
- Given 12 posts: 4 photos, 4 reels, 4 carousels
- When content diversity is scored
- Then grade = "A"

### Requirement: REQ-SE-005 Bio Completeness Score

The system SHALL check profile completeness.

**Checks:** avatar present, bio text present, external URL present, contact/category info
**Instagram bonus:** highlights present
**X bonus:** pinned tweet present

#### Scenario: Complete Instagram profile
- Given profile with avatar, bio, URL, and highlights
- When bio completeness is scored
- Then grade = "A"

### Requirement: REQ-SE-006 Follower Quality Score

The system SHALL estimate follower quality from followers/following ratio and growth patterns.

**Healthy ratio:** followers/following > 2 for accounts with 10K+ followers
**Suspicious signals:** following > followers, sudden spikes (future, requires history)

#### Scenario: Healthy large account
- Given 300K followers, 200 following
- When follower quality is scored
- Then grade = "A" (ratio = 1500)

### Requirement: REQ-SE-007 Hashtag Usage Score

The system SHALL score hashtag usage from recent posts.

**All platforms:** A = 5-15 relevant hashtags avg, B = 1-4, C = 0 or 30+

#### Scenario: Optimal hashtag usage
- Given 12 posts averaging 10 hashtags each
- When hashtag usage is scored
- Then grade = "A"

### Requirement: REQ-SE-008 Grade Mapping

The system SHALL map each dimension score (0-100) to letter grades:
A = 90-100, A- = 85-89, B+ = 80-84, B = 70-79, B- = 65-69, C = 60-64, D = 0-59

#### Scenario: Score to grade conversion
- Given dimension score 82
- When mapped to grade
- Then return "B+"
