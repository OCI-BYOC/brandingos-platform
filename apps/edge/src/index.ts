import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://brandingos.com",
      "https://*.brandingos.com",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

// Health check
app.get("/health", (c) =>
  c.json({ status: "ok", service: "brandingos-edge", ts: Date.now() })
)

// tRPC router — wired up in issue #215
// import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
// import { appRouter } from "./trpc/router"
// app.all("/trpc/*", (c) =>
//   fetchRequestHandler({ endpoint: "/trpc", req: c.req.raw, router: appRouter, createContext: () => ({}) })
// )

export default app
