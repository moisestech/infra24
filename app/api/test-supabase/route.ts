import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test Supabase API - Starting...');
    
    // Debug environment variables
    console.log('🔧 Environment Variables:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
    
    const supabase = createClient();
    
    // Debug the Supabase client
    console.log('🔧 Supabase client created');
    console.log('🔧 Supabase URL:', supabase.supabaseUrl);
    console.log('🔧 Supabase service role key present:', !!supabase.supabaseKey);
    
    // Test a simple query
    console.log('🧪 Testing simple query...');
    const { data: testData, error: testError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'madarts')
      .single();
    
    console.log('🧪 Test query result:', { testData, testError });
    
    // Test workshops query
    console.log('🧪 Testing workshops query...');
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', '01e09cce-83da-4b0f-94ce-b227e949414a');
    
    console.log('🧪 Workshops query result:', { 
      workshopsCount: workshops?.length || 0, 
      workshops: workshops?.map(w => ({ id: w.id, title: w.title, instructor: w.instructor })),
      workshopsError 
    });
    
    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKeySet: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      supabaseClient: {
        url: supabase.supabaseUrl,
        serviceRoleKeyPresent: !!supabase.supabaseKey
      },
      testQuery: {
        organization: testData,
        organizationError: testError
      },
      workshopsQuery: {
        workshops: workshops,
        workshopsError: workshopsError,
        count: workshops?.length || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Test Supabase API error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
