# BrandingOS Platform

> Personal Branding OS — The AI-native platform for every professional

Built by **Satyam Raj**, **Aditya**, and **Soumyadip** using Claude Code and Google Antigravity.

---

## Organisation: OCI-BYOC

This monorepo contains the full Personal Branding OS platform:
portfolio, commerce, job intelligence, AI agents, MCP server, and infrastructure.

## Getting Started

```bash
# Clone
git clone https://github.com/OCI-BYOC/brandingos-platform
cd brandingos-platform

# Install (also installs Git hooks)
pnpm install

# Start dev
pnpm dev
```

## Team

| Member | Role | AI IDE |
|---|---|---|
| Satyam | Portfolio, Auth, MCP, API Core | Claude Code + Antigravity |
| Aditya | Commerce, Payments, Marketplace, LMS | Claude Code + Antigravity |
| Soumyadip | AI Service, Infra, Nomad, DevOps | Claude Code + Antigravity |

## Commit Convention

Every commit must include AI attribution. See `.github/COMMIT_CONVENTION.md`.

```
feat(scope): description

AI-Agent: claude-code/claude-sonnet-4-6
Built-By: Satyam
Why: reason
How: approach
Time-Spent: 2h
Refs: #23
```

## Branch Naming

```
feature/satyam-23-github-sync
fix/aditya-89-razorpay-webhook
infra/soumyadip-12-nomad-arm-jobs
```

## Docs

- `.github/COMMIT_CONVENTION.md` — full commit format docs
- `CONTRIBUTING.md` — setup guide for the team
- `.github/ai-agent-registry.json` — registered AI agents
