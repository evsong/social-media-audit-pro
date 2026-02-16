## 1. Plan Gating Infrastructure

- [x] 1.1 Create `src/lib/plan-gate.ts` with canAccessFeature(), isPremium(), getMonthlyAuditLimit() (REQ: Feature Access Control by Plan)
- [x] 1.2 Update `src/lib/rate-limit.ts` — checkUserLimit() accepts Plan param, uses getMonthlyAuditLimit() for FREE=5/PRO=50/AGENCY=unlimited (REQ: Plan-Based Monthly Audit Limits)
- [x] 1.3 Update `src/components/audit/LockedSection.tsx` — accept userPlan + feature props, conditionally render children or lock overlay (REQ: LockedSection Plan-Aware Rendering)

## 2. AI Deep Suggestions

- [x] 2.1 Wire generateAISuggestions() into POST /api/audit — call when isPremium(userPlan), include as `aiSuggestions` in response (REQ: PRO+ AI Suggestion Generation)
- [x] 2.2 Create `src/components/audit/AISuggestionList.tsx` — "AI-Powered Suggestions" title, gradient AI badge, ✦ prefix per item (REQ: AI Suggestion UI Component)
- [x] 2.3 Integrate AISuggestionList into report page, show LockedSection for FREE users (REQ: AI Suggestion UI Component)

## 3. Best Time to Post

- [x] 3.1 Create `src/lib/analysis/best-time.ts` — analyzeBestTimes() returns 7×24 grid + top 3 slots (REQ: Post Timing Analysis)
- [x] 3.2 Create `src/components/audit/BestTimeGrid.tsx` — heatmap with teal color scale, top slot pills, axis labels, color legend (REQ: Best Time Heatmap UI)
- [x] 3.3 Wire analyzeBestTimes() into audit API for PRO+ users (REQ: Post Timing Analysis)
- [x] 3.4 Integrate BestTimeGrid into report page via LockedSection (REQ: Best Time Heatmap UI)

## 4. Growth Trend

- [x] 4.1 Create `src/lib/analysis/growth-trend.ts` — analyzeGrowthTrend() compares older vs newer post engagement (REQ: Engagement Trajectory Estimation)
- [x] 4.2 Create `src/components/audit/GrowthTrend.tsx` — direction arrow, monthly rate, confidence badge, sparkline SVG (REQ: Growth Trend UI)
- [x] 4.3 Wire analyzeGrowthTrend() into audit API for PRO+ users (REQ: Engagement Trajectory Estimation)
- [x] 4.4 Integrate GrowthTrend into report page via LockedSection (REQ: Growth Trend UI)

## 5. PDF Export

- [x] 5.1 Install jspdf + jspdf-autotable dependencies
- [x] 5.2 Create `src/app/api/audit/[id]/pdf/route.ts` — fetch AuditReport, generate PDF with header/score/grades table/suggestions (REQ: PDF Report Generation)
- [x] 5.3 Create `src/components/audit/DownloadButton.tsx` — teal link for PRO+, disabled gray for FREE (REQ: Download Button UI)
- [x] 5.4 Integrate DownloadButton into report page nav bar (REQ: Download Button UI)

## 6. Competitor Compare

- [x] 6.1 Create `src/app/api/compare/route.ts` — accept platform + 2-3 usernames, auth + plan check, parallel audit pipeline (REQ: Competitor Compare API)
- [x] 6.2 Create `src/components/audit/CompareTable.tsx` — side-by-side table with health score + 6 dimension grades (REQ: Compare Table UI)
- [x] 6.3 Create `src/app/compare/[platform]/page.tsx` — input form, Compare button, results area (REQ: Compare Page)
- [x] 6.4 Add "Compare with competitors" link on report page via LockedSection (REQ: Compare Page)

## 7. Fake Follower Detection

- [x] 7.1 Create `src/lib/analysis/fake-followers.ts` — analyzeFakeFollowers() with heuristic scoring (REQ: Fake Follower Heuristic Analysis)
- [x] 7.2 Create `src/components/audit/FakeFollowerCard.tsx` — circular SVG gauge, confidence indicator, risk factors list (REQ: Fake Follower Card UI)
- [x] 7.3 Wire analyzeFakeFollowers() into audit API for PRO+ users (REQ: Fake Follower Heuristic Analysis)
- [x] 7.4 Integrate FakeFollowerCard into report page via LockedSection (REQ: Fake Follower Card UI)

## 8. Report Page Integration

- [x] 8.1 Update `src/app/api/audit/route.ts` — fetch user plan, run premium analyses in parallel, include userPlan + premium fields in response
- [x] 8.2 Update `src/app/audit/[platform]/[username]/page.tsx` — import all new components, pass userPlan to all LockedSections, render premium sections

## 9. Verification

- [ ] 9.1 Set test user plan to PRO in DB, run audit — verify AI suggestions, best time, growth trend, fake follower data all appear unlocked
- [ ] 9.2 Run audit as FREE user — verify all premium sections show lock overlay with upgrade CTA
- [ ] 9.3 Test PDF download endpoint returns valid PDF with correct content
- [ ] 9.4 Test competitor compare with 2 usernames on same platform
- [ ] 9.5 Deploy to Vercel and verify end-to-end
