import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateICS, generateICSFileName, ICSBookingData } from '@/lib/ics-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get booking details with participants
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (
          user_id,
          status
        )
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Get organization details
    const { data: organization } = await supabaseAdmin
      .from('organizations')
      .select('name')
      .eq('id', booking.org_id)
      .single()

    // Get resource details
    const { data: resource } = await supabaseAdmin
      .from('resources')
      .select('title, location')
      .eq('id', booking.resource_id)
      .single()

    // Extract participant information
    const participants = booking.booking_participants || []
    const artistParticipant = participants.find((p: any) => p.status === 'registered')
    const hostParticipant = participants.find((p: any) => p.status === 'confirmed')

    if (!artistParticipant || !hostParticipant) {
      return NextResponse.json(
        { error: 'Missing participant information' },
        { status: 400 }
      )
    }

    // Prepare ICS data
    const icsData: ICSBookingData = {
      bookingId: booking.id,
      title: booking.title,
      description: booking.description || '',
      startTime: new Date(booking.start_time),
      endTime: new Date(booking.end_time),
      location: booking.location || resource?.location || 'TBD',
      artistName: booking.metadata?.artist_name || 'Unknown Artist',
      artistEmail: artistParticipant.user_id,
      hostEmail: hostParticipant.user_id,
      hostName: booking.metadata?.host?.split('@')[0] || hostParticipant.user_id.split('@')[0],
      organizationName: organization?.name || 'Oolite Arts',
      meetingUrl: booking.location?.includes('http') ? booking.location : undefined
    }

    // Generate ICS content
    console.log('ICS API - Generating ICS for data:', icsData)
    const icsContent = generateICS(icsData)
    console.log('ICS API - Generated content length:', icsContent.length)
    const fileName = generateICSFileName(booking.id, booking.title)

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('ICS API - Error generating ICS file:', error)
    console.error('ICS API - Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      bookingId: 'unknown'
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
