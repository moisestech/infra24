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
    console.log('🔍 API Route: /api/organizations/by-slug/[slug] - Starting request');
    
    const authResult = await auth();
    const { userId } = authResult;
    
    console.log('🔐 Auth result:', { userId, hasUserId: !!userId });
    
    if (!userId) {
      console.log('❌ No userId found, returning unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    console.log('📍 Requested slug:', slug);

    // Get the requesting user's membership to check permissions
    console.log('👤 Looking up user membership for userId:', userId);
    const { data: requestingUserMembership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    console.log('👤 User membership lookup result:', { requestingUserMembership, membershipError });

    if (!requestingUserMembership) {
      console.log('❌ User membership not found in database');
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Get the organization by slug
    console.log('🏢 Looking up organization with slug:', slug);
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug, artist_icon, banner_image, created_at')
      .eq('slug', slug)
      .single();

    console.log('🏢 Organization lookup result:', { organization, orgError });

    if (orgError || !organization) {
      console.log('❌ Organization not found:', orgError);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    // Super admins can see all organizations, others can only see their own
    console.log('🔐 Checking access:', { 
      userRole: requestingUserMembership.role, 
      userOrgId: requestingUserMembership.org_id, 
      requestedOrgId: organization.id,
      isSuperAdmin: requestingUserMembership.role === 'super_admin'
    });
    
    if (requestingUserMembership.role !== 'super_admin' && requestingUserMembership.org_id !== organization.id) {
      console.log('❌ Access denied - user not super admin and not member of org');
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    console.log('✅ Access granted, returning organization data');
    return NextResponse.json({
      organization
    });

  } catch (error) {
    console.error('Error in organization by slug API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
