# Frontend Interaction

## ADDED Requirements

### Requirement: REQ-FE-001 Platform Selection Tabs

The home page SHALL display 3 platform tabs (Instagram / TikTok / X) above the username input field. User must select a platform before submitting.

#### Scenario: Select platform and submit
- Given user selects "Instagram" tab and enters "nike"
- When form is submitted
- Then POST /api/audit with { platform: "instagram", username: "nike" }

#### Scenario: No platform selected
- Given no platform tab is active
- When user tries to submit
- Then show validation error "Please select a platform"

### Requirement: REQ-FE-002 4-Step Progress Animation

During audit processing, the UI SHALL display a 4-step progress indicator:
1. "Fetching profile data..." → checkmark when done
2. "Analyzing posts..." → checkmark when done
3. "Calculating scores..." → checkmark when done
4. "Generating insights..." → checkmark when done

#### Scenario: Audit in progress
- Given user submitted audit for "instagram/nike"
- When API is processing
- Then show progress steps with current step animated, completed steps with checkmark

#### Scenario: Audit completes
- Given all 4 steps complete
- Then redirect to /audit/instagram/nike with results

### Requirement: REQ-FE-003 Audit Report Page

The report page SHALL display:
- Account info card (avatar, username, platform badge, follower/following/post counts)
- Health score (0-100) with color coding (green 80+, yellow 60-79, red <60)
- 6 dimension grade cards with letter grades
- Template suggestions (free tier)
- Locked sections with blur overlay (growth trends, best time to post, AI suggestions)
- CTA banner to upgrade

#### Scenario: View free audit report
- Given audit completed with healthScore 85
- When report page loads
- Then show score 85 in green, 6 grade cards, template suggestions, and 3 locked sections

### Requirement: REQ-FE-004 Locked Premium Sections

The report SHALL show 3 locked sections with blur overlay and lock icon:
1. Growth Trend (line chart placeholder)
2. Best Time to Post (heatmap placeholder)
3. AI Deep Suggestions

Each locked section shows "Upgrade to Pro to unlock" CTA.

#### Scenario: Free user views locked section
- Given user is not on Pro plan
- When viewing report
- Then locked sections show blurred placeholder content with upgrade CTA

### Requirement: REQ-FE-005 Remaining Audits Counter

The UI SHALL show remaining audit count for the current period.

#### Scenario: Anonymous user
- Given IP has 1 audit remaining today
- Then show "1 free audit remaining today. Sign up for more."

#### Scenario: Registered free user
- Given user has 3 of 5 monthly audits remaining
- Then show "3 audits remaining this month"
