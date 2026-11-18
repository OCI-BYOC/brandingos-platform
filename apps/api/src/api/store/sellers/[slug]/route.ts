import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../modules/seller"
import SellerModuleService from "../../../../modules/seller/service"

const PRODUCT_FIELDS = [
  "id",
  "title",
  "description",
  "thumbnail",
  "status",
  "handle",
  "type.*",
  "categories.*",
  "tags.*",
  "options.*",
  "options.values.*",
  "variants.*",
  "variants.prices.*",
  "metadata",
]

/**
 * GET /store/sellers/:slug
 * Public endpoint — returns seller profile + their published products.
 *
 * Product resolution strategy (in order):
 *  1. If the seller has a medusa_sales_channel_id, query through that
 *     Sales Channel (proper many-to-many Medusa linkage).
 *  2. Fall back to metadata.seller_slug for sellers provisioned before
 *     the Sales Channel feature shipped.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params

  const sellerService = req.scope.resolve<SellerModuleService>(SELLER_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const sellers = await sellerService.listSellers({ slug })
  if (!sellers.length) {
    return res.status(404).json({ message: `Store '${slug}' not found` })
  }

  const seller = sellers[0]

  if (!seller.is_active) {
    return res.status(404).json({ message: "This store is not yet active" })
  }

  let products: Record<string, unknown>[] = []

  if (seller.medusa_sales_channel_id) {
    // Primary path: traverse Sales Channel → Products (real Medusa linkage)
    const { data: channels } = await query.graph({
      entity: "sales_channel",
      fields: PRODUCT_FIELDS.map((f) => `products.${f}`).concat(["id"]),
      filters: { id: seller.medusa_sales_channel_id },
    })

    const channelProducts = (channels[0]?.products ?? []) as Record<string, unknown>[]
    products = channelProducts.filter((p) => p.status === "published")
  } else {
    // Fallback: metadata tag for sellers without a Sales Channel
    const { data: metaProducts } = await query.graph({
      entity: "product",
      fields: PRODUCT_FIELDS,
      filters: {
        metadata: { seller_slug: slug },
        status: "published",
      },
    })
    products = metaProducts as Record<string, unknown>[]
  }

  const page = parseInt(req.query.page as string) || 1
  const limit = Math.min(parseInt(req.query.limit as string) || 24, 100)
  const offset = (page - 1) * limit
  const paginated = products.slice(offset, offset + limit)

  res.json({
    seller: {
      id: seller.id,
      name: seller.name,
      slug: seller.slug,
      bio: seller.bio,
      logo_url: seller.logo_url,
      banner_url: seller.banner_url,
      store_name: seller.store_name ?? seller.name,
      store_tagline: seller.store_tagline,
      store_theme: seller.store_theme,
      accent_color: seller.accent_color,
      store_type: seller.store_type,
      currency_code: seller.currency_code,
      medusa_sales_channel_id: seller.medusa_sales_channel_id,
      store_launched_at: seller.store_launched_at,
    },
    products: paginated,
    pagination: {
      page,
      limit,
      total: products.length,
      pages: Math.ceil(products.length / limit),
    },
  })
}
