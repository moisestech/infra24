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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    // Get the requesting user's membership to check permissions
    const { data: requestingUserMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!requestingUserMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Get the target user's membership
    const { data: targetUserMembership, error: userError } = await supabase
      .from('org_memberships')
      .select('id, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !targetUserMembership) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions:
    // - Super admins can see any user's announcements
    // - Org admins can see announcements from users in their organization
    // - Users can see their own announcements
    const canAccess = 
      requestingUserMembership.role === 'super_admin' ||
      (requestingUserMembership.role === 'org_admin' && requestingUserMembership.org_id === targetUserMembership.org_id) ||
      currentUserId === userId;

    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all announcements by this user
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select(`
        id,
        title,
        body,
        status,
        created_at,
        published_at,
        expires_at,
        priority,
        tags,
        org_id
      `)
      .eq('author_clerk_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (announcementsError) {
      console.error('Error fetching announcements:', announcementsError);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    return NextResponse.json({
      announcements: announcements || [],
      user: {
        id: targetUserMembership.id,
        clerk_user_id: userId
      }
    });

  } catch (error) {
    console.error('Error in user announcements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
