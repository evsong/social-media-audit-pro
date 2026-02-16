# Landing Pages

## ADDED Requirements

### Requirement: REQ-LP-001 Instagram Audit Landing Page

The system SHALL serve a dedicated landing page at /instagram-audit targeting the keyword "instagram audit tool". The page SHALL include a unique H1 ("Free Instagram Audit Tool"), Instagram-specific feature descriptions, platform-specific audit form pre-selecting Instagram, and Instagram engagement benchmarks.

#### Scenario: Instagram landing page renders
- **WHEN** /instagram-audit is requested
- **THEN** render page with H1 "Free Instagram Audit Tool", meta title containing "Instagram Audit", and audit form with Instagram pre-selected

#### Scenario: Submit audit from landing page
- **WHEN** user enters username "nike" and submits on /instagram-audit
- **THEN** POST /api/audit with { platform: "instagram", username: "nike" }

### Requirement: REQ-LP-002 TikTok Audit Landing Page

The system SHALL serve a dedicated landing page at /tiktok-audit targeting the keyword "tiktok audit tool". The page SHALL include a unique H1 ("Free TikTok Audit Tool"), TikTok-specific feature descriptions, and TikTok engagement benchmarks.

#### Scenario: TikTok landing page renders
- **WHEN** /tiktok-audit is requested
- **THEN** render page with H1 "Free TikTok Audit Tool", meta title containing "TikTok Audit", and audit form with TikTok pre-selected

### Requirement: REQ-LP-003 Twitter/X Audit Landing Page

The system SHALL serve a dedicated landing page at /twitter-audit targeting the keywords "twitter audit tool" and "x audit tool". The page SHALL include a unique H1 ("Free Twitter / X Audit Tool"), X-specific feature descriptions, and X engagement benchmarks.

#### Scenario: Twitter landing page renders
- **WHEN** /twitter-audit is requested
- **THEN** render page with H1 "Free Twitter / X Audit Tool", meta title containing "Twitter Audit", and audit form with X pre-selected

### Requirement: REQ-LP-004 Landing Page SEO Content Sections

Each platform landing page SHALL include: hero with H1 and audit form, "What You'll Get" feature grid, platform-specific scoring benchmarks table, FAQ section with 5+ questions using schema.org FAQPage markup, and a CTA section.

#### Scenario: FAQ structured data
- **WHEN** /instagram-audit is rendered
- **THEN** include JSON-LD FAQPage schema with at least 5 question/answer pairs about Instagram auditing
