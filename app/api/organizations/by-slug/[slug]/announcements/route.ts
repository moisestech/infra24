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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    console.log('🔐 Auth check - userId:', userId ? 'present' : 'missing');
    
    const { slug } = await params;
    console.log('🏢 Fetching announcements for organization slug:', slug);

    // First, get the organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      console.log('🏢 Organization not found for slug:', slug, 'Error:', orgError);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    console.log('🏢 Found organization:', organization);

    // Get announcements for this organization
    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        type,
        priority,
        visibility,
        start_date,
        end_date,
        location,
        key_people,
        metadata,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
      `)
      .eq('org_id', organization.id)
      .order('created_at', { ascending: false });

    // If no user is authenticated, only show active announcements
    if (!userId) {
      query = query.eq('is_active', true);
    } else {
      // Check if user has access to this organization
      const { data: userMembership } = await supabase
        .from('org_memberships')
        .select('role, organization_id')
        .eq('clerk_user_id', userId)
        .single();

      if (userMembership) {
        console.log('👥 Found user membership:', userMembership);
        
        // Super admins can see all organizations, others can only see their own
        if (userMembership.role !== 'super_admin' && userMembership.organization_id !== organization.id) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // If user is not an admin, only show active announcements
        if (!['super_admin', 'org_admin', 'moderator'].includes(userMembership.role)) {
          query = query.eq('is_active', true);
        }
      } else {
        // No membership found, only show active announcements
        query = query.eq('is_active', true);
      }
    }

    const { data: announcements, error: announcementsError } = await query;

    if (announcementsError) {
      console.error('📢 Error fetching announcements:', announcementsError);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    console.log('📢 Successfully fetched announcements:', announcements?.length || 0, 'announcements');

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    // First, get the organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, organization_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Super admins can see all organizations, others can only see their own
    if (userMembership.role !== 'super_admin' && userMembership.organization_id !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if user has permission to create announcements
    if (!['super_admin', 'org_admin', 'moderator', 'resident'].includes(userMembership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create the announcement using correct schema
    const { data: announcement, error: createError } = await supabase
      .from('announcements')
      .insert({
        org_id: organization.id,
        created_by: userId,
        title: body.title,
        content: body.content,
        is_active: body.is_active !== false, // Default to true
        priority: body.priority || 'normal',
        visibility: body.visibility || 'internal',
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        location: body.location || null,
        key_people: body.key_people || [],
        metadata: body.metadata || {}
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
