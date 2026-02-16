# Static Pages

## ADDED Requirements

### Requirement: REQ-SP-001 Privacy Policy Page

The system SHALL serve a privacy policy page at /privacy. The page SHALL describe data collection practices, cookie usage, third-party API data handling, and user rights. The page SHALL include proper SEO metadata.

#### Scenario: Privacy page renders
- **WHEN** /privacy is requested
- **THEN** render privacy policy content with meta title "Privacy Policy | AuditPro"

### Requirement: REQ-SP-002 Terms of Service Page

The system SHALL serve a terms of service page at /terms. The page SHALL cover acceptable use, service limitations, disclaimer of warranties, and limitation of liability.

#### Scenario: Terms page renders
- **WHEN** /terms is requested
- **THEN** render terms of service content with meta title "Terms of Service | AuditPro"

### Requirement: REQ-SP-003 About Page

The system SHALL serve an about page at /about. The page SHALL describe the product mission, how the audit tool works, and include a CTA to try the free audit. The page SHALL include Organization JSON-LD schema.

#### Scenario: About page renders
- **WHEN** /about is requested
- **THEN** render about content with meta title "About AuditPro — Free Social Media Audit Tool" and Organization JSON-LD

### Requirement: REQ-SP-004 Footer Link Integration

The site footer SHALL link to /privacy, /terms, /about, and /blog. All links SHALL be functional and point to the correct pages.

#### Scenario: Footer links work
- **WHEN** any page is rendered
- **THEN** footer SHALL contain working links to /privacy, /terms, /about, and /blog
