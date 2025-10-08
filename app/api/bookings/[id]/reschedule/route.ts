import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateScheduledGoogleMeetLink } from '@/lib/google-meet'
import { sendBookingRescheduledEmail, BookingEmailData } from '@/lib/email/email-service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { token, start_time, end_time, notes } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Reschedule token is required' },
        { status: 400 }
      )
    }

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: 'New start_time and end_time are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        resources (
          id,
          title,
          location,
          metadata,
          availability_rules
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

    // Verify reschedule token
    if (booking.metadata?.reschedule_token !== token) {
      return NextResponse.json(
        { error: 'Invalid reschedule token' },
        { status: 403 }
      )
    }

    // Check if booking can be rescheduled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot reschedule completed or cancelled booking' },
        { status: 400 }
      )
    }

    // Check if new time is in the future
    const newStartTime = new Date(start_time)
    const now = new Date()
    if (newStartTime <= now) {
      return NextResponse.json(
        { error: 'New booking time must be in the future' },
        { status: 400 }
      )
    }

    // Check availability for new time slot
    const resource = booking.resources
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Simple availability check - in a real system, you'd use the availability API
    const { data: conflictingBookings } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('resource_id', resource.id)
      .eq('status', 'confirmed')
      .neq('id', bookingId)
      .or(`and(start_time.lt.${end_time},end_time.gt.${start_time})`)

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 409 }
      )
    }

    // Generate new Google Meet link if it's a remote visit
    let newMeetingUrl = booking.location
    let newMeetingCode = booking.metadata?.meeting_code
    
    if (resource.metadata?.meeting_platform === 'google_meet' || 
        resource.metadata?.booking_type === 'remote_visit') {
      const meetConfig = {
        meetingTitle: booking.title,
        description: booking.description || 'Remote consultation via Google Meet',
        startTime: newStartTime,
        endTime: new Date(end_time),
        hostEmail: booking.metadata?.host || 'mo@oolite.org',
        attendeeEmails: [booking.metadata?.artist_email || booking.user_id]
      }
      
      const meetResult = generateScheduledGoogleMeetLink(meetConfig)
      newMeetingUrl = meetResult.meetUrl
      newMeetingCode = meetResult.meetingCode
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        start_time: start_time,
        end_time: end_time,
        location: newMeetingUrl,
        notes: notes || booking.notes,
        updated_at: new Date().toISOString(),
        metadata: {
          ...booking.metadata,
          meeting_url: newMeetingUrl,
          meeting_code: newMeetingCode,
          rescheduled_at: new Date().toISOString(),
          rescheduled_from: {
            start_time: booking.start_time,
            end_time: booking.end_time,
            location: booking.location
          }
        }
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to reschedule booking' },
        { status: 500 }
      )
    }

    // Update announcement if it exists
    const { data: announcement } = await supabaseAdmin
      .from('announcements')
      .select('id')
      .eq('payload->booking_id', bookingId)
      .single()

    if (announcement) {
      await supabaseAdmin
        .from('announcements')
        .update({
          starts_at: start_time,
          ends_at: end_time,
          location: newMeetingUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcement.id)
    }

    // Send reschedule notification email
    try {
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        artistName: booking.metadata?.artist_name || 'Unknown Artist',
        artistEmail: booking.metadata?.artist_email || booking.user_id,
        hostName: booking.metadata?.host?.split('@')[0] || 'Host',
        hostEmail: booking.metadata?.host || 'mo@oolite.org',
        resourceTitle: resource.title,
        startTime: new Date(start_time),
        endTime: new Date(end_time),
        location: newMeetingUrl || resource.location || 'TBD',
        meetingUrl: newMeetingUrl,
        meetingCode: newMeetingCode,
        organizationName: 'Oolite Arts',
        rescheduleUrl: '', // Not needed for reschedule email
        cancelUrl: '', // Not needed for reschedule email
        icsUrl: '',
        calendarUrls: { google: '', outlook: '' }
      }

      const oldStartTime = new Date(booking.start_time)
      const oldEndTime = new Date(booking.end_time)
      
      const rescheduleResult = await sendBookingRescheduledEmail(emailData, oldStartTime, oldEndTime)
      console.log('Booking rescheduled email result:', rescheduleResult)

    } catch (emailError) {
      console.error('Error sending reschedule email:', emailError)
      // Don't fail the reschedule if email fails
    }

    return NextResponse.json({
      message: 'Booking rescheduled successfully',
      booking: updatedBooking,
      new_meeting_url: newMeetingUrl,
      new_meeting_code: newMeetingCode
    })

  } catch (error) {
    console.error('Error in reschedule API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
