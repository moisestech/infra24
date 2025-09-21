import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const resourceId = searchParams.get('resource_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        resources (
          id,
          title,
          type,
          category,
          location
        )
      `)
      .eq('organization_id', orgId)
      .order('start_time', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('start_time', endDate)
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
    console.error('Error in bookings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const body = await request.json()
    
    // Get user info from Clerk (optional for public bookings)
    const { userId } = await auth()
    
    const {
      resource_id,
      title,
      description,
      start_time,
      end_time,
      capacity = 1,
      location,
      notes,
      user_name,
      user_email,
      metadata = {}
    } = body

    // Validate required fields
    if (!resource_id || !title || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get resource details to calculate price
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('price, currency, title')
      .eq('id', resource_id)
      .single()

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Check for conflicts
    const { data: conflicts, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('id, title, start_time, end_time')
      .eq('resource_id', resource_id)
      .eq('status', 'confirmed')
      .or(`and(start_time.lt.${end_time},end_time.gt.${start_time})`)

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError)
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      )
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Time slot is not available',
          conflicts: conflicts.map(c => ({
            title: c.title,
            start_time: c.start_time,
            end_time: c.end_time
          }))
        },
        { status: 409 }
      )
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        organization_id: orgId,
        resource_id,
        user_id: userId,
        user_name: user_name || 'Guest User',
        user_email: user_email || 'guest@example.com',
        title,
        description,
        start_time,
        end_time,
        status: 'confirmed', // Auto-confirm Digital Lab bookings
        capacity,
        current_participants: 0,
        price: resource.price,
        currency: resource.currency,
        location: location || resource.title,
        notes,
        metadata: {
          ...metadata,
          resource_title: resource.title,
          created_via: 'digital_lab_booking'
        }
      })
      .select(`
        *,
        resources (
          id,
          title,
          type,
          category,
          location
        ),
        organizations (
          id,
          name,
          slug
        )
      `)
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Send confirmation email and add to Google Calendar
    try {
      // Import services dynamically to avoid build issues
      const { Resend } = await import('resend')
      const { googleCalendarService } = await import('@/lib/google-calendar')
      
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Send confirmation email
      const emailData = {
        from: 'noreply@bakehouse-news.com',
        to: booking.user_email,
        subject: `Booking Confirmed: ${booking.title} - ${booking.organizations.name}`,
        html: generateBookingConfirmationHTML(booking)
      }

      const { data: emailResult, error: emailError } = await resend.emails.send(emailData)
      if (emailError) {
        console.error('Error sending confirmation email:', emailError)
      } else {
        console.log('Confirmation email sent successfully:', emailResult)
      }

      // Add to Google Calendar
      const calendarResult = await googleCalendarService.createEvent(booking, booking.user_email)
      if (calendarResult.success) {
        console.log('Google Calendar event created:', calendarResult.eventId)
        
        // Store calendar event ID in booking metadata
        await supabaseAdmin
          .from('bookings')
          .update({ 
            metadata: {
              ...booking.metadata,
              google_calendar_event_id: calendarResult.eventId,
              google_calendar_link: calendarResult.eventLink
            }
          })
          .eq('id', booking.id)
      } else {
        console.error('Failed to create Google Calendar event:', calendarResult.error)
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Error in create booking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateBookingConfirmationHTML(booking: any) {
  const startDate = new Date(booking.start_time)
  const endDate = new Date(booking.end_time)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Digital Lab Booking Confirmed</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .status-badge {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .booking-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #10B981;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: bold;
          color: #666;
        }
        .detail-value {
          color: #333;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 5px;
        }
        .button:hover {
          background: #5a6fd8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Digital Lab Booking Confirmed</h1>
        <p>${booking.organizations.name}</p>
      </div>
      
      <div class="content">
        <div class="status-badge">
          CONFIRMED
        </div>
        
        <p>Hello ${booking.user_name},</p>
        
        <p>Great news! Your Digital Lab booking has been <strong>confirmed</strong>.</p>
        
        <div class="booking-details">
          <h3>Booking Details</h3>
          
          <div class="detail-row">
            <span class="detail-label">Resource:</span>
            <span class="detail-value">${booking.resources.title}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${formatDate(startDate)}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${formatTime(startDate)} - ${formatTime(endDate)}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${booking.resources.location}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Price:</span>
            <span class="detail-value">$${booking.price} ${booking.currency}</span>
          </div>
          
          ${booking.notes ? `
          <div class="detail-row">
            <span class="detail-label">Notes:</span>
            <span class="detail-value">${booking.notes}</span>
          </div>
          ` : ''}
        </div>
        
        <h3>What's Next?</h3>
        <ul>
          <li>Arrive 10 minutes before your scheduled time</li>
          <li>Bring any required materials or files</li>
          <li>Check in with Digital Lab staff upon arrival</li>
          <li>Follow all safety guidelines and equipment instructions</li>
        </ul>
        
        <p><strong>Need to make changes?</strong> Contact us at least 24 hours in advance.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://${booking.organizations.slug}.infra24.digital/digital-lab" class="button">
            View Digital Lab
          </a>
          <a href="https://${booking.organizations.slug}.infra24.digital/bookings" class="button">
            Manage Bookings
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p>This is an automated message from ${booking.organizations.name} Digital Lab.</p>
        <p>If you have any questions, please contact our Digital Lab team.</p>
      </div>
    </body>
    </html>
  `
}
