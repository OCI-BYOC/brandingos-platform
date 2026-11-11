import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db, withRLS } from '@/lib/db'
import { users } from '@brandingos/db'
import { eq } from 'drizzle-orm'
import DashboardClient from './_components/DashboardClient'

// Dashboard is per-user — never statically generated at build time
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  // Fetch the user's DB row (includes AI credits, tier, etc.)
  let dbUser = null
  try {
    const rows = await withRLS(db(), clerkUser.id, (tx) =>
      tx.select().from(users).where(eq(users.id, clerkUser.id)).limit(1)
    )
    dbUser = rows[0] ?? null
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
        tier: dbUser?.tier ?? 'free',
        aiCredits: dbUser?.aiCreditsRemaining ?? 50,
      }}
    />
  )
}
