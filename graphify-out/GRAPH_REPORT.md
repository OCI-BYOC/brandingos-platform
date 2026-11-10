# Graph Report - brandingos-platform  (2026-11-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 523 nodes · 617 edges · 33 communities (29 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c614c05d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- with
- package.json
- antigravity
- courses.ts
- tasks
- db/package.json
- compilerOptions
- posts.ts
- report
- with
- ai.ts
- ai-agent-registration.yml
- bug.yml
- feature.yml
- validate-branch
- orders.ts
- subscriptions.ts
- booking.ts
- jobs.ts
- portfolios.ts
- products.ts
- newsletter.ts
- users.ts
- teams.ts
- payments.ts
- notifications.ts
- drizzle-orm
- mcp.ts
- schema/index.ts
- integrations.ts
- pnpm-workspace.yaml

## God Nodes (most connected - your core abstractions)
1. `drizzle-orm` - 23 edges
2. `users` - 19 edges
3. `compilerOptions` - 14 edges
4. `with` - 13 edges
5. `scripts` - 12 edges
6. `antigravity` - 12 edges
7. `claude-code` - 12 edges
8. `tasks` - 10 edges
9. `commit_id_map` - 8 edges
10. `portfolios` - 7 edges

## Surprising Connections (you probably didn't know these)
- `typescript@^5.7.2` --declares--> `typescript`  [EXTRACTED]
  packages/db/package.json → package.json

## Import Cycles
- None detected.

## Communities (33 total, 4 thin omitted)

