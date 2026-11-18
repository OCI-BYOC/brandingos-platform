import { auth } from "@clerk/nextjs/server"
import { db, rls } from "@/lib/db"
import { products } from "@brandingos/db"
import { and, eq, isNull, desc } from "drizzle-orm"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ products: [] })

  const list = await rls<typeof products.$inferSelect[]>(userId, (tx) =>
    tx
      .select({
        id:           products.id,
        title:        products.title,
        type:         products.type,
        price:        products.price,
        currency:     products.currency,
        status:       products.status,
        coverImageUrl: products.coverImageUrl,
        createdAt:    products.createdAt,
      })
      .from(products)
      .where(and(eq(products.userId, userId), isNull(products.deletedAt)))
      .orderBy(desc(products.createdAt))
      .limit(50)
  )

  return Response.json({ products: list })
}
