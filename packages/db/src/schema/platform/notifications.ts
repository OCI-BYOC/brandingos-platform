import {
  pgTable, pgEnum, text, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";

// ─── In-app notifications ─────────────────────────────────────────────────────
// No soft delete — notifications are event logs.
export const notifications = pgTable(
  "notifications",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:      text("type").notNull(),
    // portfolio_view_milestone | new_sale | booking_confirmed | course_enrollment |
    // new_follower | job_match | brand_digest | newsletter_subscriber | payout_sent etc.
    title:     text("title").notNull(),
    body:      text("body"),
    actionUrl: text("action_url"),
    isRead:    boolean("is_read").notNull().default(false),
    readAt:    timestamp("read_at", { withTimezone: true }),
    data:      jsonb("data").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:  index("notifications_user_idx").on(t.userId),
    unreadIdx: index("notifications_unread_idx").on(t.userId, t.isRead),
  })
);

// Per-user, per-type, per-channel notification preferences
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:      text("type").notNull(),
    channel:   text("channel").notNull(),   // in_app | email | push
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userTypeChannelUniq: uniqueIndex("notif_prefs_user_type_channel_uniq").on(t.userId, t.type, t.channel),
    userIdx:             index("notif_prefs_user_idx").on(t.userId),
  })
);

// PWA Web Push subscriptions
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    endpoint:  text("endpoint").unique().notNull(),
    p256dh:    text("p256dh").notNull(),   // ECDH public key
    auth:      text("auth").notNull(),     // auth secret
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("push_subscriptions_user_idx").on(t.userId) })
);

// ─── Incoming webhook delivery log (Clerk, Razorpay, Stripe, Shiprocket) ─────
// No soft delete — these are immutable event receipts for idempotency + replay.
export const webhookStatusEnum = pgEnum("webhook_status", ["received","processed","failed","duplicate"]);

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    provider:        text("provider").notNull(),   // clerk | razorpay | stripe | shiprocket
    eventType:       text("event_type").notNull(),
    externalEventId: text("external_event_id"),    // idempotency key from provider
    status:          webhookStatusEnum("status").notNull().default("received"),
    payload:         jsonb("payload"),
    processingError: text("processing_error"),
    processedAt:     timestamp("processed_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    providerEventUniq: uniqueIndex("webhook_deliveries_provider_event_uniq").on(t.provider, t.externalEventId),
    statusIdx:         index("webhook_deliveries_status_idx").on(t.status),
  })
);

export type Notification            = typeof notifications.$inferSelect;
export type NotificationPreference  = typeof notificationPreferences.$inferSelect;
export type WebhookDelivery         = typeof webhookDeliveries.$inferSelect;
