import { db } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull, asc } from "drizzle-orm"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [portfolio] = await db()
    .select()
    .from(portfolios)
    .where(
      and(
        eq(portfolios.slug, slug),
        eq(portfolios.isPublished, true),
        isNull(portfolios.deletedAt)
      )
    )
    .limit(1)

  if (!portfolio) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const sections = await db()
    .select()
    .from(portfolioSections)
    .where(
      and(
        eq(portfolioSections.portfolioId, portfolio.id),
        eq(portfolioSections.isVisible, true),
        isNull(portfolioSections.deletedAt)
      )
    )
    .orderBy(asc(portfolioSections.order))

  return Response.json({ portfolio, sections })
}
