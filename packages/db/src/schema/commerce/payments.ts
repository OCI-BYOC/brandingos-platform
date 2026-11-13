import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, numeric, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { products } from "./products";
import { orders } from "./orders";
import { portfolios } from "../portfolios";

export const reviewStatusEnum  = pgEnum("review_status",  ["pending","approved","hidden"]);

export const productReviews = pgTable(
  "product_reviews",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    productId:          uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    orderId:            uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    reviewerId:         text("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    rating:             integer("rating").notNull(),   // 1–5
    title:              text("title"),
    body:               text("body"),
    isVerifiedPurchase: boolean("is_verified_purchase").notNull().default(false),
    status:             reviewStatusEnum("status").notNull().default("pending"),
    deletedAt:          timestamp("deleted_at", { withTimezone: true }),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    productIdx:   index("product_reviews_product_idx").on(t.productId),
    reviewerIdx:  index("product_reviews_reviewer_idx").on(t.reviewerId),
    statusIdx:    index("product_reviews_status_idx").on(t.productId, t.status),
  })
);

export const testimonials = pgTable(
  "testimonials",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    portfolioId:        uuid("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
    clientName:         text("client_name").notNull(),
    clientTitle:        text("client_title"),
    clientCompany:      text("client_company"),
    clientAvatarUrl:    text("client_avatar_url"),
    body:               text("body").notNull(),
    rating:             integer("rating"),   // 1–5, optional
    verificationEmail:  text("verification_email"),
    verificationToken:  text("verification_token"),
    verifiedAt:         timestamp("verified_at", { withTimezone: true }),
    isPublic:           boolean("is_public").notNull().default(false),
    order:              integer("order").notNull().default(0),
    deletedAt:          timestamp("deleted_at", { withTimezone: true }),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ portfolioIdx: index("testimonials_portfolio_idx").on(t.portfolioId) })
);

export const payoutAccounts = pgTable(
  "payout_accounts",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:          text("provider").notNull(),   // razorpay | stripe
    providerAccountId: text("provider_account_id").notNull(),
    accountType:       text("account_type"),         // bank_account | upi
    accountDetails:    text("account_details"),      // AES-256 encrypted JSON
    isDefault:         boolean("is_default").notNull().default(false),
    isVerified:        boolean("is_verified").notNull().default(false),
    verifiedAt:        timestamp("verified_at", { withTimezone: true }),
    deletedAt:         timestamp("deleted_at", { withTimezone: true }),
    createdAt:         timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("payout_accounts_user_idx").on(t.userId) })
);

export const payouts = pgTable(
  "payouts",
  {
    id:              uuid("id").primaryKey().defaultRandom(),
    userId:          text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider:        text("provider").notNull(),
    providerPayoutId: text("provider_payout_id"),
    amount:          integer("amount").notNull(),
    currency:        text("currency").notNull(),
    status:          text("status").notNull().default("pending"),
    initiatedAt:     timestamp("initiated_at", { withTimezone: true }),
    completedAt:     timestamp("completed_at", { withTimezone: true }),
    failureReason:   text("failure_reason"),
    createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("payouts_user_idx").on(t.userId) })
);

export type ProductReview = typeof productReviews.$inferSelect;
export type Testimonial   = typeof testimonials.$inferSelect;
export type Payout        = typeof payouts.$inferSelect;
