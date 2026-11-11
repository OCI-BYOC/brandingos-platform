import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db, withRLS } from '@/lib/db'
import { users, portfolios, analyticsEvents } from '@brandingos/db'
import { eq, and, gte, count, isNull, desc } from 'drizzle-orm'
import DashboardClient from './_components/DashboardClient'

// Dashboard is per-user — never statically generated at build time
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  let dbUser = null
  let portfolioCount = 0
  let recentEvents: Array<{ id: string; eventType: string; path: string | null; occurredAt: Date }> = []
  let viewsLast30d = 0

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [userRows, portfolioRows] = await Promise.all([
      withRLS(db(), clerkUser.id, (tx) =>
        tx.select().from(users).where(eq(users.id, clerkUser.id)).limit(1)
      ),
      withRLS(db(), clerkUser.id, (tx) =>
        tx.select({ count: count() }).from(portfolios)
          .where(and(eq(portfolios.userId, clerkUser.id), isNull(portfolios.deletedAt)))
      ),
    ])

    dbUser = userRows[0] ?? null
    portfolioCount = Number(portfolioRows[0]?.count ?? 0)

    // Fetch last 10 analytics events (may fail if no portfolios yet)
    try {
      const events = await withRLS(db(), clerkUser.id, (tx) =>
        tx.select({
          id: analyticsEvents.id,
          eventType: analyticsEvents.eventType,
          path: analyticsEvents.path,
          occurredAt: analyticsEvents.occurredAt,
        })
          .from(analyticsEvents)
          .where(eq(analyticsEvents.userId, clerkUser.id))
          .orderBy(desc(analyticsEvents.occurredAt))
          .limit(10)
      )
      recentEvents = events

      const viewRows = await withRLS(db(), clerkUser.id, (tx) =>
        tx.select({ count: count() })
          .from(analyticsEvents)
          .where(and(
            eq(analyticsEvents.userId, clerkUser.id),
            eq(analyticsEvents.eventType, 'page_view'),
            gte(analyticsEvents.occurredAt, thirtyDaysAgo)
          ))
      )
      viewsLast30d = Number(viewRows[0]?.count ?? 0)
    } catch {
      // No analytics yet
    }
  } catch {
    // DB row may not exist yet (webhook lag) — fall back gracefully
  }

  return (
    <DashboardClient
      user={{
        id: clerkUser.id,
        firstName: clerkUser.firstName ?? '',
        lastName: clerkUser.lastName ?? '',
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        imageUrl: clerkUser.imageUrl,
        tier: (dbUser?.tier ?? 'free') as 'free' | 'pro' | 'growth' | 'brand',
        aiCredits: dbUser?.aiCreditsRemaining ?? 50,
        aiCreditsTotal: dbUser?.aiCreditsMonthlyAlloc ?? 50,
        portfolioCount,
        viewsLast30d,
        recentEvents,
      }}
    />
  )
}
