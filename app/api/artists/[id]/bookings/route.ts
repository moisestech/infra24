import { NextRequest, NextResponse } from 'next/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'

export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'private, no-store' }
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// The hosted bookings resource_type constraint has no artist value. Do not
// invent a space mapping, trust a caller's status, or store contact PII here.
// Restore writes only after a reviewed artist booking contract and caller audit.
export async function POST(
  _request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: 'Legacy artist booking requests are unavailable' },
    { status: 410, headers }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = request.nextUrl.searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status, headers })
    }
    const { id: artistId } = await params
    if (!uuid.test(artistId)) {
      return NextResponse.json({ error: 'Invalid artist ID' }, { status: 400, headers })
    }
    const { data: artist, error: artistError } = await access.db
      .from('artist_profiles')
      .select('id')
      .eq('id', artistId)
      .eq('organization_id', access.orgId)
      .maybeSingle()
    if (artistError) {
      return NextResponse.json({ error: 'Artist lookup unavailable' }, { status: 503, headers })
    }
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404, headers })
    }
    const { data: bookings, error } = await access.db
      .from('bookings')
      .select('id,title,start_time,end_time,status,created_at')
      .eq('org_id', access.orgId)
      .eq('resource_id', artistId)
      .eq('metadata->>booking_type', 'artist_booking')
      .order('start_time', { ascending: true })
    if (error) {
      return NextResponse.json({ error: 'Booking lookup unavailable' }, { status: 503, headers })
    }
    // Explicit projection: no contact data, free-form metadata or tenant IDs.
    return NextResponse.json({
      bookings: (bookings || []).map(booking => ({
        id: booking.id,
        title: booking.title,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        created_at: booking.created_at,
      })),
    }, { headers })
  } catch {
    return NextResponse.json({ error: 'Booking lookup unavailable' }, { status: 500, headers })
  }
}
