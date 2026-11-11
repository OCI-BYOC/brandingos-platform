import { headers } from "next/headers"
import { Webhook } from "svix"
import { neon } from "@neondatabase/serverless"

type ClerkEvent =
  | { type: "user.created"; data: { id: string; email_addresses: Array<{ email_address: string }>; first_name: string | null; last_name: string | null; image_url: string | null } }
  | { type: "user.updated"; data: { id: string; email_addresses: Array<{ email_address: string }>; first_name: string | null; last_name: string | null; image_url: string | null } }
  | { type: "user.deleted"; data: { id: string } }

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) return new Response("No webhook secret", { status: 500 })

  const headerPayload = await headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.text()
  const wh = new Webhook(secret)

  let event: ClerkEvent
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses[0]?.email_address ?? ""
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null
    await sql`
      INSERT INTO users (id, email, full_name, avatar_url, tier, ai_credits_remaining, ai_credits_monthly_alloc, created_at, updated_at)
      VALUES (${id}, ${email}, ${fullName}, ${image_url ?? null}, 'free', 50, 50, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `
  } else if (event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses[0]?.email_address ?? ""
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null
    await sql`
      UPDATE users
      SET email = ${email}, full_name = ${fullName}, avatar_url = ${image_url ?? null}, updated_at = NOW()
      WHERE id = ${id}
    `
  } else if (event.type === "user.deleted") {
    await sql`UPDATE users SET deleted_at = NOW() WHERE id = ${event.data.id}`
  }

  return new Response("OK", { status: 200 })
}
