import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" />
      </head>
      <body>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
