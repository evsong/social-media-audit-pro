## ADDED Requirements

### Requirement: Competitor Compare API
The system SHALL provide POST /api/compare accepting a platform and 2-3 usernames, running the full audit pipeline (fetchProfile + fetchPosts + calculateScore) for each username in parallel, and returning side-by-side results. This endpoint SHALL require authentication and PRO+ plan.

#### Scenario: Compare 2 accounts
- **WHEN** a PRO user calls POST /api/compare with platform="instagram" and usernames=["nike", "adidas"]
- **THEN** return { platform: "instagram", results: [{ username, healthScore, healthGrade, grades }, ...] } with 2 entries

#### Scenario: Compare 3 accounts
- **WHEN** a PRO user calls POST /api/compare with 3 usernames
- **THEN** return results array with 3 entries

#### Scenario: Unauthenticated user
- **WHEN** an unauthenticated user calls POST /api/compare
- **THEN** return 401 with error "Sign in required"

#### Scenario: FREE user denied
- **WHEN** a FREE user calls POST /api/compare
- **THEN** return 403 with error "Upgrade to Pro to use competitor compare"

#### Scenario: Invalid username count
- **WHEN** POST /api/compare is called with fewer than 2 or more than 3 usernames
- **THEN** return 400 with error "Provide platform and 2-3 usernames"

#### Scenario: Profile not found
- **WHEN** one of the usernames does not exist on the platform
- **THEN** return 404 with the ProfileNotFoundError message

### Requirement: Compare Table UI
The system SHALL render a CompareTable component showing a side-by-side table with health score and all 6 dimension grades for each compared account.

#### Scenario: Render comparison of 2 accounts
- **WHEN** CompareTable renders with 2 entries
- **THEN** display a table with columns for each username, rows for Health Score and 6 dimensions (Engagement, Frequency, Content Mix, Bio & Profile, Follower Quality, Hashtags), showing score and color-coded grade per cell

#### Scenario: Grade color coding
- **WHEN** a grade starts with "A"
- **THEN** display in green; "B" in teal; "C" in yellow; "D" in red

### Requirement: Compare Page
The system SHALL provide a /compare/[platform] page with input fields for 2-3 usernames, a "Compare" button, and a results area showing CompareTable.

#### Scenario: Submit comparison
- **WHEN** user enters 2 usernames and clicks "Compare"
- **THEN** call POST /api/compare and display CompareTable with results

#### Scenario: Add third username slot
- **WHEN** user clicks "+ Add another" (visible when fewer than 3 slots)
- **THEN** a third input field appears

#### Scenario: Error display
- **WHEN** the compare API returns an error
- **THEN** display the error message in red text below the form
