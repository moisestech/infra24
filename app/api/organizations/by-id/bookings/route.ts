import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { orgId } = params;
    const { searchParams } = new URL(request.url);
    
    const resourceType = searchParams.get('resource_type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        booking_participants(*),
        resources(*)
      `)
      .eq('org_id', orgId)
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1);

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('start_time', startDate);
    }

    if (endDate) {
      query = query.lte('end_time', endDate);
    }

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in bookings GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { orgId } = params;
    const body = await request.json();

    const {
      resource_type,
      resource_id,
      title,
      description,
      start_time,
      end_time,
      capacity = 1,
      price = 0,
      currency = 'USD',
      location,
      requirements = [],
      notes,
      metadata = {}
    } = body;

    // Validate required fields
    if (!resource_type || !resource_id || !title || !start_time || !end_time) {
      return NextResponse.json({ 
        error: 'Missing required fields: resource_type, resource_id, title, start_time, end_time' 
      }, { status: 400 });
    }

    // Check if user has permission to create bookings for this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    // Check booking availability
    const { data: availability } = await supabase
      .rpc('check_booking_availability', {
        p_organization_id: orgId,
        p_resource_id: resource_id,
        p_start_time: start_time,
        p_end_time: end_time,
        p_capacity: capacity
      });

    if (!availability) {
      return NextResponse.json({ error: 'Resource not available for the requested time slot' }, { status: 409 });
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        org_id: orgId,
        user_id: userId,
        resource_type,
        resource_id,
        title,
        description,
        start_time,
        end_time,
        capacity,
        price,
        currency,
        location,
        requirements,
        notes,
        metadata,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // Add user as participant if capacity > 1
    if (capacity > 1) {
      await supabase
        .from('booking_participants')
        .insert({
          booking_id: booking.id,
          user_id: userId,
          status: 'confirmed'
        });
    }

    return NextResponse.json({ booking }, { status: 201 });

  } catch (error) {
    console.error('Error in bookings POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
