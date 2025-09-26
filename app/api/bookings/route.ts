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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organizationId')
    const resourceId = searchParams.get('resourceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Check if user is member of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        id,
        title,
        description,
        starts_at,
        ends_at,
        status,
        created_by_clerk_id,
        approved_by_clerk_id,
        is_public,
        created_at,
        updated_at,
        resources (
          id,
          title,
          type,
          capacity
        )
      `)
      .eq('organization_id', orgId)

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    if (startDate) {
      query = query.gte('starts_at', startDate)
    }

    if (endDate) {
      query = query.lte('ends_at', endDate)
    }

    const { data: bookings, error: bookingsError } = await query.order('starts_at', { ascending: true })

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      organizationId, 
      resourceId, 
      title, 
      description, 
      startTime, 
      endTime, 
      status = 'pending' 
    } = body

    // Validate required fields
    if (!organizationId || !resourceId || !title || !startTime || !endTime) {
      return NextResponse.json({ 
        error: 'Missing required fields: organizationId, resourceId, title, startTime, endTime' 
      }, { status: 400 })
    }

    // Check if user is member of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
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

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        organization_id: organizationId,
        resource_id: resourceId,
        title,
        description,
        starts_at: startTime,
        ends_at: endTime,
        status,
        created_by_clerk_id: userId,
        is_public: false
      })
      .select(`
        id,
        title,
        description,
        starts_at,
        ends_at,
        status,
        created_by_clerk_id,
        created_at,
        resources (
          id,
          title,
          type,
          capacity
        )
      `)
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: booking
    }, { status: 201 })

  } catch (error) {
    console.error('Create booking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}