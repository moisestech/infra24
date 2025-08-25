import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ClerkServerService } from '@/lib/clerk-server';

// POST /api/artists/claim - Submit a claim request for an artist profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { artist_id, claim_reason, supporting_evidence } = body;

    // Validate required fields
    if (!artist_id || !claim_reason) {
      return NextResponse.json(
        { error: 'Missing required fields: artist_id, claim_reason' },
        { status: 400 }
      );
    }

    // Get user profile
    const userProfile = await ClerkServerService.getUserMembership(userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check if artist profile exists and is unclaimed
    const artistResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_profiles?id=eq.${artist_id}&select=*`,
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

    // Check if artist is already claimed
    if (artist.is_claimed) {
      return NextResponse.json(
        { error: 'Artist profile is already claimed' },
        { status: 400 }
      );
    }

    // Check if user is in the same organization
    if (artist.organization_id !== userProfile.organization_id) {
      return NextResponse.json(
        { error: 'You can only claim artist profiles in your organization' },
        { status: 403 }
      );
    }

    // Check if user already has a pending claim for this artist
    const existingClaimResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_claim_requests?artist_profile_id=eq.${artist_id}&requester_user_id=eq.${userId}&status=eq.pending&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    );

    if (existingClaimResponse.ok) {
      const existingClaims = await existingClaimResponse.json();
      if (existingClaims.length > 0) {
        return NextResponse.json(
          { error: 'You already have a pending claim request for this artist profile' },
          { status: 400 }
        );
      }
    }

    // Create claim request
    const claimResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_claim_requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({
          artist_profile_id: artist_id,
          requester_user_id: userId,
          requester_email: userProfile.email,
          requester_name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim(),
          claim_reason: claim_reason,
          supporting_evidence: supporting_evidence || '',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!claimResponse.ok) {
      throw new Error(`Failed to create claim request: ${claimResponse.statusText}`);
    }

    const claim = await claimResponse.json();

    // Send notification to admins (optional - you can implement this later)
    // await sendClaimNotification(claim, artist, userProfile);

    return NextResponse.json({
      message: 'Claim request submitted successfully',
      claim_id: claim[0]?.id,
      status: 'pending'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating claim request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/artists/claim - Get user's claim requests
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's claim requests
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/artist_claim_requests?requester_user_id=eq.${userId}&select=*,artist_profiles(name,studio_number,studio_type)&order=created_at.desc`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch claim requests: ${response.statusText}`);
    }

    const claims = await response.json();
    return NextResponse.json(claims);

  } catch (error) {
    console.error('Error fetching claim requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
