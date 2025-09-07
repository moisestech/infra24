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
  { params }: { params: Promise<{ announcementId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { announcementId } = await params;

    // Get the announcement with organization data
    const { data: announcement, error } = await supabase
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
        event_state,
        organizations!inner(
          id,
          name,
          slug
        )
      `)
      .eq('id', announcementId)
      .is('deleted_at', null)
      .single();

    if (error || !announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user has access to this announcement
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Super admins can see all announcements, others can only see their organization's or their own
    if (userMembership.role !== 'super_admin' && 
        userMembership.org_id !== announcement.org_id &&
        announcement.author_clerk_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Non-admin users can only see published announcements or their own
    if (!['super_admin', 'org_admin', 'moderator'].includes(userMembership.role) &&
        announcement.status !== 'published' &&
        announcement.author_clerk_id !== userId) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      announcement
    });

  } catch (error) {
    console.error('Error in announcement API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ announcementId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { announcementId } = await params;
    const body = await request.json();

    // Get the announcement first to check permissions
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('id, org_id, author_clerk_id, status')
      .eq('id', announcementId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user has permission to edit this announcement
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Only admins, moderators, or the author can edit announcements
    const canEdit = ['super_admin', 'org_admin', 'moderator'].includes(userMembership.role) ||
                   announcement.author_clerk_id === userId;

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.body !== undefined) updateData.body = body.body;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at || null;
    if (body.expires_at !== undefined) updateData.expires_at = body.expires_at || null;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.visibility !== undefined) updateData.visibility = body.visibility;
    if (body.starts_at !== undefined) updateData.starts_at = body.starts_at || null;
    if (body.ends_at !== undefined) updateData.ends_at = body.ends_at || null;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.sub_type !== undefined) updateData.sub_type = body.sub_type;
    if (body.primary_link !== undefined) updateData.primary_link = body.primary_link;
    if (body.additional_info !== undefined) updateData.additional_info = body.additional_info;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.people !== undefined) updateData.people = body.people;
    if (body.external_orgs !== undefined) updateData.external_orgs = body.external_orgs;
    if (body.style !== undefined) updateData.style = body.style;
    if (body.timezone !== undefined) updateData.timezone = body.timezone;
    if (body.is_all_day !== undefined) updateData.is_all_day = body.is_all_day;
    if (body.is_time_tbd !== undefined) updateData.is_time_tbd = body.is_time_tbd;
    if (body.rsvp_label !== undefined) updateData.rsvp_label = body.rsvp_label;
    if (body.rsvp_url !== undefined) updateData.rsvp_url = body.rsvp_url;
    if (body.event_state !== undefined) updateData.event_state = body.event_state;
    
    // Only super admins can change the author
    if (body.author_clerk_id !== undefined && userMembership.role === 'super_admin') {
      updateData.author_clerk_id = body.author_clerk_id;
    }
    
    // If status is being changed to published, set published_at
    if (body.status === 'published' && announcement.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    // Update the announcement
    const { data: updatedAnnouncement, error: updateError } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', announcementId)
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
      .single();

    if (updateError) {
      console.error('Error updating announcement:', updateError);
      return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
    }

    return NextResponse.json({
      announcement: updatedAnnouncement,
      message: 'Announcement updated successfully'
    });

  } catch (error) {
    console.error('Error in announcement update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
