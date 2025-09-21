import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET /api/surveys/[id]/responses - Get survey responses
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
    const role = searchParams.get('role');

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

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', survey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build query
    let query = supabase
      .from('survey_responses')
      .select(`
        id,
        respondent_email,
        respondent_name,
        respondent_role,
        responses,
        language_used,
        status,
        completion_time_seconds,
        created_at,
        completed_at,
        survey_invitations (
          email,
          name,
          role
        )
      `)
      .eq('survey_id', id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (role) {
      query = query.eq('respondent_role', role);
    }

    const { data: responses, error } = await query;

    if (error) {
      console.error('Error fetching responses:', error);
      return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', id);

    return NextResponse.json({
      responses,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in get survey responses API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/surveys/[id]/responses - Submit survey response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const body = await request.json();

    const {
      responses,
      languageUsed = 'en',
      invitationToken,
      respondentEmail,
      respondentName,
      respondentRole
    } = body;

    if (!responses) {
      return NextResponse.json({ error: 'Responses are required' }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Get survey details
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();

    if (surveyError) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Check if survey is active
    if (survey.status !== 'active') {
      return NextResponse.json({ error: 'Survey is not active' }, { status: 400 });
    }

    // Check if survey has closed
    if (survey.closes_at && new Date(survey.closes_at) < new Date()) {
      return NextResponse.json({ error: 'Survey has closed' }, { status: 400 });
    }

    // Check if survey has opened
    if (survey.opens_at && new Date(survey.opens_at) > new Date()) {
      return NextResponse.json({ error: 'Survey has not opened yet' }, { status: 400 });
    }

    // Handle invitation token if provided
    let invitationId = null;
    if (invitationToken) {
      const { data: invitation } = await supabase
        .from('survey_invitations')
        .select('id, email, name, role, status, expires_at')
        .eq('magic_token', invitationToken)
        .eq('survey_id', id)
        .single();

      if (!invitation) {
        return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
      }

      if (invitation.status === 'completed') {
        return NextResponse.json({ error: 'Survey already completed' }, { status: 400 });
      }

      if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
        return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
      }

      invitationId = invitation.id;
    }

    // Check authentication requirements
    if (survey.requires_authentication && !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has already submitted (if max_responses_per_user is set)
    if (survey.max_responses_per_user && userId) {
      const { count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', id)
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (count && count >= survey.max_responses_per_user) {
        return NextResponse.json({ error: 'Maximum responses per user exceeded' }, { status: 400 });
      }
    }

    // Check if max responses reached
    if (survey.max_responses) {
      const { count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', id)
        .eq('status', 'completed');

      if (count && count >= survey.max_responses) {
        return NextResponse.json({ error: 'Maximum responses reached' }, { status: 400 });
      }
    }

    // Get client IP and user agent
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create response
    const { data: response, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: id,
        invitation_id: invitationId,
        user_id: userId,
        respondent_email: respondentEmail,
        respondent_name: respondentName,
        respondent_role: respondentRole,
        responses,
        language_used: languageUsed,
        ip_address: clientIP,
        user_agent: userAgent,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating response:', error);
      return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
    }

    // Update invitation status if applicable
    if (invitationId) {
      await supabase
        .from('survey_invitations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', invitationId);
    }

    // Generate analytics
    await supabase.rpc('generate_survey_analytics', {
      p_survey_id: id,
      p_date: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error('Error in submit survey response API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
