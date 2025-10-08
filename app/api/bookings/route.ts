import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateScheduledGoogleMeetLink } from '@/lib/google-meet'
import { sendBookingConfirmationEmail, sendHostNotificationEmail, BookingEmailData } from '@/lib/email/email-service'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

interface CreateBookingRequest {
  org_id: string
  resource_id: string
  start_time: string
  end_time: string
  artist_name: string
  artist_email: string
  goal_text?: string
  consent_recording?: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('org_id')
    const when = searchParams.get('when') || 'today'
    const owner = searchParams.get('owner') || 'team'
    const resourceId = searchParams.get('resource_id')
    const status = searchParams.get('status')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Missing org_id parameter' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Build date range based on 'when' parameter
    let startDate: Date
    let endDate: Date

    switch (when) {
      case 'today':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        break
      case 'week':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setDate(endDate.getDate() + 7)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'range':
        const start = searchParams.get('start')
        const end = searchParams.get('end')
        if (!start || !end) {
          return NextResponse.json(
            { error: 'Missing start and end dates for range' },
            { status: 400 }
          )
        }
        startDate = new Date(start)
        endDate = new Date(end)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid when parameter. Use: today, week, or range' },
          { status: 400 }
        )
    }

    // Build query
    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        booking_participants (
          user_id,
          status
        )
      `)
      .eq('org_id', orgId)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: true })

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Error in bookings GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingRequest = await request.json()
    
    const {
      org_id,
      resource_id,
      start_time,
      end_time,
      artist_name,
      artist_email,
      goal_text,
      consent_recording = false
    } = body

    // Validate required fields
    if (!org_id || !resource_id || !start_time || !end_time || !artist_name || !artist_email) {
      return NextResponse.json(
        { error: 'Missing required fields: org_id, resource_id, start_time, end_time, artist_name, artist_email' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get resource details
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', resource_id)
      .eq('org_id', org_id)
      .eq('is_active', true)
      .eq('is_bookable', true)
      .single()

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found or not bookable' },
        { status: 404 }
      )
    }

    // Validate slot availability
    const slotAvailable = await validateSlotAvailability(
      supabaseAdmin,
      resource_id,
      start_time,
      end_time,
      resource.availability_rules
    )

    if (!slotAvailable.available) {
      return NextResponse.json(
        { error: slotAvailable.reason || 'Slot no longer available' },
        { status: 409 }
      )
    }

    // Generate reschedule/cancel token
    const rescheduleToken = crypto.randomBytes(32).toString('hex')

    // Determine host (from availability or default)
    const host = slotAvailable.host || resource.metadata?.default_hosts?.[0] || 'mo@oolite.org'

    // Generate Google Meet link for remote visits
    let meetingUrl: string | undefined
    let meetingCode: string | undefined
    
    if (resource.metadata?.meeting_platform === 'google_meet' || 
        resource.metadata?.booking_type === 'remote_visit') {
      const meetConfig = {
        meetingTitle: `${resource.title} — ${artist_name}`,
        description: goal_text || 'Remote consultation via Google Meet',
        startTime: new Date(start_time),
        endTime: new Date(end_time),
        hostEmail: host,
        attendeeEmails: [artist_email]
      }
      
      const meetResult = generateScheduledGoogleMeetLink(meetConfig)
      meetingUrl = meetResult.meetUrl
      meetingCode = meetResult.meetingCode
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        org_id: org_id,
        user_id: artist_email, // Using email as user identifier for public bookings
        resource_type: 'space',
        resource_id: resource_id,
        title: `${resource.title} — ${artist_name}`,
        description: goal_text || '',
        start_time: start_time,
        end_time: end_time,
        status: 'confirmed',
        capacity: 1,
        current_participants: 1,
        price: resource.price || 0,
        currency: resource.currency || 'USD',
        location: meetingUrl || resource.location || 'TBD',
        notes: 'Booked via Infra24',
        metadata: {
          reschedule_token: rescheduleToken,
          host: host,
          source: 'infra24',
          artist_name: artist_name,
          artist_email: artist_email,
          consent_recording: consent_recording,
          meeting_url: meetingUrl,
          meeting_code: meetingCode,
          meeting_platform: resource.metadata?.meeting_platform || 'google_meet'
        },
        created_by_clerk_id: 'public_booking',
        updated_by_clerk_id: 'public_booking'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Create participants
    const participants = [
      { booking_id: booking.id, user_id: artist_email, status: 'registered' },
      { booking_id: booking.id, user_id: host, status: 'confirmed' }
    ]

    const { error: participantsError } = await supabaseAdmin
      .from('booking_participants')
      .insert(participants)

    if (participantsError) {
      console.error('Error creating participants:', participantsError)
      // Continue anyway - booking is created
    }

    // Create announcement
    const announcementTitle = `${resource.title} — ${artist_name} with ${host.split('@')[0]}`
    const announcementBody = goal_text ? goal_text.substring(0, 240) : ''

    const { error: announcementError } = await supabaseAdmin
      .from('announcements')
      .insert({
        organization_id: org_id,
        org_id: org_id,
        author_clerk_id: 'system',
        created_by: 'system',
        updated_by: 'system',
        title: announcementTitle,
        body: announcementBody,
        status: 'approved',
        visibility: 'internal',
        starts_at: start_time,
        ends_at: end_time,
        location: resource.location || 'TBD',
        type: 'booking',
        sub_type: resource.metadata?.booking_type || 'consultation',
        event_state: 'scheduled',
        primary_link: resource.location || 'TBD',
        payload: {
          booking_id: booking.id,
          resource_id: resource_id,
          hosts: [host],
          artist: {
            name: artist_name,
            email: artist_email
          },
          duration_minutes: Math.round((new Date(end_time).getTime() - new Date(start_time).getTime()) / 60000)
        },
        timezone: resource.availability_rules?.timezone || 'America/New_York',
        priority: 0
      })

    if (announcementError) {
      console.error('Error creating announcement:', announcementError)
      // Continue anyway - booking is created
    }

    // Generate URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const confirmationUrl = `${baseUrl}/bookings/confirmation/${booking.id}`
    const rescheduleUrl = `${baseUrl}/bookings/reschedule/${booking.id}?token=${rescheduleToken}`
    const cancelUrl = `${baseUrl}/bookings/cancel/${booking.id}?token=${rescheduleToken}`
    const icsUrl = `${baseUrl}/api/bookings/${booking.id}/ics`
    const calendarUrls = {
      google: `${baseUrl}/api/bookings/${booking.id}/calendar-urls?provider=google`,
      outlook: `${baseUrl}/api/bookings/${booking.id}/calendar-urls?provider=outlook`
    }

    // Send email notifications
    try {
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        artistName: artist_name,
        artistEmail: artist_email,
        hostName: host.split('@')[0],
        hostEmail: host,
        resourceTitle: resource.title,
        startTime: new Date(start_time),
        endTime: new Date(end_time),
        location: meetingUrl || resource.location || 'TBD',
        meetingUrl: meetingUrl,
        meetingCode: meetingCode,
        organizationName: 'Oolite Arts', // TODO: Get from organization data
        rescheduleUrl: rescheduleUrl,
        cancelUrl: cancelUrl,
        icsUrl: icsUrl,
        calendarUrls: calendarUrls
      }

      // Send confirmation email to artist
      const confirmationResult = await sendBookingConfirmationEmail(emailData)
      console.log('Booking confirmation email result:', confirmationResult)

      // Send notification email to host
      const hostNotificationResult = await sendHostNotificationEmail(emailData)
      console.log('Host notification email result:', hostNotificationResult)

    } catch (emailError) {
      console.error('Error sending booking emails:', emailError)
      // Don't fail the booking creation if emails fail
    }

    return NextResponse.json({
      booking_id: booking.id,
      confirmation_url: confirmationUrl,
      reschedule_url: rescheduleUrl,
      cancel_url: cancelUrl,
      booking: booking
    }, { status: 201 })

  } catch (error) {
    console.error('Error in bookings POST API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function validateSlotAvailability(
  supabaseAdmin: any,
  resourceId: string,
  startTime: string,
  endTime: string,
  availabilityRules: any
): Promise<{ available: boolean; reason?: string; host?: string }> {
  try {
    // Check for existing bookings in the same time slot
    const { data: conflictingBookings } = await supabaseAdmin
      .from('bookings')
      .select('start_time, end_time, metadata')
      .eq('resource_id', resourceId)
      .eq('status', 'confirmed')
      .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

    if (conflictingBookings && conflictingBookings.length > 0) {
      return { available: false, reason: 'Time slot is already booked' }
    }

    // For now, return the first available host
    // In a more sophisticated implementation, you'd check availability rules
    const defaultHost = availabilityRules?.windows?.[0]?.host || 'mo@oolite.org'
    
    return { available: true, host: defaultHost }

  } catch (error) {
    console.error('Error validating slot availability:', error)
    return { available: false, reason: 'Error checking availability' }
  }
}