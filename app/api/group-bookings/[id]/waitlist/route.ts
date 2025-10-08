import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

const promoteWaitlistSchema = z.object({
  waitlistId: z.string().uuid(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params
    const body = await request.json()
    const { waitlistId } = promoteWaitlistSchema.parse(body)

    const result = await GroupBookingService.promoteWaitlistParticipant(bookingId, waitlistId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Waitlist participant promoted successfully'
    })
  } catch (error) {
    console.error('Promote waitlist participant error:', error)
    return NextResponse.json(
      { error: 'Failed to promote waitlist participant' },
      { status: 500 }
    )
  }
}
