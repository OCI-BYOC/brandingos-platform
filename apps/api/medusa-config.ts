import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    // Shared Neon DB — Medusa gets its own schema (public) while BrandingOS
    // platform uses the app schema. Set search_path=public in the URL if needed.
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
    // File storage for digital product downloads
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
    // Notification for order confirmations (sendgrid placeholder)
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
  ],
})
