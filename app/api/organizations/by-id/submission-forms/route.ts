import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId } = await params;
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isActive = searchParams.get('is_active') !== 'false';
    const isPublic = searchParams.get('is_public') === 'true';

    // Build query
    let query = supabase
      .from('submission_forms')
      .select('*')
      .eq('organization_id', orgId)
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

    return NextResponse.json({ forms });

  } catch (error) {
    console.error('Error in submission forms GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId } = await params;
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

    // Check if user has permission to create forms for this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create submission form
    const { data: form, error } = await supabase
      .from('submission_forms')
      .insert({
        organization_id: orgId,
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
