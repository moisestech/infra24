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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');
    const role = searchParams.get('role');
    const studio = searchParams.get('studio');

    let query = supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        bio,
        profile_image,
        studio_number,
        studio_type,
        is_claimed,
        claimed_by_clerk_user_id,
        member_type_id,
        created_at,
        updated_at,
        organization_id,
        organizations (
          id,
          name,
          slug
        )
      `);

    if (orgId) {
      query = query.eq('organization_id', orgId);
    }

    if (role) {
      query = query.eq('role', role);
    }

    if (studio) {
      query = query.eq('studio', studio);
    }

    const { data: artists, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    return NextResponse.json({ artists }, { status: 200 });
  } catch (error) {
    console.error('Error in artists API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, profile_image_url, studio, role, org_id } = body;

    // Check if user has permission to create artist profiles
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', org_id)
      .eq('clerk_user_id', userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Not authorized to create artist profiles' }, { status: 403 });
    }

    const userRole = membership.role;
    if (!['super_admin', 'org_admin', 'moderator'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { data: artist, error } = await supabase
      .from('artist_profiles')
      .insert({
        name,
        bio,
        profile_image_url,
        studio,
        role,
        org_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating artist profile:', error);
      return NextResponse.json({ error: 'Failed to create artist profile' }, { status: 500 });
    }

    return NextResponse.json({ artist }, { status: 201 });
  } catch (error) {
    console.error('Error in create artist API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}