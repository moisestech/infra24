import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const supabase = createClient();

    // Get workshops for this organization
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching workshops:', error);
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
    }


    return NextResponse.json({
      workshops: workshops || []
    });

  } catch (error) {
    console.error('Error in workshops API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
