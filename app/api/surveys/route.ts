import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET /api/surveys - List surveys for organization
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const organizationSlug = searchParams.get('organizationId'); // This is actually the slug
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    if (!organizationSlug) {
      return NextResponse.json({ error: 'Organization slug is required' }, { status: 400 });
    }

    // Get organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', organizationSlug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const organizationId = organization.id;

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build query
    let query = supabase
      .from('surveys')
      .select(`
        id,
        title,
        description,
        status,
        is_anonymous,
        language_default,
        languages_supported,
        opens_at,
        closes_at,
        max_responses,
        max_responses_per_user,
        created_at,
        updated_at,
        created_by,
        updated_by,
        template_id,
        survey_templates (
          name,
          category
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('survey_templates.category', category);
    }

    const { data: surveys, error } = await query;

    if (error) {
      console.error('Error fetching surveys:', error);
      return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
    }

    // Get response counts for each survey
    const surveysWithCounts = await Promise.all(
      surveys.map(async (survey) => {
        const { count } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('survey_id', survey.id)
          .eq('status', 'completed');

        return {
          ...survey,
          response_count: count || 0
        };
      })
    );

    return NextResponse.json({ surveys: surveysWithCounts }, { status: 200 });
  } catch (error) {
    console.error('Error in surveys API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/surveys - Create new survey
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      organizationId, // This might be a slug
      templateId,
      title,
      description,
      isAnonymous = true,
      languageDefault = 'en',
      languagesSupported = ['en'],
      requiresAuthentication = false,
      allowedRoles = ['staff', 'resident', 'public'],
      opensAt,
      closesAt,
      maxResponses,
      maxResponsesPerUser = 1,
      surveySchema,
      settings = {},
      metadata = {}
    } = body;

    if (!organizationId || !title) {
      return NextResponse.json({ error: 'Organization ID and title are required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const supabase = supabaseAdmin;

    // Handle organization ID (could be slug or UUID)
    let finalOrganizationId = organizationId;
    if (!organizationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // It's a slug, get the UUID
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', organizationId)
        .single();

      if (orgError || !organization) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }
      finalOrganizationId = organization.id;
    }

    // Check if user has admin/manager access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', finalOrganizationId)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // If templateId is provided, get the template schema
    let finalSurveySchema = surveySchema;
    if (templateId && !surveySchema) {
      const { data: template } = await supabase
        .from('survey_templates')
        .select('template_schema')
        .eq('id', templateId)
        .single();

      if (template) {
        finalSurveySchema = template.template_schema;
      }
    }

    if (!finalSurveySchema) {
      return NextResponse.json({ error: 'Survey schema is required' }, { status: 400 });
    }

    // Create survey
    const { data: survey, error } = await supabase
      .from('surveys')
      .insert({
        organization_id: finalOrganizationId,
        template_id: templateId,
        title,
        description,
        is_anonymous: isAnonymous,
        language_default: languageDefault,
        languages_supported: languagesSupported,
        requires_authentication: requiresAuthentication,
        allowed_roles: allowedRoles,
        opens_at: opensAt,
        closes_at: closesAt,
        max_responses: maxResponses,
        max_responses_per_user: maxResponsesPerUser,
        survey_schema: finalSurveySchema,
        settings,
        metadata,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating survey:', error);
      return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
    }

    return NextResponse.json({ survey }, { status: 201 });
  } catch (error) {
    console.error('Error in create survey API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
