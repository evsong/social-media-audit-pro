# MVP Audit Engine — Design

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
├──────────────┬──────────────┬───────────────────┤
│  Pages/UI    │  API Routes  │  Auth (NextAuth)  │
│  - Home      │  - /api/audit│  - Email Magic    │
│  - Report    │  - /api/audits│   Link           │
│  - Loading   │              │                   │
├──────────────┴──────────────┴───────────────────┤
│              Middleware Layer                     │
│  - Rate Limiter (IP + User)                     │
│  - Cache Check (24h TTL)                        │
├─────────────────────────────────────────────────┤
│              Core Engine                         │
│  ┌───────────────┐  ┌────────────────────┐      │
│  │  Providers     │  │  Scoring Engine    │      │
│  │  - Instagram   │  │  - Weights Config  │      │
│  │  - TikTok      │  │  - 6 Dimensions   │      │
│  │  - X/Twitter   │  │  - Grade Mapper   │      │
│  └───────┬───────┘  └────────┬───────────┘      │
│          │                    │                   │
│  ┌───────▼───────┐  ┌───────▼───────────┐      │
│  │  Suggestions   │  │  Report Builder   │      │
│  │  - Templates   │  │  - Aggregate      │      │
│  │  - AI (paid)   │  │  - Format         │      │
│  └───────────────┘  └───────────────────┘      │
├─────────────────────────────────────────────────┤
│              Data Layer                          │
│  PostgreSQL (Prisma) + Cache (in-memory/KV)     │
└─────────────────────────────────────────────────┘
         │              │              │
    RapidAPI        RapidAPI      X API v2
   (Instagram)     (TikTok)      (Official)
```

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (updated: platform tabs)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Styles
│   ├── api/
│   │   ├── audit/route.ts          # POST: run audit
│   │   ├── audits/route.ts         # GET: audit history (auth required)
│   │   └── auth/[...nextauth]/route.ts  # NextAuth handlers
│   └── audit/
│       ├── loading/page.tsx         # Progress animation page
│       └── [platform]/[username]/page.tsx  # Report page
├── lib/
│   ├── providers/
│   │   ├── types.ts                # ProfileData, PostData interfaces
│   │   ├── factory.ts              # getProvider(platform)
│   │   ├── instagram.ts            # RapidAPI Glavier client
│   │   ├── tiktok.ts               # RapidAPI Lundehund client
│   │   └── x.ts                    # X API v2 client
│   ├── scoring/
│   │   ├── types.ts                # ScoreResult, GradeBreakdown
│   │   ├── weights.ts              # Platform-specific weight configs
│   │   ├── calculator.ts           # Main scoring orchestrator
│   │   ├── dimensions/
│   │   │   ├── engagement.ts       # Engagement rate scorer
│   │   │   ├── frequency.ts        # Posting frequency scorer
│   │   │   ├── content-mix.ts      # Content diversity scorer
│   │   │   ├── bio.ts              # Bio completeness scorer
│   │   │   ├── followers.ts        # Follower quality scorer
│   │   │   └── hashtags.ts         # Hashtag usage scorer
│   │   └── grades.ts               # Score-to-grade mapper
│   ├── suggestions/
│   │   ├── templates.ts            # Rule-based suggestion templates
│   │   └── ai.ts                   # GPT-4o-mini integration (paid)
│   ├── cache.ts                    # 24h audit result cache
│   ├── rate-limit.ts               # IP + user rate limiting
│   └── auth.ts                     # NextAuth config
├── components/
│   ├── landing/
│   │   ├── PlatformTabs.tsx        # Instagram/TikTok/X tab selector
│   │   └── AuditForm.tsx           # Username input + submit
│   ├── audit/
│   │   ├── ProgressSteps.tsx       # 4-step loading animation
│   │   ├── HealthScore.tsx         # Score ring/gauge (0-100)
│   │   ├── GradeCard.tsx           # Individual dimension grade
│   │   ├── GradeBreakdown.tsx      # All 6 grades grid
│   │   ├── SuggestionList.tsx      # Template suggestions
│   │   ├── LockedSection.tsx       # Blur overlay + upgrade CTA
│   │   └── AccountCard.tsx         # Profile info card
│   └── ui/
│       └── RemainingAudits.tsx     # Audit count indicator
└── prisma/
    └── schema.prisma               # User + AuditReport models
```

## Data Flow

### Audit Request Flow

```
1. User selects platform tab + enters username
2. POST /api/audit { platform, username }
3. Middleware checks:
   a. Rate limit (3/min per IP) → 429 if exceeded
   b. Cache lookup (platform+username, 24h TTL) → return cached if hit
   c. User limit check (1/day anonymous, 5/month registered) → 429 if exceeded
4. Provider fetches data:
   a. fetchProfile(platform, username) → ProfileData
   b. fetchPosts(platform, username, 12) → PostData[]
5. Scoring engine calculates:
   a. 6 dimension scores (0-100 each)
   b. Weighted total → healthScore (0-100)
   c. Grade mapping → letter grades
6. Suggestions generated:
   a. Template suggestions for grades B or below
7. Result stored:
   a. AuditReport saved to PostgreSQL
   b. Result cached (24h TTL)
8. Response returned to client
```

### Response Shape

```typescript
interface AuditResponse {
  platform: "instagram" | "tiktok" | "x";
  profile: ProfileData;
  healthScore: number;          // 0-100
  healthGrade: string;          // "A", "B+", etc.
  grades: {
    engagement: { score: number; grade: string; rate: number };
    frequency: { score: number; grade: string; postsPerMonth: number };
    contentMix: { score: number; grade: string; types: Record<string, number> };
    bio: { score: number; grade: string; checks: Record<string, boolean> };
    followerQuality: { score: number; grade: string; ratio: number };
    hashtags: { score: number; grade: string; avgPerPost: number };
  };
  suggestions: string[];        // Template suggestions (free)
  cached: boolean;              // Whether result was from cache
  auditId: string;              // For history reference
}
```

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  plan      Plan     @default(FREE)
  audits    AuditReport[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Plan {
  FREE
  PRO
  AGENCY
}

model AuditReport {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  platform    String
  username    String
  healthScore Int
  grades      Json
  suggestions Json
  rawData     Json
  createdAt   DateTime @default(now())

  @@index([platform, username])
  @@index([userId])
  @@index([createdAt])
}
```

## Environment Variables

```
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...
EMAIL_SERVER=smtp://...
EMAIL_FROM=noreply@auditpro.com

# RapidAPI
RAPIDAPI_KEY=...

# X/Twitter API
X_BEARER_TOKEN=...

# OpenAI (paid tier only)
OPENAI_API_KEY=...
```

## Key Decisions

1. **Cache strategy:** In-memory Map for MVP (simple, no extra infra). Upgrade to Vercel KV/Redis when needed.
2. **Rate limiting:** In-memory counter per IP. Store user audit counts in PostgreSQL.
3. **No SSE/streaming for progress:** Frontend uses polling or simulated progress animation (steps timed at 1s intervals) while awaiting single API response.
4. **Prisma with Vercel Postgres:** Free tier supports 256MB storage, sufficient for MVP.
5. **NextAuth email provider:** Requires SMTP. Use Resend free tier (100 emails/day) for magic links.
