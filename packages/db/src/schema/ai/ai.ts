import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, date, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

// ─── AI Credit Ledger (append-only, source of truth) ─────────────────────────
// Hybrid model: monthly allocation (expires at billing cycle end) + never-expiring top-up packs.
// Balance = SUM of active ledger entries where (expiresAt IS NULL OR expiresAt > NOW())
// Cached on users.ai_credits_remaining for fast reads — updated transactionally.
export const creditLedgerTypeEnum = pgEnum("credit_ledger_type", [
  "monthly_allocation",   // credited at billing cycle start
  "topup_purchase",       // purchased top-up pack (never expires)
  "consumption",          // AI action consumed credits
  "refund",               // refund on failed AI call
  "adjustment",           // manual admin adjustment
  "expiry",               // monthly credits expired at cycle end
]);

export const aiCreditLedger = pgTable(
  "ai_credit_ledger",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    userId:             text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:               creditLedgerTypeEnum("type").notNull(),
    amount:             integer("amount").notNull(),   // positive = credit in, negative = out
    description:        text("description"),           // "cover_letter_generation" | "monthly_reset" etc
    model:              text("model"),                 // ollama/llama3.1-8b | claude-haiku-3-5 etc
    relatedEntityType:  text("related_entity_type"),   // resume | portfolio | social_post etc
    relatedEntityId:    uuid("related_entity_id"),
    balanceBefore:      integer("balance_before").notNull(),  // snapshot for audit
    balanceAfter:       integer("balance_after").notNull(),
    expiresAt:          timestamp("expires_at", { withTimezone: true }),  // null = never, set for monthly allocation
    topupPackId:        uuid("topup_pack_id"),                              // which pack this came from
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:     index("ai_credit_ledger_user_idx").on(t.userId),
    typeIdx:     index("ai_credit_ledger_type_idx").on(t.userId, t.type),
    createdIdx:  index("ai_credit_ledger_created_idx").on(t.userId, t.createdAt),
  })
);

// Top-up packs — purchased with real money, never expire
export const aiTopupPacks = pgTable(
  "ai_topup_packs",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    orderId:          uuid("order_id"),    // FK → orders.id — deferred
    credits:          integer("credits").notNull(),
    price:            integer("price").notNull(),
    remainingCredits: integer("remaining_credits").notNull(),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:        timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("ai_topup_packs_user_idx").on(t.userId) })
);

// ─── AI Usage Logs (no soft delete — analytics) ───────────────────────────────
export const aiProviderEnum    = pgEnum("ai_provider",    ["ollama","anthropic","openai"]);
export const aiCallStatusEnum  = pgEnum("ai_call_status", ["success","failed","timeout"]);

export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    userId:             text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:           aiProviderEnum("provider").notNull(),
    model:              text("model").notNull(),
    action:             text("action").notNull(),   // portfolio_generation | cover_letter | social_post | research etc
    promptTokens:       integer("prompt_tokens"),
    completionTokens:   integer("completion_tokens"),
    totalTokens:        integer("total_tokens"),
    creditsConsumed:    integer("credits_consumed").notNull(),
    latencyMs:          integer("latency_ms"),
    status:             aiCallStatusEnum("status").notNull().default("success"),
    errorMessage:       text("error_message"),
    relatedEntityType:  text("related_entity_type"),
    relatedEntityId:    uuid("related_entity_id"),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:    index("ai_usage_logs_user_idx").on(t.userId),
    actionIdx:  index("ai_usage_logs_action_idx").on(t.userId, t.action),
    createdIdx: index("ai_usage_logs_created_idx").on(t.createdAt),
  })
);

// ─── AI Agents & Workflows ────────────────────────────────────────────────────
export const aiAgentTypeEnum = pgEnum("ai_agent_type", ["social","job","research","brand","custom"]);

