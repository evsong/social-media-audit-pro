## 1. Project Setup & Dependencies

- [x] 1.1 Install core dependencies: prisma, @prisma/client, next-auth, nodemailer
- [x] 1.2 Install API client dependencies for RapidAPI and X API
- [x] 1.3 Create .env.example with all required environment variables
- [x] 1.4 Initialize Prisma with PostgreSQL provider

## 2. Database Schema & Auth

- [x] 2.1 Create Prisma schema with User and AuditReport models (REQ-US-001)
- [x] 2.2 Run initial migration
- [x] 2.3 Configure NextAuth with email magic link provider (REQ-US-002)
- [x] 2.4 Create /api/auth/[...nextauth]/route.ts handler
- [x] 2.5 Create /api/audits/route.ts for audit history (REQ-US-003)

## 3. Provider Types & Factory

- [x] 3.1 Define ProfileData and PostData interfaces in lib/providers/types.ts (REQ-DP-007)
- [x] 3.2 Create provider factory getProvider(platform) in lib/providers/factory.ts

## 4. Data Providers

- [x] 4.1 Implement Instagram provider: fetchProfile via RapidAPI Glavier (REQ-DP-001)
- [x] 4.2 Implement Instagram provider: fetchPosts via RapidAPI Glavier (REQ-DP-002)
- [x] 4.3 Implement TikTok provider: fetchProfile via RapidAPI Lundehund (REQ-DP-003)
- [x] 4.4 Implement TikTok provider: fetchPosts via RapidAPI Lundehund (REQ-DP-004)
- [x] 4.5 Implement X provider: fetchProfile via v2 API (REQ-DP-005)
- [x] 4.6 Implement X provider: fetchPosts via v2 API (REQ-DP-006)

## 5. Scoring Engine

- [x] 5.1 Define scoring types in lib/scoring/types.ts (ScoreResult, GradeBreakdown)
- [x] 5.2 Create platform-specific weight configs in lib/scoring/weights.ts (REQ-SE-001)
- [x] 5.3 Implement grade mapper in lib/scoring/grades.ts (REQ-SE-008)
- [x] 5.4 Implement engagement rate dimension scorer (REQ-SE-002)
- [x] 5.5 Implement posting frequency dimension scorer (REQ-SE-003)
- [x] 5.6 Implement content diversity dimension scorer (REQ-SE-004)
- [x] 5.7 Implement bio completeness dimension scorer (REQ-SE-005)
- [x] 5.8 Implement follower quality dimension scorer (REQ-SE-006)
- [x] 5.9 Implement hashtag usage dimension scorer (REQ-SE-007)
- [x] 5.10 Create main scoring calculator orchestrator (REQ-SE-001)

## 6. Suggestions Engine

- [x] 6.1 Implement template suggestion mapper in lib/suggestions/templates.ts (REQ-AI-001)
- [x] 6.2 Implement GPT-4o-mini AI suggestion generator in lib/suggestions/ai.ts (REQ-AI-002)

## 7. Rate Limiting & Caching

- [x] 7.1 Implement in-memory cache with 24h TTL in lib/cache.ts (REQ-RL-004)
- [x] 7.2 Implement rate limiter (IP global 3/min + anonymous 1/day + user 5/month) in lib/rate-limit.ts (REQ-RL-001, REQ-RL-002, REQ-RL-003)

## 8. Audit API Route

- [x] 8.1 Rewrite POST /api/audit/route.ts: integrate rate limiter, cache, providers, scoring, suggestions, and DB persistence
- [x] 8.2 Return AuditResponse shape matching design spec

## 9. Frontend Components

- [x] 9.1 Create PlatformTabs component with Instagram/TikTok/X selection (REQ-FE-001)
- [x] 9.2 Update AuditForm to include platform tabs and POST to /api/audit
- [x] 9.3 Create ProgressSteps 4-step loading animation component (REQ-FE-002)
- [x] 9.4 Create audit loading page at /audit/loading/page.tsx
- [x] 9.5 Create HealthScore gauge component with color coding (REQ-FE-003)
- [x] 9.6 Create GradeCard and GradeBreakdown components for 6 dimensions
- [x] 9.7 Create AccountCard component for profile info display
- [x] 9.8 Create SuggestionList component for template suggestions
- [x] 9.9 Create LockedSection component with blur overlay and upgrade CTA (REQ-FE-004)
- [x] 9.10 Create RemainingAudits counter component (REQ-FE-005)

## 10. Page Integration

- [x] 10.1 Update landing page with PlatformTabs and real AuditForm
- [x] 10.2 Update /audit/[platform]/[username]/page.tsx to fetch and display real audit data
- [x] 10.3 Wire up loading page with progress animation and redirect on completion

## 11. Testing & Validation

- [ ] 11.1 Test scoring engine with sample data for each platform
- [ ] 11.2 Test provider error handling (invalid username, API failures)
- [ ] 11.3 Test rate limiting and caching behavior
- [ ] 11.4 End-to-end test: submit audit → loading → report page
