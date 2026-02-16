# AI Suggestions

## ADDED Requirements

### Requirement: REQ-AI-001 Template Suggestions Free Tier

The system SHALL generate rule-based template suggestions based on scoring dimensions. Each dimension with grade B or below triggers a corresponding suggestion.

**Template mapping:**
- Engagement D/C: "Your engagement rate is below average. Try asking questions in captions and responding to comments within the first hour."
- Engagement B: "Your engagement is decent. Consider using more interactive content like polls, quizzes, or carousel posts."
- Frequency D: "You're posting less than once a week. Aim for at least 3 posts per week to stay visible in the algorithm."
- Frequency C: "Increase your posting frequency. 3-4 times per week is the sweet spot for most accounts."
- ContentMix C: "You're only using one content type. Mix in Reels, carousels, and Stories to reach different audience segments."
- Bio D/C: "Your profile is incomplete. Add a bio, profile picture, and link to improve discoverability."
- Hashtags D: "You're not using hashtags. Add 5-15 relevant hashtags per post to increase reach."
- Hashtags C (too many): "You're using too many hashtags. Focus on 5-15 highly relevant ones instead of 30+."

#### Scenario: Low engagement triggers suggestion
- Given engagement grade = "C"
- When template suggestions are generated
- Then include engagement improvement suggestion

#### Scenario: All grades A
- Given all dimensions grade A
- When template suggestions are generated
- Then return congratulatory message with 1-2 optimization tips

### Requirement: REQ-AI-002 AI Deep Suggestions Paid Tier

The system SHALL use GPT-4o-mini to generate 3-5 personalized suggestions for Pro users, incorporating profile data, post analysis, and scoring results.

**Prompt template includes:** platform, username, follower count, engagement rate, content types, posting frequency, top performing posts, lowest scoring dimensions.

#### Scenario: Pro user gets AI suggestions
- Given Pro user completes audit
- When AI suggestions are requested
- Then call OpenAI API and return 3-5 actionable, personalized suggestions

#### Scenario: Free user cannot access AI suggestions
- Given free user views report
- When AI suggestion section is rendered
- Then show locked/blurred section with upgrade CTA
