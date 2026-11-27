import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateScheduledGoogleMeetLink } from '@/lib/google-meet'
import { configuredSlot,bookingBuffers } from '@/lib/booking/configured-slot'
import { bookingCalendarToken } from '@/lib/security/booking-receipt'
import { sendBookingRescheduledEmail, BookingEmailData } from '@/lib/email/email-service'

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { token, start_time, end_time, notes } = await request.json()

    if (typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { error: 'Reschedule token is required' },
        { status: 400 }
      )
    }

    if (typeof start_time !== 'string' || typeof end_time !== 'string' || !Number.isFinite(Date.parse(start_time)) || !Number.isFinite(Date.parse(end_time)) || Date.parse(end_time) <= Date.parse(start_time)) {
      return NextResponse.json(
        { error: 'New start_time and end_time are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
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
    const {data:resource,error:resourceError}=await supabaseAdmin.from('resources').select('id,title,location,metadata,availability_rules').eq('id',booking.resource_id).eq('org_id',booking.org_id).eq('is_active',true).eq('is_bookable',true).maybeSingle()
    if(resourceError) return NextResponse.json({error:'Resource verification unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}})
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const host=booking.metadata?.host
    if(typeof host!=='string'||!configuredSlot(resource.availability_rules,start_time,end_time,host))return NextResponse.json({error:'Outside configured availability'},{status:409})
    const {before,after}=bookingBuffers(resource.availability_rules)
    // Check interval including configured buffers
    const { data: conflictingBookings, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('resource_id', resource.id)
      .eq('org_id', booking.org_id)
      .eq('status', 'confirmed')
      .neq('id', bookingId)
      .lt('start_time', new Date(Date.parse(end_time)+before*60000).toISOString())
      .gt('end_time', new Date(newStartTime.getTime()-after*60000).toISOString())

    if (conflictError || !conflictingBookings) return NextResponse.json({error:'Availability check failed'},{status:503})

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
        hostEmail: host,
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
      .eq('org_id', booking.org_id)
      .eq('metadata->>reschedule_token', token)
      .eq('status', booking.status)
      .select()
      .single()

    if(updateError?.code==='23P01')return NextResponse.json({error:'Time slot is not available'},{status:409})
    if (updateError?.code === '40P01' || updateError?.code === '40001') return NextResponse.json({error:'Booking contention; retry availability'},{status:503})
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
      .eq('payload->>booking_id', bookingId)
      .eq('org_id',booking.org_id)
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
        .eq('org_id',booking.org_id)
    }

    // Send reschedule notification email
    try {
      const calendarPage = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings/confirmation/${booking.id}#calendar=${bookingCalendarToken(booking.id,token)}`
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        artistName: booking.metadata?.artist_name || 'Unknown Artist',
        artistEmail: booking.metadata?.artist_email || booking.user_id,
        hostName: booking.metadata?.host?.split('@')[0] || 'Host',
        hostEmail: host,
        resourceTitle: resource.title,
        startTime: new Date(start_time),
        endTime: new Date(end_time),
        location: newMeetingUrl || resource.location || 'TBD',
        meetingUrl: newMeetingUrl,
        meetingCode: newMeetingCode,
        organizationName: 'Oolite Arts',
        rescheduleUrl: '', // Not needed for reschedule email
        cancelUrl: '', // Not needed for reschedule email
        icsUrl: calendarPage,
        calendarUrls: { google: calendarPage, outlook: calendarPage }
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
