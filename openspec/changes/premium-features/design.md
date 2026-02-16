# Premium Features — Design

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App                             │
├──────────────────┬──────────────────┬───────────────────────┤
│  Pages/UI        │  API Routes      │  Auth (NextAuth)      │
│  - Report (更新) │  - /api/audit    │  - session.user.plan  │
│  - Compare (新)  │  - /api/compare  │                       │
│                  │  - /api/audit/   │                       │
│                  │    [id]/pdf      │                       │
├──────────────────┴──────────────────┴───────────────────────┤
│                    Plan Gating Layer (新)                     │
│  plan-gate.ts: canAccessFeature(plan, feature) → boolean     │
│  Features: ai_suggestions | best_time | growth_trend |       │
│            pdf_export | competitor_compare |                  │
│            fake_follower_detection                           │
├─────────────────────────────────────────────────────────────┤
│                    Core Engine (扩展)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Providers    │  │  Scoring     │  │  Analysis (新)   │  │
│  │  (不变)       │  │  (不变)      │  │  - best-time.ts  │  │
│  │              │  │              │  │  - growth-trend  │  │
│  │              │  │              │  │  - fake-followers│  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Suggestions  │  │  PDF Builder │  │  Compare Engine  │  │
│  │  - templates  │  │  (新)        │  │  (新)            │  │
│  │  - ai (接入)  │  │  jspdf       │  │  复用 provider + │  │
│  └──────────────┘  └──────────────┘  │  scoring 管道    │  │
│                                       └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Rate Limiting (更新)                       │
│  FREE: 5/月  |  PRO: 50/月  |  AGENCY: 无限                 │
└─────────────────────────────────────────────────────────────┘
```

## 新增文件结构

```
src/
├── lib/
│   ├── plan-gate.ts                    # 功能访问权限控制
│   └── analysis/
│       ├── best-time.ts                # 最佳发布时间分析
│       ├── growth-trend.ts             # 增长趋势估算
│       └── fake-followers.ts           # 假粉检测
├── components/audit/
│   ├── AISuggestionList.tsx            # AI 建议列表（带徽章）
│   ├── BestTimeGrid.tsx                # 7×24 热力图
│   ├── GrowthTrend.tsx                 # 趋势指示器 + 折线图
│   ├── FakeFollowerCard.tsx            # 圆形仪表盘 + 风险因素
│   ├── DownloadButton.tsx              # PDF 下载按钮
│   └── CompareTable.tsx                # 并排对比表
├── app/
│   ├── api/
│   │   ├── audit/[id]/pdf/route.ts     # PDF 生成端点
│   │   └── compare/route.ts            # 竞品对比端点
│   └── compare/[platform]/page.tsx     # 竞品对比页面
```

## 修改文件

```
src/lib/rate-limit.ts                   # 按计划等级设置限额
src/components/audit/LockedSection.tsx   # 接受 userPlan + feature 属性
src/app/api/audit/route.ts              # 返回 premium 数据
src/app/audit/[platform]/[username]/page.tsx  # 集成所有新组件
```

## 数据流

### 审计请求流（更新）

```
1. POST /api/audit { platform, username }
2. 中间件检查（不变）
3. 获取用户 session → 确定 userPlan
4. Provider 获取数据（不变）
5. 评分引擎计算（不变）
6. 模板建议生成（不变）
7. 如果 userPlan 是 PRO/AGENCY:
   a. 并行执行:
      - generateAISuggestions() → aiSuggestions
      - analyzeBestTimes(posts) → bestTimes
      - analyzeGrowthTrend(posts) → growthTrend
      - analyzeFakeFollowers(profile, posts) → fakeFollowers
8. 存储到 DB（不变）
9. 返回响应（新增 premium 字段 + userPlan）
```

### 审计响应结构（扩展）

```typescript
interface AuditResponse {
  // ... 原有字段不变 ...
  userPlan: "FREE" | "PRO" | "AGENCY";

  // PRO+ 专属字段（FREE 用户不返回）
  aiSuggestions?: string[];
  bestTimes?: {
    grid: number[][];           // 7×24 归一化互动值
    topSlots: { day: number; hour: number; label: string; score: number }[];
  };
  growthTrend?: {
    direction: "growing" | "stable" | "declining";
    monthlyGrowthRate: number;
    recentEngagements: number[];
    confidence: "low" | "medium" | "high";
  };
  fakeFollowers?: {
    authenticPercent: number;   // 0-100
    confidence: "low" | "medium" | "high";
    riskFactors: string[];
  };
}
```

### 竞品对比流

```
1. POST /api/compare { platform, usernames: string[] }
2. 验证用户已登录且 plan 为 PRO+
3. 对每个 username 并行执行: fetchProfile + fetchPosts + calculateScore
4. 返回 { platform, results: CompareEntry[] }
```

### PDF 生成流

```
1. GET /api/audit/[id]/pdf
2. 从 DB 获取 AuditReport
3. 使用 jsPDF 生成:
   - 标题 + 品牌
   - 健康分数
   - 维度评分表（autoTable）
   - 建议列表
4. 返回 application/pdf
```

## 关键决策

1. **增长趋势用估算而非历史快照：** 当前只有单次审计数据，通过对比新旧帖子互动量估算趋势方向。未来可加入定时快照。
2. **假粉检测用启发式而非 ML：** 基于互动率、关注比、评论比等可用数据做启发式评分，无需额外 API。
3. **PDF 在服务端生成：** 使用 jspdf 在 API route 中生成，返回二进制流，避免客户端依赖。
4. **竞品对比复用现有管道：** 不新建 provider 或 scoring 逻辑，直接对每个用户名跑完整审计流程。
5. **Stripe 延后：** 计划等级目前通过数据库手动设置，支付集成作为独立 change 实现。
