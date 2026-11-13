import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

// Prevents Next.js from pre-rendering any page at build time.
// All pages are user-specific or use Clerk — static export would
// validate the publishable key with no real request context.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'BrandingOS — Own Your Professional Narrative',
  description:
    'AI-native personal branding platform. Build your portfolio, grow your audience, and monetize your expertise.',
  keywords: ['personal branding', 'portfolio', 'AI content', 'career growth'],
  openGraph: {
    title: 'BrandingOS',
    description: 'Own Your Professional Narrative',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={displayFont.variable} suppressHydrationWarning>
      <body>
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
