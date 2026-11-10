import { getDb, withRLS } from '@brandingos/db'

// Single DB instance for the web app — reused across server components & API routes
export const db = getDb()

// Re-export withRLS so server components only import from one place
export { withRLS }

// Convenience: run a query scoped to the current Clerk user
// Usage in server components:
//   const user = await rls(userId, (tx) => tx.select().from(users).where(eq(users.id, userId)))
export function rls<T>(
  userId: string,
  callback: Parameters<typeof withRLS>[2]
): Promise<T> {
  return withRLS(db, userId, callback) as Promise<T>
}
