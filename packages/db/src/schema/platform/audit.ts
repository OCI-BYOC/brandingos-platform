import {
  pgTable, text, timestamp, uuid, jsonb, index
} from "drizzle-orm/pg-core";
import { users } from "../users.js";

// ─── Full append-only audit log — GDPR-ready ─────────────────────────────────
// No UPDATE, no DELETE ever. Hard-coded constraint enforced at DB level via trigger.
// Sensitive tables that must be audited:
//   users, subscriptions, payment_transactions, refunds, payouts, payout_accounts,
//   oracle_connections, team_members, team_permissions, agency_clients,
//   enrollments, certificates, ai_credit_ledger, mcp_sessions
//
// Actions: created | updated | deleted | viewed | exported |
//          login | logout | permission_changed | payment | refund |
//          subscription_changed | data_export_requested | account_deleted

export const auditLogs = pgTable(
  "audit_logs",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    userId:         text("user_id").references(() => users.id, { onDelete: "set null" }),  // actor (null = system)
    targetUserId:   text("target_user_id"),   // affected user if different from actor
    action:         text("action").notNull(),
    entityType:     text("entity_type").notNull(),
    entityId:       text("entity_id"),
    changes:        jsonb("changes"),         // {before: {...}, after: {...}} for updates
    ipAddress:      text("ip_address"),
    userAgent:      text("user_agent"),
    sessionId:      text("session_id"),       // Clerk session ID
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:       index("audit_logs_user_idx").on(t.userId),
    entityIdx:     index("audit_logs_entity_idx").on(t.entityType, t.entityId),
    actionIdx:     index("audit_logs_action_idx").on(t.action),
    createdIdx:    index("audit_logs_created_idx").on(t.createdAt),
    targetUserIdx: index("audit_logs_target_user_idx").on(t.targetUserId),
  })
);

export type AuditLog    = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
