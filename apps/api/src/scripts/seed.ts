import {
  ExecArgs,
  IRegionModuleService,
  IProductModuleService,
  IFulfillmentModuleService,
  ITaxModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("🌱 Seeding BrandingOS Medusa store...")

  // ── Resolve core modules ──────────────────────────────────────────────────
  const regionModule = container.resolve<IRegionModuleService>(Modules.REGION)
  const productModule = container.resolve<IProductModuleService>(Modules.PRODUCT)
  const fulfillmentModule = container.resolve<IFulfillmentModuleService>(Modules.FULFILLMENT)
  const taxModule = container.resolve<ITaxModuleService>(Modules.TAX)
  const salesChannelModule = container.resolve<ISalesChannelModuleService>(Modules.SALES_CHANNEL)
  const storeModule = container.resolve<IStoreModuleService>(Modules.STORE)

  // ── 1. Regions ────────────────────────────────────────────────────────────
  logger.info("Creating regions...")

  const existingRegions = await regionModule.listRegions({})
  if (existingRegions.length === 0) {
    const [indiaRegion, globalRegion, europeRegion] = await regionModule.createRegions([
      {
        name: "India",
        currency_code: "inr",
        countries: ["in"],
      },
      {
        name: "Global (USD)",
        currency_code: "usd",
        countries: ["us", "ca", "au", "nz", "sg", "ae", "gb", "jp", "kr", "br", "mx", "za", "ng"],
      },
      {
        name: "Europe (EUR)",
        currency_code: "eur",
        countries: ["de", "fr", "it", "es", "nl", "be", "at", "se", "no", "dk", "fi", "pl", "pt"],
      },
    ])

    logger.info(`Created regions: ${indiaRegion.id}, ${globalRegion.id}, ${europeRegion.id}`)
  } else {
    logger.info("Regions already exist, skipping...")
  }

  // ── 2. Sales Channels ─────────────────────────────────────────────────────
  logger.info("Creating sales channels...")

  const existingChannels = await salesChannelModule.listSalesChannels({})
  let marketplaceChannelId: string | undefined

  if (existingChannels.length === 0) {
    const [marketplace] = await salesChannelModule.createSalesChannels([
      {
        name: "BrandingOS Marketplace",
        description: "Central marketplace — all published creator products",
        is_disabled: false,
      },
    ])
    marketplaceChannelId = marketplace.id
    logger.info(`Created marketplace channel: ${marketplace.id}`)

    // Link to default store
    const stores = await storeModule.listStores({})
    const defaultStore = stores[0]
    if (defaultStore) {
      await storeModule.updateStores(defaultStore.id, {
        default_sales_channel_id: marketplace.id,
      })
    }
  } else {
    marketplaceChannelId = existingChannels[0].id
    logger.info("Sales channels already exist, skipping...")
  }

  // ── 3. Shipping Profiles ──────────────────────────────────────────────────
  logger.info("Creating shipping profiles...")

  const existingProfiles = await fulfillmentModule.listShippingProfiles({})

  let digitalProfileId: string | undefined
  let physicalProfileId: string | undefined

  if (existingProfiles.length === 0) {
    const profiles = await fulfillmentModule.createShippingProfiles([
      { name: "Digital Products", type: "digital" as const },
      { name: "Physical Standard", type: "default" as const },
    ])
    digitalProfileId = profiles[0].id
    physicalProfileId = profiles[1].id
    logger.info(`Created shipping profiles: digital=${digitalProfileId}, physical=${physicalProfileId}`)
  } else {
    digitalProfileId = existingProfiles.find((p) => p.type === "digital")?.id ?? existingProfiles[0].id
    physicalProfileId = existingProfiles.find((p) => p.type === "default")?.id ?? existingProfiles[0].id
    logger.info("Shipping profiles already exist, skipping...")
  }

  // ── 4. Fulfillment Sets + Service Zones + Shipping Options ───────────────
  logger.info("Creating fulfillment sets and shipping options...")

  const existingSets = await fulfillmentModule.listFulfillmentSets({})

  if (existingSets.length === 0 && digitalProfileId && physicalProfileId) {
    const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "BrandingOS Shipping",
      type: "shipping",
    })

    // ── India zone
    const indiaServiceZone = await fulfillmentModule.createServiceZones({
      name: "India",
      fulfillment_set_id: fulfillmentSet.id,
      geo_zones: [{ type: "country" as const, country_code: "in" }],
    })

    // ── Global zone
    const globalServiceZone = await fulfillmentModule.createServiceZones({
      name: "Global",
      fulfillment_set_id: fulfillmentSet.id,
      geo_zones: [
        { type: "country" as const, country_code: "us" },
        { type: "country" as const, country_code: "ca" },
        { type: "country" as const, country_code: "gb" },
        { type: "country" as const, country_code: "au" },
        { type: "country" as const, country_code: "sg" },
        { type: "country" as const, country_code: "ae" },
        { type: "country" as const, country_code: "de" },
        { type: "country" as const, country_code: "fr" },
        { type: "country" as const, country_code: "nl" },
      ],
    })

    logger.info(`Created service zones: india=${indiaServiceZone.id}, global=${globalServiceZone.id}`)

    // ── Shipping Options — India
    // Note: Prices are set separately via the price module after creation.
    // Use Medusa Admin or createShippingOptionsPriceSetsWorkflow to associate prices.
    await fulfillmentModule.createShippingOptions([
      {
        name: "Instant Digital Delivery",
        price_type: "flat" as const,
        service_zone_id: indiaServiceZone.id,
        shipping_profile_id: digitalProfileId,
        provider_id: "manual_manual",
        type: { label: "Digital", description: "Download after payment", code: "instant" },
        rules: [],
      },
      {
        name: "Standard (5–7 days)",
        price_type: "flat" as const,
        service_zone_id: indiaServiceZone.id,
        shipping_profile_id: physicalProfileId,
        provider_id: "shiprocket_shiprocket",
        type: { label: "Standard", description: "5–7 business days", code: "standard" },
        rules: [],
      },
      {
        name: "Express (2–3 days)",
        price_type: "flat" as const,
        service_zone_id: indiaServiceZone.id,
        shipping_profile_id: physicalProfileId,
        provider_id: "shiprocket_shiprocket",
        type: { label: "Express", description: "2–3 business days", code: "express" },
        rules: [],
      },
      {
        name: "Same-Day Delivery",
        price_type: "flat" as const,
        service_zone_id: indiaServiceZone.id,
        shipping_profile_id: physicalProfileId,
        provider_id: "shiprocket_shiprocket",
        type: { label: "Same Day", description: "Order before 12pm, delivered by 9pm", code: "same_day" },
        rules: [],
      },
    ])

    // ── Shipping Options — Global
    await fulfillmentModule.createShippingOptions([
      {
        name: "Instant Digital Delivery (Global)",
        price_type: "flat" as const,
        service_zone_id: globalServiceZone.id,
        shipping_profile_id: digitalProfileId,
        provider_id: "manual_manual",
        type: { label: "Digital", description: "Download after payment", code: "instant" },
        rules: [],
      },
      {
        name: "International Standard (10–15 days)",
        price_type: "flat" as const,
        service_zone_id: globalServiceZone.id,
        shipping_profile_id: physicalProfileId,
        provider_id: "easyship_easyship",
        type: { label: "Standard", description: "10–15 business days", code: "intl_standard" },
        rules: [],
      },
      {
        name: "International Express (3–5 days)",
        price_type: "flat" as const,
        service_zone_id: globalServiceZone.id,
        shipping_profile_id: physicalProfileId,
        provider_id: "easyship_easyship",
        type: { label: "Express", description: "3–5 business days", code: "intl_express" },
        rules: [],
      },
    ])

    logger.info("Shipping options created")
  } else {
    logger.info("Fulfillment sets already exist, skipping...")
  }

  // ── 5. Product Category Taxonomy ─────────────────────────────────────────
  logger.info("Creating product categories...")

  const existingCategories = await productModule.listProductCategories({})

  if (existingCategories.length === 0) {
    // Root categories
    const [digitalRoot, physicalRoot, servicesRoot] = await productModule.createProductCategories([
      { name: "Digital Products", handle: "digital-products", is_active: true, rank: 0 },
      { name: "Physical Products", handle: "physical-products", is_active: true, rank: 1 },
      { name: "Services", handle: "services", is_active: true, rank: 2 },
    ])

    // Digital subcategories
    await productModule.createProductCategories([
      { name: "Design & Templates", handle: "design-templates", parent_category_id: digitalRoot.id, is_active: true, rank: 0 },
      { name: "Code & Development", handle: "code-development", parent_category_id: digitalRoot.id, is_active: true, rank: 1 },
      { name: "eBooks & Guides", handle: "ebooks-guides", parent_category_id: digitalRoot.id, is_active: true, rank: 2 },
      { name: "Online Courses", handle: "online-courses", parent_category_id: digitalRoot.id, is_active: true, rank: 3 },
      { name: "Photography Presets", handle: "photography-presets", parent_category_id: digitalRoot.id, is_active: true, rank: 4 },
      { name: "Music & Audio", handle: "music-audio", parent_category_id: digitalRoot.id, is_active: true, rank: 5 },
      { name: "AI Tools & Prompts", handle: "ai-tools-prompts", parent_category_id: digitalRoot.id, is_active: true, rank: 6 },
      { name: "Fonts & Graphics", handle: "fonts-graphics", parent_category_id: digitalRoot.id, is_active: true, rank: 7 },
    ])

    // Physical subcategories
    const physicalSubs = await productModule.createProductCategories([
      { name: "Clothing & Apparel", handle: "clothing-apparel", parent_category_id: physicalRoot.id, is_active: true, rank: 0 },
      { name: "Food & Groceries", handle: "food-groceries", parent_category_id: physicalRoot.id, is_active: true, rank: 1 },
      { name: "Art & Prints", handle: "art-prints", parent_category_id: physicalRoot.id, is_active: true, rank: 2 },
      { name: "Books & Stationery", handle: "books-stationery", parent_category_id: physicalRoot.id, is_active: true, rank: 3 },
      { name: "Health & Beauty", handle: "health-beauty", parent_category_id: physicalRoot.id, is_active: true, rank: 4 },
      { name: "Electronics & Gadgets", handle: "electronics-gadgets", parent_category_id: physicalRoot.id, is_active: true, rank: 5 },
      { name: "Home & Living", handle: "home-living", parent_category_id: physicalRoot.id, is_active: true, rank: 6 },
      { name: "Handmade & Crafts", handle: "handmade-crafts", parent_category_id: physicalRoot.id, is_active: true, rank: 7 },
    ])

    const clothingCat = physicalSubs[0]
    const foodCat = physicalSubs[1]

    // Clothing sub-subcategories
    await productModule.createProductCategories([
      { name: "Men's Clothing", handle: "mens-clothing", parent_category_id: clothingCat.id, is_active: true, rank: 0 },
      { name: "Women's Clothing", handle: "womens-clothing", parent_category_id: clothingCat.id, is_active: true, rank: 1 },
      { name: "Kids' Clothing", handle: "kids-clothing", parent_category_id: clothingCat.id, is_active: true, rank: 2 },
      { name: "Accessories", handle: "accessories", parent_category_id: clothingCat.id, is_active: true, rank: 3 },
    ])

    // Food sub-subcategories
    await productModule.createProductCategories([
      { name: "Fresh Produce", handle: "fresh-produce", parent_category_id: foodCat.id, is_active: true, rank: 0 },
      { name: "Packaged Foods", handle: "packaged-foods", parent_category_id: foodCat.id, is_active: true, rank: 1 },
      { name: "Beverages", handle: "beverages", parent_category_id: foodCat.id, is_active: true, rank: 2 },
      { name: "Organic & Natural", handle: "organic-natural", parent_category_id: foodCat.id, is_active: true, rank: 3 },
      { name: "Sweets & Snacks", handle: "sweets-snacks", parent_category_id: foodCat.id, is_active: true, rank: 4 },
    ])

    // Services subcategories
    await productModule.createProductCategories([
      { name: "Coaching & Mentoring", handle: "coaching-mentoring", parent_category_id: servicesRoot.id, is_active: true, rank: 0 },
      { name: "Design Services", handle: "design-services", parent_category_id: servicesRoot.id, is_active: true, rank: 1 },
      { name: "Development Services", handle: "development-services", parent_category_id: servicesRoot.id, is_active: true, rank: 2 },
      { name: "Marketing Services", handle: "marketing-services", parent_category_id: servicesRoot.id, is_active: true, rank: 3 },
      { name: "Consulting", handle: "consulting", parent_category_id: servicesRoot.id, is_active: true, rank: 4 },
      { name: "Writing & Content", handle: "writing-content", parent_category_id: servicesRoot.id, is_active: true, rank: 5 },
      { name: "Video & Animation", handle: "video-animation", parent_category_id: servicesRoot.id, is_active: true, rank: 6 },
      { name: "Photography", handle: "photography-services", parent_category_id: servicesRoot.id, is_active: true, rank: 7 },
    ])

    logger.info("Product categories created")
  } else {
    logger.info("Product categories already exist, skipping...")
  }

  // ── 6. Tax Regions & Rates (India GST) ───────────────────────────────────
  logger.info("Creating tax regions...")

  const existingTaxRegions = await taxModule.listTaxRegions({})

  if (existingTaxRegions.length === 0) {
    const indiaTaxRegion = await taxModule.createTaxRegions({
      country_code: "in",
      default_tax_rate: {
        name: "India GST (Standard)",
        code: "GST-18",
        rate: 18,
      },
    })

    await taxModule.createTaxRates([
      {
        tax_region_id: indiaTaxRegion.id,
        name: "GST Food (Essential)",
        code: "GST-0-ESSENTIAL",
        rate: 0,
      },
      {
        tax_region_id: indiaTaxRegion.id,
        name: "GST Food (Packaged)",
        code: "GST-5-FOOD",
        rate: 5,
      },
      {
        tax_region_id: indiaTaxRegion.id,
        name: "GST Clothing",
        code: "GST-12-CLOTH",
        rate: 12,
      },
    ])

    logger.info("Indian GST tax rates created")
  } else {
    logger.info("Tax regions already exist, skipping...")
  }

  logger.info("✅ BrandingOS seed complete!")
  logger.info("")
  logger.info("Next steps:")
  logger.info("  1. Add env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, STRIPE_API_KEY")
  logger.info("  2. Add env vars: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD")
  logger.info("  3. Add env vars: EASYSHIP_API_KEY, EASYSHIP_ACCOUNT_ID")
  logger.info("  4. Run: pnpm --filter @brandingos/api db:migrate")
  logger.info("  5. Configure payment providers per region in Medusa Admin")
  void marketplaceChannelId
}
