import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');
    const organizationId = searchParams.get('organization_id');

    // Get users from booking_participants to get user data
    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from('booking_participants')
      .select(`
        user_id,
        name,
        email,
        role,
        created_at,
        bookings!inner (
          organization_id,
          amount_total,
          payment_status
        )
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (organizationId) {
      query = query.eq('bookings.organization_id', organizationId);
    }

    const { data: participants, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Aggregate user data
    const userMap = new Map();
    
    participants?.forEach(participant => {
      const userId = participant.user_id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          email: participant.email,
          first_name: participant.name?.split(' ')[0],
          last_name: participant.name?.split(' ').slice(1).join(' '),
          role: participant.role,
          organization_id: participant.bookings?.[0]?.organization_id || null,
          is_active: true, // Default to active
          created_at: participant.created_at,
          total_bookings: 0,
          total_spent: 0,
          organization: {
            id: participant.bookings?.[0]?.organization_id || null,
            name: 'Unknown' // Would need to join with organizations table
          }
        });
      }
      
      const user = userMap.get(userId);
      user.total_bookings += 1;
      if (participant.bookings?.[0]?.payment_status === 'succeeded') {
        user.total_spent += participant.bookings?.[0]?.amount_total || 0;
      }
    });

    const users = Array.from(userMap.values());

    return NextResponse.json({ 
      users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
