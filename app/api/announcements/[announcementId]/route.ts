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

    // Get the announcement
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
        scheduled_at
      `)
      .eq('id', id)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get the announcement first to check permissions
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('id, org_id, author_clerk_id, status')
      .eq('id', id)
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
      .eq('id', id)
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
        scheduled_at
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
