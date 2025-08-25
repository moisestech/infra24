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

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Super admins can see all organizations, others can only see their own
    if (userMembership.role !== 'super_admin' && userMembership.org_id !== organization.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all artist profiles for this organization
    const { data: artists, error: artistsError } = await supabase
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
        org_member_types (
          id,
          type_key,
          label
        )
      `)
      .eq('organization_id', organization.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (artistsError) {
      console.error('Error fetching artists:', artistsError);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    return NextResponse.json({
      artists: artists || [],
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      }
    });

  } catch (error) {
    console.error('Error in organization artists API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
