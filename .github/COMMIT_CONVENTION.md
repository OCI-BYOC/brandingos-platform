# OCI-BYOC Commit Convention

Every commit must follow this format or the push is blocked.

## Format

```
<type>(<scope>): <description>

AI-Agent: <agent-id>/<model>
Built-By: <Satyam|Aditya|Soumyadip>
Why: <reason — one sentence>
How: <technical approach — one or two sentences>
Time-Spent: <Xh or Xm>
Refs: #<issue-number>
```

## Types
feat, fix, chore, refactor, perf, test, docs, style, revert, infra, ai, db, sec

## Registered AI Agents
- `claude-code` — Claude Code by Anthropic (claude-sonnet-4-6, claude-opus-4-6)
- `antigravity` — Google Antigravity (gemini-3.1-pro, claude-opus-4-6)
- `none/manual` — No AI used

## Example

```
feat(commerce): implement razorpay route split payment webhook

AI-Agent: claude-code/claude-sonnet-4-6
Built-By: Satyam
Why: Platform needs automated 92/8 split on every sale without manual transfers
How: Razorpay webhook -> HMAC verify -> Drizzle transaction -> Trigger.dev payout job
Time-Spent: 4h
Refs: #47
```

## Using a New Agent?

Just use it. CI auto-creates a GitHub issue asking you to register it.
You have 24 hours after merging your PR to fill in the registration.

## Setup

```bash
pnpm install  # installs Husky hooks automatically
```
