# Premium Features — Proposal

## Summary

在 MVP 审计引擎（50/50 任务完成）基础上，实现全部付费功能：计划分级门控、AI 深度建议、最佳发布时间、增长趋势、PDF 导出、竞品对比、假粉检测。Stripe 支付集成延后。

## Problem

- `Plan` 枚举（FREE/PRO/AGENCY）存在于 Prisma schema 但未在任何地方执行
- `LockedSection` 组件硬编码显示锁定遮罩，不检查用户实际计划
- 付费功能（AI 建议、最佳时间、增长趋势等）后端逻辑未实现
- 速率限制未按计划等级区分（FREE/PRO/AGENCY 共用同一限额）

## Solution

### Phase 0: 计划门控基础设施
- 创建 `plan-gate.ts` 集中管理功能访问权限
- 更新 `rate-limit.ts` 按计划等级设置月度限额（FREE: 5, PRO: 50, AGENCY: 无限）
- 更新 `LockedSection.tsx` 接受 `userPlan` + `feature` 属性，动态决定显示内容或锁定

### Phase 1: AI 深度建议（PRO+）
- 将已有的 `ai.ts`（GPT-4o-mini）接入审计流程
- PRO+ 用户审计时自动调用 AI 生成个性化建议
- 新建 `AISuggestionList.tsx` 组件，带"AI"徽章

### Phase 2: 最佳发布时间（PRO+）
- 分析帖子时间戳，按星期×小时分组，加权互动量
- 7×24 热力图 + 前 3 个推荐时段

### Phase 3: 增长趋势估算（PRO+）
- 基于帖子互动轨迹（新旧帖子对比）估算增长方向和月增长率
- 趋势指示器 + 迷你折线图

### Phase 4: PDF 导出（PRO+）
- 使用 jspdf + jspdf-autotable 生成 PDF 报告
- 包含健康分数、维度评分表、建议列表

### Phase 5: 竞品对比（PRO+）
- 接受 2-3 个用户名，复用现有 provider + scoring 管道
- 并排对比表：健康分数、各维度评分

### Phase 6: 假粉检测（PRO+）
- 基于互动率/粉丝比、关注/粉丝比、评论/点赞比等启发式评分
- 圆形仪表盘 + 风险因素列表

### Phase 7: 报告页面重构
- 获取用户 session 确定计划等级
- 所有新组件集成到报告页，替换硬编码 LockedSection

## 月度运营成本增量

| 项目 | 成本 |
|------|------|
| OpenAI API（仅 PRO 用户） | ~$0.01-0.03/次审计 |
| jspdf（客户端库） | $0 |
| 其他 | $0 |

## Out of Scope

- Stripe 支付集成（延后）
- OAuth 深度分析（Instagram Graph API 等）
- 定时监控/自动审计
- 历史数据快照（增长趋势目前用估算方式）
