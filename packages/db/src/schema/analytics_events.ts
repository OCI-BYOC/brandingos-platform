import {
  pgTable, text, timestamp, uuid, integer, boolean, jsonb, index
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { portfolios } from "./portfolios";

// ─── Portfolio view + engagement events (no soft delete — raw analytics log) ──
// Partitioned by month in production via Postgres table inheritance.
// Retained for 90 days on Free, 2 years on Pro+.
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
    userId:      text("user_id").references(() => users.id, { onDelete: "set null" }), // portfolio owner
    eventType:   text("event_type").notNull(),
    // page_view | section_view | link_click | contact_click | social_click |
    // resume_download | newsletter_subscribe | booking_created | product_view | course_view
    path:        text("path"),
    referrer:    text("referrer"),
    country:     text("country"),          // ISO 3166-1 alpha-2, from Cloudflare header
    city:        text("city"),
    device:      text("device"),           // desktop | mobile | tablet
    browser:     text("browser"),
    os:          text("os"),
    isUnique:    boolean("is_unique").notNull().default(false),
    sessionId:   text("session_id"),       // anonymous session fingerprint
    data:        jsonb("data").default({}), // extra context (clicked link, section name etc.)
    occurredAt:  timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    portfolioIdx:  index("analytics_events_portfolio_idx").on(t.portfolioId),
    typeIdx:       index("analytics_events_type_idx").on(t.portfolioId, t.eventType),
    occurredIdx:   index("analytics_events_occurred_idx").on(t.portfolioId, t.occurredAt),
    countryIdx:    index("analytics_events_country_idx").on(t.portfolioId, t.country),
  })
);

export type AnalyticsEvent    = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
