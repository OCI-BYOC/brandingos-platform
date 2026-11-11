import { getDb, withRLS } from '@brandingos/db'

// Lazy singleton — deferred until first request, not at module import time.
// Prevents crashes during Next.js build when DATABASE_URL is unavailable.
let _db: ReturnType<typeof getDb> | null = null

export function db(): ReturnType<typeof getDb> {
  if (!_db) _db = getDb()
  return _db
}

export { withRLS }

// Convenience wrapper — run a query scoped to the current Clerk user
export function rls<T>(
  userId: string,
  callback: Parameters<typeof withRLS>[2]
): Promise<T> {
  return withRLS(db(), userId, callback) as Promise<T>
}
