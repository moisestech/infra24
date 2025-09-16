import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      org_id, 
      amount, 
      message, 
      is_anonymous, 
      is_recurring, 
      recurring_frequency, 
      status 
    } = body;

    // Validate required fields
    if (!org_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: org_id, amount' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate recurring frequency if recurring
    if (is_recurring && !recurring_frequency) {
      return NextResponse.json(
        { error: 'Recurring frequency is required for recurring donations' },
        { status: 400 }
      );
    }

    // Create the donation record
    const { data: donation, error } = await supabase
      .from('organization_donations')
      .insert({
        org_id,
        amount,
        message: message || null,
        is_anonymous: is_anonymous || false,
        is_recurring: is_recurring || false,
        recurring_frequency: is_recurring ? recurring_frequency : null,
        status: status || 'pending',
        metadata: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      return NextResponse.json(
        { error: 'Failed to create donation' },
        { status: 500 }
      );
    }

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error in donations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('org_id');
    const status = searchParams.get('status');
    const isRecurring = searchParams.get('is_recurring');

    let query = supabase
      .from('organization_donations')
      .select(`
        *,
        organizations!inner(name, slug)
      `)
      .order('created_at', { ascending: false });

    if (orgId) {
      query = query.eq('org_id', orgId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (isRecurring !== null) {
      query = query.eq('is_recurring', isRecurring === 'true');
    }

    const { data: donations, error } = await query;

    if (error) {
      console.error('Error fetching donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      );
    }

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error in donations GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
