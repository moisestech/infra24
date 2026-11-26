import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'

export const dynamic = 'force-dynamic'
const PRIVATE = { 'Cache-Control': 'private, no-store' }
const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status, headers: PRIVATE })

/**
 * Administrative booking data is never a public list.
 * All operations must be scoped to one verified organization staff membership.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get('org_id') ?? searchParams.get('organization_id')
    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return error(access.error, access.status)

    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 50)
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100 || page > 10000) {
      return error('Invalid pagination', 400)
    }

    let query = access.db.from('bookings')
      .select('*,booking_participants(id,user_id,status,registered_at)', { count: 'exact' })
      .eq('org_id', access.orgId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')
    if (status && status !== 'all') query = query.eq('status', status)
    if (paymentStatus && paymentStatus !== 'all') query = query.eq('payment_status', paymentStatus)

    const { data, error: dbError, count } = await query
    if (dbError) return error('Failed to load bookings', 503)
    return NextResponse.json({
      bookings: (data ?? []).map(booking => ({
        ...booking, participants: booking.booking_participants ?? [],
      })),
      pagination: { page, limit, total: count ?? 0 },
    }, { headers: PRIVATE })
  } catch {
    return error('Bookings unavailable', 503)
  }
}

async function authorizedBooking(id: unknown) {
  const { userId } = await auth()
  if (!userId) return { response: error('Sign in required', 401) }
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) {
    return { response: error('Valid booking ID required', 400) }
  }
  const db = getSupabaseAdmin()
  const { data: booking, error: dbError } = await db.from('bookings')
    .select('id,org_id').eq('id', id).maybeSingle()
  if (dbError) return { response: error('Booking unavailable', 503) }
  if (!booking) return { response: error('Booking not found', 404) }
  const access = await requireOrganizationStaff(booking.org_id)
  if (!access.ok) return { response: error(access.error, access.status) }
  return { access, booking }
}

export async function PATCH(req: NextRequest) {
  try {
    const raw: unknown = await req.json()
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return error('Invalid payload', 400)
    const { id, status, payment_status, notes } = raw as Record<string, unknown>
    const check = await authorizedBooking(id)
    if (check.response) return check.response
    const updates: Record<string, string> = {}
    if (status !== undefined) {
      if (typeof status !== 'string' || !status || status.length > 40) return error('Invalid booking status', 400)
      updates.status = status
    }
    if (payment_status !== undefined) {
      if (typeof payment_status !== 'string' || !payment_status || payment_status.length > 40) return error('Invalid payment status', 400)
      updates.payment_status = payment_status
    }
    if (notes !== undefined) {
      if (typeof notes !== 'string' || notes.length > 4000) return error('Invalid notes', 400)
      updates.notes = notes
    }
    if (!Object.keys(updates).length) return error('No allowed changes', 400)

    const { data, error: dbError } = await check.access!.db.from('bookings')
      .update(updates).eq('id', check.booking!.id).eq('org_id', check.access!.orgId)
      .select().single()
    if (dbError) return error('Failed to update booking', 503)
    return NextResponse.json({ booking: data }, { headers: PRIVATE })
  } catch {
    return error('Could not update booking', 503)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const check = await authorizedBooking(id)
    if (check.response) return check.response
    const { error: dbError } = await check.access!.db.from('bookings')
      .delete().eq('id', check.booking!.id).eq('org_id', check.access!.orgId)
    if (dbError) return error('Failed to delete booking', 503)
    return NextResponse.json({ success: true }, { headers: PRIVATE })
  } catch {
    return error('Could not delete booking', 503)
  }
}
