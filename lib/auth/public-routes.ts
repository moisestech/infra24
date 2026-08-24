/**
 * Clerk public-route matcher for Infra24 / DCC MIA.
 * Marketing surfaces (/artists, /workshops, /programs, …) must stay reachable
 * without a session. Tenant workshop admin under /o/{org}/workshops stays signed-in.
 */

function normalizePathname(pathname: string): string {
  const path = pathname.split('?')[0]?.split('#')[0] || '/'
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

function matchesPrefix(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`)
}

export function isPublicRoute(rawPathname: string): boolean {
  const pathname = normalizePathname(rawPathname)

  if (pathname === '/') return true

  /** DCC public artist directory + culture artist pages. */
  if (matchesPrefix(pathname, '/artists') || pathname === '/for-artists') return true

  /** DCC public workshop catalog (published listings only on the page). */
  if (matchesPrefix(pathname, '/workshops')) return true

  /** Public workshop reader chapters: canonical `/workshop/{slug}/{chapter}`. */
  if (matchesPrefix(pathname, '/workshop')) return true

  /** Live workshop room surfaces (join / TV / facilitator). */
  if (
    matchesPrefix(pathname, '/session') ||
    matchesPrefix(pathname, '/present') ||
    matchesPrefix(pathname, '/facilitate')
  ) {
    return true
  }
  if (matchesPrefix(pathname, '/api/workshop-live-sessions')) return true

  /** Tenant workshop UI under `/o/{org}/workshops` requires sign-in (full catalog, drafts, digital-lab tools). */
  if (/^\/o\/[^/]+\/workshops(\/.*)?$/.test(pathname)) return false

  /** Org-scoped reader chapters under `/o/{org}/workshop/.../chapters/...` require sign-in. */
  if (/^\/o\/[^/]+\/workshop(\/.*)?$/.test(pathname)) return false

  /** Other org tenant surfaces stay public unless individually protected elsewhere. */
  if (matchesPrefix(pathname, '/o')) return true

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
    /** Recruiter-safe Applied AI demo surfaces */
    '/memory-agent',
    '/applied-ai',
    '/network/agent',
    /** DCC.MIAMI public product surfaces */
    '/machines',
    '/pricing',
    '/make',
    '/fabricate',
    '/scale-up',
    '/dashboard/ceo',
    '/api/dcc/make',
    '/api/scale-up',
    '/api/signage',
  ]

  return publicRoutes.some((route) => matchesPrefix(pathname, route))
}
