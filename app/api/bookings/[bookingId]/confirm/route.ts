import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { googleCalendarService } from '@/lib/google-calendar'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params
    const { action } = await request.json() // 'confirm' or 'cancel'

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
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
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking status
    const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled'
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    // Send email notification
    try {
      const emailData = {
        from: 'noreply@bakehouse-news.com',
        to: [booking.user_email],
        subject: action === 'confirm' 
          ? `Booking Confirmed: ${booking.title} - ${booking.organizations.name}`
          : `Booking Cancelled: ${booking.title} - ${booking.organizations.name}`,
        html: generateBookingEmailHTML(booking, action === 'confirm')
      }

      const { data: emailResult, error: emailError } = await resend.emails.send(emailData)

      if (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail the request if email fails
      } else {
        console.log('Email sent successfully:', emailResult)
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
      // Don't fail the request if email fails
    }

    // Add to Google Calendar if confirmed
    let calendarResult = null
    if (action === 'confirm') {
      try {
        calendarResult = await googleCalendarService.createEvent(booking, booking.user_email)
        if (calendarResult.success) {
          console.log('Google Calendar event created:', calendarResult.eventId)
          
          // Store calendar event ID in booking metadata
          await supabase
            .from('bookings')
            .update({ 
              metadata: {
                ...booking.metadata,
                google_calendar_event_id: calendarResult.eventId,
                google_calendar_link: calendarResult.eventLink
              }
            })
            .eq('id', bookingId)
        } else {
          console.error('Failed to create Google Calendar event:', calendarResult.error)
        }
      } catch (error) {
        console.error('Google Calendar integration error:', error)
        // Don't fail the request if calendar integration fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      status: newStatus,
      message: `Booking ${newStatus} successfully`
    })
  } catch (error) {
    console.error('Error in booking confirmation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateBookingEmailHTML(booking: any, isConfirmed: boolean) {
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

  const statusColor = isConfirmed ? '#10B981' : '#EF4444'
  const statusText = isConfirmed ? 'Confirmed' : 'Cancelled'
  const statusIcon = isConfirmed ? '✅' : '❌'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Digital Lab Booking ${statusText}</title>
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
          background: ${statusColor};
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
          border-left: 4px solid ${statusColor};
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
        <h1>${statusIcon} Digital Lab Booking ${statusText}</h1>
        <p>${booking.organizations.name}</p>
      </div>
      
      <div class="content">
        <div class="status-badge">
          ${statusText.toUpperCase()}
        </div>
        
        <p>Hello ${booking.user_name},</p>
        
        <p>Your Digital Lab booking has been <strong>${statusText.toLowerCase()}</strong>.</p>
        
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
        
        ${isConfirmed ? `
        <h3>What's Next?</h3>
        <ul>
          <li>Arrive 10 minutes before your scheduled time</li>
          <li>Bring any required materials or files</li>
          <li>Check in with Digital Lab staff upon arrival</li>
          <li>Follow all safety guidelines and equipment instructions</li>
        </ul>
        
        <p><strong>Need to make changes?</strong> Contact us at least 24 hours in advance.</p>
        ` : `
        <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
        `}
        
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
