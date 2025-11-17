import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();

    // Update workshop to enable learn content
    const { data, error } = await supabase
      .from('workshops')
      .update({
        has_learn_content: true,
        course_available: true,
        estimated_learn_time: 180,
        learn_difficulty: 'beginner',
        learn_prerequisites: ['No prior experience required', 'Basic computer skills helpful'],
        learn_materials: ['Laptop or tablet', 'Notebook and pen', 'Internet connection']
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workshop:', error);
      return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      workshop: data 
    });

  } catch (error) {
    console.error('Error in enable-learn API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
