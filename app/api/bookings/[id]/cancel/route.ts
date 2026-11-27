import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendBookingCancelledEmail, BookingEmailData } from '@/lib/email/email-service'

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { token, reason } = await request.json()

    if (typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { error: 'Cancel token is required' },
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

    // Verify cancel token (same as reschedule token)
    if (booking.metadata?.reschedule_token !== token) {
      return NextResponse.json(
        { error: 'Invalid cancel token' },
        { status: 403 }
      )
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel completed booking' },
        { status: 400 }
      )
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    // Resource lookup is optional for cancellation; a missing resource must not prevent cancellation.
    const {data: resource} = await supabaseAdmin.from('resources').select('title,location').eq('id',booking.resource_id).eq('org_id',booking.org_id).maybeSingle()

    // Update booking status to cancelled
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        metadata: {
          ...booking.metadata,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason || 'Cancelled by user',
          cancelled_by: 'user'
        }
      })
      .eq('id', bookingId)
      .eq('org_id', booking.org_id)
      .eq('metadata->>reschedule_token', token)
      .eq('status', booking.status)
      .select()
      .single()

    if (updateError) {
      console.error('Error cancelling booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    // Update announcement status if it exists
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
          status: 'cancelled',
          event_state: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', announcement.id)
        .eq('org_id',booking.org_id)
    }

    // Send cancellation notification email
    try {
      const host=booking.metadata?.host
      if(typeof host!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(host))throw Error('Booking host unavailable')
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        artistName: booking.metadata?.artist_name || 'Unknown Artist',
        artistEmail: booking.metadata?.artist_email || booking.user_id,
        hostName: booking.metadata?.host?.split('@')[0] || 'Host',
        hostEmail: host,
        resourceTitle: resource?.title || 'Unknown Resource',
        startTime: new Date(booking.start_time),
        endTime: new Date(booking.end_time),
        location: booking.location || resource?.location || 'TBD',
        meetingUrl: booking.metadata?.meeting_url,
        meetingCode: booking.metadata?.meeting_code,
        organizationName: 'Oolite Arts',
        rescheduleUrl: '', // Not needed for cancel email
        cancelUrl: '', // Not needed for cancel email
        icsUrl: '',
        calendarUrls: { google: '', outlook: '' }
      }

      const cancelResult = await sendBookingCancelledEmail(emailData, reason)
      console.log('Booking cancelled email result:', cancelResult)

    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError)
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
      cancellation_reason: reason || 'Cancelled by user'
    })

  } catch (error) {
    console.error('Error in cancel API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
