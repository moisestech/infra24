import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

export const dynamic = 'force-dynamic';

const createGroupBookingSchema = z.object({
  organizationId: z.string().uuid(),
  resourceId: z.string().uuid(),
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

    const access = await requireOrganizationStaff(params.organizationId)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status})
    if (Date.parse(params.endTime) <= Date.parse(params.startTime)) return NextResponse.json({error:'Invalid booking interval'},{status:400})
    const {data:resource,error:resourceError} = await access.db.from('resources').select('id,type').eq('id',params.resourceId).eq('org_id',access.orgId).eq('is_active',true).eq('is_bookable',true).maybeSingle()
    if (resourceError) return NextResponse.json({error:'Resource verification unavailable'},{status:503})
    if (!resource || resource.type !== params.resourceType) return NextResponse.json({error:'Bookable resource not found'},{status:404})
    const result = await GroupBookingService.createGroupBooking({
      ...params,
      organizationId: access.orgId,
      userId: access.userId,
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
