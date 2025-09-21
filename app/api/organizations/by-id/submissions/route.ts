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
    
    const formId = searchParams.get('form_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const reviewerId = searchParams.get('reviewer_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('submissions')
      .select(`
        *,
        submission_forms(*),
        submission_reviews(*),
        submission_comments(*)
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (formId) {
      query = query.eq('form_id', formId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (reviewerId) {
      query = query.eq('reviewer_id', reviewerId);
    }

    const { data: submissions, error, count } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in submissions GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId } = await params;
    const body = await request.json();

    const {
      form_id,
      title,
      content,
      submitter_name,
      submitter_email,
      submitter_phone,
      tags = [],
      attachments = [],
      metadata = {}
    } = body;

    // Validate required fields
    if (!form_id || !title || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: form_id, title, content' 
      }, { status: 400 });
    }

    // Get form details
    const { data: form, error: formError } = await supabase
      .from('submission_forms')
      .select('*')
      .eq('id', form_id)
      .eq('organization_id', orgId)
      .single();

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Check if form is active and not past deadline
    if (!form.is_active) {
      return NextResponse.json({ error: 'Form is not active' }, { status: 400 });
    }

    if (form.submission_deadline && new Date() > new Date(form.submission_deadline)) {
      return NextResponse.json({ error: 'Submission deadline has passed' }, { status: 400 });
    }

    // Check authentication requirement
    if (form.requires_authentication && !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check max submissions per user
    if (form.max_submissions_per_user && userId) {
      const { count: userSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('form_id', form_id)
        .eq('user_id', userId);

      if (userSubmissions && userSubmissions >= form.max_submissions_per_user) {
        return NextResponse.json({ 
          error: `Maximum submissions per user (${form.max_submissions_per_user}) exceeded` 
        }, { status: 400 });
      }
    }

    // Create submission
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        organization_id: orgId,
        form_id,
        user_id: userId,
        title,
        content,
        submitter_name,
        submitter_email,
        submitter_phone,
        tags,
        attachments,
        metadata,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission:', error);
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }

    // Send notification to organization admins
    const { data: admins } = await supabase
      .from('org_memberships')
      .select('user_id')
      .eq('organization_id', orgId)
      .in('role', ['admin', 'manager']);

    if (admins) {
      for (const admin of admins) {
        await supabase
          .from('submission_notifications')
          .insert({
            submission_id: submission.id,
            user_id: admin.user_id,
            type: 'submitted',
            title: 'New Submission Received',
            message: `A new submission "${title}" has been received for form "${form.title}".`
          });
      }
    }

    return NextResponse.json({ submission }, { status: 201 });

  } catch (error) {
    console.error('Error in submissions POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
