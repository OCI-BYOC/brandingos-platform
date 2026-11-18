import { auth } from "@clerk/nextjs/server"
import { db, rls } from "@/lib/db"
import { products } from "@brandingos/db"
import { and, eq, isNull, desc } from "drizzle-orm"
import { NextRequest } from "next/server"

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

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, type, price, currency, description, status, coverImageUrl, compareAtPrice, stockQuantity } = body

  if (!title?.trim()) return Response.json({ message: "Title is required" }, { status: 400 })
  if (!type) return Response.json({ message: "Type is required" }, { status: 400 })
  if (price == null || isNaN(Number(price))) return Response.json({ message: "Price is required" }, { status: 400 })

  const [created] = await rls<typeof products.$inferSelect[]>(userId, (tx) =>
    tx.insert(products).values({
      userId,
      title: title.trim(),
      type,
      price: Math.round(Number(price) * 100), // store in paise/cents
      currency: currency ?? "INR",
      description: description?.trim() ?? null,
      status: status ?? "draft",
      coverImageUrl: coverImageUrl?.trim() || null,
      compareAtPrice: compareAtPrice ? Math.round(Number(compareAtPrice) * 100) : null,
      stockQuantity: type === "digital" ? null : (stockQuantity ? Number(stockQuantity) : null),
      shippingRequired: type === "physical",
    }).returning()
  )

  return Response.json({ product: created }, { status: 201 })
}
