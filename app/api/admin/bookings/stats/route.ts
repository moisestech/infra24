import { NextRequest, NextResponse } from 'next/server';
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organization_id');
    const timeRange = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const access = await requireOrganizationStaff(organizationId);
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}});
    const supabaseAdmin = access.db;
    
    // Get total bookings
    const totalBookingsQuery = supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('org_id', access.orgId);
    const { count: totalBookings } = await totalBookingsQuery;

    // Get bookings by status
    const { count: pendingBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .eq('status', 'pending');

    const { count: confirmedBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .eq('status', 'confirmed');

    const { count: cancelledBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .eq('status', 'cancelled');

    // Get revenue data
    const { data: revenueData } = await supabaseAdmin.from("bookings")
      .select('amount_total, payment_status')
      .eq('org_id', access.orgId)
      .not('amount_total', 'is', null);

    const totalRevenue = revenueData?.reduce((sum, booking) => {
      if (booking.payment_status === 'succeeded') {
        return sum + (booking.amount_total || 0);
      }
      return sum;
    }, 0) || 0;

    // Get group vs individual bookings
    const { count: groupBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .eq('is_group_booking', true);

    const { count: individualBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .eq('is_group_booking', false);

    // Get recent bookings (last 7 days)
    const { count: recentBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Get bookings by time range
    const { count: rangeBookings } = await supabaseAdmin.from("bookings")
      .select('*', { count: 'exact', head: true })
      .eq('org_id', access.orgId)
      .gte('created_at', startDate.toISOString());

    const stats = {
      total_bookings: totalBookings || 0,
      pending_bookings: pendingBookings || 0,
      confirmed_bookings: confirmedBookings || 0,
      cancelled_bookings: cancelledBookings || 0,
      total_revenue: totalRevenue,
      group_bookings: groupBookings || 0,
      individual_bookings: individualBookings || 0,
      recent_bookings: recentBookings || 0,
      range_bookings: rangeBookings || 0,
      average_booking_value: totalBookings ? totalRevenue / totalBookings : 0,
      booking_success_rate: totalBookings ? (confirmedBookings || 0) / totalBookings : 0
    };

    return NextResponse.json({ stats },{headers:{'Cache-Control':'private, no-store'}});

  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return NextResponse.json({ error: 'Failed to fetch booking stats' }, { status: 500 });
  }
}
