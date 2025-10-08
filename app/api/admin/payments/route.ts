import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const organizationId = searchParams.get('organization_id');

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from('bookings')
      .select(`
        id,
        title,
        user_id,
        start_time,
        payment_intent_id,
        amount_total,
        currency,
        payment_status,
        receipt_url,
        refund_id,
        refund_reason,
        created_at,
        updated_at
      `)
      .not('payment_intent_id', 'is', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('payment_status', status);
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }

    // Transform the data to match Payment interface
    const transformedPayments = payments?.map(payment => ({
      id: payment.id,
      booking_id: payment.id,
      payment_intent_id: payment.payment_intent_id,
      amount_total: payment.amount_total || 0,
      currency: payment.currency || 'usd',
      payment_status: payment.payment_status,
      receipt_url: payment.receipt_url,
      refund_id: payment.refund_id,
      refund_reason: payment.refund_reason,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      booking: {
        id: payment.id,
        title: payment.title,
        user_id: payment.user_id,
        start_time: payment.start_time
      }
    })) || [];

    return NextResponse.json({ 
      payments: transformedPayments,
      pagination: {
        page,
        limit,
        total: transformedPayments.length
      }
    });

  } catch (error) {
    console.error('Error in admin payments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
