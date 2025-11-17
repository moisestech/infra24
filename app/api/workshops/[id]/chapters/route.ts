import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { chapters } = await request.json();
    const supabase = createClient();

    // Insert chapters
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapters.map((chapter: any) => ({
        ...chapter,
        workshop_id: id
      })))
      .select();

    if (error) {
      console.error('Error creating chapters:', error);
      return NextResponse.json({ error: 'Failed to create chapters' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      chapters: data 
    });

  } catch (error) {
    console.error('Error in chapters API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}