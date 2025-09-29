import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;
    
    console.log('🔍 Fetching artist:', artistId);

    // Fetch artist with organization data
    const { data: artist, error } = await supabase
      .from('artist_profiles')
      .select(`
        *,
        organizations (
          id,
          name,
          slug
        )
      `)
      .eq('id', artistId)
      .single();

    if (error) {
      console.error('❌ Error fetching artist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch artist' },
        { status: 500 }
      );
    }

    if (!artist) {
      console.log('❌ Artist not found:', artistId);
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    console.log('✅ Artist fetched successfully:', artist.name);

    return NextResponse.json({
      artist,
      success: true
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}