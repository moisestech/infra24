import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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

    // First, get the organization by ID
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('id', id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Super admins can see all organizations, others can only see their own
    if (userMembership.role !== 'super_admin' && userMembership.org_id !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all announcements for this organization
    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        body,
        status,
        author_clerk_id,
        created_at,
        published_at,
        expires_at,
        priority,
        tags,
        org_id,
        scheduled_at,
        location,
        visibility,
        starts_at,
        ends_at,
        type,
        sub_type,
        primary_link,
        additional_info,
        image_url,
        people,
        external_orgs,
        style,
        timezone,
        is_all_day,
        is_time_tbd,
        rsvp_label,
        rsvp_url,
        event_state
      `)
      .eq('org_id', organization.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // If user is not an admin, only show published announcements or their own
    if (!['super_admin', 'org_admin', 'moderator'].includes(userMembership.role)) {
      query = query.or(`status.eq.published,author_clerk_id.eq.${userId}`);
    }

    const { data: announcements, error: announcementsError } = await query;

    if (announcementsError) {
      console.error('Error fetching announcements:', announcementsError);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    return NextResponse.json({
      announcements: announcements || [],
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      }
    });

  } catch (error) {
    console.error('Error in organization announcements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // First, get the organization by ID
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('id', id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Super admins can see all organizations, others can only see their own
    if (userMembership.role !== 'super_admin' && userMembership.org_id !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if user has permission to create announcements
    if (!['super_admin', 'org_admin', 'moderator', 'resident'].includes(userMembership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create the announcement
    const { data: announcement, error: createError } = await supabase
      .from('announcements')
      .insert({
        org_id: organization.id,
        author_clerk_id: userId,
        title: body.title,
        body: body.body,
        status: body.status || 'draft',
        priority: body.priority || 0,
        tags: body.tags || [],
        visibility: body.visibility || 'internal',
        scheduled_at: body.scheduled_at || null,
        expires_at: body.expires_at || null,
        published_at: body.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating announcement:', createError);
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }

    return NextResponse.json({
      announcement,
      message: 'Announcement created successfully'
    });

  } catch (error) {
    console.error('Error in create announcement API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
