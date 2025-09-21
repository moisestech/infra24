import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET /api/surveys/[id]/invitations - Get survey invitations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    const supabase = supabaseAdmin;

    // Get survey to check permissions
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (surveyError) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Check if user has admin/manager access
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', survey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Build query
    let query = supabase
      .from('survey_invitations')
      .select('*')
      .eq('survey_id', id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: invitations, error } = await query;

    if (error) {
      console.error('Error fetching invitations:', error);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('survey_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', id);

    return NextResponse.json({
      invitations,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in get survey invitations API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/surveys/[id]/invitations - Create survey invitations
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      invitations, // Array of { email, name, role }
      expiresInHours = 168 // 7 days default
    } = body;

    if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
      return NextResponse.json({ error: 'Invitations array is required' }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Get survey to check permissions
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (surveyError) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Check if user has admin/manager access
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', survey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Create invitations
    const invitationData = invitations.map(invitation => ({
      survey_id: id,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      expires_at: new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
    }));

    const { data: createdInvitations, error } = await supabase
      .from('survey_invitations')
      .insert(invitationData)
      .select();

    if (error) {
      console.error('Error creating invitations:', error);
      return NextResponse.json({ error: 'Failed to create invitations' }, { status: 500 });
    }

    return NextResponse.json({ invitations: createdInvitations }, { status: 201 });
  } catch (error) {
    console.error('Error in create survey invitations API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
