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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    console.log('🗑️ Delete announcement - userId:', userId ? 'present' : 'missing');
    
    if (!userId) {
      console.log('🗑️ No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('🗑️ Deleting announcement ID:', id);

    // First, get the announcement to check permissions
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !announcement) {
      console.log('🗑️ Announcement not found:', fetchError);
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, organization_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      console.log('🗑️ User membership not found for userId:', userId);
      return NextResponse.json({ error: 'User membership not found' }, { status: 401 });
    }

    // Check permissions - super admins can delete any, org admins can delete from their org, users can delete their own
    const canDelete = 
      userMembership.role === 'super_admin' ||
      (userMembership.role === 'org_admin' && userMembership.organization_id === announcement.organization_id) ||
      (userMembership.role === 'moderator' && userMembership.organization_id === announcement.organization_id) ||
      announcement.created_by === userId;

    if (!canDelete) {
      console.log('🗑️ User does not have permission to delete this announcement');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Delete the announcement
    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('🗑️ Error deleting announcement:', deleteError);
      return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
    }

    console.log('🗑️ Successfully deleted announcement:', id);

    return NextResponse.json({
      message: 'Announcement deleted successfully',
      id: id
    });

  } catch (error) {
    console.error('🗑️ Error in delete announcement API:', error);
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
    console.log('✏️ Update announcement - userId:', userId ? 'present' : 'missing');
    
    if (!userId) {
      console.log('✏️ No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    console.log('✏️ Updating announcement ID:', id, 'with data:', body);

    // First, get the announcement to check permissions
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !announcement) {
      console.log('✏️ Announcement not found:', fetchError);
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, organization_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      console.log('✏️ User membership not found for userId:', userId);
      return NextResponse.json({ error: 'User membership not found' }, { status: 401 });
    }

    // Check permissions - super admins can edit any, org admins can edit from their org, users can edit their own
    const canEdit = 
      userMembership.role === 'super_admin' ||
      (userMembership.role === 'org_admin' && userMembership.organization_id === announcement.organization_id) ||
      (userMembership.role === 'moderator' && userMembership.organization_id === announcement.organization_id) ||
      announcement.created_by === userId;

    if (!canEdit) {
      console.log('✏️ User does not have permission to edit this announcement');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update the announcement
    const { data: updatedAnnouncement, error: updateError } = await supabase
      .from('announcements')
      .update({
        ...body,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('✏️ Error updating announcement:', updateError);
      return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
    }

    console.log('✏️ Successfully updated announcement:', id);

    return NextResponse.json({
      announcement: updatedAnnouncement,
      message: 'Announcement updated successfully'
    });

  } catch (error) {
    console.error('✏️ Error in update announcement API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
