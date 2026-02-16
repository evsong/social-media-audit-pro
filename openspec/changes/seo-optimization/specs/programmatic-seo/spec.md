# Programmatic SEO

## ADDED Requirements

### Requirement: REQ-PSEO-001 Public Report Indexing

The system SHALL allow audit report pages at /audit/[platform]/[username] to be indexed by search engines. Pages SHALL NOT include noindex meta tags. Each report page SHALL have a unique, keyword-rich title and meta description generated from the audit data.

#### Scenario: Report page SEO title
- **WHEN** /audit/instagram/nike is rendered with healthScore 85
- **THEN** meta title SHALL be "nike Instagram Audit Report — Score 85/100 | AuditPro" and meta description SHALL summarize the health score and top grades

#### Scenario: Report page is crawlable
- **WHEN** Googlebot requests /audit/instagram/nike
- **THEN** page SHALL return 200 with full HTML content and no noindex directive

### Requirement: REQ-PSEO-002 Dynamic Sitemap for Reports

The system SHALL include all audit report pages in the sitemap. The sitemap generation SHALL query the AuditReport table for unique platform+username combinations and generate URLs for each.

#### Scenario: Sitemap contains report URLs
- **WHEN** database contains reports for instagram/nike, tiktok/adidas, x/elonmusk
- **THEN** sitemap.xml SHALL include /audit/instagram/nike, /audit/tiktok/adidas, and /audit/x/elonmusk

#### Scenario: Deduplicate report URLs
- **WHEN** database contains 5 reports for instagram/nike (different dates)
- **THEN** sitemap SHALL include only one URL for /audit/instagram/nike with lastmod set to the most recent report date

### Requirement: REQ-PSEO-003 Report Page Internal Linking

Each audit report page SHALL include internal links to: the platform-specific landing page, related blog posts (if any match the platform), and a CTA to audit another account. This SHALL improve crawl depth and page authority distribution.

#### Scenario: Internal links on report page
- **WHEN** /audit/instagram/nike is rendered
- **THEN** page SHALL contain a link to /instagram-audit and a "Try another audit" link to homepage
