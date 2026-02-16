# Rate Limiting & Caching

## ADDED Requirements

### Requirement: REQ-RL-001 Anonymous Rate Limiting

The system SHALL limit anonymous users to 1 audit per day per IP address.

#### Scenario: First audit of the day
- Given IP "1.2.3.4" has not audited today
- When POST /api/audit is called
- Then allow and return audit result

#### Scenario: Second audit attempt same day
- Given IP "1.2.3.4" already audited today
- When POST /api/audit is called
- Then return 429 with message "Daily limit reached. Sign up for more audits."

### Requirement: REQ-RL-002 Registered User Rate Limiting

The system SHALL limit free registered users to 5 audits per calendar month.

#### Scenario: Within monthly limit
- Given user has used 3 of 5 monthly audits
- When POST /api/audit is called
- Then allow and return audit result, show "2 audits remaining"

#### Scenario: Monthly limit exceeded
- Given user has used 5 of 5 monthly audits
- When POST /api/audit is called
- Then return 429 with message "Monthly limit reached. Upgrade to Pro for more."

### Requirement: REQ-RL-003 Global Rate Limiting

The system SHALL enforce a global rate limit of 3 requests per minute per IP.

#### Scenario: Rapid requests
- Given 3 requests in the last 60 seconds from same IP
- When 4th request arrives
- Then return 429 with Retry-After header

### Requirement: REQ-RL-004 Audit Result Caching

The system SHALL cache audit results for the same platform+username for 24 hours. Cached results do not count toward user limits.

#### Scenario: Cache hit
- Given audit for "instagram/nike" completed 2 hours ago
- When another user audits "instagram/nike"
- Then return cached result, do not call external APIs, do not count toward limit

#### Scenario: Cache expired
- Given audit for "instagram/nike" completed 25 hours ago
- When user audits "instagram/nike"
- Then fetch fresh data, count toward limit, update cache
