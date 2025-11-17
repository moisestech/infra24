const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkWorkshopsRLS() {
  console.log('🔒 Checking workshops table RLS policies...');

  try {
    const orgId = '01e09cce-83da-4b0f-94ce-b227e949414a';
    
    // Test with service role (should bypass RLS)
    console.log('🔑 Testing with service role (should bypass RLS)...');
    const { data: serviceRoleWorkshops, error: serviceError } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId);

    console.log('🔑 Service role result:', {
      count: serviceRoleWorkshops?.length || 0,
      error: serviceError
    });

    // Test with anon role (subject to RLS)
    console.log('👤 Testing with anon role (subject to RLS)...');
    const anonSupabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
    
    const { data: anonWorkshops, error: anonError } = await anonSupabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId);

    console.log('👤 Anon role result:', {
      count: anonWorkshops?.length || 0,
      error: anonError
    });

    // Check if the API is using the right client
    console.log('\n🔍 Checking API client configuration...');
    console.log('Service role key starts with:', supabaseServiceRoleKey.substring(0, 20) + '...');
    
    // Let's also check what the API environment variables are
    console.log('\n🌐 Testing API endpoint with detailed logging...');
    
    // Make a request and check server logs
    const response = await fetch('http://localhost:3000/api/organizations/01e09cce-83da-4b0f-94ce-b227e949414a/workshops');
    console.log('📡 API Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📡 API Response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }

  } catch (error) {
    console.error('❌ RLS check failed:', error.message);
  }
}

// Run the check
checkWorkshopsRLS();
