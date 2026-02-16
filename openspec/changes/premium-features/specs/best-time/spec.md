## ADDED Requirements

### Requirement: Post Timing Analysis
The system SHALL analyze post timestamps grouped by day-of-week (0=Sun..6=Sat) and hour (0-23), weighted by engagement score (likes + comments×2 + shares×3), and return a normalized 7×24 grid plus the top 3 time slots.

#### Scenario: Sufficient post data across multiple time slots
- **WHEN** analyzeBestTimes() is called with 12 posts distributed across different days and hours
- **THEN** return a 7×24 grid with values normalized to 0-1 and up to 3 topSlots sorted by descending score, each with day, hour, label (e.g. "Wed 14:00"), and score

#### Scenario: All posts at same time slot
- **WHEN** analyzeBestTimes() is called with posts all published on Wednesday at 14:00
- **THEN** grid[3][14] = 1.0, all other cells = 0, topSlots contains exactly 1 entry

#### Scenario: No valid timestamps
- **WHEN** analyzeBestTimes() is called with posts whose timestamps are all invalid
- **THEN** return an all-zero grid and empty topSlots array

### Requirement: Best Time Heatmap UI
The system SHALL render a BestTimeGrid component showing a 7-day × 24-hour heatmap color-coded by engagement density, with top slot pills, axis labels, and a color legend.

**Color scale:**
- 0: bg-white/5 (no data)
- 0–0.25: bg-teal-900/40
- 0.25–0.5: bg-teal-700/50
- 0.5–0.75: bg-teal-500/60
- 0.75–1.0: bg-teal-400/70

#### Scenario: Render heatmap with recommendations
- **WHEN** BestTimeGrid renders with grid data and 3 topSlots
- **THEN** display 3 recommendation pills at top, a 7-row × 24-column grid with teal color coding, row labels (Sun–Sat), column labels every 3 hours, and a Low→High color legend

#### Scenario: Hover tooltip
- **WHEN** user hovers over a grid cell
- **THEN** display a tooltip showing day name, hour, and engagement percentage
