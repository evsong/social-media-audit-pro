# Blog System

## ADDED Requirements

### Requirement: REQ-BLOG-001 MDX Blog Infrastructure

The system SHALL serve blog posts from MDX files stored in /content/blog/. Each MDX file SHALL have frontmatter fields: title, description, slug, date, category, keywords, ogImage (optional), and published (boolean). The blog index page at /blog SHALL list all published posts sorted by date descending.

#### Scenario: Blog index page
- **WHEN** /blog is requested
- **THEN** render a paginated list of all published blog posts with title, date, category, and excerpt

#### Scenario: Individual blog post
- **WHEN** /blog/how-to-increase-instagram-engagement is requested
- **THEN** render the MDX content with SEO metadata from frontmatter, Article JSON-LD, and OG tags

#### Scenario: Unpublished post not visible
- **WHEN** a blog post has published: false in frontmatter
- **THEN** it SHALL NOT appear in the blog index, sitemap, or be accessible via URL

### Requirement: REQ-BLOG-002 Blog Category Pages

The system SHALL support 4 content categories: tutorials, checklists, trends, case-studies. Each category SHALL have a dedicated page at /blog/category/[category] listing posts in that category.

#### Scenario: Category page renders
- **WHEN** /blog/category/tutorials is requested
- **THEN** render all published posts with category "tutorials", with meta title "Social Media Tutorials | AuditPro Blog"

### Requirement: REQ-BLOG-003 Blog SEO Optimization

Each blog post page SHALL include: meta title from frontmatter title + " | AuditPro Blog", meta description from frontmatter description, canonical URL, Article JSON-LD schema, Open Graph tags, and internal links to related posts and relevant platform landing pages.

#### Scenario: Blog post meta tags
- **WHEN** blog post with title "Instagram Audit Checklist 2026" is rendered
- **THEN** meta title SHALL be "Instagram Audit Checklist 2026 | AuditPro Blog" and include Article JSON-LD with datePublished

### Requirement: REQ-BLOG-004 AI Content Generation Pipeline

The system SHALL include a CLI script at /scripts/generate-blog.ts that accepts a topic, category, and target keywords, calls an AI API to generate an MDX blog post with proper frontmatter, and saves it to /content/blog/[slug].mdx. The script SHALL support batch mode to generate multiple posts from a CSV/JSON topic list.

#### Scenario: Generate single blog post
- **WHEN** script is run with topic "How to Increase Instagram Engagement" and category "tutorials"
- **THEN** create /content/blog/how-to-increase-instagram-engagement.mdx with valid frontmatter and 1000-2000 word content

#### Scenario: Batch generation
- **WHEN** script is run with --batch topics.json containing 10 topics
- **THEN** generate 10 MDX files in /content/blog/ with unique slugs and proper frontmatter

### Requirement: REQ-BLOG-005 Blog Sitemap Integration

All published blog posts SHALL be included in the sitemap.xml with their lastmod date matching the frontmatter date field.

#### Scenario: Blog posts in sitemap
- **WHEN** 50 published blog posts exist in /content/blog/
- **THEN** sitemap.xml SHALL contain 50 /blog/[slug] URLs with correct lastmod dates
