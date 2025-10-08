import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GroupBookingService } from '@/lib/group-booking/service'
import { z } from 'zod'

const respondToInvitationSchema = z.object({
  response: z.enum(['accepted', 'declined']),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Get invitation details for display
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = getSupabaseAdmin()

    const { data: invitation, error } = await supabase
      .from('group_booking_invitations')
      .select(`
        *,
        bookings (
          id,
          title,
          description,
          start_time,
          end_time,
          location
        )
      `)
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .single()

    if (error || !invitation) {
      return NextResponse.json({ error: 'Invitation not found or expired' }, { status: 404 })
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        invitedEmail: invitation.invited_email,
        invitedName: invitation.invited_name,
        message: invitation.message,
        expiresAt: invitation.expires_at,
        booking: invitation.bookings
      }
    })
  } catch (error) {
    console.error('Get invitation error:', error)
    return NextResponse.json(
      { error: 'Failed to get invitation details' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { userId } = await auth()
    const { token } = await params
    const body = await request.json()
    const { response } = respondToInvitationSchema.parse(body)

    const result = await GroupBookingService.respondToInvitation(token, response, userId || undefined)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: response === 'accepted' 
        ? 'Invitation accepted successfully'
        : 'Invitation declined'
    })
  } catch (error) {
    console.error('Respond to invitation error:', error)
    return NextResponse.json(
      { error: 'Failed to respond to invitation' },
      { status: 500 }
    )
  }
}
