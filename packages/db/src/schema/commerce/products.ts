import {
  pgTable, pgEnum, text, integer, boolean, timestamp, uuid, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";
import { users } from "../users";
import { portfolios } from "../portfolios";

export const productTypeEnum   = pgEnum("product_type",   ["digital", "physical", "printful"]);
export const productStatusEnum = pgEnum("product_status", ["draft", "active", "archived"]);

export const products = pgTable(
  "products",
  {
    id:                uuid("id").primaryKey().defaultRandom(),
    userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    portfolioId:       uuid("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
    type:              productTypeEnum("type").notNull(),
    title:             text("title").notNull(),
    description:       text("description"),
    price:             integer("price").notNull(),       // cents / paise
    currency:          text("currency").notNull().default("INR"),
    compareAtPrice:    integer("compare_at_price"),
    status:            productStatusEnum("status").notNull().default("draft"),
    isOnMarketplace:   boolean("is_on_marketplace").notNull().default(false),
    stockQuantity:     integer("stock_quantity"),        // null = unlimited (digital)
    lowStockThreshold: integer("low_stock_threshold"),
    coverImageUrl:     text("cover_image_url"),
    imageUrls:         text("image_urls").array(),
    tags:              text("tags").array(),
    weight:            integer("weight"),                // grams, physical only
    dimensions:        jsonb("dimensions"),              // {length, width, height} cm
    shippingRequired:  boolean("shipping_required").notNull().default(false),
    printfulProductId: text("printful_product_id"),
    seoTitle:          text("seo_title"),
    seoDescription:    text("seo_description"),
    deletedAt:         timestamp("deleted_at", { withTimezone: true }),
    createdAt:         timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:         timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:        index("products_user_idx").on(t.userId),
    portfolioIdx:   index("products_portfolio_idx").on(t.portfolioId),
    statusIdx:      index("products_status_idx").on(t.status),
    marketplaceIdx: index("products_marketplace_idx").on(t.isOnMarketplace, t.status),
  })
);

// Attribute definitions per product — fully flexible (size, colour, material, finish…)
export const productAttributeDefinitions = pgTable(
  "product_attribute_definitions",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    name:      text("name").notNull(),   // "Size", "Colour", "Material"
    values:    text("values").array().notNull(),  // ["S","M","L","XL"]
    position:  integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ productIdx: index("prod_attr_defs_product_idx").on(t.productId) })
);

// Each variant is a combination of attribute values
export const productVariants = pgTable(
  "product_variants",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    productId:     uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    sku:           text("sku").unique(),
    price:         integer("price"),           // overrides product price if set
    compareAtPrice: integer("compare_at_price"),
    stockQuantity: integer("stock_quantity"),
    attributes:    jsonb("attributes").notNull().default({}), // {size:"M", colour:"Red"}
    imageUrl:      text("image_url"),
    isDefault:     boolean("is_default").notNull().default(false),
    deletedAt:     timestamp("deleted_at", { withTimezone: true }),
    createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:     timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ productIdx: index("product_variants_product_idx").on(t.productId) })
);

// Files attached to digital products
export const digitalProductFiles = pgTable(
  "digital_product_files",
  {
    id:        uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    name:      text("name").notNull(),
    r2Key:     text("r2_key").notNull(),
    sizeBytes: integer("size_bytes"),
    mimeType:  text("mime_type"),
    version:   integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ productIdx: index("digital_files_product_idx").on(t.productId) })
);

export type Product                    = typeof products.$inferSelect;
export type NewProduct                 = typeof products.$inferInsert;
export type ProductVariant             = typeof productVariants.$inferSelect;
export type ProductAttributeDefinition = typeof productAttributeDefinitions.$inferSelect;
