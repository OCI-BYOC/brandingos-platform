import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios.js";

/**
 * Portfolio Sections — the building blocks of a portfolio page.
 * RLS: tied to portfolio ownership.
 *
 * Section types:
 *   hero          → Name, title, tagline, avatar, CTA buttons
 *   about         → Bio text, photo
 *   skills        → Skill tags with optional proficiency levels
 *   work          → Work experience (from LinkedIn or manual)
 *   education     → Education history
 *   projects      → Projects (from GitHub or manual)
 *   integrations  → GitHub activity, LinkedIn highlights
 *   testimonials  → Quotes from colleagues/clients
 *   newsletter    → Email signup widget
 *   contact       → Contact form or links
 *   custom        → Freeform HTML/Markdown block (Growth/Brand tier)
 */
export const portfolioSections = pgTable("portfolio_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),

  // Section type (determines which React component renders it)
  type: text("type").notNull(),

  // Display title (optional — some sections have no visible heading)
  title: text("title"),

  // Position in the page (1-based, user can reorder)
  order: integer("order").notNull().default(0),

  // The actual content — schema varies by type, stored as JSON
  // We use JSON here because each section type has a different shape.
  // The TypeScript types in packages/types enforce the shape at app layer.
  content: jsonb("content").notNull().default({}),

  // Visibility — users can hide a section without deleting it
  isVisible: boolean("is_visible").notNull().default(true),

  // Soft delete
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PortfolioSection = typeof portfolioSections.$inferSelect;
export type NewPortfolioSection = typeof portfolioSections.$inferInsert;
