import { db } from "@/lib/db"
import { portfolios } from "@brandingos/db"
import { and, eq, isNull } from "drizzle-orm"
import { clerkClient } from "@clerk/nextjs/server"
import { Resend } from "resend"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json() as { name?: string; email?: string; message?: string }
  const { name, email, message } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: "All fields are required" }, { status: 400 })
  }

  const [portfolio] = await db()
    .select({ userId: portfolios.userId, title: portfolios.title })
    .from(portfolios)
    .where(and(eq(portfolios.slug, slug), eq(portfolios.isPublished, true), isNull(portfolios.deletedAt)))
    .limit(1)

  if (!portfolio) {
    return Response.json({ error: "Portfolio not found" }, { status: 404 })
  }

  // Get owner email from Clerk
  const clerk = await clerkClient()
  const owner = await clerk.users.getUser(portfolio.userId)
  const ownerEmail = owner.emailAddresses[0]?.emailAddress

  if (!ownerEmail) {
    return Response.json({ error: "Could not reach portfolio owner" }, { status: 500 })
  }

  if (!process.env.RESEND_API_KEY) {
    // Dev fallback — accept form submissions silently before Resend is configured
    return Response.json({ ok: true })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const portfolioTitle = portfolio.title ?? slug

  await resend.emails.send({
    from:    "BrandingOS <noreply@brandingos.in>",
    to:      ownerEmail,
    replyTo: email,
    subject: `New contact from ${name} via your portfolio`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#0f172a;margin:0 0 8px;">New message via your portfolio</h2>
        <p style="color:#64748b;margin:0 0 24px;font-size:14px;">Someone reached out through <strong>${portfolioTitle}</strong></p>
        <div style="background:white;border-radius:8px;padding:20px;border:1px solid #e2e8f0;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">From</p>
          <p style="margin:0 0 16px;font-weight:600;color:#0f172a;">${name} &lt;${email}&gt;</p>
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
          <p style="margin:0;color:#334155;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;">Hit Reply to respond directly to ${name}.</p>
      </div>
    `,
  })

  return Response.json({ ok: true })
}