### Community 0 - "with"
Cohesion: 0.06
Nodes (45): name, needs, runs-on, steps, concurrency, cancel-in-progress, group, NODE_ENV (+37 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (39): config, description, devDependencies, @commitlint/cli@^19.0.0, @commitlint/config-conventional@^19.0.0, @commitlint/types@^19.0.0, husky@^9.0.0, prettier@^3.0.0 (+31 more)

### Community 2 - "antigravity"
Cohesion: 0.05
Nodes (38): agents, antigravity, claude-code, commit_id, default_model, id, models, name (+30 more)

### Community 3 - "courses.ts"
Cohesion: 0.06
Nodes (33): Cohort, cohorts, cohortStatusEnum, Course, courseAffiliates, courseCoupons, courseLevelEnum, courses (+25 more)

### Community 4 - "tasks"
Cohesion: 0.07
Nodes (27): dependsOn, inputs, outputs, cache, cache, cache, persistent, cache (+19 more)

### Community 5 - "db/package.json"
Cohesion: 0.10
Nodes (22): typescript@^5.5.0, typescript, dependencies, @neondatabase/serverless@^0.10.4, devDependencies, dotenv@^16.4.7, drizzle-kit@^0.28.0, typescript@^5.7.2 (+14 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowSyntheticDefaultImports, esModuleInterop, incremental, isolatedModules, lib, module, moduleResolution (+12 more)

### Community 7 - "posts.ts"
Cohesion: 0.11
Nodes (19): blueskyPosts, commonPostCols(), ContentWorkflow, contentWorkflowRuns, contentWorkflows, devtoPosts, hashnodePosts, instagramPosts (+11 more)

### Community 8 - "report"
Cohesion: 0.11
Nodes (18): jobs, report, name, on, schedule, workflow_dispatch, contents, issues (+10 more)

### Community 9 - "with"
Cohesion: 0.11
Nodes (18): name, runs-on, steps, jobs, commitlint, name, on, pull_request (+10 more)

### Community 10 - "ai.ts"
Cohesion: 0.11
Nodes (18): aiAgentTypeEnum, aiCallStatusEnum, aiCreditLedger, AiCreditLedger, aiProviderEnum, aiTopupPacks, AiUsageLog, aiUsageLogs (+10 more)

### Community 11 - "ai-agent-registration.yml"
Cohesion: 0.13
Nodes (14): label, options, placeholder, value, body, attributes, id, type (+6 more)

### Community 12 - "bug.yml"
Cohesion: 0.14
Nodes (13): label, options, render, body, attributes, id, type, validations (+5 more)

### Community 13 - "feature.yml"
Cohesion: 0.14
Nodes (13): label, options, placeholder, body, attributes, id, type, validations (+5 more)

### Community 14 - "validate-branch"
Cohesion: 0.14
Nodes (13): jobs, validate-branch, name, on, pull_request, push, branches, branches-ignore (+5 more)

### Community 15 - "orders.ts"
Cohesion: 0.14
Nodes (13): Order, OrderItem, orderItems, orderShipments, orderStatusEnum, paymentMethodEnum, paymentStatusEnum, PaymentTransaction (+5 more)

### Community 16 - "subscriptions.ts"
Cohesion: 0.15
Nodes (12): ReferralCode, referralCodes, referrals, Subscription, subscriptionEvents, subscriptionProviderEnum, subscriptions, subscriptionStatusEnum (+4 more)

### Community 17 - "booking.ts"
Cohesion: 0.17
Nodes (11): availabilityExceptions, availabilityExceptionTypeEnum, availabilityRules, BookingAppointment, bookingAppointments, bookingLocationEnum, bookingPayments, bookingPaymentStatusEnum (+3 more)

### Community 18 - "jobs.ts"
Cohesion: 0.17
Nodes (11): coldEmails, coverLetters, interviewPreps, JobApplication, jobApplications, JobListing, jobListings, jobSearchConfigs (+3 more)

### Community 19 - "portfolios.ts"
Cohesion: 0.18
Nodes (10): NewPortfolioSection, PortfolioSection, portfolioSections, NewPortfolio, Portfolio, portfolios, PortfolioSection, portfolioSections (+2 more)

### Community 20 - "products.ts"
Cohesion: 0.18
Nodes (10): digitalProductFiles, NewProduct, Product, ProductAttributeDefinition, productAttributeDefinitions, products, productStatusEnum, productTypeEnum (+2 more)

### Community 21 - "newsletter.ts"
Cohesion: 0.18
Nodes (10): campaignEventEnum, campaignStatusEnum, Newsletter, NewsletterCampaign, newsletterCampaignEvents, newsletterCampaigns, newsletters, NewsletterSubscriber (+2 more)

### Community 22 - "users.ts"
Cohesion: 0.20
Nodes (9): AuditLog, auditLogs, NewAuditLog, NewUser, tierEnum, User, UserPreference, userPreferences (+1 more)

### Community 23 - "teams.ts"
Cohesion: 0.18
Nodes (10): AgencyClient, agencyClients, Team, TeamMember, teamMemberRoleEnum, teamMembers, teamMemberStatusEnum, teamPermissions (+2 more)

### Community 24 - "payments.ts"
Cohesion: 0.20
Nodes (9): orders, Payout, payoutAccounts, payouts, ProductReview, productReviews, reviewStatusEnum, Testimonial (+1 more)

### Community 25 - "notifications.ts"
Cohesion: 0.22
Nodes (8): Notification, NotificationPreference, notificationPreferences, notifications, pushSubscriptions, webhookDeliveries, WebhookDelivery, webhookStatusEnum

### Community 26 - "drizzle-orm"
Cohesion: 0.33
Nodes (5): drizzle-orm@^0.37.0, AnalyticsEvent, analyticsEvents, NewAnalyticsEvent, drizzle-orm

### Community 27 - "mcp.ts"
Cohesion: 0.33
Nodes (5): mcpCallStatusEnum, McpSession, mcpSessions, McpToolCall, mcpToolCalls

### Community 29 - "integrations.ts"
Cohesion: 0.40
Nodes (4): Integration, integrationProviderEnum, integrations, NewIntegration

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drizzle-orm` connect `drizzle-orm` to `courses.ts`, `db/package.json`, `posts.ts`, `ai.ts`, `orders.ts`, `subscriptions.ts`, `booking.ts`, `jobs.ts`, `portfolios.ts`, `products.ts`, `newsletter.ts`, `users.ts`, `teams.ts`, `payments.ts`, `notifications.ts`, `mcp.ts`, `schema/index.ts`, `integrations.ts`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.05507246376811594 - nodes in this community are weakly interconnected._
- **Why does `typescript` connect `db/package.json` to `package.json`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05731707317073171 - nodes in this community are weakly interconnected._
- **Why does `users` connect `users.ts` to `courses.ts`, `posts.ts`, `ai.ts`, `orders.ts`, `subscriptions.ts`, `booking.ts`, `jobs.ts`, `portfolios.ts`, `products.ts`, `newsletter.ts`, `teams.ts`, `payments.ts`, `notifications.ts`, `drizzle-orm`, `mcp.ts`, `integrations.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `antigravity` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `courses.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06218487394957983 - nodes in this community are weakly interconnected._