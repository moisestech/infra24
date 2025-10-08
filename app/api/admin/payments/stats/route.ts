import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

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
    let query = supabaseAdmin.from('bookings')
      .select('amount_total, payment_status, currency')
      .not('payment_intent_id', 'is', null);

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    // Get all payments
    const { data: allPayments } = await query;

    // Calculate stats
    const successfulPayments = allPayments?.filter(p => p.payment_status === 'succeeded') || [];
    const failedPayments = allPayments?.filter(p => p.payment_status === 'failed') || [];
    const pendingPayments = allPayments?.filter(p => p.payment_status === 'pending') || [];
    const refundedPayments = allPayments?.filter(p => p.payment_status === 'refunded') || [];

    const totalRevenue = successfulPayments.reduce((sum, payment) => sum + (payment.amount_total || 0), 0);
    const refundedAmount = refundedPayments.reduce((sum, payment) => sum + (payment.amount_total || 0), 0);
    const averagePayment = successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0;

    // Get monthly revenue (current month)
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let monthlyQuery = supabaseAdmin.from('bookings')
      .select('amount_total, payment_status')
      .not('payment_intent_id', 'is', null)
      .gte('created_at', currentMonthStart.toISOString())
      .eq('payment_status', 'succeeded');
    
    if (organizationId) {
      monthlyQuery = monthlyQuery.eq('organization_id', organizationId);
    }
    
    const { data: monthlyPayments } = await monthlyQuery;

    const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => sum + (payment.amount_total || 0), 0) || 0;

    // Get daily revenue (today)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dailyQuery = supabaseAdmin.from('bookings')
      .select('amount_total, payment_status')
      .not('payment_intent_id', 'is', null)
      .gte('created_at', todayStart.toISOString())
      .eq('payment_status', 'succeeded');
    
    if (organizationId) {
      dailyQuery = dailyQuery.eq('organization_id', organizationId);
    }
    
    const { data: dailyPayments } = await dailyQuery;

    const dailyRevenue = dailyPayments?.reduce((sum, payment) => sum + (payment.amount_total || 0), 0) || 0;

    // Get payments by time range
    let rangeQuery = supabaseAdmin.from('bookings')
      .select('amount_total, payment_status')
      .not('payment_intent_id', 'is', null)
      .gte('created_at', startDate.toISOString());
    
    if (organizationId) {
      rangeQuery = rangeQuery.eq('organization_id', organizationId);
    }
    
    const { data: rangePayments } = await rangeQuery;

    const rangeRevenue = rangePayments?.filter(p => p.payment_status === 'succeeded')
      .reduce((sum, payment) => sum + (payment.amount_total || 0), 0) || 0;

    const stats = {
      total_revenue: totalRevenue,
      successful_payments: successfulPayments.length,
      failed_payments: failedPayments.length,
      pending_payments: pendingPayments.length,
      refunded_amount: refundedAmount,
      average_payment: averagePayment,
      monthly_revenue: monthlyRevenue,
      daily_revenue: dailyRevenue,
      range_revenue: rangeRevenue,
      payment_success_rate: allPayments?.length ? successfulPayments.length / allPayments.length : 0,
      refund_rate: totalRevenue > 0 ? refundedAmount / totalRevenue : 0
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json({ error: 'Failed to fetch payment stats' }, { status: 500 });
  }
}
