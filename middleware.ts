import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'
import { isPublicRoute } from '@/lib/auth/public-routes'

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  if (isPublicRoute(pathname)) return
  const { userId } = await auth()
  if (!userId) {
    if (pathname.startsWith('/api/') || pathname.startsWith('/trpc/')) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } })
    }
    const signIn = new URL('/sign-in', req.url)
    signIn.searchParams.set('redirect_url', pathname + (req.nextUrl.search || ''))
    return NextResponse.redirect(signIn)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
