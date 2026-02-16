## Why

The site currently has only basic meta tags — no sitemap, no structured data, no programmatic SEO pages, no blog. With "social media audit tool" at 210K monthly searches and KD 21%, there's a massive organic traffic opportunity. Competitors (HypeAuditor, Iconosquare) rank well but leave long-tail keywords underserved. A comprehensive SEO strategy combining technical foundations, tool landing pages, programmatic report indexing, and AI-generated blog content can capture significant organic traffic at near-zero marginal cost.

## What Changes

- Add technical SEO infrastructure: sitemap.xml (dynamic), robots.txt, JSON-LD structured data, Open Graph/Twitter Cards, canonical URLs
- Create 3 platform-specific landing pages (/instagram-audit, /tiktok-audit, /twitter-audit) targeting high-volume platform keywords
- Make audit report pages (/audit/[platform]/[username]) publicly indexable with SEO-optimized titles and meta descriptions
- Build a blog system (/blog/[slug]) using MDX files for AI batch-generated content at 5-10 articles per week
- Cover 4 content pillars: platform tutorials, audit checklists, industry trends, brand/KOL case studies
- Add static pages: /privacy, /terms, /about to complete footer links and build site trust
- Create reusable SEO component for consistent meta tag management across all pages
- English only for MVP

## Capabilities

### New Capabilities
- `technical-seo`: Sitemap generation, robots.txt, JSON-LD structured data, Open Graph/Twitter Cards, canonical URLs, SEO head component
- `landing-pages`: Platform-specific landing pages (/instagram-audit, /tiktok-audit, /twitter-audit) with unique H1, meta, content, and audit entry points
- `programmatic-seo`: Public indexing of audit report pages with dynamic SEO metadata, automatic sitemap inclusion, long-tail keyword targeting
- `blog-system`: MDX-based blog with frontmatter SEO fields, category pages, AI batch generation pipeline, 4 content pillars
- `static-pages`: Privacy policy, terms of service, about page — footer link targets

### Modified Capabilities

_(none — SEO is additive, no existing spec requirements change)_

## Impact

- **Pages**: New routes /instagram-audit, /tiktok-audit, /twitter-audit, /blog/[slug], /privacy, /terms, /about
- **Existing pages**: layout.tsx (global SEO component), audit report pages (add dynamic meta + allow indexing)
- **Dependencies**: next-mdx-remote or @next/mdx for blog, gray-matter for frontmatter parsing
- **Build**: Sitemap generation at build time + ISR for dynamic report pages
- **Infrastructure**: MDX files in /content/blog/, AI generation script for batch content production
- **Database**: Query AuditReport table for dynamic sitemap (report pages)
