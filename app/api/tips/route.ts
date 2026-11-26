import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { org_id, artist_profile_id, amount, message, is_anonymous, status } = body;

    // Validate required fields
    if (!org_id || !artist_profile_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: org_id, artist_profile_id, amount' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create the tip record
    const { data: tip, error } = await supabase
      .from('artist_tips')
      .insert({
        org_id,
        artist_profile_id,
        amount,
        message: message || null,
        is_anonymous: is_anonymous || false,
        // An anonymous client can only create a pending intent, never mark money as paid.
        status: 'pending',
        metadata: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tip:', error);
      return NextResponse.json(
        { error: 'Failed to create tip' },
        { status: 500 }
      );
    }

    return NextResponse.json(tip, { status: 201 });
  } catch (error) {
    console.error('Error in tips API:', error);
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
    const access = await requireOrganizationStaff(orgId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
    const artistId = searchParams.get('artist_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('artist_tips')
      .select(`
        *,
        artist_profiles!inner(name, profile_image)
      `)
      .eq('org_id', orgId!)
      .order('created_at', { ascending: false })
      .limit(100);

    if (artistId) {
      query = query.eq('artist_profile_id', artistId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: tips, error } = await query;

    if (error) {
      console.error('Error fetching tips:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tips' },
        { status: 500 }
      );
    }

    return NextResponse.json(tips);
  } catch (error) {
    console.error('Error in tips GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

