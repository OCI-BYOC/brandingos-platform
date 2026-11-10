import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

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
