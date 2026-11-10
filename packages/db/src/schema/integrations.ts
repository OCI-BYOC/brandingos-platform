import {
  pgTable, pgEnum, text, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const integrationProviderEnum = pgEnum("integration_provider", [
  "github", "linkedin", "twitter", "instagram", "youtube",
  "threads", "bluesky", "devto", "hashnode",
]);

export const integrations = pgTable(
  "integrations",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:      integrationProviderEnum("provider").notNull(),
    externalId:    text("external_id").notNull(),
    accessToken:   text("access_token"),   // AES-256 encrypted via Vault before storage
    refreshToken:  text("refresh_token"),  // AES-256 encrypted
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    data:          jsonb("data").default({}), // Last synced snapshot
    lastSyncedAt:  timestamp("last_synced_at", { withTimezone: true }),
    syncEnabled:   boolean("sync_enabled").notNull().default(true),
    deletedAt:     timestamp("deleted_at", { withTimezone: true }),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userProviderUniq: uniqueIndex("integrations_user_provider_uniq").on(t.userId, t.provider),
    userIdx:          index("integrations_user_idx").on(t.userId),
  })
);

export type Integration    = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
