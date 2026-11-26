import { clerkMiddleware } from '@clerk/nextjs/server'
import { isPublicRoute } from '@/lib/auth/public-routes'

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  if (isPublicRoute(pathname)) return
  const { userId } = await auth()
  if (!userId) {
    const signIn = new URL('/sign-in', req.url)
    signIn.searchParams.set('redirect_url', pathname + (req.nextUrl.search || ''))
    return Response.redirect(signIn)
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
