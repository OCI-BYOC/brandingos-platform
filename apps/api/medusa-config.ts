import { defineConfig, Modules } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    // Shared Neon DB — direct endpoint (no pooler) so SSL and all params are accepted.
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    // Disable built-in admin — we'll build a custom dashboard in apps/web
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.BACKEND_URL || "http://localhost:9000",
  },
  modules: [
    // ── Payment Providers ────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Razorpay — primary for India (UPI, cards, wallets, net banking)
          {
            resolve: "./src/providers/payment/razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
              webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
            },
          },
          // Stripe — international (cards, Apple Pay, Google Pay, SEPA)
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
        ],
      },
    },

    // ── Fulfillment Providers ────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          // Manual — seller marks orders as shipped themselves (default for everyone)
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
          // ShipRocket — 25+ courier partners, India-first (domestic + international)
          {
            resolve: "./src/providers/fulfillment/shiprocket",
            id: "shiprocket",
            options: {
              email: process.env.SHIPROCKET_EMAIL,
              password: process.env.SHIPROCKET_PASSWORD,
            },
          },
          // EasyShip — 550+ couriers globally, great for cross-border
          {
            resolve: "./src/providers/fulfillment/easyship",
            id: "easyship",
            options: {
              api_key: process.env.EASYSHIP_API_KEY,
              account_id: process.env.EASYSHIP_ACCOUNT_ID,
            },
          },
          // Seller Courier (BYOC) — seller's own courier via webhook
          {
            resolve: "./src/providers/fulfillment/seller-courier",
            id: "seller-courier",
            options: {},
          },
        ],
      },
    },

    // ── File Storage — digital product downloads ─────────────────────────────
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "uploads",
              backend_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/uploads`,
            },
          },
        ],
      },
    },

    // ── Notifications — order confirmations, shipping updates ────────────────
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {},
          },
        ],
      },
    },

    // ── Seller Module — multi-tenancy for BrandingOS creators ────────────────
    {
      resolve: "./src/modules/seller",
    },
  ],
})
