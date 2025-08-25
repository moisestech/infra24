import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ClerkServerService } from '@/lib/clerk-server';

// GET /api/artists - Get artists for the current user's organization
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = `
      SELECT * FROM artist_profiles 
      WHERE organization_id = $1
    `;
    const params: any[] = [userProfile.organization_id];
    let paramIndex = 2;

    // Add search filter
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR studio_number ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add type filter
    if (type && type !== 'all') {
      query += ` AND studio_type = $${paramIndex}`;
      params.push(type.charAt(0).toUpperCase() + type.slice(1));
      paramIndex++;
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'claimed') {
        query += ` AND is_claimed = true`;
      } else if (status === 'unclaimed') {
        query += ` AND is_claimed = false`;
      }
    }

    // Add ordering and pagination
    query += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Execute query
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_artists`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({
          org_id: userProfile.organization_id,
          search_term: search || '',
          type_filter: type || 'all',
          status_filter: status || 'all',
          limit_count: limit,
          offset_count: offset
        }),
      }
    );

    if (!response.ok) {
      // Fallback to direct query if RPC doesn't exist
      const directResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles?organization_id=eq.${userProfile.organization_id}&select=*&order=name.asc&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          },
        }
      );

      if (!directResponse.ok) {
        throw new Error(`Failed to fetch artists: ${directResponse.statusText}`);
      }

      const artists = await directResponse.json();
      
      // Apply filters in memory if RPC failed
      let filteredArtists = artists;
      
      if (search) {
        filteredArtists = filteredArtists.filter((artist: any) =>
          artist.name.toLowerCase().includes(search.toLowerCase()) ||
          (artist.studio_number && artist.studio_number.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      if (type && type !== 'all') {
        filteredArtists = filteredArtists.filter((artist: any) =>
          artist.studio_type.toLowerCase() === type.toLowerCase()
        );
      }
      
      if (status && status !== 'all') {
        if (status === 'claimed') {
          filteredArtists = filteredArtists.filter((artist: any) => artist.is_claimed);
        } else if (status === 'unclaimed') {
          filteredArtists = filteredArtists.filter((artist: any) => !artist.is_claimed);
        }
      }

      return NextResponse.json(filteredArtists);
    }

    const artists = await response.json();
    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create a new artist profile (admin only)
export async function POST(request: NextRequest) {
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

    // Check if user has permission to create artists (admin only)
    if (!['super_admin', 'org_admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, studio_number, studio_type, studio_location, bio, website_url, instagram_handle, email, phone } = body;

    // Validate required fields
    if (!name || !studio_type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, studio_type' },
        { status: 400 }
      );
    }

    // Create artist profile
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({
          name,
          studio_number,
          studio_type,
          studio_location,
          bio,
          website_url,
          instagram_handle,
          email,
          phone,
          org_id: userProfile.org_id,
          is_active: true,
          is_claimed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create artist profile: ${response.statusText}`);
    }

    const artist = await response.json();
    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error('Error creating artist profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
