import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params
    const body = await request.json()
    const { 
      startTime, 
      endTime, 
      resourceId, 
      capacity,
      title,
      description 
    } = body

    // Validate required fields
    if (!startTime || !endTime || !resourceId) {
      return NextResponse.json({ 
        error: 'Missing required fields: startTime, endTime, resourceId' 
      }, { status: 400 })
    }

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('organization_id, title, description')
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', workshop.organization_id)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Check for overlapping bookings
    const { data: overlappingBookings, error: overlapError } = await supabase
      .from('bookings')
      .select('id')
      .eq('resource_id', resourceId)
      .eq('status', 'confirmed')
      .or(`and(starts_at.lt.${endTime},ends_at.gt.${startTime})`)

    if (overlapError) {
      console.error('Error checking overlaps:', overlapError)
      return NextResponse.json({ error: 'Failed to check booking conflicts' }, { status: 500 })
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json({ 
        error: 'Time slot conflicts with existing confirmed booking' 
      }, { status: 409 })
    }

    // Create booking for the workshop session
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        organization_id: workshop.organization_id,
        resource_id: resourceId,
        title: title || `${workshop.title} Session`,
        description: description || workshop.description,
        starts_at: startTime,
        ends_at: endTime,
        status: 'confirmed',
        created_by_clerk_id: userId,
        is_public: true
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Create workshop session linked to the booking
    const { data: session, error: sessionError } = await supabase
      .from('workshop_sessions')
      .insert({
        workshop_id: workshopId,
        booking_id: booking.id,
        capacity: capacity
      })
      .select(`
        id,
        workshop_id,
        booking_id,
        capacity,
        created_at,
        bookings (
          id,
          title,
          description,
          starts_at,
          ends_at,
          status,
          resources (
            id,
            title,
            type,
            capacity
          )
        )
      `)
      .single()

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      // Clean up the booking if session creation fails
      await supabase.from('bookings').delete().eq('id', booking.id)
      return NextResponse.json({ error: 'Failed to create workshop session' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: session
    }, { status: 201 })

  } catch (error) {
    console.error('Create workshop session API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = await params

    // Get workshop sessions with booking details
    const { data: sessions, error: sessionsError } = await supabase
      .from('workshop_sessions')
      .select(`
        id,
        workshop_id,
        booking_id,
        capacity,
        created_at,
        bookings (
          id,
          title,
          description,
          starts_at,
          ends_at,
          status,
          created_by_clerk_id,
          resources (
            id,
            title,
            type,
            capacity
          )
        )
      `)
      .eq('workshop_id', workshopId)
      .order('bookings(starts_at)', { ascending: true })

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      return NextResponse.json({ error: 'Failed to fetch workshop sessions' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: sessions
    })

  } catch (error) {
    console.error('Get workshop sessions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
