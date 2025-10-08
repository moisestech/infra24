import { NextRequest, NextResponse } from 'next/server'
import { GoogleCalendarService } from '@/lib/calendar/google-calendar'

// Force dynamic rendering for this callback route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get base URL with fallback for build time
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This should contain the user ID
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        `${baseUrl}/bookings?error=google_auth_failed`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${baseUrl}/bookings?error=missing_auth_data`
      )
    }

    // Exchange code for tokens
    const result = await GoogleCalendarService.exchangeCodeForTokens(code, state)

    if (!result.success) {
      console.error('Token exchange failed:', result.error)
      return NextResponse.redirect(
        `${baseUrl}/bookings?error=token_exchange_failed`
      )
    }

    // Redirect back to bookings page with success
    return NextResponse.redirect(
      `${baseUrl}/bookings?calendar_connected=google`
    )
  } catch (error) {
    console.error('Google callback error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      `${baseUrl}/bookings?error=callback_failed`
    )
  }
}
