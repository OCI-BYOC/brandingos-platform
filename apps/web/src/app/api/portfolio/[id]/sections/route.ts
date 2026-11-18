import { auth } from "@clerk/nextjs/server"
import { db, rls } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull } from "drizzle-orm"

type SectionType =
  | "hero" | "about" | "skills" | "work" | "education" | "projects"
  | "integrations" | "testimonials" | "newsletter" | "booking" | "contact" | "custom"

interface SectionInput {
  id?: string
  type: SectionType
  title: string
  order: number
  isVisible: boolean
  content: Record<string, unknown>
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { sections } = await req.json() as { sections: SectionInput[] }

  const result = await rls<typeof portfolioSections.$inferSelect[]>(userId, async (tx) => {
    // Verify ownership
    const [portfolio] = await tx
      .select({ id: portfolios.id })
      .from(portfolios)
      .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId), isNull(portfolios.deletedAt)))
      .limit(1)

    if (!portfolio) return []

    // Soft-delete all existing sections
    await tx
      .update(portfolioSections)
      .set({ deletedAt: new Date() })
      .where(and(eq(portfolioSections.portfolioId, id), isNull(portfolioSections.deletedAt)))

    if (!sections.length) return []

    // Insert fresh set
    const inserted = await tx
      .insert(portfolioSections)
      .values(sections.map((s, i) => ({
        portfolioId: id,
        type:        s.type,
        title:       s.title,
        order:       i + 1,
        isVisible:   s.isVisible,
        content:     s.content,
      })))
      .returning()

    return inserted
  })

  return Response.json({ sections: result })
}
