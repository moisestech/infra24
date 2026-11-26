import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

export const dynamic = 'force-dynamic';

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
    const {data: booking,error} = await getSupabaseAdmin().from('bookings').select('id,org_id').eq('id',bookingId).eq('is_group_booking',true).maybeSingle()
    if (error || !booking) return NextResponse.json({error:'Group booking not found'},{status:404})
    const access = await requireOrganizationStaff(booking.org_id)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})
    const body = await request.json()
    const { waitlistId } = promoteWaitlistSchema.parse(body)

    const {data:entry,error:entryError} = await access.db.from('booking_waitlist').select('id').eq('id',waitlistId).eq('booking_id',bookingId).eq('status','waiting').maybeSingle()
    if (entryError) return NextResponse.json({error:'Waitlist verification unavailable'},{status:503})
    if (!entry) return NextResponse.json({error:'Waitlist entry not found'},{status:404})
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
