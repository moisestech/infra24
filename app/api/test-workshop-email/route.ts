import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sendWorkshopRegistrationEmail } from '@/lib/email/workshop-emails'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      email,
      workshopTitle,
      participantName,
      workshopDate,
      workshopTime,
      workshopLocation,
      instructorName,
      language = 'en'
    } = body

    // Validate required fields
    if (!email || !workshopTitle) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, workshopTitle' 
      }, { status: 400 })
    }

    // Prepare email data
    const emailData = {
      to: email,
      workshopTitle,
      organizationName: 'Oolite Arts',
      participantName: participantName || 'Test User',
      workshopDate,
      workshopTime,
      workshopLocation,
      instructorName,
      workshopDescription: 'This is a test workshop registration email to demonstrate the email template functionality.',
      maxParticipants: 12,
      currentParticipants: 8,
      language: language as 'en' | 'es',
      registrationId: 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      workshopId: 'test-workshop-123',
      organizationSlug: 'oolite'
    }

    // Send the email
    const result = await sendWorkshopRegistrationEmail(emailData)

    if (result.success) {
      return NextResponse.json({ 
        message: `Test email sent successfully to ${email}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({ 
        error: `Failed to send email: ${result.error}` 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test workshop email API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
