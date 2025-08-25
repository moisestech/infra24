import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)'
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
