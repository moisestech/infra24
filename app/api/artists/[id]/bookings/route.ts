import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 Artist Booking API: Starting request');
    const { id: artistId } = await params;
    const body = await request.json();
    
    console.log('🔍 Artist Booking API: Artist ID:', artistId);
    console.log('🔍 Artist Booking API: Booking data:', body);

    const {
      organizationId,
      title,
      description,
      startTime,
      endTime,
      meetingType,
      contactMethod,
      bookerName,
      bookerEmail,
      bookerPhone,
      status = 'pending'
    } = body;

    // Validate required fields
    if (!organizationId || !title || !startTime || !endTime || !bookerName || !bookerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // First, verify the artist exists and belongs to the organization
    const { data: artist, error: artistError } = await supabaseAdmin
      .from('artist_profiles')
      .select('id, name, organization_id')
      .eq('id', artistId)
      .eq('organization_id', organizationId)
      .single();

    if (artistError || !artist) {
      console.error('❌ Artist Booking API: Artist not found:', artistError);
      return NextResponse.json(
        { error: 'Artist not found or does not belong to this organization' },
        { status: 404 }
      );
    }

    console.log('🔍 Artist Booking API: Found artist:', artist.name);

    // Create the booking
    const bookingData = {
      org_id: organizationId,
      resource_id: artistId, // Using artist ID as resource ID
      resource_label: `Artist: ${artist.name}`,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      status,
      booker_name: bookerName,
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      metadata: {
        artist_id: artistId,
        artist_name: artist.name,
        meeting_type: meetingType,
        contact_method: contactMethod,
        booking_type: 'artist_booking'
      }
    };

    console.log('🔍 Artist Booking API: Creating booking with data:', bookingData);

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert(bookingData)
      .select('id, title, start_time, end_time, status')
      .single();

    if (bookingError) {
      console.error('❌ Artist Booking API: Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    console.log('🔍 Artist Booking API: Successfully created booking:', booking);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Artist Booking API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 Artist Bookings API: Starting request');
    const { id: artistId } = await params;
    
    console.log('🔍 Artist Bookings API: Fetching bookings for artist:', artistId);

    const supabaseAdmin = getSupabaseAdmin();

    // Get all bookings for this artist
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
        status,
        booker_name,
        booker_email,
        booker_phone,
        metadata,
        created_at
      `)
      .eq('resource_id', artistId)
      .eq('metadata->>booking_type', 'artist_booking')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('❌ Artist Bookings API: Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    console.log('🔍 Artist Bookings API: Found', bookings?.length || 0, 'bookings');

    return NextResponse.json({ bookings: bookings || [] }, { status: 200 });

  } catch (error) {
    console.error('❌ Artist Bookings API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
