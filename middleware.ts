import { authMiddleware } from '@clerk/nextjs'

// Simple function to check if route is public
function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true

  /** DCC public workshop catalog (published listings only on the page). */
  if (pathname === '/workshops' || pathname.startsWith('/workshops/')) return true

  /** Public workshop reader chapters: canonical `/workshop/{slug}/{chapter}`. */
  if (pathname === '/workshop' || pathname.startsWith('/workshop/')) return true

  /** Tenant workshop UI under `/o/{org}/workshops` requires sign-in (full catalog, drafts, digital-lab tools). */
  if (/^\/o\/[^/]+\/workshops(\/.*)?$/.test(pathname)) return false

  /** Org-scoped reader chapters under `/o/{org}/workshop/.../chapters/...` require sign-in. */
  if (/^\/o\/[^/]+\/workshop(\/.*)?$/.test(pathname)) return false

  /** Other org tenant surfaces stay public unless individually protected elsewhere. */
  if (pathname === '/o' || pathname.startsWith('/o/')) return true

  const publicRoutes = [
    '/network',
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
    '/powered-by-infra24',
    '/faq',
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
    '/who-we-work-with',
    '/contact',
    '/grant',
    /** Funder-facing packet hub (must stay public; not under /grant). */
    '/knight',
    /** Born-Digital Era public marketing surfaces. */
    '/era',
    /** DCC Index signup + Edge Zones partnership portal (QR / print). */
    '/dcc',
    '/edgezones',
    '/join',
    /** Landscape TV intake funnel (kiosk). */
    '/display/dcc',
    /** Soho House Member Signal Agent pitch funnel (back-cover QR). */
    '/soho-house-ai-assistant',
    /** Root alias → /soho-house-ai-assistant */
    '/member-signal-agent',
    /** Soho about-page alias (redirects to /o/sohohouse/memory-agent/about). */
    '/sohohouse',
    '/events',
    '/newsletter',
    '/opportunities',
  ]

  return publicRoutes.some((route) => pathname.startsWith(route))
}

export default authMiddleware({
  publicRoutes: (req) => isPublicRoute(req.nextUrl.pathname),
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
