import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organization_id');
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const daysBack = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const supabaseAdmin = getSupabaseAdmin();
    
    // Overview stats
    let totalBookingsQuery = supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true });
    if (organizationId) {
      totalBookingsQuery = totalBookingsQuery.eq('organization_id', organizationId);
    }
    const { count: totalBookings } = await totalBookingsQuery;

    let revenueQuery = supabaseAdmin.from('bookings').select('amount_total, payment_status').not('amount_total', 'is', null);
    if (organizationId) {
      revenueQuery = revenueQuery.eq('organization_id', organizationId);
    }
    const { data: revenueData } = await revenueQuery;

    const totalRevenue = revenueData?.filter(b => b.payment_status === 'succeeded')
      .reduce((sum, booking) => sum + (booking.amount_total || 0), 0) || 0;

    const { count: totalUsers } = await supabaseAdmin
      .from('booking_participants')
      .select('user_id', { count: 'exact', head: true })
      .not('user_id', 'is', null);

    const averageBookingValue = totalBookings ? totalRevenue / totalBookings : 0;

    // Success rates
    const { count: confirmedBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    const { count: successfulPayments } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'succeeded');

    const bookingSuccessRate = totalBookings ? (confirmedBookings || 0) / totalBookings : 0;
    const paymentSuccessRate = totalBookings ? (successfulPayments || 0) / totalBookings : 0;

    // User retention (users with multiple bookings)
    const { data: userBookings } = await supabaseAdmin
      .from('booking_participants')
      .select('user_id')
      .not('user_id', 'is', null);

    const userBookingCounts = new Map();
    userBookings?.forEach(participant => {
      const count = userBookingCounts.get(participant.user_id) || 0;
      userBookingCounts.set(participant.user_id, count + 1);
    });

    const retainedUsers = Array.from(userBookingCounts.values()).filter(count => count > 1).length;
    const userRetentionRate = totalUsers ? retainedUsers / totalUsers : 0;

    // Trends over time
    const { data: bookingsOverTime } = await supabaseAdmin.from("bookings")
      .select('created_at, amount_total, payment_status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const dailyStats = new Map();
    bookingsOverTime?.forEach(booking => {
      const date = new Date(booking.created_at).toISOString().split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, { bookings: 0, revenue: 0 });
      }
      const stats = dailyStats.get(date);
      stats.bookings += 1;
      if (booking.payment_status === 'succeeded') {
        stats.revenue += booking.amount_total || 0;
      }
    });

    const bookingsOverTimeArray = Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      bookings: stats.bookings,
      revenue: stats.revenue
    }));

    // User growth
    const { data: userGrowth } = await supabaseAdmin
      .from('booking_participants')
      .select('created_at, user_id')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const dailyUsers = new Map();
    const uniqueUsers = new Set();
    userGrowth?.forEach(participant => {
      const date = new Date(participant.created_at).toISOString().split('T')[0];
      if (!dailyUsers.has(date)) {
        dailyUsers.set(date, { new_users: 0, total_users: 0 });
      }
      const stats = dailyUsers.get(date);
      if (!uniqueUsers.has(participant.user_id)) {
        stats.new_users += 1;
        uniqueUsers.add(participant.user_id);
      }
      stats.total_users = uniqueUsers.size;
    });

    const userGrowthArray = Array.from(dailyUsers.entries()).map(([date, stats]) => ({
      date,
      new_users: stats.new_users,
      total_users: stats.total_users
    }));

    // Top resources
    const { data: resourceBookings } = await supabaseAdmin.from("bookings")
      .select('resource_id, resource_type, amount_total, payment_status')
      .gte('created_at', startDate.toISOString());

    const resourceStats = new Map();
    resourceBookings?.forEach(booking => {
      const key = `${booking.resource_type}-${booking.resource_id}`;
      if (!resourceStats.has(key)) {
        resourceStats.set(key, { 
          resource_name: `${booking.resource_type} ${booking.resource_id}`,
          booking_count: 0, 
          revenue: 0 
        });
      }
      const stats = resourceStats.get(key);
      stats.booking_count += 1;
      if (booking.payment_status === 'succeeded') {
        stats.revenue += booking.amount_total || 0;
      }
    });

    const mostPopularResources = Array.from(resourceStats.values())
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, 10);

    // Top organizations
    const { data: orgBookings } = await supabaseAdmin.from("bookings")
      .select('organization_id, amount_total, payment_status')
      .gte('created_at', startDate.toISOString());

    const orgStats = new Map();
    orgBookings?.forEach(booking => {
      if (!orgStats.has(booking.organization_id)) {
        orgStats.set(booking.organization_id, { 
          organization_name: `Org ${booking.organization_id}`,
          booking_count: 0, 
          revenue: 0 
        });
      }
      const stats = orgStats.get(booking.organization_id);
      stats.booking_count += 1;
      if (booking.payment_status === 'succeeded') {
        stats.revenue += booking.amount_total || 0;
      }
    });

    const topOrganizations = Array.from(orgStats.values())
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, 10);

    // User roles distribution
    const { data: roleData } = await supabaseAdmin
      .from('booking_participants')
      .select('role, user_id')
      .not('user_id', 'is', null);

    const roleCounts = new Map();
    roleData?.forEach(participant => {
      const count = roleCounts.get(participant.role) || 0;
      roleCounts.set(participant.role, count + 1);
    });

    const totalRoleUsers = Array.from(roleCounts.values()).reduce((sum, count) => sum + count, 0);
    const userRolesDistribution = Array.from(roleCounts.entries()).map(([role, count]) => ({
      role,
      count,
      percentage: totalRoleUsers ? (count / totalRoleUsers) * 100 : 0
    }));

    // Performance metrics
    const { data: timeData } = await supabaseAdmin.from("bookings")
      .select('start_time, end_time, created_at')
      .gte('created_at', startDate.toISOString());

    const averageBookingDuration = timeData && timeData.length > 0 ? timeData.reduce((sum, booking) => {
      const start = new Date(booking.start_time);
      const end = new Date(booking.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
    }, 0) / timeData.length : 0;

    // Peak hours
    const hourCounts = new Map();
    timeData?.forEach(booking => {
      const hour = new Date(booking.start_time).getHours();
      const count = hourCounts.get(hour) || 0;
      hourCounts.set(hour, count + 1);
    });

    const peakBookingHours = Array.from(hourCounts.entries())
      .map(([hour, booking_count]) => ({ hour, booking_count }))
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, 12);

    const analytics = {
      overview: {
        total_bookings: totalBookings || 0,
        total_revenue: totalRevenue,
        total_users: totalUsers || 0,
        average_booking_value: averageBookingValue,
        booking_success_rate: bookingSuccessRate,
        user_retention_rate: userRetentionRate
      },
      trends: {
        bookings_over_time: bookingsOverTimeArray,
        user_growth: userGrowthArray
      },
      top_metrics: {
        most_popular_resources: mostPopularResources,
        top_organizations: topOrganizations,
        user_roles_distribution: userRolesDistribution
      },
      performance: {
        conversion_rates: {
          booking_to_payment: paymentSuccessRate,
          payment_success: paymentSuccessRate,
          user_activation: userRetentionRate
        },
        time_metrics: {
          average_booking_duration: averageBookingDuration,
          peak_booking_hours: peakBookingHours
        }
      }
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
