import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// GET /api/surveys/[id] - Get specific survey
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 API Route: /api/surveys/[id] - Starting request for survey:', id)

    // Get survey details
    const supabaseAdmin = getSupabaseAdmin()

    const { data: $2, error: $3 } = await supabaseAdmin
      .from('submission_forms')
      .select(`
        id,
        title,
        description,
        category,
        type,
        form_schema,
        submission_settings,
        is_public,
        requires_authentication,
        organization_id,
        organizations!inner(id, name, slug)
      `)
      .eq('id', id)
      .eq('type', 'survey')
      .eq('is_active', true)
      .single()

    if (surveyError || !survey) {
      console.log('❌ Survey not found:', surveyError)
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    console.log('✅ Found survey:', survey.title)

    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        category: survey.category,
        form_schema: survey.form_schema,
        submission_settings: survey.submission_settings,
        is_public: survey.is_public,
        requires_authentication: survey.requires_authentication,
        organization: survey.organizations
      }
    })

  } catch (error) {
    console.error('Error in survey API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/surveys/[id] - Update survey
export async function PUT(
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

    const supabase = supabaseAdmin;

    // Get current survey to check permissions
    const { data: currentSurvey, error: fetchError } = await supabase
      .from('surveys')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Check if user has admin/manager access
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', currentSurvey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Update survey
    const { data: survey, error } = await supabase
      .from('surveys')
      .update({
        ...body,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating survey:', error);
      return NextResponse.json({ error: 'Failed to update survey' }, { status: 500 });
    }

    return NextResponse.json({ survey }, { status: 200 });
  } catch (error) {
    console.error('Error in update survey API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/surveys/[id] - Delete survey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const supabase = supabaseAdmin;

    // Get current survey to check permissions
    const { data: currentSurvey, error: fetchError } = await supabase
      .from('surveys')
      .select('organization_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Check if user has admin access
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', currentSurvey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Delete survey (cascade will handle related records)
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting survey:', error);
      return NextResponse.json({ error: 'Failed to delete survey' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Survey deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in delete survey API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
