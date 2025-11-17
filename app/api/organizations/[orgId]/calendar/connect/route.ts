import { NextRequest, NextResponse } from 'next/server'
import { googleCalendarService } from '@/lib/google-calendar-integration'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Calendar Connect API: Starting GET request')
    console.log('🔍 Calendar Connect API: orgId =', params.orgId)

    // Generate authorization URL
    const authUrl = googleCalendarService.generateAuthUrl(params.orgId)
    
    console.log('✅ Calendar Connect API: Generated auth URL')
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('❌ Calendar Connect API: Error generating auth URL:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate authorization URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Calendar Connect API: Starting POST request')
    console.log('🔍 Calendar Connect API: orgId =', params.orgId)
    
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange code for tokens
    const integration = await googleCalendarService.exchangeCodeForTokens(code, params.orgId)
    
    console.log('✅ Calendar Connect API: Integration created successfully:', integration.id)
    return NextResponse.json(integration, { status: 201 })
  } catch (error) {
    console.error('❌ Calendar Connect API: Error exchanging code for tokens:', error)
    return NextResponse.json(
      { 
        error: 'Failed to connect Google Calendar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