export const aiWorkflows = pgTable(
  "ai_workflows",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:        text("name").notNull(),
    agentType:   aiAgentTypeEnum("agent_type").notNull(),
    trigger:     jsonb("trigger").notNull().default({}),
    config:      jsonb("config").notNull().default({}),
    isActive:    boolean("is_active").notNull().default(true),
    lastRunAt:   timestamp("last_run_at", { withTimezone: true }),
    runCount:    integer("run_count").notNull().default(0),
    deletedAt:   timestamp("deleted_at", { withTimezone: true }),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("ai_workflows_user_idx").on(t.userId) })
);

export const aiWorkflowRuns = pgTable("ai_workflow_runs", {
  id:           uuid("id").primaryKey().defaultRandom(),
  workflowId:   uuid("workflow_id").notNull().references(() => aiWorkflows.id, { onDelete: "cascade" }),
  status:       text("status").notNull().default("pending"),
  input:        jsonb("input").default({}),
  output:       jsonb("output").default({}),
  errorMessage: text("error_message"),
  startedAt:    timestamp("started_at", { withTimezone: true }),
  completedAt:  timestamp("completed_at", { withTimezone: true }),
  createdAt:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Oracle BYOC Private AI connections ──────────────────────────────────────
export const oracleConnectionStatusEnum = pgEnum("oracle_connection_status", [
  "pending","provisioning","active","failed","disconnected",
]);
export const oracleHealthStatusEnum = pgEnum("oracle_health_status", ["healthy","degraded","offline"]);

export const oracleConnections = pgTable(
  "oracle_connections",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    userId:             text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status:             oracleConnectionStatusEnum("status").notNull().default("pending"),
    tenancyOcid:        text("tenancy_ocid"),       // AES-256 encrypted
    userOcid:           text("user_ocid"),          // AES-256 encrypted
    apiKeyFingerprint:  text("api_key_fingerprint"),
    regionIdentifier:   text("region_identifier"),
    instanceId:         text("instance_id"),
    instanceIp:         text("instance_ip"),
    nomadAllocId:       text("nomad_alloc_id"),
    lastHealthCheckAt:  timestamp("last_health_check_at", { withTimezone: true }),
    healthStatus:       oracleHealthStatusEnum("health_status"),
    errorMessage:       text("error_message"),
    connectedAt:        timestamp("connected_at", { withTimezone: true }),
    disconnectedAt:     timestamp("disconnected_at", { withTimezone: true }),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("oracle_connections_user_idx").on(t.userId) })
);

// ─── Brand health scores (weekly snapshots) ───────────────────────────────────
export const brandHealthScores = pgTable(
  "brand_health_scores",
  {
    id:                     uuid("id").primaryKey().defaultRandom(),
    userId:                 text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    weekStart:              date("week_start").notNull(),
    overallScore:           integer("overall_score").notNull(),
    portfolioViewsScore:    integer("portfolio_views_score").notNull(),
    newsletterGrowthScore:  integer("newsletter_growth_score").notNull(),
    socialEngagementScore:  integer("social_engagement_score").notNull(),
    brandConsistencyScore:  integer("brand_consistency_score").notNull(),
    reputationScore:        integer("reputation_score").notNull(),
    revenueScore:           integer("revenue_score").notNull(),
    notes:                  text("notes"),
    createdAt:              timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userWeekUniq: uniqueIndex("brand_health_scores_user_week_uniq").on(t.userId, t.weekStart),
    userIdx:      index("brand_health_scores_user_idx").on(t.userId),
  })
);

// ─── Research reports ─────────────────────────────────────────────────────────
export const researchReports = pgTable(
  "research_reports",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:       text("type").notNull(),   // competitor_landscape | brand_audit | content_research | investor_client | custom
    title:      text("title").notNull(),
    query:      text("query"),
    content:    text("content"),
    sources:    jsonb("sources").default([]),
    workflowId: uuid("workflow_id").references(() => aiWorkflows.id, { onDelete: "set null" }),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("research_reports_user_idx").on(t.userId) })
);

export type AiCreditLedger  = typeof aiCreditLedger.$inferSelect;
export type AiUsageLog      = typeof aiUsageLogs.$inferSelect;
export type OracleConnection = typeof oracleConnections.$inferSelect;
export type BrandHealthScore = typeof brandHealthScores.$inferSelect;
