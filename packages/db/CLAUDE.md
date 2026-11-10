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

## Schema files
- `src/schema/users.ts` — users table
- `src/schema/portfolios.ts` — portfolios table
- `src/schema/portfolio_sections.ts` — portfolio sections
- `src/schema/integrations.ts` — GitHub/LinkedIn integration data
- `src/schema/analytics_events.ts` — view tracking events
- `src/schema/index.ts` — re-exports all schemas

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
