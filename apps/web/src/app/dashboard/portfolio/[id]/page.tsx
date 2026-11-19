import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { db } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull, asc } from "drizzle-orm"
import PortfolioEditor from "./PortfolioEditor"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortfolioEditorPage({ params }: Props) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { id } = await params

  const [raw] = await db()
    .select()
    .from(portfolios)
    .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId), isNull(portfolios.deletedAt)))
    .limit(1)

  if (!raw) notFound()

  const rawSections = await db()
    .select()
    .from(portfolioSections)
    .where(and(eq(portfolioSections.portfolioId, id), isNull(portfolioSections.deletedAt)))
    .orderBy(asc(portfolioSections.order))

  const portfolio = { ...raw, settings: raw.settings as Record<string, unknown> | null }
  const sections  = rawSections.map(s => ({ ...s, content: s.content as Record<string, unknown> | null }))

  return <PortfolioEditor portfolio={portfolio} sections={sections} />
}
