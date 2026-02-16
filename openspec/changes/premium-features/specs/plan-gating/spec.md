## ADDED Requirements

### Requirement: Feature Access Control by Plan
The system SHALL provide a centralized `canAccessFeature(plan, feature)` function that returns a boolean indicating whether the given plan tier has access to the specified feature.

**Feature matrix:**
| Feature | FREE | PRO | AGENCY |
|---------|------|-----|--------|
| ai_suggestions | ✗ | ✓ | ✓ |
| best_time | ✗ | ✓ | ✓ |
| growth_trend | ✗ | ✓ | ✓ |
| pdf_export | ✗ | ✓ | ✓ |
| competitor_compare | ✗ | ✓ | ✓ |
| fake_follower_detection | ✗ | ✓ | ✓ |

#### Scenario: FREE user denied premium feature
- **WHEN** canAccessFeature("FREE", "ai_suggestions") is called
- **THEN** return false

#### Scenario: PRO user granted premium feature
- **WHEN** canAccessFeature("PRO", "ai_suggestions") is called
- **THEN** return true

#### Scenario: AGENCY user granted all features
- **WHEN** canAccessFeature("AGENCY", feature) is called for any feature
- **THEN** return true

### Requirement: Plan-Based Monthly Audit Limits
The system SHALL enforce different monthly audit limits based on user plan: FREE=5, PRO=50, AGENCY=unlimited.

#### Scenario: FREE user exceeds monthly limit
- **WHEN** a FREE user with 5 audits this month calls POST /api/audit
- **THEN** return 429 with message "Monthly limit reached (5). Upgrade to Pro for more."

#### Scenario: PRO user within limit
- **WHEN** a PRO user with 30 audits this month calls POST /api/audit
- **THEN** allow the request and return remaining: 20

#### Scenario: AGENCY user unlimited
- **WHEN** an AGENCY user with 200 audits this month calls POST /api/audit
- **THEN** allow the request

### Requirement: LockedSection Plan-Aware Rendering
The LockedSection component SHALL accept `userPlan` and `feature` props and conditionally render children content (when unlocked) or a lock overlay with upgrade CTA (when locked).

#### Scenario: PRO user views premium section
- **WHEN** LockedSection renders with userPlan="PRO", feature="best_time", and children present
- **THEN** display children content without lock overlay

#### Scenario: FREE user views premium section
- **WHEN** LockedSection renders with userPlan="FREE", feature="best_time"
- **THEN** display lock overlay with lock icon, "Upgrade to Pro to unlock" text, and "Upgrade Now" button

#### Scenario: Unauthenticated user views premium section
- **WHEN** LockedSection renders without userPlan prop
- **THEN** display lock overlay identical to FREE user behavior
