import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ClerkServerService } from '@/lib/clerk-server';

// GET /api/artists/[id] - Get a specific artist profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's organization
    const userProfile = await ClerkServerService.getUserMembership(userId);
    if (!userProfile?.org_id) {
      return NextResponse.json(
        { error: 'User not assigned to an organization' },
        { status: 400 }
      );
    }

    const { artistId } = await params;
    
    // Fetch artist profile
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles?id=eq.${artistId}&org_id=eq.${userProfile.org_id}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch artist profile' },
        { status: 500 }
      );
    }

    const artists = await response.json();
    
    if (artists.length === 0) {
      return NextResponse.json(
        { error: 'Artist profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(artists[0]);
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/artists/[id] - Update artist profile (claimed artists only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bio, website_url, instagram_handle, phone, portfolio_images, specialties, media } = body;

    // Get user's organization
    const userProfile = await ClerkServerService.getUserMembership(userId);
    if (!userProfile?.org_id) {
      return NextResponse.json(
        { error: 'User not assigned to an organization' },
        { status: 400 }
      );
    }

    const { artistId } = await params;
    
    // Check if artist profile exists and user can edit it
    const artistResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles?id=eq.${artistId}&org_id=eq.${userProfile.org_id}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    );

    if (!artistResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch artist profile' },
        { status: 500 }
      );
    }

    const artists = await artistResponse.json();
    
    if (artists.length === 0) {
      return NextResponse.json(
        { error: 'Artist profile not found' },
        { status: 404 }
      );
    }

    const artist = artists[0];

    // Check if user can edit this profile
    const canEdit = artist.claimed_by_clerk_user_id === userId || 
                   userProfile.role === 'org_admin' || 
                   userProfile.role === 'super_admin';

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own claimed profile or need admin access' },
        { status: 403 }
      );
    }

    // Update artist profile
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles?id=eq.${artistId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({
          bio,
          website_url,
          instagram_handle,
          phone,
          portfolio_images,
          specialties,
          media,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update artist profile: ${updateResponse.statusText}`);
    }

    const updatedArtist = await updateResponse.json();
    return NextResponse.json(updatedArtist[0]);
  } catch (error) {
    console.error('Error updating artist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
