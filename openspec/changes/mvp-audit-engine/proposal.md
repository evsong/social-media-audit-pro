# MVP Audit Engine — Proposal

## Summary

Replace mock data with real social media data from Instagram, TikTok, and X/Twitter. Implement weighted scoring engine with platform-specific weights, user system with PostgreSQL, caching/rate-limiting, and template-based suggestions for free tier.

## Problem

Current app returns hardcoded mock data. Users cannot audit real accounts. No user system, no persistence, no rate limiting.

## Solution

### Data Acquisition (Hybrid Model)

**Free tier — public data via third-party services:**
- Instagram: RapidAPI Glavier (instagram191) — $20/mo, 15K requests
- TikTok: RapidAPI Lundehund (tiktok-api23) — $10/mo, 200K requests
- X/Twitter: Official v2 API — free tier, public_metrics

**Paid tier — deep data via OAuth (future):**
- Instagram Graph API: reach, saves, shares
- X: impressions, detailed analytics

### Scoring Engine

Weighted scoring (0-100) with platform-differentiated weights:

**Instagram weights:**
| Dimension | Weight | A threshold |
|-----------|--------|-------------|
| Engagement Rate | 25% | >3% |
| Posting Frequency | 15% | >12 posts/30d |
| Content Diversity | 20% | 3+ content types |
| Bio Completeness | 10% | All fields filled |
| Follower Quality | 20% | Healthy ratio |
| Hashtag Usage | 10% | 5-15 relevant |

**TikTok weights:**
| Dimension | Weight | A threshold |
|-----------|--------|-------------|
| Engagement Rate | 30% | >8% |
| Posting Frequency | 25% | >12 posts/30d |
| Content Diversity | 10% | N/A (video only) |
| Bio Completeness | 10% | All fields filled |
| Follower Quality | 15% | Healthy ratio |
| Hashtag Usage | 10% | 5-15 relevant |

**X/Twitter weights:**
| Dimension | Weight | A threshold |
|-----------|--------|-------------|
| Engagement Rate | 30% | >1.5% |
| Posting Frequency | 25% | >12 posts/30d |
| Content Diversity | 10% | Text/image/video/thread |
| Bio Completeness | 15% | Bio + pinned tweet |
| Follower Quality | 15% | Healthy ratio |
| Hashtag Usage | 5% | Minimal impact |

Grade mapping: A=90+, A-=85, B+=80, B=70, B-=65, C=60, D=<60

### Database & User System

- PostgreSQL + Prisma ORM (Vercel Postgres or Supabase free tier)
- NextAuth.js with email magic link authentication
- Models: User, AuditReport

### Caching & Rate Limiting

- Anonymous: 1 audit/day per IP
- Registered free: 5 audits/month
- Same account within 24h: serve from cache, no count
- Global rate limit: 3 requests/minute per IP

### Frontend Interaction

- Manual platform selection (3 tabs: Instagram / TikTok / X)
- 4-step progress animation during audit
- Free tier: template suggestions from rules engine
- Locked sections with blur overlay for paid features
- CTA to upgrade

### AI Suggestions (Tiered)

- Free: Rule-based template suggestions per scoring dimension
- Paid: GPT-4o-mini personalized deep suggestions (~$0.01-0.03/audit)

## Monthly Operating Cost

| Item | Cost |
|------|------|
| Instagram API (Glavier) | $20 |
| TikTok API (Lundehund) | $10 |
| X API | $0 |
| Database (Vercel/Supabase free) | $0 |
| AI (paid users only) | Variable |
| **Total** | **~$30/mo** |

## Out of Scope (Future)

- OAuth deep analytics (Instagram Graph API, TikTok Research API)
- Competitor comparison
- PDF report export
- Stripe payment integration
- Scheduled monitoring
- Fake follower detection algorithm
