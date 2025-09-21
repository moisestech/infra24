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
    const { data: userMemberships, error: membershipError } = await supabase
      .from('org_memberships')
      .select(`
        id,
        clerk_user_id,
        role,
        organization_id,
        joined_at,
        organizations (
          id,
          name,
          slug,
          logo_url
        )
      `)
      .eq('clerk_user_id', userId)
      .eq('is_active', true);

    console.log('👤 User membership lookup result:', { userMemberships, membershipError });

    if (membershipError || !userMemberships || userMemberships.length === 0) {
      console.log('❌ User membership not found in database:', membershipError);
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Get the primary membership (first one) and all organizations
    const primaryMembership = userMemberships[0];
    const organizations = userMemberships.map(membership => membership.organizations);

    console.log('✅ Returning user data:', { 
      membershipId: primaryMembership.id, 
      role: primaryMembership.role, 
      hasOrg: !!primaryMembership.organizations,
      totalOrgs: organizations.length
    });

    return NextResponse.json({
      user: {
        id: primaryMembership.id,
        clerk_user_id: primaryMembership.clerk_user_id,
        role: primaryMembership.role,
        organization_id: primaryMembership.organization_id,
        joined_at: primaryMembership.joined_at
      },
      organization: primaryMembership.organizations,
      organizations: organizations,
      role: primaryMembership.role,
      permissions: getPermissionsForRole(primaryMembership.role)
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
