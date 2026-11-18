import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../modules/seller"
import SellerModuleService from "../../../modules/seller/service"

/**
 * GET /store/sellers?clerk_user_id=xxx
 * Returns the seller record for a given Clerk user ID.
 * Called server-side from the web app BFF to check if a user has an active store.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { clerk_user_id } = req.query

  if (!clerk_user_id) {
    return res.status(400).json({ message: "clerk_user_id query param required" })
  }

  const sellerService = req.scope.resolve<SellerModuleService>(SELLER_MODULE)
  const sellers = await sellerService.listSellers({
    clerk_user_id: clerk_user_id as string,
  })

  if (!sellers.length) {
    return res.json({ seller: null })
  }

  const s = sellers[0]
  return res.json({
    seller: {
      id: s.id,
      slug: s.slug,
      name: s.name,
      store_name: s.store_name ?? s.name,
      store_tagline: s.store_tagline,
      store_theme: s.store_theme,
      accent_color: s.accent_color,
      is_active: s.is_active,
      store_launched_at: s.store_launched_at,
      medusa_sales_channel_id: s.medusa_sales_channel_id,
      currency_code: s.currency_code,
    },
  })
}

/**
 * POST /store/sellers
 * Provisions a new seller + Medusa Sales Channel for the given Clerk user.
 * Called from the web app's BFF after Clerk session validation.
 * Idempotent — returns existing record if already provisioned.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as {
    clerk_user_id?: string
    store_name?: string
    slug?: string
    sell_category?: string
    niche?: string
    audience_description?: string
    audience_age?: string
    audience_goal?: string
    pricing_model?: string
    primary_currency?: string
    theme_style?: string
    theme_color?: string
    payment_provider?: string
  }

  const { clerk_user_id, store_name } = body

  if (!clerk_user_id || !store_name) {
    return res.status(400).json({ message: "clerk_user_id and store_name are required" })
  }

  const sellerService = req.scope.resolve<SellerModuleService>(SELLER_MODULE)

  // Idempotency — return existing seller if already provisioned
  const existing = await sellerService.listSellers({ clerk_user_id })
  if (existing.length) {
    return res.json({ seller: existing[0], already_exists: true })
  }

  // Build a unique slug from the store name
  const baseSlug = (body.slug || store_name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  const slugTaken = await sellerService.listSellers({ slug: baseSlug })
  const finalSlug = slugTaken.length ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug

  // Create a Medusa Sales Channel — each seller gets their own
  const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
  const salesChannels = await salesChannelService.createSalesChannels([
    {
      name: `${store_name} — Store`,
      description: `Sales channel for ${store_name}`,
      is_disabled: false,
    },
  ])
  const salesChannel = Array.isArray(salesChannels) ? salesChannels[0] : salesChannels

  // Derive currency from primary_currency label ("INR ₹" → "inr")
  const currencyCode =
    body.primary_currency?.split(" ")[0]?.toLowerCase() ?? "inr"

  // Store audience info as a lightweight string
  const audience = [body.audience_age, body.audience_goal].filter(Boolean).join("; ") || null

  const seller = await sellerService.createSellers({
    clerk_user_id,
    name: store_name,
    slug: finalSlug,
    store_name,
    store_theme: body.theme_style ?? "clean",
    accent_color: body.theme_color ?? "#0891b2",
    store_type: body.sell_category ?? null,
    categories: body.niche ?? null,
    audience,
    pricing_model: body.pricing_model ?? "one-time",
    currency_code: currencyCode,
    payment_provider: body.payment_provider ?? "razorpay",
    medusa_sales_channel_id: salesChannel.id,
    is_active: true,
    store_launched_at: new Date(),
  })

  return res.status(201).json({ seller })
}
