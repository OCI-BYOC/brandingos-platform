import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { SELLER_MODULE } from "../../../../modules/seller"
import SellerModuleService from "../../../../modules/seller/service"

/**
 * GET /store/sellers/:slug
 * Public endpoint — returns seller profile + their published products.
 * Powers both alex.brandingos.in storefronts and marketplace cards.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params

  const sellerService = req.scope.resolve<SellerModuleService>(SELLER_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Look up seller by slug
  const sellers = await sellerService.listSellers({ slug })
  if (!sellers.length) {
    return res.status(404).json({ message: `Store '${slug}' not found` })
  }

  const seller = sellers[0]

  if (!seller.is_active) {
    return res.status(404).json({ message: "This store is not yet active" })
  }

  // Fetch published products tagged to this seller (via metadata)
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
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
    ],
    filters: {
      metadata: { seller_slug: slug },
      status: "published",
    },
  })

  // Pagination support
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
