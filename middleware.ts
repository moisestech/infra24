import { authMiddleware } from '@clerk/nextjs'

// Simple function to check if route is public
function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true

  /** DCC public workshop catalog (published listings only on the page). */
  if (pathname === '/workshops' || pathname.startsWith('/workshops/')) return true

  /** Tenant workshop UI under `/o/{org}/workshops` requires sign-in (full catalog, drafts, digital-lab tools). */
  if (/^\/o\/[^/]+\/workshops(\/.*)?$/.test(pathname)) return false

  /** Other org tenant surfaces stay public unless individually protected elsewhere. */
  if (pathname === '/o' || pathname.startsWith('/o/')) return true

  const publicRoutes = [
    '/sign-in',
    '/sign-up',
    '/api/webhooks/clerk',
    '/api/organizations/by-slug',
    '/api/organizations',
    '/api/artists',
    '/api/workshops',
    '/api/availability',
    '/api/bookings',
    '/api/waitlist',
    '/api/analytics',
    '/api/marketing',
    '/book',
    '/bookings',
    '/platform',
    '/infra24',
    '/programs',
    '/grants',
    '/projects',
    '/partners',
    '/journal',
    '/what-we-do',
    '/audit',
    '/pilots',
    '/case-studies',
    '/about',
    '/contact',
    '/grant',
  ]

  return publicRoutes.some((route) => pathname.startsWith(route))
}

export default authMiddleware({
  publicRoutes: (req) => {
    const { pathname } = req.nextUrl
    console.log(`🔒 Middleware processing: ${req.url}`)
    
    if (isPublicRoute(pathname)) {
      console.log('🌐 Route is public, skipping auth')
      return true
    }
    
    console.log('🔐 Route is protected, checking auth...')
    return false
  },
  afterAuth: (auth, req) => {
    const { pathname } = req.nextUrl
    const { userId } = auth
    
    if (!isPublicRoute(pathname) && !userId) {
      console.log('❌ Auth protection failed: User not authenticated')
      const signIn = new URL('/sign-in', req.url)
      const returnPath = `${pathname}${req.nextUrl.search || ''}`
      signIn.searchParams.set('redirect_url', returnPath)
      return Response.redirect(signIn)
    }
    
    if (userId) {
      console.log('✅ Auth protection passed')
    }
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