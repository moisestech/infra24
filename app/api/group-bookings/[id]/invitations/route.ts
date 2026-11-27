import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

export const dynamic = 'force-dynamic';

const sendInvitationSchema = z.object({
  invitedEmail: z.string().email(),
  invitedName: z.string().optional(),
  invitedUserId: z.string().optional(),
  message: z.string().optional(),
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
    const { invitedEmail, invitedName, invitedUserId, message } = sendInvitationSchema.parse(body)

    const result = await GroupBookingService.sendInvitation(
      bookingId,
      access.userId,
      invitedEmail,
      invitedName,
      invitedUserId,
      message
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      invitationId: result.invitationId,
      message: 'Invitation sent successfully'
    })
  } catch (error) {
    console.error('Send invitation error:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}
