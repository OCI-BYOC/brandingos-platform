import { model } from "@medusajs/framework/utils"

const Seller = model.define("seller", {
  id: model.id().primaryKey(),

  // Identity
  name: model.text(),
  slug: model.text().unique(),
  bio: model.text().nullable(),
  logo_url: model.text().nullable(),
  banner_url: model.text().nullable(),

  // Auth — Clerk user ID
  clerk_user_id: model.text().unique(),

  // Store branding
  store_name: model.text().nullable(),
  store_tagline: model.text().nullable(),
  store_theme: model.text().default("clean"),
  accent_color: model.text().default("#0891b2"),
  store_type: model.text().nullable(),

  // Niche & audience (comma-separated for lightweight storage)
  categories: model.text().nullable(),
  audience: model.text().nullable(),

  // Commerce config
  currency_code: model.text().default("inr"),
  pricing_model: model.text().default("one-time"),

  // Fulfillment preference
  // Options: manual | shiprocket | easyship | seller-courier
  fulfillment_provider: model.text().default("manual"),
  custom_courier_name: model.text().nullable(),
  custom_courier_webhook_url: model.text().nullable(),

  // Payment preference
  // Options: razorpay | stripe | paypal
  payment_provider: model.text().default("razorpay"),
  payout_account_id: model.text().nullable(),

  // Medusa linkage — each seller gets their own Sales Channel
  medusa_sales_channel_id: model.text().nullable(),

  // Status
  is_active: model.boolean().default(false),
  store_launched_at: model.dateTime().nullable(),

  metadata: model.json().nullable(),
})

export default Seller
