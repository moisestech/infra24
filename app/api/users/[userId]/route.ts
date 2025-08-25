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
      .select(`
        id,
        clerk_user_id,
        role,
        org_id,
        joined_at,
        organizations (
          id,
          name,
          slug
        )
      `)
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !targetUserMembership) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions:
    // - Super admins can see any user
    // - Org admins can see users in their organization
    // - Users can see their own profile
    const canAccess = 
      requestingUserMembership.role === 'super_admin' ||
      (requestingUserMembership.role === 'org_admin' && requestingUserMembership.org_id === targetUserMembership.org_id) ||
      currentUserId === userId;

    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      user: targetUserMembership
    });

  } catch (error) {
    console.error('Error in user profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;
    const updates = await request.json();

    // Get the requesting user's membership to check permissions
    const { data: requestingUserMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', currentUserId)
      .single();

    if (!requestingUserMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Only super admins and org admins can update user roles
    if (!['super_admin', 'org_admin'].includes(requestingUserMembership.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the target user's membership
    const { data: targetUserMembership, error: userError } = await supabase
      .from('org_memberships')
      .select('id, org_id, role')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !targetUserMembership) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Org admins can only update users in their organization
    if (requestingUserMembership.role === 'org_admin' && requestingUserMembership.org_id !== targetUserMembership.org_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update the user membership
    const { data: updatedMembership, error: updateError } = await supabase
      .from('org_memberships')
      .update(updates)
      .eq('clerk_user_id', userId)
      .select(`
        id,
        clerk_user_id,
        role,
        org_id,
        joined_at,
        organizations (
          id,
          name,
          slug
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating user membership:', updateError);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      user: updatedMembership
    });

  } catch (error) {
    console.error('Error in user update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
