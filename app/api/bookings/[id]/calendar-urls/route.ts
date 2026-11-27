import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  ICSBookingData,
} from '@/lib/ics-generator'

export const dynamic = 'force-dynamic'

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

    const { userId } = await auth()
    if (!userId) return NextResponse.json({error:'Authentication required'},{status:401,headers:{'Cache-Control':'private, no-store'}})
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

    // Email addresses in legacy participant records are not Clerk identity proof.
    if (booking.user_id !== userId) {
      const access = await requireOrganizationStaff(booking.org_id)
      if (!access.ok) return NextResponse.json({error:'Forbidden'},{status:403,headers:{'Cache-Control':'private, no-store'}})
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
      .eq('org_id', booking.org_id)
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

    // Prepare calendar data
    const calendarData: ICSBookingData = {
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

    // Generate calendar URLs
    const calendarUrls = {
      google: generateGoogleCalendarUrl(calendarData),
      outlook: generateOutlookCalendarUrl(calendarData),
      ics: `/api/bookings/${bookingId}/ics`
    }

    return NextResponse.json({
      booking_id: bookingId,
      calendar_urls: calendarUrls
    },{headers:{'Cache-Control':'private, no-store'}})

  } catch (error) {
    console.error('Error generating calendar URLs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
