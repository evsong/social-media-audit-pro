## ADDED Requirements

### Requirement: Engagement Trajectory Estimation
The system SHALL estimate growth trend by comparing average engagement (likes + comments×2 + shares×3) of the older half of posts vs the newer half, normalized to a monthly growth rate.

**Direction thresholds:** >3% monthly = "growing", <-3% = "declining", else "stable"
**Confidence levels:** ≥10 posts = "high", ≥6 = "medium", <6 = "low"

#### Scenario: Growing account
- **WHEN** analyzeGrowthTrend() is called with 12 posts where newer posts average 20% higher engagement than older posts
- **THEN** return direction="growing", monthlyGrowthRate > 0, confidence="high"

#### Scenario: Stable account
- **WHEN** analyzeGrowthTrend() is called with 8 posts where newer and older halves have similar engagement
- **THEN** return direction="stable", monthlyGrowthRate between -3 and 3, confidence="medium"

#### Scenario: Declining account
- **WHEN** analyzeGrowthTrend() is called with 10 posts where newer posts average 30% lower engagement
- **THEN** return direction="declining", monthlyGrowthRate < -3, confidence="high"

#### Scenario: Insufficient data
- **WHEN** analyzeGrowthTrend() is called with fewer than 4 posts
- **THEN** return direction="stable", monthlyGrowthRate=0, confidence="low"

### Requirement: Growth Trend UI
The system SHALL render a GrowthTrend component showing direction arrow, monthly rate, confidence badge, and a mini SVG sparkline of engagement values.

**Visual mapping:**
- Growing: green ↑ arrow
- Stable: yellow → arrow
- Declining: red ↓ arrow

#### Scenario: Display growing trend
- **WHEN** GrowthTrend renders with direction="growing", monthlyGrowthRate=5.2, confidence="high"
- **THEN** display green ↑, text "Growing", "+5.2% est. monthly", "high confidence" badge, and a teal sparkline SVG

#### Scenario: Display with low confidence
- **WHEN** GrowthTrend renders with confidence="low"
- **THEN** display "low confidence" badge in gray
