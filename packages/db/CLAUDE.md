# BrandingOS Database Package

## What lives here
Drizzle ORM schema, migrations, RLS policies, and the database client.

## Stack
- Drizzle ORM (type-safe SQL query builder)
- Neon (serverless Postgres) 
- drizzle-kit (migration generator)

## Critical Rules
1. **RLS on every table** — set `app.current_user_id` before every query in the API layer
2. **Soft delete only** — every user-owned table has `deletedAt` column, never hard delete
3. **Timestamps** — every table has `createdAt` and `updatedAt` (auto-updated)
4. **Never put business logic here** — schema only, no queries except in `src/index.ts`

## Schema files (20 files, 88 tables across 14 domains)

### Core
- `src/schema/users.ts` — users, user_preferences
- `src/schema/portfolios.ts` — portfolios, portfolio_sections (with section type enum)
- `src/schema/integrations.ts` — GitHub/LinkedIn/social OAuth integrations
- `src/schema/analytics_events.ts` — portfolio view/engagement events

### Commerce
- `src/schema/commerce/products.ts` — products, product_variants, product_attribute_definitions, digital_product_files
- `src/schema/commerce/orders.ts` — orders, order_items, order_shipments, shipping_addresses, payment_transactions, refunds
- `src/schema/commerce/payments.ts` — product_reviews, testimonials, payout_accounts, payouts

### Courses / LMS
- `src/schema/courses/courses.ts` — courses, course_sections, lessons, lesson_videos, lesson_attachments, cohorts, course_coupons, course_affiliates
- `src/schema/courses/enrollments.ts` — enrollments, lesson_progress, certificates, quizzes, quiz_questions, quiz_question_options, quiz_attempts, course_discussions

### Social Agent
- `src/schema/social/posts.ts` — social_accounts, 8 platform post tables, voice_model_samples, content_workflows, content_workflow_runs

### Job Intelligence
- `src/schema/jobs/jobs.ts` — resume_versions, job_search_configs, job_listings, job_applications, cover_letters, interview_preps, cold_emails

### Newsletter
- `src/schema/newsletter/newsletter.ts` — newsletters, newsletter_subscribers, newsletter_campaigns, newsletter_campaign_events

### Booking
- `src/schema/booking/booking.ts` — meeting_types, availability_rules, availability_exceptions, booking_appointments, booking_payments

### AI Layer
- `src/schema/ai/ai.ts` — ai_credit_ledger, ai_topup_packs, ai_usage_logs, ai_workflows, ai_workflow_runs, oracle_connections, brand_health_scores, research_reports

### Teams & Agency
- `src/schema/teams/teams.ts` — teams, team_members, team_permissions, agency_clients

### Platform
- `src/schema/platform/subscriptions.ts` — subscriptions, subscription_events, referral_codes, referrals, verifications
- `src/schema/platform/notifications.ts` — notifications, notification_preferences, push_subscriptions, webhook_deliveries
- `src/schema/platform/mcp.ts` — mcp_sessions, mcp_tool_calls
- `src/schema/platform/audit.ts` — audit_logs

### Barrel export
- `src/schema/index.ts` — re-exports all schemas

> **Note:** `src/schema/portfolio_sections.ts` is a stale file — delete it.
> `portfolioSections` is correctly defined in `portfolios.ts`.

## Commands
```bash
pnpm db:generate   # generate migration from schema changes
pnpm db:migrate    # run migrations against DATABASE_URL
pnpm db:studio     # open Drizzle Studio to inspect data
pnpm db:push       # push schema to DB (dev only, skips migration file)
```

## Neon branching
- `main` branch = production DB
- `staging` branch = staging DB  
- Each developer gets their own branch
- CI creates a fresh branch per run, deletes after
