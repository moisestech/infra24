import { NextRequest, NextResponse } from 'next/server'
import { googleCalendarService } from '@/lib/google-calendar-integration'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Calendar Events API: Starting GET request')
    console.log('🔍 Calendar Events API: orgId =', params.orgId)

    // Get integration
    const integration = await googleCalendarService.getIntegration(params.orgId)
    
    if (!integration) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 404 }
      )
    }

    // Check if token needs refresh
    if (googleCalendarService.needsTokenRefresh(integration)) {
      console.log('🔄 Calendar Events API: Refreshing access token')
      await googleCalendarService.refreshAccessToken(integration)
    }

    // Sync events from Google Calendar
    const events = await googleCalendarService.syncEventsFromGoogle(integration)
    
    console.log('✅ Calendar Events API: Retrieved', events.length, 'events')
    return NextResponse.json({ events })
  } catch (error) {
    console.error('❌ Calendar Events API: Error retrieving events:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve calendar events',
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
    console.log('🔍 Calendar Events API: Starting POST request')
    console.log('🔍 Calendar Events API: orgId =', params.orgId)
    
    const body = await request.json()
    const { title, description, start, end, location, attendees } = body

    if (!title || !start || !end) {
      return NextResponse.json(
        { error: 'Title, start, and end are required' },
        { status: 400 }
      )
    }

    // Get integration
    const integration = await googleCalendarService.getIntegration(params.orgId)
    
    if (!integration) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 404 }
      )
    }

    // Check if token needs refresh
    if (googleCalendarService.needsTokenRefresh(integration)) {
      console.log('🔄 Calendar Events API: Refreshing access token')
      await googleCalendarService.refreshAccessToken(integration)
    }

    // Create event
    const event = await googleCalendarService.createEvent(integration, {
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      location,
      attendees,
      status: 'confirmed',
      source: 'infra24'
    })
    
    console.log('✅ Calendar Events API: Event created successfully:', event.id)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('❌ Calendar Events API: Error creating event:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create calendar event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
