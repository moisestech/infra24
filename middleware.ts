import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/organizations/by-slug/(.*)/public(.*)',
  '/api/organizations/by-slug/(.*)/announcements/public(.*)',
  '/api/organizations/by-slug/(.*)/announcements(.*)', // Announcements API public for testing
  '/api/organizations/by-slug/(.*)', // Organization API public for testing
  '/api/organizations/(.*)/resources(.*)', // Resources API public for testing
  '/api/organizations/(.*)/workshops(.*)', // Workshops API public for testing
  '/api/workshops/(.*)', // Individual workshop API public for testing
  '/api/organizations/(.*)/bookings(.*)', // Bookings API public for testing
  '/api/organizations/(.*)/equipment-options(.*)', // Equipment options API public for testing
  '/api/organizations/(.*)/equipment-votes(.*)', // Equipment votes API public for testing
  '/api/artists(.*)', // Artists API public for testing
  '/api/surveys/templates(.*)',
  '/api/surveys/(.*)/responses(.*)',
  '/api/surveys/(.*)',
  '/api/magic-links/(.*)',
  '/survey/(.*)',
  '/submit/(.*)',
  '/map/(.*)', // Map proposal pages
  '/xr/(.*)', // XR proposal pages
  '/o/(.*)/announcements/public(.*)',
  '/o/(.*)/announcements/display(.*)',
  '/o/(.*)/workshops(.*)',
  '/o/(.*)/bookings(.*)',
  '/o/(.*)/analytics(.*)',
  '/o/(.*)/submissions(.*)',
  '/o/(.*)/digital-lab(.*)',
  '/o/(.*)/ai-tools(.*)',
  '/o/(.*)/roadmap(.*)',
  '/o/(.*)/budget(.*)',
  '/o/(.*)/impact-roi(.*)',
  '/o/(.*)/map(.*)', // Organization map pages
  '/o/(.*)/xr(.*)', // Organization XR pages
  '/o/(.*)/submit(.*)', // Organization submit pages
  '/o/(.*)',
  '/product(.*)',
  '/test(.*)',
  '/tenant-example(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Log the request URL for debugging
  console.log('🔒 Middleware processing:', req.url)
  
  if (!isPublicRoute(req)) {
    console.log('🔐 Route is protected, checking auth...')
    try {
      const authResult = await auth();
      console.log('🔐 Auth check result:', { 
        hasUserId: !!authResult.userId, 
        userId: authResult.userId?.substring(0, 8) + '...' 
      });
      await auth.protect()
      console.log('✅ Auth protection passed')
    } catch (error) {
      console.log('❌ Auth protection failed:', error)
      throw error
    }
  } else {
    console.log('🌐 Route is public, skipping auth')
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
