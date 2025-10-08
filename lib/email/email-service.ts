/**
 * Email Service
 * Main service for sending booking-related emails
 */

import { sendEmail, EmailOptions } from './resend-client'
import { generateBookingConfirmationHTML, generateBookingConfirmationText, BookingConfirmationData } from './templates/booking-confirmation'

export interface BookingEmailData {
  bookingId: string
  artistName: string
  artistEmail: string
  hostName: string
  hostEmail: string
  resourceTitle: string
  startTime: Date
  endTime: Date
  location: string
  meetingUrl?: string
  meetingCode?: string
  organizationName: string
  rescheduleUrl: string
  cancelUrl: string
  icsUrl: string
  calendarUrls: {
    google: string
    outlook: string
  }
}

export interface WaitlistNotificationData {
  userEmail: string
  userName: string
  resourceTitle: string
  availableSlots: Array<{
    start_time: string
    end_time: string
    host: string
  }>
  expiresAt: Date
  entryId: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  recipient: string
  type: 'confirmation' | 'reminder' | 'rescheduled' | 'cancelled'
}

/**
 * Send booking confirmation email to artist
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<EmailResult> {
  try {
    const emailData: BookingConfirmationData = {
      artistName: data.artistName,
      artistEmail: data.artistEmail,
      hostName: data.hostName,
      hostEmail: data.hostEmail,
      resourceTitle: data.resourceTitle,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      meetingUrl: data.meetingUrl,
      meetingCode: data.meetingCode,
      organizationName: data.organizationName,
      rescheduleUrl: data.rescheduleUrl,
      cancelUrl: data.cancelUrl,
      icsUrl: data.icsUrl,
      calendarUrls: data.calendarUrls
    }

    const emailOptions: EmailOptions = {
      to: data.artistEmail,
      subject: `Booking Confirmed: ${data.resourceTitle} - ${data.startTime.toLocaleDateString()}`,
      html: generateBookingConfirmationHTML(emailData),
      text: generateBookingConfirmationText(emailData),
      replyTo: data.hostEmail,
      tags: [
        { name: 'type', value: 'booking_confirmation' },
        { name: 'booking_id', value: data.bookingId },
        { name: 'organization', value: data.organizationName }
      ]
    }

    const result = await sendEmail(emailOptions)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.artistEmail,
      type: 'confirmation'
    }

  } catch (error: any) {
    console.error('Error sending booking confirmation email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send confirmation email',
      recipient: data.artistEmail,
      type: 'confirmation'
    }
  }
}

/**
 * Send booking notification email to host
 */
export async function sendHostNotificationEmail(data: BookingEmailData): Promise<EmailResult> {
  try {
    const emailOptions: EmailOptions = {
      to: data.hostEmail,
      subject: `New Booking: ${data.resourceTitle} with ${data.artistName}`,
      html: generateHostNotificationHTML(data),
      text: generateHostNotificationText(data),
      replyTo: data.artistEmail,
      tags: [
        { name: 'type', value: 'host_notification' },
        { name: 'booking_id', value: data.bookingId },
        { name: 'organization', value: data.organizationName }
      ]
    }

    const result = await sendEmail(emailOptions)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.hostEmail,
      type: 'confirmation'
    }

  } catch (error: any) {
    console.error('Error sending host notification email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send host notification',
      recipient: data.hostEmail,
      type: 'confirmation'
    }
  }
}

/**
 * Send waitlist notification email
 */
