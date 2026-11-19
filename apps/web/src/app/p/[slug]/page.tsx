import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull, asc } from "drizzle-orm"
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params

  const [raw] = await db()
    .select()
    .from(portfolios)
    .where(and(eq(portfolios.slug, slug), eq(portfolios.isPublished, true), isNull(portfolios.deletedAt)))
    .limit(1)

  if (!raw) notFound()

  const rawSections = await db()
    .select()
    .from(portfolioSections)
    .where(and(eq(portfolioSections.portfolioId, raw.id), eq(portfolioSections.isVisible, true), isNull(portfolioSections.deletedAt)))
    .orderBy(asc(portfolioSections.order))

  const portfolio = {
    ...raw,
    settings: raw.settings as Record<string, unknown> | null,
  }

  const sections = rawSections.map(s => ({
    ...s,
    content: s.content as Record<string, unknown> | null,
  }))

  return <PortfolioRenderer portfolio={portfolio} sections={sections} />
}
