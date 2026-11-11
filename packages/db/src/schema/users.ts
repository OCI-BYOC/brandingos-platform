import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";

export const tierEnum = pgEnum("tier", ["free", "pro", "growth", "brand"]);

export const users = pgTable("users", {
  id:                    text("id").primaryKey(),
  username:              text("username").unique().notNull(),
  email:                 text("email").unique().notNull(),
  fullName:              text("full_name").notNull(),
  avatarUrl:             text("avatar_url"),
  tier:                  tierEnum("tier").notNull().default("free"),
  stripeCustomerId:      text("stripe_customer_id").unique(),
  razorpayCustomerId:    text("razorpay_customer_id").unique(),
  billingCycleStart:     timestamp("billing_cycle_start", { withTimezone: true }),
  aiCreditsRemaining:    integer("ai_credits_remaining").notNull().default(50),
  aiCreditsMonthlyAlloc: integer("ai_credits_monthly_alloc").notNull().default(50),
  isVerified:            boolean("is_verified").notNull().default(false),
  verifiedAt:            timestamp("verified_at", { withTimezone: true }),
  deletedAt:             timestamp("deleted_at", { withTimezone: true }),
  createdAt:             timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:             timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userPreferences = pgTable(
  "user_preferences",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    key:       text("key").notNull(),
    value:     jsonb("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userKeyUniq: uniqueIndex("user_preferences_user_key_uniq").on(t.userId, t.key),
    userIdx:     index("user_preferences_user_idx").on(t.userId),
  })
);

export type User             = typeof users.$inferSelect;
export type NewUser          = typeof users.$inferInsert;
export type UserPreference   = typeof userPreferences.$inferSelect;
