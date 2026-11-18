import { defineMiddlewares, authenticate } from "@medusajs/framework/http"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework"

// Lightweight guard for internal server-to-server calls:
// the Next.js BFF passes the MEDUSA_SERVICE_KEY header, which we validate here.
// This prevents direct external calls to provisioning endpoints.
function requireServiceKey(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const key = process.env.MEDUSA_SERVICE_KEY
  if (!key) return next() // If no key configured, skip guard (dev default)
  if (req.headers["x-service-key"] === key) return next()
  res.status(401).json({ message: "Unauthorized" })
}

export default defineMiddlewares({
  routes: [
    // Protect the custom creator admin routes — requires Clerk JWT passed as Bearer
    {
      matcher: "/store/creators/*/admin",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    // Protect seller provisioning — only internal server-to-server calls allowed
    {
      matcher: "/store/sellers",
      method: ["POST"],
      middlewares: [requireServiceKey],
    },
  ],
})
