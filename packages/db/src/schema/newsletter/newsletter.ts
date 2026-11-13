import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";
import { portfolios } from "../portfolios.js";

export const subscriberStatusEnum = pgEnum("subscriber_status", ["pending","subscribed","unsubscribed","bounced","complained"]);
export const campaignStatusEnum   = pgEnum("campaign_status",   ["draft","scheduled","sending","sent","cancelled"]);
export const campaignEventEnum    = pgEnum("campaign_event_type", ["sent","delivered","opened","clicked","bounced","unsubscribed","complained"]);

export const newsletters = pgTable(
  "newsletters",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    portfolioId:     uuid("portfolio_id").references(() => portfolios.id, { onDelete: "set null" }),
    name:            text("name").notNull(),
    description:     text("description"),
    fromName:        text("from_name").notNull(),
    fromEmail:       text("from_email").notNull(),
    replyToEmail:    text("reply_to_email"),
    customDomain:    text("custom_domain"),
    subscriberCount: integer("subscriber_count").notNull().default(0),
    settings:        jsonb("settings").default({}),
    deletedAt:       timestamp("deleted_at", { withTimezone: true }),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:       timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("newsletters_user_idx").on(t.userId) })
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    newsletterId:       uuid("newsletter_id").notNull().references(() => newsletters.id, { onDelete: "cascade" }),
    email:              text("email").notNull(),
    firstName:          text("first_name"),
    lastName:           text("last_name"),
    status:             subscriberStatusEnum("status").notNull().default("pending"),
    subscribedAt:       timestamp("subscribed_at", { withTimezone: true }),
    unsubscribedAt:     timestamp("unsubscribed_at", { withTimezone: true }),
    unsubscribeReason:  text("unsubscribe_reason"),
    referralSource:     text("referral_source"),   // direct | twitter | linkedin | …
    tags:               text("tags").array(),
    customFields:       jsonb("custom_fields").default({}),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    newsletterEmailUniq: uniqueIndex("newsletter_subscribers_nl_email_uniq").on(t.newsletterId, t.email),
    statusIdx:           index("newsletter_subscribers_status_idx").on(t.newsletterId, t.status),
  })
);

export const newsletterCampaigns = pgTable(
  "newsletter_campaigns",
  {
    id:               uuid("id").primaryKey().defaultRandom(),
    newsletterId:     uuid("newsletter_id").notNull().references(() => newsletters.id, { onDelete: "cascade" }),
    subject:          text("subject").notNull(),
    previewText:      text("preview_text"),
    htmlContent:      text("html_content"),
    textContent:      text("text_content"),
    status:           campaignStatusEnum("status").notNull().default("draft"),
    scheduledAt:      timestamp("scheduled_at", { withTimezone: true }),
    sentAt:           timestamp("sent_at", { withTimezone: true }),
    recipientCount:   integer("recipient_count").notNull().default(0),
    sentCount:        integer("sent_count").notNull().default(0),
    openCount:        integer("open_count").notNull().default(0),
    clickCount:       integer("click_count").notNull().default(0),
    unsubscribeCount: integer("unsubscribe_count").notNull().default(0),
    bounceCount:      integer("bounce_count").notNull().default(0),
    createdAt:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:        timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    newsletterIdx: index("newsletter_campaigns_nl_idx").on(t.newsletterId),
    statusIdx:     index("newsletter_campaigns_status_idx").on(t.status),
  })
);

// Per-email event tracking — no soft delete (logs/events)
export const newsletterCampaignEvents = pgTable(
  "newsletter_campaign_events",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    campaignId:    uuid("campaign_id").notNull().references(() => newsletterCampaigns.id, { onDelete: "cascade" }),
    subscriberId:  uuid("subscriber_id").references(() => newsletterSubscribers.id, { onDelete: "set null" }),
    eventType:     campaignEventEnum("event_type").notNull(),
    clickedUrl:    text("clicked_url"),
    occurredAt:    timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    campaignIdx:   index("nl_campaign_events_campaign_idx").on(t.campaignId),
    subscriberIdx: index("nl_campaign_events_subscriber_idx").on(t.subscriberId),
    eventTypeIdx:  index("nl_campaign_events_type_idx").on(t.campaignId, t.eventType),
  })
);

export type Newsletter         = typeof newsletters.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
