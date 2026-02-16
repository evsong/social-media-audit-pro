## ADDED Requirements

### Requirement: Fake Follower Heuristic Analysis
The system SHALL estimate the percentage of authentic followers using heuristic scoring based on available profile and post data. The analysis SHALL evaluate: engagement-to-follower ratio, follower/following ratio anomalies, comment-to-like ratio, and round follower count detection.

**Scoring rules:**
- Engagement rate <0.5% with >10K followers: +30 suspicion
- Engagement rate <1% with >5K followers: +15 suspicion
- Following/followers ratio <0.1 with >1K followers: +20 suspicion
- >100K followers and >5K following: +10 suspicion
- Comment/like ratio <0.005 with >100 avg likes: +20 suspicion
- Comment/like ratio <0.01 with >100 avg likes: +10 suspicion
- Follower count ends in "000" with ≥1K followers: +5 suspicion
- authenticPercent = max(0, min(100, 100 - suspicionScore))

#### Scenario: Healthy account
- **WHEN** analyzeFakeFollowers() is called with a profile having 50K followers, 2% engagement rate, healthy ratios
- **THEN** return authenticPercent ≥ 80, riskFactors containing "No significant risk factors detected"

#### Scenario: Suspicious account with low engagement
- **WHEN** analyzeFakeFollowers() is called with 500K followers but 0.3% engagement rate
- **THEN** return authenticPercent < 70, riskFactors containing "Very low engagement rate relative to follower count"

#### Scenario: Follow-back scheme pattern
- **WHEN** analyzeFakeFollowers() is called with 5K followers and 60K following
- **THEN** return riskFactors containing "Following far more accounts than followers — possible follow-back scheme"

#### Scenario: Confidence based on post count
- **WHEN** analyzeFakeFollowers() is called with ≥10 posts
- **THEN** confidence = "high"
- **WHEN** called with 5-9 posts
- **THEN** confidence = "medium"
- **WHEN** called with <5 posts
- **THEN** confidence = "low"

### Requirement: Fake Follower Card UI
The system SHALL render a FakeFollowerCard component with a circular SVG gauge showing authentic percentage, confidence indicator, and a list of risk factors.

**Gauge colors:** ≥80% green, ≥60% yellow, <60% red

#### Scenario: Display healthy account
- **WHEN** FakeFollowerCard renders with authenticPercent=92, confidence="high"
- **THEN** display a green circular gauge at 92%, "high confidence" text, and risk factors list

#### Scenario: Display suspicious account
- **WHEN** FakeFollowerCard renders with authenticPercent=45, confidence="medium", 3 risk factors
- **THEN** display a red circular gauge at 45%, "medium confidence" text, and 3 risk factor items each with ⚠ prefix
