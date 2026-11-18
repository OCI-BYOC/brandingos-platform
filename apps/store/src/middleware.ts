import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isStoreCheckout = createRouteMatcher(['/:username/store/checkout'])
const isStoreAccount  = createRouteMatcher(['/:username/store/account(.*)'])
const isLegacyProtected = createRouteMatcher(['/checkout', '/account(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isStoreCheckout(req) || isStoreAccount(req)) {
    // Redirect unauthenticated users to the per-creator sign-in page
    const username = req.nextUrl.pathname.split('/')[1]
    const signInUrl = new URL(`/${username}/store/sign-in`, req.nextUrl.origin)
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
    await auth.protect({ unauthenticatedUrl: signInUrl.toString() })
  } else if (isLegacyProtected(req)) {
    await auth.protect()
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
