# BrandingOS Platform — Claude Code Context

## What This Is
An AI-native personal branding platform. Users connect GitHub, LinkedIn, deploy a portfolio, sell products, find jobs, and manage their professional presence via AI agents. Think Notion + Shopify + LinkedIn rolled into one, controlled by natural language through an MCP server.

## GitHub
- Org: OCI-BYOC
- Repo: github.com/OCI-BYOC/brandingos-platform
- Default branch: `develop`
- Main is production-locked

## Team
| Person | GitHub | Owns |
|--------|--------|------|
| Satyam | satyamraj2101 | Portfolio, Auth, API Core, MCP server |
| Aditya | (pending invite) | Commerce, Payments, Marketplace, LMS |
| Soumyadip | (pending invite) | AI Service, Infra, Nomad, DevOps |

## Branch naming (enforced by CI)
`type/name-issuenumber-description`
Example: `feature/satyam-4-database-schema`

## Commit format (enforced by Husky + commitlint)
```
feat(scope): description

AI-Agent: claude-code/claude-sonnet-4-6
Built-By: Satyam
Why: reason for this change
How: approach taken
Time-Spent: 2h
Refs: #4
```

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ App Router, TypeScript, Tailwind CSS v4, Shadcn/UI |
| Edge API | Hono on Cloudflare Workers |
| Compute API | Fastify on Fly.io / Oracle (Node.js 22) |
| Internal API | tRPC + Zod |
| Database | Neon (Postgres serverless), Drizzle ORM |
| Cache | Upstash Redis (edge-compatible) |
| Storage | Cloudflare R2 (zero egress) |
| Search | Typesense (self-hosted Oracle) |
| Auth | Clerk |
| Background Jobs | Trigger.dev (self-hosted Oracle) |
| Queue | RabbitMQ (self-hosted Oracle) |
| AI Premium | Claude Haiku/Sonnet (Anthropic API) |
| AI Free | Ollama + Llama 3.1 8B, Mistral 7B, Gemma 2 9B (Oracle ARM) |
| India Payments | Razorpay Route |
| Global Payments | Stripe Connect |
| Logistics India | Shiprocket API |
| Logistics Global | EasyPost |
| Email | Resend + React Email |
| Monitoring | Prometheus + Grafana (self-hosted Oracle) |
| Orchestration | HashiCorp Nomad + Consul + Vault |
| IaC | Terraform |
| CDN/Routing | Cloudflare |

## Monorepo Structure
```
apps/
  web/          → Next.js 14 frontend (App Router)
  api/          → Hono on Cloudflare Workers (tRPC)
  worker/       → Trigger.dev background jobs
  ai-service/   → AI router, Ollama, agent orchestration
  mcp-server/   → MCP server (Claude/Gemini control plane)
packages/
  db/           → Drizzle schema, migrations, RLS policies
  types/        → Shared TypeScript types
  ui/           → Shared Shadcn/UI components
  config/       → Shared ESLint, Tailwind, TypeScript configs
  utils/        → Shared utility functions
infrastructure/
  terraform/    → Terraform for Oracle Cloud
  nomad/        → Nomad job definitions
  docker/       → Dockerfiles (ARM64 for Oracle)
```

## Critical Architecture Rules

### Database (packages/db)
- Drizzle ORM with Neon (serverless Postgres)
- RLS on EVERY table — no exceptions. Pattern: `app.current_user_id` set per request
- Soft delete everywhere (deleted_at column, never hard delete)
- Neon branching for dev/staging (branch per developer, branch per CI run)
- Never use Drizzle's `db.transaction()` without RLS set inside it

### API (apps/api)
- Auth middleware MUST run first on every route
- Sets `SET app.current_user_id = $userId` before any DB query
- Never pass raw user IDs from query params — always from JWT
- Rate limits enforced in Upstash Redis before hitting DB

### AI
- Free tier: Ollama (self-hosted Oracle ARM) — Llama 3.1 8B, Mistral 7B, Gemma 2 9B
- Premium (paid plan): Claude API — Haiku for fast tasks, Sonnet for complex
- Credits system: Free=50/month, Pro=500, Growth=2K, Brand=10K
- Always log AI usage to Langfuse
- Route AI decisions in apps/ai-service/src/router.ts

### Infrastructure
- Oracle Free Tier: 2 OCPU / 12GB RAM per account (halved June 2026)
- 7 Oracle accounts = 14 OCPUs / 84GB total — all zero cost
- Never let any single Oracle account exceed 85% CPU or 90% RAM
- Terraform hard limits on all resources — cannot go paid accidentally
- Cloudflare sits in front of everything (zero cost, global CDN)

### Security
- Never store credentials in code or config files
- All secrets in HashiCorp Vault
- Postgres RLS is the last line of defense — treat it as mandatory
- httpOnly cookies only — no localStorage for auth tokens
- CSP headers on all responses

## Current Build Phase
**Phase 1 — Foundation** (due Feb 2027)
21 open issues on the project board.

**Start order for Phase 1 (dependency order):**
1. #3 Monorepo Turborepo (Soumyadip) — in progress
2. #4 Database schema + RLS (Soumyadip) — **start here**
3. #5 Clerk auth (Satyam) — depends on nothing
4. #7 Hono API + tRPC (Satyam) — depends on #5
5. #8 Oracle control plane (Soumyadip) — depends on nothing
6. Everything else can run in parallel after #3+#4+#5+#7+#8

## Project Board
github.com/orgs/OCI-BYOC/projects/1

## Environment Variables Needed
```env
# Database
DATABASE_URL=postgresql://...@neon.tech/brandingos

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Storage
CLOUDFLARE_R2_BUCKET=brandingos-uploads
CLOUDFLARE_R2_ENDPOINT=https://...r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...

# Cache
UPSTASH_REDIS_URL=https://...upstash.io
UPSTASH_REDIS_TOKEN=...

# AI
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://oracle-ai-1:11434

# Email
RESEND_API_KEY=re_...

# GitHub
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# LinkedIn
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

## What to Do When Starting a Session
1. Run `git pull origin develop` to get latest
2. Check open issues: `gh issue list --repo OCI-BYOC/brandingos-platform --state open`
3. Check your assigned issues: filter by your name label
4. Pick the highest-priority unstarted issue
5. Create branch: `git checkout -b feature/satyam-{number}-{description} develop`
6. Work, commit using the format above
7. Push and open PR against `develop`

## Package Manager
pnpm (not npm, not yarn). Always `pnpm install`, `pnpm dev`, `pnpm build`.