export async function sendWaitlistNotificationEmail(data: WaitlistNotificationData): Promise<EmailResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const bookingUrl = `${baseUrl}/waitlist/book/${data.entryId}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Slot Available - ${data.resourceTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .slot { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 15px 0; }
          .slot-time { font-size: 18px; font-weight: bold; color: #667eea; }
          .slot-host { color: #666; margin-top: 5px; }
          .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .cta-button:hover { background: #5a6fd8; }
          .expires { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Great News!</h1>
          <h2>A slot is now available for ${data.resourceTitle}</h2>
        </div>
        
        <div class="content">
          <p>Hi ${data.userName},</p>
          
          <p>Good news! A slot has become available for <strong>${data.resourceTitle}</strong> and you're next on the waitlist!</p>
          
          <h3>Available Slots:</h3>
          ${data.availableSlots.map(slot => `
            <div class="slot">
              <div class="slot-time">${new Date(slot.start_time).toLocaleString()}</div>
              <div class="slot-host">Host: ${slot.host}</div>
            </div>
          `).join('')}
          
          <div class="expires">
            <strong>⏰ Important:</strong> This notification expires at ${data.expiresAt.toLocaleString()}. 
            Book quickly as slots are first-come, first-served!
          </div>
          
          <div style="text-align: center;">
            <a href="${bookingUrl}" class="cta-button">Book This Slot Now</a>
          </div>
          
          <p>If you're no longer interested, you can ignore this email and we'll automatically remove you from the waitlist.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message from Infra24 Booking System</p>
          <p>If you have any questions, please contact support.</p>
        </div>
      </body>
      </html>
    `

    const textContent = `
      Great News! A slot is now available for ${data.resourceTitle}
      
      Hi ${data.userName},
      
      Good news! A slot has become available for ${data.resourceTitle} and you're next on the waitlist!
      
      Available Slots:
      ${data.availableSlots.map(slot => 
        `- ${new Date(slot.start_time).toLocaleString()} (Host: ${slot.host})`
      ).join('\n')}
      
      Important: This notification expires at ${data.expiresAt.toLocaleString()}. 
      Book quickly as slots are first-come, first-served!
      
      Book this slot: ${bookingUrl}
      
      If you're no longer interested, you can ignore this email and we'll automatically remove you from the waitlist.
      
      This is an automated message from Infra24 Booking System
    `

    const emailOptions: EmailOptions = {
      to: data.userEmail,
      subject: `🎉 Slot Available: ${data.resourceTitle}`,
      html: htmlContent,
      text: textContent
    }

    const result = await sendEmail(emailOptions)

    if (result.success) {
      console.log(`Waitlist notification email sent to ${data.userEmail}`)
    } else {
      console.error(`Failed to send waitlist notification email to ${data.userEmail}:`, result.error)
    }

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.userEmail,
      type: 'confirmation' as const
    }

  } catch (error: any) {
    console.error('Error sending waitlist notification email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send waitlist notification email',
      recipient: data.userEmail,
      type: 'confirmation' as const
    }
  }
}

/**
 * Send booking reminder email
 */
export async function sendBookingReminderEmail(data: BookingEmailData, reminderType: '24h' | '1h'): Promise<EmailResult> {
  try {
    const hours = reminderType === '24h' ? '24 hours' : '1 hour'
    const subject = `Reminder: ${data.resourceTitle} in ${hours}`

    const emailOptions: EmailOptions = {
      to: data.artistEmail,
      subject: subject,
      html: generateReminderHTML(data, reminderType),
      text: generateReminderText(data, reminderType),
      replyTo: data.hostEmail,
      tags: [
        { name: 'type', value: 'booking_reminder' },
        { name: 'reminder_type', value: reminderType },
        { name: 'booking_id', value: data.bookingId },
        { name: 'organization', value: data.organizationName }
      ]
    }

    const result = await sendEmail(emailOptions)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.artistEmail,
      type: 'reminder'
    }

  } catch (error: any) {
    console.error('Error sending booking reminder email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send reminder email',
      recipient: data.artistEmail,
      type: 'reminder'
    }
  }
}

/**
 * Send booking rescheduled email
 */
export async function sendBookingRescheduledEmail(data: BookingEmailData, oldStartTime: Date, oldEndTime: Date): Promise<EmailResult> {
  try {
    const emailOptions: EmailOptions = {
      to: data.artistEmail,
      subject: `Booking Rescheduled: ${data.resourceTitle}`,
      html: generateRescheduledHTML(data, oldStartTime, oldEndTime),
      text: generateRescheduledText(data, oldStartTime, oldEndTime),
      replyTo: data.hostEmail,
      tags: [
        { name: 'type', value: 'booking_rescheduled' },
        { name: 'booking_id', value: data.bookingId },
        { name: 'organization', value: data.organizationName }
      ]
    }

    const result = await sendEmail(emailOptions)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.artistEmail,
      type: 'rescheduled'
    }

  } catch (error: any) {
    console.error('Error sending booking rescheduled email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send rescheduled email',
      recipient: data.artistEmail,
      type: 'rescheduled'
    }
  }
}

/**
 * Send booking cancelled email
 */
