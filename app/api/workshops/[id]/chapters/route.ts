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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Workshop ID is required' },
        { status: 400 }
      );
    }

    // Get chapters for the workshop, ordered by order_index
    const { data: chapters, error } = await supabase
      .from('workshop_chapters')
      .select(`
        id,
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time,
        created_at,
        updated_at
      `)
      .eq('workshop_id', id)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching workshop chapters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workshop chapters' },
        { status: 500 }
      );
    }

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Error in workshop chapters API:', error);
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
    if (!body.chapter_slug || !body.title || body.order_index === undefined) {
      return NextResponse.json(
        { error: 'chapter_slug, title, and order_index are required' },
        { status: 400 }
      );
    }

    // Create new chapter
    const { data: chapter, error } = await supabase
      .from('workshop_chapters')
      .insert({
        workshop_id: id,
        chapter_slug: body.chapter_slug,
        title: body.title,
        description: body.description,
        order_index: body.order_index,
        estimated_time: body.estimated_time,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workshop chapter:', error);
      return NextResponse.json(
        { error: 'Failed to create workshop chapter' },
        { status: 500 }
      );
    }

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error('Error in workshop chapters POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
