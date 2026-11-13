import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";

export const subscriptionProviderEnum = pgEnum("subscription_provider", ["stripe","razorpay"]);
export const subscriptionStatusEnum   = pgEnum("subscription_status",   ["active","past_due","cancelled","trialing","paused"]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id:                   uuid("id").primaryKey().defaultRandom(),
    userId:               text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:             subscriptionProviderEnum("provider").notNull(),
    providerSubscriptionId: text("provider_subscription_id").unique().notNull(),
    tier:                 text("tier").notNull(),   // free | pro | growth | brand
    status:               subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodStart:   timestamp("current_period_start", { withTimezone: true }).notNull(),
    currentPeriodEnd:     timestamp("current_period_end", { withTimezone: true }).notNull(),
    cancelAtPeriodEnd:    boolean("cancel_at_period_end").notNull().default(false),
    cancelledAt:          timestamp("cancelled_at", { withTimezone: true }),
    trialEndsAt:          timestamp("trial_ends_at", { withTimezone: true }),
    createdAt:            timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:            timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("subscriptions_user_idx").on(t.userId) })
);

export const subscriptionEvents = pgTable(
  "subscription_events",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
    userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    eventType:      text("event_type").notNull(),
    // created | upgraded | downgraded | cancelled | reactivated | payment_failed | trial_ended
    fromTier:       text("from_tier"),
    toTier:         text("to_tier"),
    amount:         integer("amount"),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    subscriptionIdx: index("subscription_events_subscription_idx").on(t.subscriptionId),
    userIdx:         index("subscription_events_user_idx").on(t.userId),
  })
);

// ─── Referral system ──────────────────────────────────────────────────────────
export const referralCodes = pgTable(
  "referral_codes",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    code:          text("code").unique().notNull(),
    type:          text("type").notNull().default("user_referral"),  // user_referral | affiliate
    usageCount:    integer("usage_count").notNull().default(0),
    earningsTotal: integer("earnings_total").notNull().default(0),
    isActive:      boolean("is_active").notNull().default(true),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("referral_codes_user_idx").on(t.userId) })
);

export const referrals = pgTable(
  "referrals",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    referralCodeId:  uuid("referral_code_id").notNull().references(() => referralCodes.id, { onDelete: "cascade" }),
    referrerId:      text("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    referredUserId:  text("referred_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status:          text("status").notNull().default("pending"),  // pending | converted | rewarded
    rewardAmount:    integer("reward_amount"),
    convertedAt:     timestamp("converted_at", { withTimezone: true }),
    rewardedAt:      timestamp("rewarded_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    referrerIdx:     index("referrals_referrer_idx").on(t.referrerId),
    referredUserUniq: uniqueIndex("referrals_referred_user_uniq").on(t.referredUserId),
  })
);

// ─── Creator verifications ────────────────────────────────────────────────────
export const verificationTypeEnum   = pgEnum("verification_type",   ["creator","skill","income"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending","approved","rejected","revoked"]);

export const verifications = pgTable(
  "verifications",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:        verificationTypeEnum("type").notNull(),
    status:      verificationStatusEnum("status").notNull().default("pending"),
    evidence:    jsonb("evidence").default({}),   // links, documents, screenshots
    reviewedAt:  timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy:  text("reviewed_by"),             // admin user ID
    notes:       text("notes"),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("verifications_user_idx").on(t.userId) })
);

export type Subscription  = typeof subscriptions.$inferSelect;
export type ReferralCode  = typeof referralCodes.$inferSelect;
export type Verification  = typeof verifications.$inferSelect;
