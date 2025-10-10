import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    console.log('🎓 Workshops API - Organization ID:', orgId);
    
    // Debug environment variables
    console.log('🔧 API Environment Variables:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
    
    const supabase = createClient();
    
    // Debug the Supabase client
    console.log('🔧 Supabase client created');
    console.log('🔧 Supabase URL:', supabase.supabaseUrl);
    console.log('🔧 Supabase service role key present:', !!supabase.supabaseKey);

    // Get workshops for this organization
    console.log('🎓 Running workshops query for orgId:', orgId);
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    console.log('🎓 Workshops API - Query result:', { 
      workshopsCount: workshops?.length || 0, 
      workshops: workshops?.map(w => ({ id: w.id, title: w.title, instructor: w.instructor })),
      error 
    });

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
