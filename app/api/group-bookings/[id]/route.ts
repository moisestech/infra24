import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GroupBookingService } from '@/lib/group-booking/service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    const result = await GroupBookingService.getGroupBookingDetails(bookingId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: result.booking
    })
  } catch (error) {
    console.error('Group booking details error:', error)
    return NextResponse.json(
      { error: 'Failed to get group booking details' },
      { status: 500 }
    )
  }
}
