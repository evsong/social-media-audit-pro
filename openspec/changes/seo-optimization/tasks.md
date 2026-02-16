## 1. SEO Infrastructure

- [ ] 1.1 Create lib/seo.ts with generateSEO() utility returning Next.js Metadata objects (REQ-TSEO-006)
- [ ] 1.2 Create src/app/robots.ts with crawl rules and sitemap reference (REQ-TSEO-002)
- [ ] 1.3 Create src/app/sitemap.ts with static routes (homepage, landing pages, static pages) (REQ-TSEO-001)
- [ ] 1.4 Add JSON-LD helper functions for Organization, SoftwareApplication, Article, FAQPage schemas (REQ-TSEO-003)
- [ ] 1.5 Update layout.tsx to use generateSEO() and add global OG/Twitter Card defaults (REQ-TSEO-004)
- [ ] 1.6 Add canonical URL support to generateSEO() (REQ-TSEO-005)

## 2. Platform Landing Pages

- [ ] 2.1 Create shared PlatformLandingPage component with props for platform-specific content
- [ ] 2.2 Create /instagram-audit/page.tsx with Instagram-specific H1, meta, benchmarks, FAQ (REQ-LP-001)
- [ ] 2.3 Create /tiktok-audit/page.tsx with TikTok-specific content (REQ-LP-002)
- [ ] 2.4 Create /twitter-audit/page.tsx with X-specific content (REQ-LP-003)
- [ ] 2.5 Add FAQPage JSON-LD schema to each landing page (REQ-LP-004)

## 3. Programmatic SEO

- [ ] 3.1 Update /audit/[platform]/[username]/page.tsx generateMetadata() with dynamic SEO title and description (REQ-PSEO-001)
- [ ] 3.2 Remove any noindex directives from report pages (REQ-PSEO-001)
- [ ] 3.3 Extend sitemap.ts to query AuditReport table for unique platform+username URLs (REQ-PSEO-002)
- [ ] 3.4 Add internal links on report pages to platform landing page and homepage (REQ-PSEO-003)

## 4. Blog System

- [ ] 4.1 Install next-mdx-remote and gray-matter dependencies
- [ ] 4.2 Create lib/blog.ts with MDX parsing, post listing, and category filtering helpers (REQ-BLOG-001)
- [ ] 4.3 Create /blog/page.tsx blog index with paginated post listing (REQ-BLOG-001)
- [ ] 4.4 Create /blog/[slug]/page.tsx for individual posts with Article JSON-LD (REQ-BLOG-001, REQ-BLOG-003)
- [ ] 4.5 Create /blog/category/[category]/page.tsx for category listing (REQ-BLOG-002)
- [ ] 4.6 Add blog post URLs to sitemap.ts (REQ-BLOG-005)
- [ ] 4.7 Create scripts/generate-blog.ts AI content generation CLI with single and batch modes (REQ-BLOG-004)
- [ ] 4.8 Create scripts/topics.json template with initial 20 topic ideas across 4 categories

## 5. Static Pages

- [ ] 5.1 Create /privacy/page.tsx with privacy policy content (REQ-SP-001)
- [ ] 5.2 Create /terms/page.tsx with terms of service content (REQ-SP-002)
- [ ] 5.3 Create /about/page.tsx with product description and Organization JSON-LD (REQ-SP-003)
- [ ] 5.4 Update footer component with working links to /privacy, /terms, /about, /blog (REQ-SP-004)

## 6. Validation

- [ ] 6.1 Run Lighthouse SEO audit on homepage, landing pages, and a report page — target 100/100
- [ ] 6.2 Validate sitemap.xml output contains all expected URL types
- [ ] 6.3 Validate JSON-LD with Google Rich Results Test on homepage and a blog post
- [ ] 6.4 Generate 3 sample blog posts with the AI script and verify MDX rendering
