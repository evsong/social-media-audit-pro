## Context

AuditPro is a Next.js App Router application deployed on Vercel. The current site has basic meta tags but no SEO infrastructure. The `mvp-audit-engine` change (parallel) handles core audit functionality with PostgreSQL + Prisma. This SEO change builds on top of that foundation, adding discoverability layers without modifying core audit logic.

Current file structure relevant to SEO:
```
src/app/
├── layout.tsx          # Has basic Metadata export
├── page.tsx            # Landing page, no structured data
├── audit/
│   └── [platform]/[username]/page.tsx  # Report page, no SEO meta
```

## Goals / Non-Goals

**Goals:**
- Achieve indexing of all public pages within 2 weeks of launch
- Rank for "social media audit tool" (210K/mo, KD 21%) and platform-specific variants
- Build a long-tail traffic engine via programmatic report pages
- Establish content pipeline producing 5-10 SEO articles per week
- Pass Google Lighthouse SEO audit at 100/100

**Non-Goals:**
- Multi-language / i18n (English only for MVP)
- Link building or off-page SEO
- Paid search / SEM
- CMS admin interface for blog (use git-based workflow)
- Image SEO optimization (og:image generation service)

## Decisions

### 1. Blog storage: MDX files in /content/blog/

**Choice:** MDX files with frontmatter, processed by next-mdx-remote at request time.

**Alternatives considered:**
- Database (Prisma BlogPost model): Requires admin UI, adds complexity. Overkill for AI-generated content that goes through git anyway.
- Contentlayer: Good DX but project is unmaintained.

**Rationale:** MDX files are zero-cost, version-controlled, and pair naturally with an AI generation script that writes files and pushes via git. Vercel auto-deploys on push.

### 2. Sitemap: Dynamic generation via App Router sitemap.ts

**Choice:** Single `src/app/sitemap.ts` that queries DB for report pages and scans /content/blog/ for posts.

**Rationale:** Next.js App Router natively supports `sitemap.ts` returning `MetadataRoute.Sitemap`. No extra dependencies. Handles both static routes and dynamic DB-driven report URLs.

### 3. Landing pages: Static routes with shared layout

**Choice:** Three static pages at `/instagram-audit`, `/tiktok-audit`, `/twitter-audit` sharing a `PlatformLandingPage` component with platform-specific props (benchmarks, features, FAQ data).

**Rationale:** Keeps code DRY while allowing each page to have unique H1, meta, and content for SEO. Static generation means fast TTFB.

### 4. SEO utility: generateSEO() helper

**Choice:** A `lib/seo.ts` utility that returns Next.js `Metadata` objects. All pages call `generateSEO({ title, description, ... })` in their `generateMetadata()` export.

**Rationale:** Single source of truth for OG tags, Twitter cards, canonical URLs. Prevents inconsistency across 50+ pages.

### 5. AI blog generation: CLI script with OpenAI

**Choice:** `/scripts/generate-blog.ts` using GPT-4o-mini. Accepts single topic or batch JSON. Outputs MDX with frontmatter.

**Rationale:** GPT-4o-mini is cheap (~$0.01/article), fast, and produces decent SEO content. Script runs locally or in CI, pushes to git, Vercel deploys.

## File Structure

```
src/app/
├── sitemap.ts                    # Dynamic sitemap generator
├── robots.ts                     # Robots.txt generator
├── instagram-audit/page.tsx      # Instagram landing page
├── tiktok-audit/page.tsx         # TikTok landing page
├── twitter-audit/page.tsx        # Twitter/X landing page
├── blog/
│   ├── page.tsx                  # Blog index (paginated)
│   ├── [slug]/page.tsx           # Individual blog post
│   └── category/[category]/page.tsx  # Category listing
├── privacy/page.tsx              # Privacy policy
├── terms/page.tsx                # Terms of service
├── about/page.tsx                # About page
src/lib/
├── seo.ts                        # generateSEO() utility
├── blog.ts                       # MDX parsing, post listing helpers
content/blog/
├── *.mdx                         # Blog post files
scripts/
├── generate-blog.ts              # AI content generation CLI
├── topics.json                   # Batch topic list template
```

## Risks / Trade-offs

**[Risk] AI-generated content quality** → Mitigate with keyword-focused prompts, enforce minimum word count (1000+), and include internal links to tool pages in every post.

**[Risk] Sitemap grows very large with report pages** → Mitigate by using sitemap index with multiple sitemaps if URLs exceed 50,000. Next.js supports this natively.

**[Risk] MDX build time with 500+ posts** → next-mdx-remote processes at request time (not build time), so no build slowdown. Use ISR with revalidate for caching.

**[Risk] Google penalizing thin AI content** → Mitigate by ensuring each post targets a specific keyword, has 1000+ words, includes unique data/benchmarks from the audit tool, and links to relevant audit pages.

## Open Questions

- OG image generation: Should we auto-generate branded OG images per page (e.g., via @vercel/og)? Deferred to post-MVP.
- Blog RSS feed: Nice to have, not critical for SEO. Can add later.
