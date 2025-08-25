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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route: /api/users/me - Starting request');
    
    const authResult = await auth();
    const { userId } = authResult;
    
    console.log('🔐 Auth result:', { userId, hasUserId: !!userId });
    
    if (!userId) {
      console.log('❌ No userId found, returning unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's membership info
    console.log('👤 Looking up user membership for userId:', userId);
    const { data: userMembership, error: membershipError } = await supabase
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
          slug,
          logo_url
        )
      `)
      .eq('clerk_user_id', userId)
      .single();

    console.log('👤 User membership lookup result:', { userMembership, membershipError });

    if (membershipError || !userMembership) {
      console.log('❌ User membership not found in database:', membershipError);
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Organization data is already included in the membership query
    const organization = userMembership.organizations;

    console.log('✅ Returning user data:', { 
      membershipId: userMembership.id, 
      role: userMembership.role, 
      hasOrg: !!organization 
    });

    return NextResponse.json({
      user: {
        id: userMembership.id,
        clerk_user_id: userMembership.clerk_user_id,
        role: userMembership.role,
        organization_id: userMembership.org_id,
        joined_at: userMembership.joined_at
      },
      organization,
      role: userMembership.role,
      permissions: getPermissionsForRole(userMembership.role)
    });

  } catch (error) {
    console.error('Error in user me API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case 'super_admin':
      return [
        'manage_all_organizations',
        'manage_announcements',
        'manage_artists',
        'approve_claims',
        'view_analytics',
        'manage_members',
        'manage_system'
      ];
    case 'org_admin':
      return [
        'manage_announcements',
        'manage_artists',
        'approve_claims',
        'view_analytics',
        'manage_members'
      ];
    case 'moderator':
      return [
        'approve_claims',
        'view_analytics',
        'moderate_content'
      ];
    case 'resident':
      return [
        'create_announcements',
        'view_artists',
        'claim_profile',
        'edit_own_profile'
      ];
    case 'guest':
      return [
        'view_public_content'
      ];
    default:
      return [];
  }
}
