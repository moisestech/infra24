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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: artist, error } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        bio,
        profile_image_url,
        studio,
        role,
        status,
        created_at,
        updated_at,
        org_id,
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

    return NextResponse.json({ artist }, { status: 200 });
  } catch (error) {
    console.error('Error in artist API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if user has permission to update artist profiles
    const { data: artist, error: artistError } = await supabase
      .from('artist_profiles')
      .select('org_id')
      .eq('id', id)
      .single();

    if (artistError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', artist.org_id)
      .eq('clerk_user_id', userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Not authorized to update artist profiles' }, { status: 403 });
    }

    const userRole = membership.role;
    if (!['super_admin', 'org_admin', 'moderator'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { data: updatedArtist, error } = await supabase
      .from('artist_profiles')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist:', error);
      return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
    }

    return NextResponse.json({ artist: updatedArtist }, { status: 200 });
  } catch (error) {
    console.error('Error in update artist API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user has permission to delete artist profiles
    const { data: artist, error: artistError } = await supabase
      .from('artist_profiles')
      .select('org_id')
      .eq('id', id)
      .single();

    if (artistError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', artist.org_id)
      .eq('clerk_user_id', userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Not authorized to delete artist profiles' }, { status: 403 });
    }

    const userRole = membership.role;
    if (!['super_admin', 'org_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { error } = await supabase
      .from('artist_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artist:', error);
      return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Artist deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in delete artist API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


