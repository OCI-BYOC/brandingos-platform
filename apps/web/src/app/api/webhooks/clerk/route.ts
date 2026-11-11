import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    return new Response('CLERK_WEBHOOK_SECRET not set', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let event: WebhookEvent
  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  switch (event.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name, image_url, username } = event.data

      const email = email_addresses[0]?.email_address
      if (!email) return new Response('No email', { status: 400 })

      const fullName = [first_name, last_name].filter(Boolean).join(' ') || email.split('@')[0]
      // Generate a unique username: prefer Clerk's, fall back to email prefix + random suffix
      const baseUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      const generatedUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`

      try {
        // Raw SQL insert to avoid importing the entire @brandingos/db package
        // which would pull in drizzle/neon at edge runtime
        const { neon } = await import('@neondatabase/serverless')
        const sql = neon(process.env.DATABASE_URL!)
        await sql`
          INSERT INTO users (id, username, email, full_name, avatar_url, tier, ai_credits_remaining, ai_credits_monthly_alloc, is_verified, created_at, updated_at)
          VALUES (
            ${id},
            ${generatedUsername},
            ${email},
            ${fullName},
            ${image_url || null},
            'free',
            50,
            50,
            false,
            NOW(),
            NOW()
          )
          ON CONFLICT (id) DO NOTHING
        `
      } catch (err) {
        console.error('[webhook] user.created DB error', err)
        return new Response('DB error', { status: 500 })
      }
      break
    }

    case 'user.updated': {
      const { id, email_addresses, first_name, last_name, image_url } = event.data
      const email = email_addresses[0]?.email_address
      const fullName = [first_name, last_name].filter(Boolean).join(' ')

      try {
        const { neon } = await import('@neondatabase/serverless')
        const sql = neon(process.env.DATABASE_URL!)
        await sql`
          UPDATE users
          SET
            email      = COALESCE(${email || null}, email),
            full_name  = COALESCE(NULLIF(${fullName}, ''), full_name),
            avatar_url = COALESCE(${image_url || null}, avatar_url),
            updated_at = NOW()
          WHERE id = ${id}
        `
      } catch (err) {
        console.error('[webhook] user.updated DB error', err)
        return new Response('DB error', { status: 500 })
      }
      break
    }

    case 'user.deleted': {
      const { id } = event.data
      if (!id) break

      try {
        const { neon } = await import('@neondatabase/serverless')
        const sql = neon(process.env.DATABASE_URL!)
        // Soft delete — keeps data, just marks them gone
        await sql`
          UPDATE users
          SET deleted_at = NOW(), updated_at = NOW()
          WHERE id = ${id}
        `
      } catch (err) {
        console.error('[webhook] user.deleted DB error', err)
        return new Response('DB error', { status: 500 })
      }
      break
    }
  }

  return new Response('OK', { status: 200 })
}
