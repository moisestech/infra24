/**
 * Enhanced middleware for tenant routing and authentication
 * This extends the existing middleware to handle multi-tenant routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTenantFromRequest, getTenantConfig } from './lib/tenant';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/health',
  '/api/organizations/by-slug/(.*)/public',
  '/api/organizations/by-slug/(.*)/announcements/public',
  '/o/(.*)/announcements/display(.*)',
  '/o/(.*)/public(.*)',
];

// Tenant-specific public routes
const tenantPublicRoutes = [
  '/o/(.*)/announcements/display',
  '/o/(.*)/public',
  '/o/(.*)/bookings/public',
  '/o/(.*)/workshops/public',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract tenant information
  const tenantId = getTenantFromRequest(request);
  const tenantConfig = tenantId ? getTenantConfig(tenantId) : null;
  
  // Add tenant information to headers for use in components
  const requestHeaders = new Headers(request.headers);
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-tenant-name', tenantConfig?.name || '');
    requestHeaders.set('x-tenant-domain', tenantConfig?.domain || '');
  }
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    const regex = new RegExp(route.replace(/\*/g, '.*'));
    return regex.test(pathname);
  });
  
  // Check if route is tenant-specific public
  const isTenantPublicRoute = tenantPublicRoutes.some(route => {
    const regex = new RegExp(route.replace(/\*/g, '.*'));
    return regex.test(pathname);
  });
  
  // Skip auth for public routes
  if (isPublicRoute || isTenantPublicRoute) {
    console.log(`🌐 Route is public, skipping auth: ${pathname}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Handle authentication for protected routes
  try {
    console.log(`🔐 Route is protected, checking auth: ${pathname}`);
    const authResult = await auth();
    
    console.log('🔐 Auth check result:', {
      hasUserId: !!authResult.userId,
      userId: authResult.userId?.substring(0, 8) + '...' 
    });
    
    console.log('✅ Auth protection passed');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log('❌ Auth protection failed:', error);
    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

