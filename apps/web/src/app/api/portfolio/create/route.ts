import { auth } from "@clerk/nextjs/server"
import { db, rls } from "@/lib/db"
import { portfolios, portfolioSections } from "@brandingos/db"
import { and, eq, isNull } from "drizzle-orm"

type SectionType =
  | "hero" | "about" | "skills" | "work" | "education" | "projects"
  | "integrations" | "testimonials" | "newsletter" | "booking" | "contact" | "custom"

const SECTION_TYPE_MAP: Record<string, SectionType> = {
  about:        "about",
  skills:       "skills",
  projects:     "projects",
  experience:   "work",
  services:     "custom",
  testimonials: "testimonials",
  education:    "education",
  articles:     "custom",
  contact:      "contact",
}

type DbTheme = "minimal" | "modern" | "creative"
const THEME_MAP: Record<string, DbTheme> = {
  minimal:      "minimal",
  bold:         "modern",
  creative:     "creative",
  professional: "modern",
}

function generateSlug(name: string): string {
  return (name ?? "portfolio")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "portfolio"
}

interface WizardProject {
  id: string
  title: string
  description: string
  tags: string
  url: string
}

interface WizardSection {
  id: string
  enabled: boolean
  order: number
  label: string
}

interface CreateBody {
  name: string
  professionTitle: string
  tagline: string
  bio: string
  skills: string[]
  projects: WizardProject[]
  sections: WizardSection[]
  theme: string
  accentColor: string
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json() as CreateBody
  const { name, professionTitle, tagline, bio, skills, projects, sections, theme, accentColor } = body

  // Check slug uniqueness across ALL portfolios (global unique constraint)
  const baseSlug = generateSlug(name)
  let slug = baseSlug

  const existing = await db()
    .select({ id: portfolios.id })
    .from(portfolios)
    .where(and(eq(portfolios.slug, baseSlug), isNull(portfolios.deletedAt)))
    .limit(1)

  if (existing.length > 0) {
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
  }

  const dbTheme = THEME_MAP[theme] ?? "minimal"

  const result = await rls<{ id: string; slug: string } | null>(userId, async (tx) => {
    const [portfolio] = await tx
      .insert(portfolios)
      .values({
        userId,
        slug,
        title:       name || "My Portfolio",
        tagline:     tagline || null,
        bio:         bio || null,
        theme:       dbTheme,
        isPublished: true,
        isPrimary:   true,
        publishedAt: new Date(),
        settings: {
          professionTitle: professionTitle || null,
          accentColor:     accentColor || "#7c3aed",
          skills:          skills ?? [],
        },
      })
      .returning({ id: portfolios.id, slug: portfolios.slug })

    if (!portfolio) return null

    const enabledSections = (sections ?? [])
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order)

    if (enabledSections.length > 0) {
      await tx.insert(portfolioSections).values(
        enabledSections.map((s, i) => ({
          portfolioId: portfolio.id,
          type:        SECTION_TYPE_MAP[s.id] ?? "custom",
          title:       s.label,
          order:       i + 1,
          isVisible:   true,
          content:
            s.id === "skills"   ? { skills } :
            s.id === "projects" ? { projects: (projects ?? []).filter(p => p.title?.trim()) } :
            {},
        }))
      )
    }

    return { id: portfolio.id, slug: portfolio.slug }
  })

  if (!result) {
    return Response.json({ error: "Failed to create portfolio" }, { status: 500 })
  }

  return Response.json({ portfolio: result })
}
