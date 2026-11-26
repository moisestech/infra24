import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

export const dynamic = 'force-dynamic';

const addParticipantSchema = z.object({
  participantName: z.string().min(1),
  participantEmail: z.string().email(),
  participantPhone: z.string().optional(),
  notes: z.string().optional(),
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
    const {data:booking,error} = await getSupabaseAdmin().from('bookings').select('id,group_booking_type,status,start_time').eq('id',bookingId).eq('is_group_booking',true).maybeSingle()
    if (error) return NextResponse.json({error:'Registration verification unavailable'},{status:503})
    if (!booking || booking.group_booking_type !== 'public' || booking.status !== 'confirmed' || !(Date.parse(booking.start_time) > Date.now())) return NextResponse.json({error:'Registration unavailable'},{status:403})
    const body = await request.json()
    const { participantName, participantEmail, participantPhone, notes } = addParticipantSchema.parse(body)

    const result = await GroupBookingService.addParticipant(
      bookingId,
      userId,
      participantName,
      participantEmail,
      participantPhone,
      notes
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      position: result.position,
      availableSpots: result.availableSpots,
      message: result.status === 'waitlisted' 
        ? `Added to waitlist at position ${result.position}`
        : 'Successfully added to group booking'
    })
  } catch (error) {
    console.error('Add participant error:', error)
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    const result = await GroupBookingService.removeParticipant(bookingId, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      availableSpots: result.availableSpots,
      waitlistPosition: result.waitlistPosition,
      message: 'Successfully removed from group booking'
    })
  } catch (error) {
    console.error('Remove participant error:', error)
    return NextResponse.json(
      { error: 'Failed to remove participant' },
      { status: 500 }
    )
  }
}
