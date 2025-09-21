import { NextRequest, NextResponse } from 'next/server';
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch artist profile with organization details
    const { data: artist, error } = await supabase
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
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching artist:', error);
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // If artist is claimed, fetch user details
    if (artist.is_claimed && artist.claimed_by_clerk_user_id) {
      // Note: In a real implementation, you might want to fetch additional user details
      // from Clerk or your user management system
    }

    return NextResponse.json({ artist }, { status: 200 });
  } catch (error) {
    console.error('Error in artist API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

