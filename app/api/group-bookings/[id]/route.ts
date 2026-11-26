import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GroupBookingService } from '@/lib/group-booking/service'

export const dynamic = 'force-dynamic';

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

    const {data: booking,error} = await getSupabaseAdmin().from('bookings').select('id,org_id').eq('id',bookingId).eq('is_group_booking',true).maybeSingle()
    if (error || !booking) return NextResponse.json({error:'Group booking not found'},{status:404})
    const access = await requireOrganizationStaff(booking.org_id)
    if (!access.ok) return NextResponse.json({error:'Forbidden'},{status:403,headers:{'Cache-Control':'private, no-store'}})
    const result = await GroupBookingService.getGroupBookingDetails(bookingId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: {...result.booking, invitations: (result.booking?.invitations || []).map(({invitationToken: _token,...invitation})=>invitation)}
    },{headers:{'Cache-Control':'private, no-store'}})
  } catch (error) {
    console.error('Group booking details error:', error)
    return NextResponse.json(
      { error: 'Failed to get group booking details' },
      { status: 500 }
    )
  }
}
