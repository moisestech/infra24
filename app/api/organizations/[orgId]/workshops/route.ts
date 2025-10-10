import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    console.log('🎓 Workshops API - Organization ID:', orgId);
    const supabase = createClient();

    // Get workshops for this organization
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    console.log('🎓 Workshops API - Query result:', { workshops, error });

    if (error) {
      console.error('❌ Error fetching workshops:', error);
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
    }

    console.log('🎓 Workshops API - Returning workshops:', workshops?.length || 0, 'workshops');
    if (workshops && workshops.length > 0) {
      workshops.forEach((workshop, index) => {
        console.log(`🎓 API Workshop ${index + 1}:`, {
          id: workshop.id,
          title: workshop.title,
          organization_id: workshop.organization_id,
          created_at: workshop.created_at
        });
      });
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
