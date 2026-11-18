import { auth } from "@clerk/nextjs/server"
import { rls } from "@/lib/db"
import { portfolios } from "@brandingos/db"
import { and, eq, isNull, desc } from "drizzle-orm"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ portfolios: [] })

  const list = await rls<typeof portfolios.$inferSelect[]>(userId, (tx) =>
    tx
      .select({
        id:          portfolios.id,
        slug:        portfolios.slug,
        title:       portfolios.title,
        theme:       portfolios.theme,
        isPublished: portfolios.isPublished,
        createdAt:   portfolios.createdAt,
        updatedAt:   portfolios.updatedAt,
        settings:    portfolios.settings,
      })
      .from(portfolios)
      .where(and(eq(portfolios.userId, userId), isNull(portfolios.deletedAt)))
      .orderBy(desc(portfolios.createdAt))
      .limit(20)
  )

  return Response.json({ portfolios: list })
}
