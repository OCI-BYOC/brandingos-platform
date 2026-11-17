import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users.js";
import { portfolios } from "../portfolios.js";
import { products, productVariants } from "./products.js";

export const orderStatusEnum   = pgEnum("order_status",   ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["razorpay","stripe","cod"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending","authorized","captured","failed","refunded"]);
export const refundStatusEnum  = pgEnum("refund_status",  ["pending","approved","rejected","processed"]);

export const shippingAddresses = pgTable(
  "shipping_addresses",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name:       text("name").notNull(),
    line1:      text("line1").notNull(),
    line2:      text("line2"),
    city:       text("city").notNull(),
    state:      text("state").notNull(),
    postalCode: text("postal_code").notNull(),
    country:    text("country").notNull().default("IN"),
    phone:      text("phone"),
    isDefault:  boolean("is_default").notNull().default(false),
    deletedAt:  timestamp("deleted_at", { withTimezone: true }),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("shipping_addresses_user_idx").on(t.userId) })
);

export const orders = pgTable(
  "orders",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    orderNumber:       text("order_number").unique().notNull(),   // BOS-20261110-XXXX
    buyerId:           text("buyer_id").references(() => users.id, { onDelete: "set null" }),
    buyerEmail:        text("buyer_email").notNull(),
    buyerName:         text("buyer_name").notNull(),
    sellerId:          text("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    portfolioId:       uuid("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
    status:            orderStatusEnum("status").notNull().default("pending"),
    subtotalAmount:    integer("subtotal_amount").notNull(),
    discountAmount:    integer("discount_amount").notNull().default(0),
    shippingAmount:    integer("shipping_amount").notNull().default(0),
    taxAmount:         integer("tax_amount").notNull().default(0),
    totalAmount:       integer("total_amount").notNull(),
    currency:          text("currency").notNull().default("INR"),
    couponCode:        text("coupon_code"),
    notes:             text("notes"),
    shippingAddressId: uuid("shipping_address_id").references(() => shippingAddresses.id),
    paymentMethod:     paymentMethodEnum("payment_method"),
    deletedAt:         timestamp("deleted_at", { withTimezone: true }),
    createdAt:         timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:         timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sellerIdx:  index("orders_seller_idx").on(t.sellerId),
    buyerIdx:   index("orders_buyer_idx").on(t.buyerId),
    statusIdx:  index("orders_status_idx").on(t.status),
    createdIdx: index("orders_created_idx").on(t.createdAt),
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    orderId:   uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    courseId:  uuid("course_id"),   // FK → courses.id — added after courses table
    title:     text("title").notNull(),   // snapshot at purchase time
    price:     integer("price").notNull(),
    quantity:  integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ orderIdx: index("order_items_order_idx").on(t.orderId) })
);

export const orderShipments = pgTable(
  "order_shipments",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    orderId:           uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    carrier:           text("carrier"),   // shiprocket, easypost, delhivery
    trackingNumber:    text("tracking_number"),
    trackingUrl:       text("tracking_url"),
    status:            text("status"),
    estimatedDelivery: timestamp("estimated_delivery", { withTimezone: true }),
    shippedAt:         timestamp("shipped_at", { withTimezone: true }),
    deliveredAt:       timestamp("delivered_at", { withTimezone: true }),
    createdAt:         timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:         timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ orderIdx: index("order_shipments_order_idx").on(t.orderId) })
);

export const paymentTransactions = pgTable(
  "payment_transactions",
  {
    id:                 uuid("id").primaryKey().defaultRandom(),
    orderId:            uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    provider:           text("provider").notNull(),  // razorpay | stripe
    providerPaymentId:  text("provider_payment_id").unique().notNull(),
    providerCaptureId:  text("provider_capture_id"),
    amount:             integer("amount").notNull(),
    currency:           text("currency").notNull(),
    status:             paymentStatusEnum("status").notNull().default("pending"),
    platformFeeAmount:  integer("platform_fee_amount").notNull().default(0),
    sellerAmount:       integer("seller_amount").notNull(),
    metadata:           jsonb("metadata").default({}),
    createdAt:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:          timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ orderIdx: index("payment_transactions_order_idx").on(t.orderId) })
);

export const refunds = pgTable(
  "refunds",
  {
    id:                   uuid("id").primaryKey().defaultRandom(),
    orderId:              uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    paymentTransactionId: uuid("payment_transaction_id").references(() => paymentTransactions.id),
    amount:               integer("amount").notNull(),
    reason:               text("reason"),
    status:               refundStatusEnum("status").notNull().default("pending"),
    processedAt:          timestamp("processed_at", { withTimezone: true }),
    createdAt:            timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ orderIdx: index("refunds_order_idx").on(t.orderId) })
);

export type Order              = typeof orders.$inferSelect;
export type OrderItem          = typeof orderItems.$inferSelect;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type Refund             = typeof refunds.$inferSelect;
