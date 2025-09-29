import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const supabase = createClient();

    // Get all votes for this organization
    const { data: votes, error: votesError } = await supabase
      .from('workshop_category_votes')
      .select('category, user_id')
      .eq('organization_id', orgId);

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
    }

    // Count votes by category
    const categoryCounts: { [key: string]: number } = {};
    votes?.forEach(vote => {
      categoryCounts[vote.category] = (categoryCounts[vote.category] || 0) + 1;
    });

    // Convert to array format
    const categories = Object.entries(categoryCounts).map(([category, votes]) => ({
      category,
      votes,
      hasVoted: false // Will be set by client if user has voted
    }));

    return NextResponse.json({
      categories,
      hasVoted: false // Will be determined by client
    });

  } catch (error) {
    console.error('Error in workshop categories votes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
