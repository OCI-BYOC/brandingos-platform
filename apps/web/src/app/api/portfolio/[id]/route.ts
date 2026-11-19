import { auth } from "@clerk/nextjs/server"
import { db, rls } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull, asc } from "drizzle-orm"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const [portfolio] = await db()
    .select()
    .from(portfolios)
    .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId), isNull(portfolios.deletedAt)))
    .limit(1)

  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 })

  const sections = await db()
    .select()
    .from(portfolioSections)
    .where(and(eq(portfolioSections.portfolioId, id), isNull(portfolioSections.deletedAt)))
    .orderBy(asc(portfolioSections.order))

  return Response.json({ portfolio, sections })
}

interface PatchBody {
  title?: string
  tagline?: string
  bio?: string
  theme?: "minimal" | "modern" | "creative"
  isPublished?: boolean
  settings?: Record<string, unknown>
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json() as PatchBody

  const updated = await rls<typeof portfolios.$inferSelect | null>(userId, async (tx) => {
    const [row] = await tx
      .update(portfolios)
      .set({
        ...(body.title      !== undefined && { title:       body.title }),
        ...(body.tagline    !== undefined && { tagline:     body.tagline || null }),
        ...(body.bio        !== undefined && { bio:         body.bio || null }),
        ...(body.theme      !== undefined && { theme:       body.theme }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.settings   !== undefined && { settings:    body.settings }),
        updatedAt: new Date(),
      })
      .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId), isNull(portfolios.deletedAt)))
      .returning()

    return row ?? null
  })

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ portfolio: updated })
}
