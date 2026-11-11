# BrandingOS — Antigravity (agy) Project Context

This is the BrandingOS monorepo — an AI-native personal branding platform.

## Stack
- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind v4, Shadcn/UI, Framer Motion
- **Backend**: Hono on Cloudflare Workers + tRPC
- **Database**: Neon (Postgres serverless), Drizzle ORM, RLS on all 88 tables
- **Auth**: Clerk v6
- **AI**: Ollama + Llama 3.1 8B (free), Claude Haiku/Sonnet (premium)
- **Storage**: Cloudflare R2
- **Payments**: Razorpay (India), Stripe Connect (global)

## Repo
- GitHub: OCI-BYOC/brandingos-platform
- Default branch: develop
- Working branch: feature/aditya-6-nextjs-app

## Team
- Satyam (satyamraj2101) — Tech Lead, Architecture, QA, Config
- Aditya (aditya2149) — Frontend, Full-stack UI
- Soumyadip (soumyadip012) — Backend, Infra

## Frontend Issues (Aditya)
- #6 Next.js app setup ← scaffolded, needs completion
- #10 Portfolio editor — main product UI
- #18 Resend email templates
- #19 Vitest + Playwright tests
- #20 Marketing landing page
- #21 Onboarding wizard

## Key Conventions
- Commit: `feat(ui): description` with AI-Agent/Built-By/Why/How/Time-Spent/Refs fields
- Branch: `feature/aditya-{issue}-{description}`
- All server components use `withRLS(db(), userId, tx => ...)` for DB queries
- Use Compound Engineering skills: /ce-brainstorm → /ce-plan → /ce-work → /ce-code-review

## Context Files
Read CLAUDE.md for the full project context, schema overview, and all tool instructions.
