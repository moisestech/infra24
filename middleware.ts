import { authMiddleware } from '@clerk/nextjs'

// Simple function to check if route is public
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks/clerk',
    '/api/organizations/by-slug',
    '/api/organizations',
    '/api/workshops',
    '/api/availability',
    '/api/bookings',
    '/api/waitlist',
    '/api/analytics',
    '/book',
    '/bookings',
    '/o'
  ]
  
  return publicRoutes.some(route => pathname.startsWith(route))
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
      return Response.redirect(new URL('/sign-in', req.url))
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