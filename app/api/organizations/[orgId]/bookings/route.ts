import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { conflictDetectionService } from '@/lib/conflict-detection'

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

    console.log('🔍 Bookings API: Starting GET request')
    console.log('🔍 Bookings API: orgId =', orgId)
    console.log('🔍 Bookings API: Query params:', { status, resourceId, startDate, endDate })

    const supabase = createClient()

    let query = supabase
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
      .eq('org_id', orgId)
      .order('start_time', { ascending: false })

    if (status) {
      console.log('🔍 Bookings API: Filtering by status:', status)
      query = query.eq('status', status)
    }

    if (resourceId) {
      console.log('🔍 Bookings API: Filtering by resource_id:', resourceId)
      query = query.eq('resource_id', resourceId)
    }

    if (startDate) {
      console.log('🔍 Bookings API: Filtering by start_date:', startDate)
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      console.log('🔍 Bookings API: Filtering by end_date:', endDate)
      query = query.lte('start_time', endDate)
    }

    console.log('🔍 Bookings API: Executing query...')
    const { data: bookings, error } = await query

    console.log('🔍 Bookings API: Query result:', { bookings: bookings?.length || 0, error })

    if (error) {
      console.error('❌ Bookings API: Error fetching bookings:', error)
      console.error('❌ Bookings API: Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch bookings',
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Bookings API: Successfully fetched', bookings?.length || 0, 'bookings')
    return NextResponse.json({ 
      bookings: bookings || [],
      count: bookings?.length || 0
    })
  } catch (error) {
    console.error('❌ Bookings API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
    
    console.log('🔍 Bookings API: Starting POST request')
    console.log('🔍 Bookings API: orgId =', orgId)
    console.log('🔍 Bookings API: Request body:', body)
    
    // Get user info from Clerk (optional for public bookings)
    const { userId } = await auth()
    console.log('🔍 Bookings API: User ID from auth:', userId)
    
    // If user is authenticated, get their email from Clerk
    let clerkUserEmail = null;
    if (userId) {
      try {
        const { currentUser } = await import('@clerk/nextjs/server');
        const user = await currentUser();
        clerkUserEmail = user?.emailAddresses?.[0]?.emailAddress;
        console.log('🔍 Bookings API: Clerk user email:', clerkUserEmail);
      } catch (error) {
        console.error('❌ Bookings API: Error getting Clerk user email:', error);
      }
    }
    
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
      console.error('❌ Bookings API: Missing required fields:', { resource_id, title, start_time, end_time })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('✅ Bookings API: Required fields validation passed')

    // Get resource details to calculate price
    const supabase = createClient()
    console.log('🔍 Bookings API: Fetching resource details for resource_id:', resource_id)

    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('price, currency, title')
      .eq('id', resource_id)
      .single()

    console.log('🔍 Bookings API: Resource query result:', { resource, resourceError })

    if (resourceError || !resource) {
      console.error('❌ Bookings API: Resource not found:', { resource_id, resourceError })
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    console.log('✅ Bookings API: Resource found:', resource.title)

    // Check for conflicts using enhanced conflict detection service
    console.log('🔍 Bookings API: Checking for conflicts using conflict detection service...')
    console.log('🔍 Bookings API: Time range:', { start_time, end_time })

    try {
      const conflicts = await conflictDetectionService.checkBookingConflicts(
        orgId,
        resource_id,
        new Date(start_time),
        new Date(end_time)
      )

      console.log('🔍 Bookings API: Conflict check result:', { conflicts: conflicts.length })

      if (conflicts.length > 0) {
        console.warn('⚠️ Bookings API: Conflicts detected:', conflicts)
        
        // Log conflicts for tracking
        for (const conflict of conflicts) {
          await conflictDetectionService.logConflict(
            orgId,
            resource_id,
            conflict.type,
            {
              start_time,
              end_time,
              conflict
            },
            conflict.severity
          )
        }

        return NextResponse.json(
          { 
            error: 'Booking conflicts detected',
            conflicts: conflicts,
            message: 'Please resolve conflicts before creating the booking'
          },
          { status: 409 }
        )
      }

      console.log('✅ Bookings API: No conflicts found, proceeding with booking creation')
    } catch (conflictError) {
      console.error('❌ Bookings API: Error checking conflicts:', conflictError)
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      )
    }

    // Create the booking
    console.log('🔍 Bookings API: Creating booking...')
    
    const bookingData = {
      org_id: orgId,
      resource_id,
      user_id: userId,
      user_name: user_name || 'Guest User',
      user_email: clerkUserEmail || user_email || 'guest@example.com',
      title,
      description,
      start_time,
      end_time,
      status: 'pending', // New bookings require approval
      capacity,
      current_participants: 0,
      price: resource.price,
      currency: resource.currency,
      location: location || resource.title,
      notes,
      created_by_clerk_id: userId || 'guest',
      updated_by_clerk_id: userId || 'guest',
      metadata: {
        ...metadata,
        resource_title: resource.title,
        created_via: 'digital_lab_booking'
      }
    }
    
    console.log('🔍 Bookings API: Booking data to insert:', bookingData)

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
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

    console.log('🔍 Bookings API: Booking creation result:', { booking: booking?.id, bookingError })

    if (bookingError) {
      console.error('❌ Bookings API: Error creating booking:', bookingError)
      console.error('❌ Bookings API: Booking error details:', {
        code: bookingError.code,
        message: bookingError.message,
        details: bookingError.details,
        hint: bookingError.hint
      })
      return NextResponse.json(
        { 
          error: 'Failed to create booking',
          details: bookingError.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Bookings API: Booking created successfully:', booking.id)

    // Send confirmation email to user and notification to staff
    console.log('🔍 Bookings API: Sending notifications...')
    try {
      // Import services dynamically to avoid build issues
      const { Resend } = await import('resend')
      
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Send confirmation email to user
      console.log('🔍 Bookings API: Sending confirmation email to:', booking.user_email)
      const userEmailData = {
        from: 'noreply@bakehouse-news.com',
        to: booking.user_email,
        subject: `Booking Request Submitted: ${booking.title} - ${booking.organizations.name}`,
        html: generateBookingRequestConfirmationHTML(booking)
      }

      const { data: userEmailResult, error: userEmailError } = await resend.emails.send(userEmailData)
      if (userEmailError) {
        console.error('❌ Bookings API: Error sending user confirmation email:', userEmailError)
      } else {
        console.log('✅ Bookings API: User confirmation email sent successfully:', userEmailResult)
      }

      // Send notification email to staff
      console.log('🔍 Bookings API: Sending staff notification email...')
      const staffEmailData = {
        from: 'noreply@bakehouse-news.com',
        to: 'digilab@oolitearts.org', // Digital lab staff email
        subject: `New Booking Request: ${booking.title} - ${booking.organizations.name}`,
        html: generateStaffNotificationHTML(booking)
      }

      const { data: staffEmailResult, error: staffEmailError } = await resend.emails.send(staffEmailData)
      if (staffEmailError) {
        console.error('❌ Bookings API: Error sending staff notification email:', staffEmailError)
      } else {
        console.log('✅ Bookings API: Staff notification email sent successfully:', staffEmailResult)
      }

    } catch (error) {
      console.error('❌ Bookings API: Error sending notifications:', error)
      // Don't fail the request if notifications fail
    }

    console.log('✅ Bookings API: POST request completed successfully')
    return NextResponse.json({ 
      booking,
      message: 'Booking created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Bookings API: Unexpected error in POST request:', error)
    console.error('❌ Bookings API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

// Email template for booking request confirmation (user)
function generateBookingRequestConfirmationHTML(booking: any) {
  const startTime = new Date(booking.start_time)
  const endTime = new Date(booking.end_time)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Request Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #47abc4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .status-pending { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Request Submitted</h1>
          <p>${booking.organizations.name}</p>
        </div>
        <div class="content">
          <p>Hello ${booking.user_name},</p>
          <p>Thank you for your booking request! We've received your request and our staff will review it shortly.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Service:</strong> ${booking.title}</p>
            <p><strong>Date:</strong> ${startTime.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${booking.location}</p>
            ${booking.description ? `<p><strong>Description:</strong> ${booking.description}</p>` : ''}
          </div>
          
          <div class="status-pending">
            <h4>⏳ Status: Pending Approval</h4>
            <p>Your booking request is currently pending approval. Our staff will review your request and notify you of the decision via email. You may receive:</p>
            <ul>
              <li><strong>Approval:</strong> Your booking will be confirmed and added to our calendar</li>
              <li><strong>Denial:</strong> We'll explain why and suggest alternatives</li>
              <li><strong>Rescheduling:</strong> We'll propose alternative times that work better</li>
            </ul>
          </div>
          
          <p>We'll send you an update within 24 hours. If you have any questions, please don't hesitate to contact us.</p>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} ${booking.organizations.name}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Email template for staff notification
function generateStaffNotificationHTML(booking: any) {
  const startTime = new Date(booking.start_time)
  const endTime = new Date(booking.end_time)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .action-required { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request</h1>
          <p>${booking.organizations.name} - Staff Notification</p>
        </div>
        <div class="content">
          <p>Hello Staff,</p>
          <p>A new booking request has been submitted and requires your review.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Service:</strong> ${booking.title}</p>
            <p><strong>Date:</strong> ${startTime.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${booking.location}</p>
            <p><strong>User:</strong> ${booking.user_name} (${booking.user_email})</p>
            ${booking.description ? `<p><strong>Description:</strong> ${booking.description}</p>` : ''}
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          
          <div class="action-required">
            <h4>⚠️ Action Required</h4>
            <p>Please review this booking request and take one of the following actions:</p>
            <ul>
              <li><strong>Approve:</strong> Confirm the booking and notify the user</li>
              <li><strong>Deny:</strong> Reject the booking with a reason</li>
              <li><strong>Reschedule:</strong> Propose alternative times</li>
            </ul>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
          </div>
          
          <p>Please respond to this request within 24 hours to maintain good customer service.</p>
          
          <div class="footer">
            <p>This is an automated notification from the booking system.</p>
            <p>© ${new Date().getFullYear()} ${booking.organizations.name}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
