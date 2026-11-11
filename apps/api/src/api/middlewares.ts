import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Protect the custom creator admin routes — requires Clerk JWT passed as Bearer
    {
      matcher: "/store/creators/*/admin",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
  ],
})
