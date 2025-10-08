/**
 * Waitlist Notification API
 * Handles waitlist notifications when slots become available
 */

import { NextRequest, NextResponse } from 'next/server'
import { processWaitlist, bookFromWaitlist } from '@/lib/features/waitlist/waitlist-manager'
import { sendWaitlistNotificationEmail } from '@/lib/email/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'process':
        // Process waitlist when slots become available
        const { resource_id, org_id, available_slots } = data

        if (!resource_id || !org_id || !available_slots) {
          return NextResponse.json(
            { error: 'Missing required parameters: resource_id, org_id, available_slots' },
            { status: 400 }
          )
        }

        const notifications = await processWaitlist(resource_id, org_id, available_slots)

        // Send email notifications
        const emailResults = []
        for (const notification of notifications) {
          try {
            const emailResult = await sendWaitlistNotificationEmail({
              userEmail: notification.user_email,
              userName: notification.user_name,
              resourceTitle: notification.resource_title,
              availableSlots: notification.available_slots,
              expiresAt: new Date(notification.expires_at),
              entryId: notification.entry_id
            })
            emailResults.push({
              entry_id: notification.entry_id,
              email_sent: emailResult.success,
              error: emailResult.error
            })
          } catch (emailError: any) {
            emailResults.push({
              entry_id: notification.entry_id,
              email_sent: false,
              error: emailError.message
            })
          }
        }

        return NextResponse.json({
          success: true,
          notifications_sent: notifications.length,
          notifications,
          email_results: emailResults
        })

      case 'book':
        // Book from waitlist notification
        const { entry_id, selected_slot } = data

        if (!entry_id || !selected_slot) {
          return NextResponse.json(
            { error: 'Missing required parameters: entry_id, selected_slot' },
            { status: 400 }
          )
        }

        const bookingResult = await bookFromWaitlist(entry_id, selected_slot)

        if (!bookingResult.success) {
          return NextResponse.json(
            { error: bookingResult.error },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          booking_id: bookingResult.booking_id,
          message: 'Successfully booked from waitlist'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: process, book' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Error in waitlist notification API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



