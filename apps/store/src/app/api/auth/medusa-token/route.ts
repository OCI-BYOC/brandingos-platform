import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  const password = `ck_${userId}`
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'

  // Try register first; fall back to login if the customer already exists
  const registerRes = await fetch(`${backendUrl}/auth/customer/emailpass/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (registerRes.ok) {
    const { token } = await registerRes.json()
    return NextResponse.json({ token, email })
  }

  const loginRes = await fetch(`${backendUrl}/auth/customer/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!loginRes.ok) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }

  const { token } = await loginRes.json()
  return NextResponse.json({ token, email })
}
