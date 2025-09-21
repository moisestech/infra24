import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; bookingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId, bookingId } = await params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        booking_participants(*),
        resources(*)
      `)
      .eq('id', bookingId)
      .eq('org_id', orgId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Error in booking GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; bookingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId, bookingId } = await params;
    const body = await request.json();

    // Check if user has permission to update this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('user_id, org_id')
      .eq('id', bookingId)
      .eq('org_id', orgId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single();

    const isOwner = booking.user_id === userId;
    const isAdmin = membership?.role === 'admin' || membership?.role === 'manager';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update booking
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        ...body,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('org_id', orgId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json({ booking: updatedBooking });

  } catch (error) {
    console.error('Error in booking PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; bookingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId, bookingId } = await params;

    // Check if user has permission to delete this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('user_id, org_id, status')
      .eq('id', bookingId)
      .eq('org_id', orgId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single();

    const isOwner = booking.user_id === userId;
    const isAdmin = membership?.role === 'admin' || membership?.role === 'manager';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return NextResponse.json({ error: 'Cannot delete completed booking' }, { status: 400 });
    }

    // Delete booking (this will cascade to participants and waitlist)
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error deleting booking:', error);
      return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Error in booking DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
