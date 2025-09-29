import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Workshop ID is required' },
        { status: 400 }
      );
    }

    // Get user progress for all chapters in this workshop
    const { data: progress, error } = await supabase
      .from('user_workshop_progress')
      .select(`
        id,
        user_id,
        workshop_id,
        chapter_id,
        completed_at,
        progress_percentage,
        time_spent,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .eq('workshop_id', id);

    if (error) {
      console.error('Error fetching user progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error in user progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Workshop ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.chapter_id) {
      return NextResponse.json(
        { error: 'chapter_id is required' },
        { status: 400 }
      );
    }

    // Upsert user progress (update if exists, insert if not)
    const { data: progress, error } = await supabase
      .from('user_workshop_progress')
      .upsert({
        user_id: userId,
        workshop_id: id,
        chapter_id: body.chapter_id,
        completed_at: body.completed_at || null,
        progress_percentage: body.progress_percentage || 0,
        time_spent: body.time_spent || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      return NextResponse.json(
        { error: 'Failed to update user progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error in user progress POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
