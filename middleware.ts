import { authMiddleware } from '@clerk/nextjs'
import { isPublicRoute } from '@/lib/auth/public-routes'

export default authMiddleware({
  publicRoutes: (req) => isPublicRoute(req.nextUrl.pathname),
  // Bypass Clerk entirely for live-session APIs (public join/facilitate sync).
  ignoredRoutes: ['/api/workshop-live-sessions(.*)'],
  afterAuth: (auth, req) => {
    const { pathname } = req.nextUrl
    const { userId } = auth

    if (!isPublicRoute(pathname) && !userId) {
      const signIn = new URL('/sign-in', req.url)
      const returnPath = `${pathname}${req.nextUrl.search || ''}`
      signIn.searchParams.set('redirect_url', returnPath)
      return Response.redirect(signIn)
    }
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
