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
| Satyam | satyamraj2101 | Portfolio · Store · Commerce · Analytics · MCP server |
| Aditya | Aditya2149 | Frontend · LMS migration (spotclm academy) · Booking UI · Marketing · QA |
| Soumyadip | Soumyadip012 | Infra · Edge API · Video pipeline · Search · AI service · Lago billing |

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
| Frontend | Next.js 15 App Router, TypeScript, Tailwind CSS v4, Shadcn/UI |
| Edge API | Hono on Cloudflare Workers (apps/edge) |
| Commerce API | Medusa v2 on Oracle Account 4 via Nomad (apps/api → apps/commerce) |
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
  web/          → Next.js 15 frontend — dashboard, auth, creator portal
  api/          → Medusa v2 commerce engine (rename → apps/commerce in Phase 2 · issue #219)
  edge/         → Hono on Cloudflare Workers — tRPC, Clerk auth middleware, rate limiting [Phase 1 · issue #213]
  store/        → Next.js 15 public storefront — /{username}/store, product pages
  worker/       → Trigger.dev jobs — HLS transcode, AI generation, email [Phase 2+]
  ai-service/   → Hono AI router — Ollama + Anthropic fallback [Phase 4]
  mcp-server/   → MCP server for Claude Desktop / Cursor [Phase 4]
  booking/      → Cal.com git subtree — self-hosted scheduling [Phase 3 · issue #167]
packages/
  db/           → Drizzle schema (88 tables), migrations, RLS policies
  types/        → Shared TypeScript types
  ui/           → Shared Shadcn/UI components
  config/       → Shared ESLint, Tailwind, TypeScript configs
  utils/        → Shared utility functions
  cal/          → Cal.com embed SDK + booking webhook handler [Phase 3 · issue #171]
infrastructure/
  terraform/    → Terraform for Oracle Cloud (7 accounts)
  nomad/        → Nomad job definitions (one .hcl per service)
  docker/       → Dockerfiles (ARM64 for Oracle)
```

## Critical Architecture Rules

### Database (packages/db)
- Drizzle ORM with Neon (serverless Postgres)
- RLS on EVERY table — no exceptions. Pattern: `app.current_user_id` set per request
- Soft delete everywhere (deleted_at column, never hard delete)
- Neon branching for dev/staging (branch per developer, branch per CI run)
- Never use Drizzle's `db.transaction()` without RLS set inside it

### Edge API (apps/edge)
- Hono on Cloudflare Workers — handles all tRPC calls from apps/web and apps/store
- Auth middleware (Clerk JWT verification) MUST run first on every route
- Sets `SET app.current_user_id = $userId` via Neon HTTP driver before any DB query
- Rate limits enforced with Upstash sliding-window: 100/min per IP, 10/min per AI endpoint
- Never pass raw user IDs from query params — always read from JWT claims

### Commerce API (apps/api → apps/commerce)
- Medusa v2 on Oracle Account 4 via Nomad (port 9000)
- Custom routes live in apps/api/src/api/ — follow Medusa route conventions
- Digital product delivery: generate R2 presigned GET URLs after order confirmed
- Two regions: India (INR + Razorpay) and Global (USD + Stripe Connect)

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
**Phase 0 — Infrastructure Baseline** (Weeks 1–3)
226 issues across 6 phases: github.com/orgs/OCI-BYOC/projects/1

**Roadmap (26 weeks to v1.0):**
- Phase 0 (Wks 1–3): Oracle cluster + Cloudflare setup + apps/edge scaffold — Soumyadip leads
- Phase 1 (Wks 4–6): Auth + Creator Core (portfolio CRUD, subdomain routing, Hono tRPC)
- Phase 2 (Wks 7–10): Commerce + Payments (Medusa v2, Razorpay, Stripe Connect)
- Phase 3 (Wks 11–16): LMS migration (spotclm) + Cal.com booking + HLS video pipeline
- Phase 4 (Wks 17–21): Typesense search + Ollama AI service + MCP server bootstrap
- Phase 5 (Wks 22–26): Lago billing + monitoring stack + v1.0 launch

**Phase 0 start now (by GitHub handle):**
1. Soumyadip012: Provision 7 Oracle ARM64 VMs → Nomad + Consul + Vault cluster
2. Soumyadip012: Cloudflare R2 buckets, Workers routes, Pages projects
3. Soumyadip012: Bootstrap apps/edge (issue #213) + deploy to CF Workers
4. Aditya2149: spotclm academy codebase audit → migration checklist (issue #154)
5. satyamraj2101: packages/db RLS policy review, architecture decisions

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
5. Create branch: `git checkout -b feature/{yourname}-{issue#}-{description} develop`
   Examples: `feature/satyam-213-hono-edge`, `feature/aditya-155-course-dashboard`, `feature/soumyadip-182-typesense`
6. Work, commit using the format above
7. Push and open PR against `develop`

## Package Manager
pnpm (not npm, not yarn). Always `pnpm install`, `pnpm dev`, `pnpm build`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.


## Compound Engineering Skills

37 engineering skills installed in `.claude/skills/`. Config in `.compound-engineering/config.yaml`.

The core loop for every piece of work:
1. `/ce-brainstorm <what you want to build>` — interactive Q&A, produces a requirements plan
2. `/ce-plan` — enriches the requirements plan into an implementation plan
3. `/ce-work` — executes the plan
4. `/ce-simplify-code` — cleans up what was written before review
5. `/ce-code-review` — multi-agent review against the plan
6. `/ce-compound` — saves learnings to `docs/solutions/` for the next loop

Autonomous: `/lfg` runs the whole pipeline after brainstorm.

Key on-demand skills:
- `/ce-explain <concept>` — understand how something works before touching it
- `/ce-debug <error>` — structured debugging
- `/ce-commit` / `/ce-commit-push-pr` — commits with correct format and opens PR
- `/ce-code-review` — review before every merge
- `/ce-setup` — run once per session to verify tools and config

Learning accumulates in `docs/solutions/` — always read it before starting a new loop.

## Playwright Skill

Browser automation installed in `.claude/skills/playwright-skill/`. Chromium installed.

Use for:
- E2E testing of portfolio pages (`http://localhost:3000`)
- Testing the onboarding wizard flow
- Verifying payment flows in test mode
- Screenshot diffing for portfolio themes
- Testing the booking form

Default: browser visible (`headless: false`), 0ms slow motion.
Run via: `.claude/skills/playwright-skill/run.js` (handles module resolution).

## 21st MCP — UI Components

MCP server configured in `.claude/settings.json`. Set `API_KEY_21ST` env var before starting Claude Code.

Get a free API key at: https://21st.dev/mcp

Use this for:
- Searching 10,000+ ready-made React/Tailwind components (`search` tool)
- Generating new UI components with AI (`generate` tool)
- Building portfolio section UI (hero, about, projects, testimonials, newsletter)
- Inspiration for layouts and component patterns (`get_inspiration` tool)
- Logo search for marketplace listings (`search_logo` tool)

Usage pattern: search 21st first → adapt to BrandingOS Tailwind v4 + Shadcn tokens → iterate.
Key tools: `search`, `generate`, `get_inspiration`, `search_logo`, `get_usage`.
