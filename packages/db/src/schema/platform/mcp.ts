import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index
} from "drizzle-orm/pg-core";
import { users } from "../users";

export const mcpCallStatusEnum = pgEnum("mcp_call_status", ["success","failed","permission_denied"]);

// MCP server sessions (OAuth 2.0 PKCE — one session per client connection)
export const mcpSessions = pgTable(
  "mcp_sessions",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    clientId:      text("client_id").notNull(),   // claude | gemini | cursor | custom
    accessToken:   text("access_token").notNull().unique(), // SHA-256 hashed — never stored plain
    scopes:        text("scopes").array().notNull(),
    // read:portfolio | write:portfolio | write:social | read:analytics | write:commerce etc.
    expiresAt:     timestamp("expires_at", { withTimezone: true }).notNull(),
    lastUsedAt:    timestamp("last_used_at", { withTimezone: true }),
    ipAddress:     text("ip_address"),
    userAgent:     text("user_agent"),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:    index("mcp_sessions_user_idx").on(t.userId),
    tokenIdx:   index("mcp_sessions_token_idx").on(t.accessToken),
    expiryIdx:  index("mcp_sessions_expiry_idx").on(t.expiresAt),
  })
);

// Full audit log of every MCP tool call — security + debugging
export const mcpToolCalls = pgTable(
  "mcp_tool_calls",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    sessionId:  uuid("session_id").notNull().references(() => mcpSessions.id, { onDelete: "cascade" }),
    userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    toolName:   text("tool_name").notNull(),
    input:      jsonb("input"),
    output:     jsonb("output"),
    status:     mcpCallStatusEnum("status").notNull().default("success"),
    durationMs: integer("duration_ms"),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sessionIdx: index("mcp_tool_calls_session_idx").on(t.sessionId),
    userIdx:    index("mcp_tool_calls_user_idx").on(t.userId),
    toolIdx:    index("mcp_tool_calls_tool_idx").on(t.toolName),
  })
);

export type McpSession  = typeof mcpSessions.$inferSelect;
export type McpToolCall = typeof mcpToolCalls.$inferSelect;
