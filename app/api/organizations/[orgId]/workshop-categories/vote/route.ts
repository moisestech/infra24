import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const { category, userId } = await request.json();

    if (!category || !userId) {
      return NextResponse.json(
        { error: 'Category and userId are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if user has already voted for this organization
    const { data: existingVote, error: checkError } = await supabase
      .from('workshop_category_votes')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing vote:', checkError);
      return NextResponse.json({ error: 'Failed to check existing vote' }, { status: 500 });
    }

    if (existingVote) {
      return NextResponse.json(
        { error: 'User has already voted for this organization' },
        { status: 400 }
      );
    }

    // Insert new vote
    const { data: vote, error: insertError } = await supabase
      .from('workshop_category_votes')
      .insert({
        organization_id: orgId,
        user_id: userId,
        category: category
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      vote
    });

  } catch (error) {
    console.error('Error in workshop category vote API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
