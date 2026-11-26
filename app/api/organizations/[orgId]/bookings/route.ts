import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { conflictDetectionService } from '@/lib/conflict-detection'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const resourceId = searchParams.get('resource_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')



    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })
    const supabase = access.db

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('org_id', orgId)
      .order('start_time', { ascending: false })

    if (status) {

      query = query.eq('status', status)
    }

    if (resourceId) {

      query = query.eq('resource_id', resourceId)
    }

    if (startDate) {

      query = query.gte('start_time', startDate)
    }

    if (endDate) {

      query = query.lte('start_time', endDate)
    }

    const { data: bookings, error } = await query

    if (error) {

      return NextResponse.json(
        { 
          error: 'Failed to fetch bookings' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      bookings: bookings || [],
      count: bookings?.length || 0
    })
  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const body = await request.json()


    // Get user info from Clerk (optional for public bookings)
    const { userId } = await auth()
    
    // If user is authenticated, get their email from Clerk
    let clerkUserEmail = null;
    if (userId) {
      try {
        const { currentUser } = await import('@clerk/nextjs/server');
        const user = await currentUser();
        clerkUserEmail = user?.emailAddresses?.[0]?.emailAddress;
      } catch (error) {
      }
    }
    
    const {
      resource_id,
      title,
      description,
      start_time,
      end_time,
      capacity = 1,
      location,
      notes,
      user_name,
      user_email
    } = body

    // Validate required fields
    if (!resource_id || typeof title !== 'string' || !title.trim() || typeof start_time !== 'string' || typeof end_time !== 'string' || !Number.isFinite(Date.parse(start_time)) || !Number.isFinite(Date.parse(end_time)) || Date.parse(end_time) <= Date.parse(start_time) || !Number.isInteger(capacity) || capacity < 1) {

      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get resource details to calculate price
    const supabase = createClient()

    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('price, currency, title, type, capacity')
      .eq('id', resource_id)
      .eq('org_id', orgId)
      .eq('is_active', true)
      .eq('is_bookable', true)
      .single()

    if (resourceError || !resource) {

      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const contactEmail = userId ? clerkUserEmail : user_email;
    if (typeof contactEmail !== 'string' || contactEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || typeof user_name !== 'string' || !user_name.trim() || user_name.length > 200 || (resource.capacity != null && capacity > resource.capacity)) {
      return NextResponse.json({ error: 'Invalid booking contact or capacity' }, { status: 400 });
    }

    // Check for conflicts using enhanced conflict detection service


    try {
      const conflicts = await conflictDetectionService.checkBookingConflicts(
        orgId,
        resource_id,
        new Date(start_time),
        new Date(end_time)
      )

      if (conflicts.length > 0) {
        
        // Log conflicts for tracking
        for (const conflict of conflicts) {
          await conflictDetectionService.logConflict(
            orgId,
            resource_id,
            conflict.type,
            {
              start_time,
              end_time,
              conflict: { type: conflict.type, severity: conflict.severity }
            },
            conflict.severity
          )
        }

        return NextResponse.json(
          { 
            error: 'Booking conflicts detected',
            conflictCount: conflicts.length,
            message: 'Please resolve conflicts before creating the booking'
          },
          { status: 409 }
        )
      }

    } catch (conflictError) {

      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      )
    }

    // Create the booking

    const bookingData = {
      org_id: orgId,
      resource_id,
      user_id: userId || contactEmail,
      resource_type: resource.type,
      title,
      description,
      start_time,
      end_time,
      status: 'pending', // New bookings require approval
      capacity,
      current_participants: 0,
      price: resource.price,
      currency: resource.currency,
      location: location || resource.title,
      notes,
      created_by: userId || 'guest',
      updated_by: userId || 'guest',
      metadata: {
        artist_name: user_name.trim(),
        artist_email: contactEmail,
        resource_title: resource.title,
        created_via: 'digital_lab_booking'
      }
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select('*')
      .single()

    if (bookingError) {

      return NextResponse.json(
        { 
          error: 'Failed to create booking',
          details: bookingError.message 
        },
        { status: 500 }
      )
    }

    // Notifications intentionally deferred until tenant-specific routing is verified.

    return NextResponse.json({ 
      booking: { ...booking, user_name: user_name.trim(), user_email: contactEmail },
      message: 'Booking created successfully'
    }, { status: 201 })
  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