export async function sendBookingCancelledEmail(data: BookingEmailData, reason?: string): Promise<EmailResult> {
  try {
    const emailOptions: EmailOptions = {
      to: data.artistEmail,
      subject: `Booking Cancelled: ${data.resourceTitle}`,
      html: generateCancelledHTML(data, reason),
      text: generateCancelledText(data, reason),
      replyTo: data.hostEmail,
      tags: [
        { name: 'type', value: 'booking_cancelled' },
        { name: 'booking_id', value: data.bookingId },
        { name: 'organization', value: data.organizationName }
      ]
    }

    const result = await sendEmail(emailOptions)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipient: data.artistEmail,
      type: 'cancelled'
    }

  } catch (error: any) {
    console.error('Error sending booking cancelled email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send cancelled email',
      recipient: data.artistEmail,
      type: 'cancelled'
    }
  }
}

// Helper functions for generating email content

function generateHostNotificationHTML(data: BookingEmailData): string {
  return `
    <h2>New Booking Notification</h2>
    <p>You have a new booking for ${data.resourceTitle}.</p>
    <p><strong>Artist:</strong> ${data.artistName} (${data.artistEmail})</p>
    <p><strong>Date:</strong> ${data.startTime.toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}</p>
    ${data.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}">${data.meetingUrl}</a></p>` : ''}
  `
}

function generateHostNotificationText(data: BookingEmailData): string {
  return `
New Booking Notification

You have a new booking for ${data.resourceTitle}.

Artist: ${data.artistName} (${data.artistEmail})
Date: ${data.startTime.toLocaleDateString()}
Time: ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}
${data.meetingUrl ? `Meeting Link: ${data.meetingUrl}` : ''}
  `.trim()
}

function generateReminderHTML(data: BookingEmailData, reminderType: '24h' | '1h'): string {
  const hours = reminderType === '24h' ? '24 hours' : '1 hour'
  return `
    <h2>Booking Reminder</h2>
    <p>This is a reminder that you have a booking in ${hours}.</p>
    <p><strong>Service:</strong> ${data.resourceTitle}</p>
    <p><strong>Date:</strong> ${data.startTime.toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}</p>
    ${data.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}">${data.meetingUrl}</a></p>` : ''}
  `
}

function generateReminderText(data: BookingEmailData, reminderType: '24h' | '1h'): string {
  const hours = reminderType === '24h' ? '24 hours' : '1 hour'
  return `
Booking Reminder

This is a reminder that you have a booking in ${hours}.

Service: ${data.resourceTitle}
Date: ${data.startTime.toLocaleDateString()}
Time: ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}
${data.meetingUrl ? `Meeting Link: ${data.meetingUrl}` : ''}
  `.trim()
}

function generateRescheduledHTML(data: BookingEmailData, oldStartTime: Date, oldEndTime: Date): string {
  return `
    <h2>Booking Rescheduled</h2>
    <p>Your booking has been rescheduled.</p>
    <p><strong>Service:</strong> ${data.resourceTitle}</p>
    <p><strong>New Date:</strong> ${data.startTime.toLocaleDateString()}</p>
    <p><strong>New Time:</strong> ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}</p>
    <p><strong>Previous Time:</strong> ${oldStartTime.toLocaleTimeString()} - ${oldEndTime.toLocaleTimeString()}</p>
    ${data.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}">${data.meetingUrl}</a></p>` : ''}
  `
}

function generateRescheduledText(data: BookingEmailData, oldStartTime: Date, oldEndTime: Date): string {
  return `
Booking Rescheduled

Your booking has been rescheduled.

Service: ${data.resourceTitle}
New Date: ${data.startTime.toLocaleDateString()}
New Time: ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}
Previous Time: ${oldStartTime.toLocaleTimeString()} - ${oldEndTime.toLocaleTimeString()}
${data.meetingUrl ? `Meeting Link: ${data.meetingUrl}` : ''}
  `.trim()
}

function generateCancelledHTML(data: BookingEmailData, reason?: string): string {
  return `
    <h2>Booking Cancelled</h2>
    <p>Your booking has been cancelled.</p>
    <p><strong>Service:</strong> ${data.resourceTitle}</p>
    <p><strong>Date:</strong> ${data.startTime.toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
  `
}

function generateCancelledText(data: BookingEmailData, reason?: string): string {
  return `
Booking Cancelled

Your booking has been cancelled.

Service: ${data.resourceTitle}
Date: ${data.startTime.toLocaleDateString()}
Time: ${data.startTime.toLocaleTimeString()} - ${data.endTime.toLocaleTimeString()}
${reason ? `Reason: ${reason}` : ''}
  `.trim()
}
