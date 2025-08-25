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
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

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
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    // For now, allow access if user has any membership (super admin logic)
    // TODO: Implement proper organization-specific access control
    if (!userMembership) {
      // Allow access for now - this will be refined later
      console.log('No membership found for user, but allowing access for development');
    } else {
      // Super admins can see all organizations, others can only see their own
      if (userMembership.role !== 'super_admin' && userMembership.org_id !== organization.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Get all memberships for this organization
    const { data: memberships, error: membershipsError } = await supabase
      .from('org_memberships')
      .select(`
        id,
        clerk_user_id,
        role,
        org_id,
        joined_at
      `)
      .eq('org_id', organization.id)
      .order('joined_at', { ascending: false });

    if (membershipsError) {
      console.error('Error fetching memberships:', membershipsError);
      return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 });
    }

    // Get all artist profiles for this organization with member type data
    const { data: artistProfiles, error: artistsError } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        email,
        phone,
        studio_number,
        studio_type,
        studio_location,
        bio,
        website_url,
        instagram_handle,
        profile_image,
        is_active,
        is_claimed,
        claimed_by_clerk_user_id,
        claimed_at,
        profile_type,
        created_at,
        updated_at,
        member_type_id,
        org_member_types(
          id,
          type_key,
          label,
          description,
          is_staff,
          default_role_on_claim,
          sort_order
        )
      `)
      .eq('organization_id', organization.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (artistsError) {
      console.error('Error fetching artist profiles:', artistsError);
      return NextResponse.json({ error: 'Failed to fetch artist profiles' }, { status: 500 });
    }

    // Combine memberships and artist profiles
    const allUsers = [
      ...(memberships || []).map(membership => ({
        ...membership,
        type: 'membership',
        display_name: membership.clerk_user_id, // You might want to fetch user details from Clerk
        email: membership.clerk_user_id // Placeholder
      })),
      ...(artistProfiles || []).map(artist => ({
        ...artist,
        type: 'artist_profile',
        display_name: artist.name,
        email: artist.email,
        clerk_user_id: artist.claimed_by_clerk_user_id,
        member_type: artist.org_member_types
      }))
    ];

    return NextResponse.json({
      users: allUsers,
      memberships: memberships || [],
      artist_profiles: artistProfiles || [],
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      }
    });

  } catch (error) {
    console.error('Error in organization users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
