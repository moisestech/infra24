import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; bookingId: string }> }
) {
  try {
    const { orgId, bookingId } = await params;
    const body = await request.json();
    const { status, notes, updated_by } = body;

    console.log('🔍 Booking Update API: Updating booking', bookingId, 'with status:', status);

    const supabase = getSupabaseAdmin();

    // Update the booking
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
        updated_by_clerk_id: updated_by || 'admin'
      })
      .eq('id', bookingId)
      .eq('org_id', orgId)
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
      .single();

    if (updateError) {
      console.error('❌ Booking Update API: Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('✅ Booking Update API: Booking updated successfully:', booking.id);

    // Send email notification to user about status change
    if (booking.user_email && status !== 'pending') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        let emailSubject = '';
        let emailHtml = '';

        switch (status) {
          case 'confirmed':
            emailSubject = `Booking Confirmed: ${booking.title} - ${booking.organizations.name}`;
            emailHtml = generateBookingConfirmationHTML(booking, notes);
            break;
          case 'cancelled':
            emailSubject = `Booking Cancelled: ${booking.title} - ${booking.organizations.name}`;
            emailHtml = generateBookingCancellationHTML(booking, notes);
            break;
          default:
            emailSubject = `Booking Update: ${booking.title} - ${booking.organizations.name}`;
            emailHtml = generateBookingUpdateHTML(booking, status, notes);
        }

        const emailData = {
          from: 'noreply@bakehouse-news.com',
          to: booking.user_email,
          subject: emailSubject,
          html: emailHtml
        };

        const { data: emailResult, error: emailError } = await resend.emails.send(emailData);
        if (emailError) {
          console.error('❌ Booking Update API: Error sending status email:', emailError);
        } else {
          console.log('✅ Booking Update API: Status email sent successfully:', emailResult);
        }
      } catch (emailError) {
        console.error('❌ Booking Update API: Error sending email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      booking 
    });

  } catch (error) {
    console.error('❌ Booking Update API: Error in PATCH request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email template generators
function generateBookingConfirmationHTML(booking: any, notes?: string) {
  const startTime = new Date(booking.start_time).toLocaleString();
  const endTime = new Date(booking.end_time).toLocaleString();
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #47abc4;">Booking Confirmed! 🎉</h2>
      
      <p>Hi ${booking.user_name || 'there'},</p>
      
      <p>Great news! Your booking request has been confirmed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
        <p><strong>Resource:</strong> ${booking.resources?.title || booking.title}</p>
        <p><strong>Date & Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Location:</strong> ${booking.resources?.location || booking.location || 'Digital Lab'}</p>
        <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Confirmed</span></p>
      </div>
      
      ${notes ? `
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #333;">Additional Notes</h4>
          <p>${notes}</p>
        </div>
      ` : ''}
      
      <p>If you have any questions or need to make changes, please contact us at <a href="mailto:digilab@oolitearts.org">digilab@oolitearts.org</a>.</p>
      
      <p>Best regards,<br>Digital Lab Team</p>
    </div>
  `;
}

function generateBookingCancellationHTML(booking: any, notes?: string) {
  const startTime = new Date(booking.start_time).toLocaleString();
  const endTime = new Date(booking.end_time).toLocaleString();
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc3545;">Booking Cancelled</h2>
      
      <p>Hi ${booking.user_name || 'there'},</p>
      
      <p>We're writing to inform you that your booking request has been cancelled.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
        <p><strong>Resource:</strong> ${booking.resources?.title || booking.title}</p>
        <p><strong>Date & Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Cancelled</span></p>
      </div>
      
      ${notes ? `
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #721c24;">Reason</h4>
          <p>${notes}</p>
        </div>
      ` : ''}
      
      <p>If you have any questions or would like to reschedule, please contact us at <a href="mailto:digilab@oolitearts.org">digilab@oolitearts.org</a>.</p>
      
      <p>Best regards,<br>Digital Lab Team</p>
    </div>
  `;
}

function generateBookingUpdateHTML(booking: any, status: string, notes?: string) {
  const startTime = new Date(booking.start_time).toLocaleString();
  const endTime = new Date(booking.end_time).toLocaleString();
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #47abc4;">Booking Update</h2>
      
      <p>Hi ${booking.user_name || 'there'},</p>
      
      <p>We're writing to inform you about an update to your booking.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
        <p><strong>Resource:</strong> ${booking.resources?.title || booking.title}</p>
        <p><strong>Date & Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Status:</strong> <span style="font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
      </div>
      
      ${notes ? `
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #333;">Update Details</h4>
          <p>${notes}</p>
        </div>
      ` : ''}
      
      <p>If you have any questions, please contact us at <a href="mailto:digilab@oolitearts.org">digilab@oolitearts.org</a>.</p>
      
      <p>Best regards,<br>Digital Lab Team</p>
    </div>
  `;
}
