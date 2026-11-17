import {
  pgTable, pgEnum, text, boolean, timestamp, uuid, jsonb, integer, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const themeEnum = pgEnum("portfolio_theme", ["minimal", "modern", "creative"]);

export const portfolios = pgTable(
  "portfolios",
  {
    id:             uuid("id").primaryKey().defaultRandom(),
    userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    slug:           text("slug").unique().notNull(),
    title:          text("title"),
    tagline:        text("tagline"),
    bio:            text("bio"),
    location:       text("location"),
    avatarUrl:      text("avatar_url"),
    coverUrl:       text("cover_url"),
    theme:          themeEnum("theme").notNull().default("minimal"),
    customCss:      text("custom_css"),
    isPublished:    boolean("is_published").notNull().default(false),
    isPrimary:      boolean("is_primary").notNull().default(false),
    publishedAt:    timestamp("published_at", { withTimezone: true }),
    metaTitle:      text("meta_title"),
    metaDescription: text("meta_description"),
    ogImageUrl:     text("og_image_url"),
    settings:       jsonb("settings").default({}),
    deletedAt:      timestamp("deleted_at", { withTimezone: true }),
    createdAt:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:   index("portfolios_user_idx").on(t.userId),
    slugIdx:   index("portfolios_slug_idx").on(t.slug),
    userSlug:  uniqueIndex("portfolios_user_slug_uniq").on(t.userId, t.slug),
  })
);

export const portfolioSectionTypeEnum = pgEnum("portfolio_section_type", [
  "hero", "about", "skills", "work", "education", "projects",
  "integrations", "testimonials", "newsletter", "booking", "contact", "custom",
]);

export const portfolioSections = pgTable(
  "portfolio_sections",
  {
    id:          uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
    type:        portfolioSectionTypeEnum("type").notNull(),
    title:       text("title"),
    order:       integer("order").notNull().default(0),
    content:     jsonb("content").notNull().default({}),
    isVisible:   boolean("is_visible").notNull().default(true),
    deletedAt:   timestamp("deleted_at", { withTimezone: true }),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    portfolioIdx: index("portfolio_sections_portfolio_idx").on(t.portfolioId),
    orderIdx:     index("portfolio_sections_order_idx").on(t.portfolioId, t.order),
  })
);

export type Portfolio        = typeof portfolios.$inferSelect;
export type NewPortfolio     = typeof portfolios.$inferInsert;
export type PortfolioSection = typeof portfolioSections.$inferSelect;
