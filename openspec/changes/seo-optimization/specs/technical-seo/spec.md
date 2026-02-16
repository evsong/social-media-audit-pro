# Technical SEO

## ADDED Requirements

### Requirement: REQ-TSEO-001 Dynamic Sitemap Generation

The system SHALL generate a sitemap.xml at /sitemap.xml that includes all public pages: homepage, platform landing pages, blog posts, static pages, and publicly indexed audit report pages. The sitemap SHALL be dynamically generated using Next.js App Router sitemap.ts convention.

#### Scenario: Sitemap includes all page types
- **WHEN** /sitemap.xml is requested
- **THEN** return valid XML sitemap containing homepage, 3 landing pages, all published blog slugs, static pages (/privacy, /terms, /about), and all audit report URLs from the database

#### Scenario: Sitemap updates with new audit reports
- **WHEN** a new audit report is created for instagram/nike
- **THEN** /sitemap.xml SHALL include /audit/instagram/nike on next generation

### Requirement: REQ-TSEO-002 Robots.txt

The system SHALL serve a robots.txt at /robots.txt that allows all crawlers, references the sitemap URL, and disallows /api/ routes.

#### Scenario: Robots.txt content
- **WHEN** /robots.txt is requested
- **THEN** return text containing "User-agent: *", "Allow: /", "Disallow: /api/", and "Sitemap: https://{domain}/sitemap.xml"

### Requirement: REQ-TSEO-003 JSON-LD Structured Data

The system SHALL include JSON-LD structured data on key pages. Homepage SHALL have Organization + SoftwareApplication schema. Audit report pages SHALL have WebPage schema with name and description. Blog posts SHALL have Article schema with headline, datePublished, and author.

#### Scenario: Homepage structured data
- **WHEN** homepage is rendered
- **THEN** include JSON-LD script tag with @type "SoftwareApplication" containing name "AuditPro", applicationCategory "BusinessApplication", and offers

#### Scenario: Blog post structured data
- **WHEN** blog post page is rendered
- **THEN** include JSON-LD script tag with @type "Article" containing headline, datePublished, author, and description

### Requirement: REQ-TSEO-004 Open Graph and Twitter Cards

The system SHALL include Open Graph and Twitter Card meta tags on every page. Each page SHALL have og:title, og:description, og:image, og:url, twitter:card, twitter:title, and twitter:description.

#### Scenario: Audit report OG tags
- **WHEN** /audit/instagram/nike is rendered
- **THEN** include og:title "nike Instagram Audit — Health Score & Analysis | AuditPro" and og:description with the health score summary

#### Scenario: Blog post OG tags
- **WHEN** a blog post is rendered
- **THEN** include og:title matching the post title and og:image from the post frontmatter or a default OG image

### Requirement: REQ-TSEO-005 Canonical URLs

The system SHALL include a canonical link tag on every page pointing to the preferred URL. This SHALL prevent duplicate content issues.

#### Scenario: Canonical on audit report
- **WHEN** /audit/instagram/nike is rendered
- **THEN** include link rel="canonical" href="https://{domain}/audit/instagram/nike"

### Requirement: REQ-TSEO-006 Reusable SEO Head Component

The system SHALL provide a reusable SEO metadata generation utility that accepts title, description, keywords, ogImage, and canonical as parameters and returns a Next.js Metadata object. All pages SHALL use this utility for consistent meta tag output.

#### Scenario: Generate metadata for landing page
- **WHEN** generateSEO({ title: "Instagram Audit Tool", description: "..." }) is called
- **THEN** return Metadata object with title, description, openGraph, twitter, and alternates.canonical fields populated
