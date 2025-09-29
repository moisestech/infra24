import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const supabase = createClient();

    console.log('🔍 Fetching equipment options for organization:', orgId);

    const { data: equipmentOptions, error } = await supabase
      .from('equipment_options')
      .select(`
        id,
        name,
        description,
        category,
        estimated_cost,
        priority_level,
        is_active,
        created_at,
        updated_at
      `)
      .eq('org_id', orgId)
      .eq('is_active', true)
      .order('priority_level', { ascending: false })
      .order('estimated_cost', { ascending: true });

    if (error) {
      console.error('❌ Error fetching equipment options:', error);
      return NextResponse.json({ error: 'Failed to fetch equipment options' }, { status: 500 });
    }

    console.log('📋 Found equipment options:', equipmentOptions?.length || 0);

    return NextResponse.json({
      equipmentOptions: equipmentOptions || []
    });

  } catch (error) {
    console.error('Error in equipment options API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
