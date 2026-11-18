import { auth } from "@clerk/nextjs/server"

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

/**
 * GET /api/seller/me
 * Returns the seller record for the currently signed-in Clerk user.
 * Returns { seller: null } when the user hasn't launched a store yet.
 */
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ seller: null })
  }

  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/sellers?clerk_user_id=${encodeURIComponent(userId)}`,
      {
        headers: { "x-publishable-api-key": MEDUSA_KEY },
        // Don't cache — we want the latest status
        cache: "no-store",
      }
    )
    if (!res.ok) return Response.json({ seller: null })
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ seller: null })
  }
}
