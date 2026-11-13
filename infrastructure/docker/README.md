# Docker — ARM64 Dockerfiles

All images target `linux/arm64/v8` for Oracle Free Tier ARM64 VMs.

## Build Convention

```bash
docker buildx build --platform linux/arm64 -t brandingos/<service>:latest .
```

## Dockerfiles (to be created per Phase)

| File | Service | Phase |
|------|---------|-------|
| `Dockerfile.medusa` | Medusa v2 (Node.js 22 ARM64) | 0 |
| `Dockerfile.worker` | Trigger.dev worker | 2 |
| `Dockerfile.ai-service` | Hono AI service | 4 |
| `Dockerfile.mcp-server` | MCP server | 4 |
| `Dockerfile.typesense` | Typesense (use official ARM image) | 4 |

## Base Image

```dockerfile
FROM node:22-alpine AS base
# Alpine has ARM64 support — lighter than debian for Oracle's 12 GB RAM
```

## Multi-stage Build Pattern

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```
