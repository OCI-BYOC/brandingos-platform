import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
const SERVICE_KEY = process.env.MEDUSA_SERVICE_KEY ?? ""

/**
 * POST /api/seller/provision
 * BFF for seller provisioning — validates Clerk session server-side,
 * then calls Medusa POST /store/sellers with the verified clerk_user_id.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    // empty body is fine
  }

  const res = await fetch(`${MEDUSA_URL}/store/sellers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": MEDUSA_KEY,
      "x-service-key": SERVICE_KEY,
    },
    body: JSON.stringify({ ...body, clerk_user_id: userId }),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
