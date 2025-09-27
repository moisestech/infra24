import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse, HTTP_STATUS, ERROR_MESSAGES } from '@/lib/api-response'

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
      const { response, status } = createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      return NextResponse.json(response, { status })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organizationId')
    const resourceId = searchParams.get('resourceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!orgId) {
      const { response, status } = createErrorResponse('Organization ID is required', HTTP_STATUS.BAD_REQUEST)
      return NextResponse.json(response, { status })
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
        organization_id,
        resource_id,
        user_id,
        user_name,
        user_email,
        title,
        description,
        start_time,
        end_time,
        status,
        capacity,
        current_participants,
        price,
        currency,
        location,
        notes,
        metadata,
        created_at,
        updated_at,
        created_by_clerk_id,
        updated_by_clerk_id,
        resources (
          id,
          title,
          type,
          capacity,
          is_bookable
        )
      `)
      .eq('organization_id', orgId)

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    const { data: bookings, error: bookingsError } = await query.order('start_time', { ascending: true })

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      const { response, status } = createErrorResponse('Failed to fetch bookings', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      return NextResponse.json(response, { status })
    }

    return NextResponse.json(createSuccessResponse(bookings))

  } catch (error) {
    console.error('Bookings API error:', error)
    const { response, status } = createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    return NextResponse.json(response, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      const { response, status } = createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      return NextResponse.json(response, { status })
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
      const { response, status } = createErrorResponse(
        'Missing required fields: organizationId, resourceId, title, startTime, endTime',
        HTTP_STATUS.BAD_REQUEST
      )
      return NextResponse.json(response, { status })
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
      const { response, status } = createErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      return NextResponse.json(response, { status })
    }

    // Check for overlapping bookings
    const { data: overlappingBookings, error: overlapError } = await supabase
      .from('bookings')
      .select('id')
      .eq('resource_id', resourceId)
      .eq('status', 'confirmed')
      .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

    if (overlapError) {
      console.error('Error checking overlaps:', overlapError)
      const { response, status } = createErrorResponse('Failed to check booking conflicts', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      return NextResponse.json(response, { status })
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      const { response, status } = createErrorResponse('Time slot conflicts with existing confirmed booking', HTTP_STATUS.CONFLICT)
      return NextResponse.json(response, { status })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        organization_id: organizationId,
        resource_id: resourceId,
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        status,
        created_by_clerk_id: userId,
        is_public: false
      })
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
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
      const { response, status } = createErrorResponse('Failed to create booking', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      return NextResponse.json(response, { status })
    }

    return NextResponse.json(createSuccessResponse(booking, 'Booking created successfully'), { status: HTTP_STATUS.CREATED })

  } catch (error) {
    console.error('Create booking API error:', error)
    const { response, status } = createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    return NextResponse.json(response, { status })
  }
}