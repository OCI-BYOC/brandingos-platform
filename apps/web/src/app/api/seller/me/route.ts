import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
const SERVICE_KEY = process.env.MEDUSA_SERVICE_KEY ?? ""

function medusaHeaders() {
  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": MEDUSA_KEY,
    ...(SERVICE_KEY ? { "x-service-key": SERVICE_KEY } : {}),
  }
}

/**
 * GET /api/seller/me
 * Returns the full seller record for the currently signed-in Clerk user.
 */
export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ seller: null })

  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/sellers?clerk_user_id=${encodeURIComponent(userId)}`,
      { headers: medusaHeaders(), cache: "no-store" }
    )
    if (!res.ok) return Response.json({ seller: null })
    return Response.json(await res.json())
  } catch {
    return Response.json({ seller: null })
  }
}

/**
 * PATCH /api/seller/me
 * Updates store settings for the currently signed-in Clerk user.
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  try {
    const res = await fetch(`${MEDUSA_URL}/store/sellers`, {
      method: "PATCH",
      headers: medusaHeaders(),
      body: JSON.stringify({ ...body, clerk_user_id: userId }),
    })
    const data = await res.json()
    if (!res.ok) return Response.json(data, { status: res.status })
    return Response.json(data)
  } catch {
    return Response.json({ message: "Failed to update store settings" }, { status: 500 })
  }
}
