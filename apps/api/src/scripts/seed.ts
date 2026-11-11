import { ExecArgs } from "@medusajs/framework/types"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  logger.info("Seeding BrandingOS store data...")

  // Add seed data here (regions, shipping options, etc.)
  // Run with: pnpm --filter @brandingos/api seed

  logger.info("Seed complete.")
}
