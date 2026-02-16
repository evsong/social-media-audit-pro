## ADDED Requirements

### Requirement: PRO+ AI Suggestion Generation
The system SHALL call GPT-4o-mini to generate 3-5 personalized, actionable suggestions when the auditing user's plan is PRO or AGENCY. The AI call SHALL run in parallel with other premium analyses and SHALL NOT block the audit if it fails.

**Input:** platform, ProfileData, ScoreResult (grades + healthScore)
**Model:** gpt-4o-mini, temperature=0.7, max_tokens=500
**Cost:** ~$0.01-0.03 per audit

#### Scenario: PRO user receives AI suggestions
- **WHEN** a PRO user completes an audit and OPENAI_API_KEY is configured
- **THEN** the response includes an `aiSuggestions` field containing 3-5 string suggestions targeting the weakest scoring dimensions

#### Scenario: FREE user does not trigger AI
- **WHEN** a FREE user completes an audit
- **THEN** the response does NOT include an `aiSuggestions` field and no OpenAI API call is made

#### Scenario: OpenAI API unavailable
- **WHEN** OPENAI_API_KEY is missing or the API returns an error
- **THEN** the audit completes normally without `aiSuggestions` in the response (silent degradation)

### Requirement: AI Suggestion UI Component
The system SHALL render AI suggestions in a dedicated `AISuggestionList` component visually distinct from template suggestions, with an "AI" gradient badge and ✦ prefix per item.

#### Scenario: Display AI suggestions for PRO user
- **WHEN** the report page renders with aiSuggestions containing 4 items
- **THEN** display a card with title "AI-Powered Suggestions", a teal gradient "AI" badge, and 4 suggestions each prefixed with ✦

#### Scenario: FREE user sees locked AI section
- **WHEN** the report page renders without aiSuggestions data and userPlan is FREE
- **THEN** display a LockedSection with title "AI-Powered Suggestions" and upgrade CTA
