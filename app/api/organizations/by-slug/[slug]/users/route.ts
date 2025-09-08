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

    // Get organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get user's membership to check access
    const { data: userMembership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .eq('org_id', organization.id)
      .single();

    if (membershipError || !userMembership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
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
        portfolio_images,
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

    // Get member types for this organization
    const { data: memberTypes, error: memberTypesError } = await supabase
      .from('org_member_types')
      .select(`
        id,
        type_key,
        label,
        description,
        is_staff,
        default_role_on_claim,
        sort_order
      `)
      .eq('org_id', organization.id)
      .order('sort_order', { ascending: true });

    if (memberTypesError) {
      console.error('Error fetching member types:', memberTypesError);
      return NextResponse.json({ error: 'Failed to fetch member types' }, { status: 500 });
    }

    return NextResponse.json({
      organization,
      memberships: memberships || [],
      artist_profiles: artistProfiles || [],
      member_types: memberTypes || []
    });

  } catch (error) {
    console.error('Error in organization users API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

