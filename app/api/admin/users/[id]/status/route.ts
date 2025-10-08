import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const { is_active } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be a boolean value' }, { status: 400 });
    }

    // Update user status in booking_participants table
    // Note: In a real implementation, you might want to update a dedicated users table
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('booking_participants')
      .update({ 
        is_active: is_active,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error updating user status:', error);
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      updated_participants: data
    });

  } catch (error) {
    console.error('Error in user status update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
