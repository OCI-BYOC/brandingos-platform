import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema/index";

// Neon connection — serverless HTTP mode (works in Cloudflare Workers)
// For long-running servers (Nomad jobs), use neon-pool instead
neonConfig.fetchConnectionCache = true;

function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema, logger: process.env.NODE_ENV === "development" });
}

// Singleton for server environments (Node.js, Nomad jobs)
// In edge environments (CF Workers), create per-request
let _db: ReturnType<typeof createDb> | null = null;

export function getDb(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (!_db) {
    _db = createDb(url);
  }
  return _db;
}

/**
 * withRLS — wraps a database operation with Row Level Security context.
 *
 * MUST be called on every user-initiated database operation.
 * Sets the app.current_user_id Postgres setting before the query runs,
 * which activates RLS policies that restrict access to the user's own data.
 *
 * Usage:
 *   const portfolio = await withRLS(db, userId, (tx) =>
 *     tx.select().from(portfolios).where(eq(portfolios.slug, slug))
 *   );
 *
 * Never query the database as a user without this wrapper.
 * Never call this for background jobs (they use service role and bypass RLS intentionally).
 */
export async function withRLS<T>(
  db: ReturnType<typeof createDb>,
  userId: string,
  callback: (db: ReturnType<typeof createDb>) => Promise<T>
): Promise<T> {
  // We use a transaction to scope the setting to this request only
  // Multiple concurrent requests each get their own setting scope
  return db.transaction(async (tx) => {
    // set_config supports parameterized queries; true = transaction-local (same as SET LOCAL)
    await tx.execute(sql`SELECT set_config('app.current_user_id', ${userId}, true)`);
    // Run the actual query
    return callback(tx as unknown as ReturnType<typeof createDb>);
  });
}

// Re-export everything so app code only imports from @brandingos/db
export * from "./schema/index";
export { createDb };
