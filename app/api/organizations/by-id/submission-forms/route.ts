import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status, headers: { 'Cache-Control': 'private, no-store' } });
    const supabase = access.db;
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isActive = searchParams.get('is_active') !== 'false';
    const isPublic = searchParams.get('is_public') === 'true';

    // Build query
    let query = supabase
      .from('submission_forms')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (isActive) {
      query = query.eq('is_active', true);
    }

    if (isPublic) {
      query = query.eq('is_public', true);
    }

    const { data: forms, error } = await query;

    if (error) {
      console.error('Error fetching submission forms:', error);
      return NextResponse.json({ error: 'Failed to fetch submission forms' }, { status: 500 });
    }

    return NextResponse.json({ forms }, { headers: { 'Cache-Control': 'private, no-store' } });

  } catch (error) {
    console.error('Error in submission forms GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId);
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status});
    const supabase = access.db;
    const userId = access.userId;
    const body = await request.json();

    const {
      title,
      description,
      type,
      category,
      form_schema,
      validation_rules = {},
      submission_settings = {},
      is_public = false,
      requires_authentication = true,
      max_submissions_per_user,
      submission_deadline,
      review_deadline,
      metadata = {}
    } = body;

    // Validate required fields
    if (!title || !form_schema) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, form_schema' 
      }, { status: 400 });
    }

    // Create submission form
    const { data: form, error } = await supabase
      .from('submission_forms')
      .insert({
        org_id: orgId,
        title,
        description,
        type,
        category,
        form_schema,
        validation_rules,
        submission_settings,
        is_public,
        requires_authentication,
        max_submissions_per_user,
        submission_deadline,
        review_deadline,
        metadata,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission form:', error);
      return NextResponse.json({ error: 'Failed to create submission form' }, { status: 500 });
    }

    return NextResponse.json({ form }, { status: 201 });

  } catch (error) {
    console.error('Error in submission forms POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
