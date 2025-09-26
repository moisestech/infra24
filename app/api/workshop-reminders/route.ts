import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sendWorkshopReminders } from '@/lib/email/workshop-reminders'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workshopId, organizationId, reminderType = '24h' } = body

    // Validate required fields
    if (!workshopId || !organizationId) {
      return NextResponse.json({ 
        error: 'Missing required fields: workshopId, organizationId' 
      }, { status: 400 })
    }

    // Send workshop reminders
    const result = await sendWorkshopReminders({
      workshopId,
      organizationId,
      reminderType
    })

    if (result.success) {
      return NextResponse.json({ 
        message: 'Workshop reminders sent successfully',
        results: result.results,
        summary: result.summary
      })
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to send workshop reminders' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Workshop reminders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
