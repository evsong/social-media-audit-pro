# User System

## ADDED Requirements

### Requirement: REQ-US-001 Database Schema

The system SHALL use PostgreSQL with Prisma ORM with the following models:

```
User { id, email, name?, plan (FREE|PRO|AGENCY), createdAt, updatedAt }
AuditReport { id, userId?, platform, username, healthScore, grades (JSON), rawData (JSON), createdAt }
```

#### Scenario: Create audit report for anonymous user
- Given no authenticated user
- When an audit is completed
- Then store AuditReport with userId = null

#### Scenario: Create audit report for registered user
- Given authenticated user with id "user_123"
- When an audit is completed
- Then store AuditReport with userId = "user_123"

### Requirement: REQ-US-002 Email Magic Link Authentication

The system SHALL use NextAuth.js with email provider for passwordless authentication.

#### Scenario: User signs up with email
- Given email "user@example.com" not in database
- When magic link is requested
- Then send email with login link, create User on first login with plan = FREE

#### Scenario: Existing user logs in
- Given email "user@example.com" exists in database
- When magic link is clicked
- Then authenticate and redirect to dashboard

### Requirement: REQ-US-003 Audit History

Registered users SHALL be able to view their past audit reports.

#### Scenario: View audit history
- Given user with 3 past audits
- When GET /api/audits is called with auth token
- Then return array of 3 AuditReport summaries sorted by createdAt desc
