import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

// Fires when an order is placed — update AI credits or analytics in BrandingOS DB
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  logger.info(`Order placed: ${data.id}`)
  // TODO #7 wire to BrandingOS analytics via REST or direct Neon call
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
