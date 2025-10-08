import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

const createGroupBookingSchema = z.object({
  organizationId: z.string().uuid(),
  resourceId: z.string(),
  resourceType: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().min(1).max(100),
  groupBookingType: z.enum(['public', 'private', 'invite_only']).default('public'),
  waitlistEnabled: z.boolean().default(false),
  price: z.number().min(0).optional(),
  location: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const params = createGroupBookingSchema.parse(body)

    const result = await GroupBookingService.createGroupBooking({
      ...params,
      userId,
      startTime: new Date(params.startTime),
      endTime: new Date(params.endTime),
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId
    })
  } catch (error) {
    console.error('Group booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create group booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const result = await GroupBookingService.getAvailableGroupBookings(
      organizationId,
      limit,
      offset
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookings: result.bookings
    })
  } catch (error) {
    console.error('Group bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch group bookings' },
      { status: 500 }
    )
  }
}
