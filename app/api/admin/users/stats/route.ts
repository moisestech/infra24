import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const supabaseAdmin = getSupabaseAdmin();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organization_id');
    const timeRange = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const supabaseAdmin = getSupabaseAdmin();
    
    // Get unique users with proper join
    let query = supabaseAdmin
      .from('booking_participants')
      .select('user_id, role, created_at, bookings!inner(organization_id)');

    if (organizationId) {
      query = query.eq('bookings.organization_id', organizationId);
    }

    const { data: allParticipants } = await query
      .not('user_id', 'is', null);

    // Count users by role
    const roleCounts = {
      public: 0,
      member: 0,
      resident_artist: 0,
      staff: 0,
      admin: 0
    };

    const uniqueUsers = new Set();
    const activeUsers = new Set();
    const newUsersThisMonth = new Set();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastLoginThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    allParticipants?.forEach(participant => {
      uniqueUsers.add(participant.user_id);
      
      // Count by role
      if (participant.role in roleCounts) {
        roleCounts[participant.role as keyof typeof roleCounts]++;
      }

      // Check if user is active (has recent activity)
      if (new Date(participant.created_at) > lastLoginThreshold) {
        activeUsers.add(participant.user_id);
      }

      // Check if user is new this month
      if (new Date(participant.created_at) > currentMonthStart) {
        newUsersThisMonth.add(participant.user_id);
      }
    });

    // Get users from time range
    let rangeQuery = supabaseAdmin
      .from('booking_participants')
      .select('user_id, created_at, bookings!inner(organization_id)');

    if (organizationId) {
      rangeQuery = rangeQuery.eq('bookings.organization_id', organizationId);
    }

    const { data: rangeParticipants } = await rangeQuery
      .gte('created_at', startDate.toISOString());

    const rangeUsers = new Set(rangeParticipants?.map(p => p.user_id) || []);

    const stats = {
      total_users: uniqueUsers.size,
      active_users: activeUsers.size,
      members: roleCounts.member,
      resident_artists: roleCounts.resident_artist,
      staff: roleCounts.staff,
      admins: roleCounts.admin,
      public_users: roleCounts.public,
      new_users_this_month: newUsersThisMonth.size,
      range_users: rangeUsers.size,
      user_retention_rate: uniqueUsers.size > 0 ? activeUsers.size / uniqueUsers.size : 0,
      growth_rate: uniqueUsers.size > 0 ? newUsersThisMonth.size / uniqueUsers.size : 0
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
