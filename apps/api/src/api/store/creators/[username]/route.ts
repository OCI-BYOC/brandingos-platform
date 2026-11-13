import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /store/creators/:username — public creator store profile
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { username } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "description",
      "thumbnail",
      "status",
      "variants.*",
      "variants.prices.*",
      "metadata",
    ],
    filters: {
      // Products tagged with the creator's username via metadata
      metadata: { creator_username: username },
      status: "published",
    },
  })

  res.json({ creator: { username }, products })
}
