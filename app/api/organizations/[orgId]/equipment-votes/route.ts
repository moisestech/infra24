import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const supabase = createClient();

    console.log('🔍 Fetching equipment voting results for organization:', orgId);

    // Get voting results using the view
    const { data: votingResults, error } = await supabase
      .from('equipment_voting_results')
      .select('*')
      .eq('org_id', orgId)
      .order('total_weight', { ascending: false })
      .order('total_votes', { ascending: false });

    if (error) {
      console.error('❌ Error fetching voting results:', error);
      return NextResponse.json({ error: 'Failed to fetch voting results' }, { status: 500 });
    }

    console.log('📊 Found voting results:', votingResults?.length || 0);

    return NextResponse.json({
      votingResults: votingResults || []
    });

  } catch (error) {
    console.error('Error in equipment voting results API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgId } = await params;
    const body = await request.json();
    const supabase = createClient();

    const { equipment_option_id, vote_type, vote_weight = 1, comments } = body;

    if (!equipment_option_id || !vote_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🗳️ Recording vote for equipment option:', equipment_option_id, 'by user:', userId);

    // Insert or update the vote
    const { data: vote, error } = await supabase
      .from('equipment_votes')
      .upsert({
        org_id: orgId,
        equipment_option_id,
        user_id: userId,
        vote_type,
        vote_weight,
        comments
      }, {
        onConflict: 'equipment_option_id,user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error recording vote:', error);
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
    }

    console.log('✅ Vote recorded successfully');

    return NextResponse.json({
      vote,
      message: 'Vote recorded successfully'
    });

  } catch (error) {
    console.error('Error in equipment voting API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
