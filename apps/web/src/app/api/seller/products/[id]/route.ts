import { auth } from "@clerk/nextjs/server"
import { rls } from "@/lib/db"
import { products } from "@brandingos/db"
import { and, eq, isNull } from "drizzle-orm"
import { NextRequest } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, title, price, description, coverImageUrl, compareAtPrice, stockQuantity } = body

  const allowed: Partial<typeof products.$inferInsert> = {}
  if (status !== undefined) allowed.status = status
  if (title !== undefined) allowed.title = title.trim()
  if (price !== undefined) allowed.price = Math.round(Number(price) * 100)
  if (description !== undefined) allowed.description = description?.trim() || null
  if (coverImageUrl !== undefined) allowed.coverImageUrl = coverImageUrl?.trim() || null
  if (compareAtPrice !== undefined) allowed.compareAtPrice = compareAtPrice ? Math.round(Number(compareAtPrice) * 100) : null
  if (stockQuantity !== undefined) allowed.stockQuantity = stockQuantity ? Number(stockQuantity) : null

  if (!Object.keys(allowed).length) {
    return Response.json({ message: "No fields to update" }, { status: 400 })
  }

  const [updated] = await rls<typeof products.$inferSelect[]>(userId, (tx) =>
    tx
      .update(products)
      .set({ ...allowed, updatedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.userId, userId), isNull(products.deletedAt)))
      .returning()
  )

  if (!updated) return Response.json({ message: "Product not found" }, { status: 404 })
  return Response.json({ product: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth()
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const [deleted] = await rls<typeof products.$inferSelect[]>(userId, (tx) =>
    tx
      .update(products)
      .set({ deletedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.userId, userId), isNull(products.deletedAt)))
      .returning()
  )

  if (!deleted) return Response.json({ message: "Product not found" }, { status: 404 })
  return Response.json({ ok: true })
}
