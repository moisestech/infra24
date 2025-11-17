const { createClient } = require('@supabase/supabase-js');

// Test with the same configuration as the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

console.log('🔧 Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'SET' : 'NOT SET');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugWorkshopsAPI() {
  console.log('🔍 Debugging workshops API...');

  try {
    const orgId = '01e09cce-83da-4b0f-94ce-b227e949414a';
    console.log('🎯 Testing with organization ID:', orgId);

    // Test the exact query from the API
    console.log('📊 Running workshops query...');
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    console.log('📊 Query result:', {
      workshops: workshops,
      error: error,
      count: workshops?.length || 0
    });

    if (error) {
      console.error('❌ Query error:', error);
    }

    if (workshops && workshops.length > 0) {
      console.log('✅ Workshops found:');
      workshops.forEach((workshop, index) => {
        console.log(`   ${index + 1}. ${workshop.title} by ${workshop.instructor}`);
        console.log(`      ID: ${workshop.id}`);
        console.log(`      Status: ${workshop.status}`);
        console.log(`      Featured: ${workshop.featured}`);
        console.log(`      Organization ID: ${workshop.organization_id}`);
      });
    } else {
      console.log('❌ No workshops found');
      
      // Let's check if there are any workshops at all
      console.log('🔍 Checking all workshops in database...');
      const { data: allWorkshops, error: allError } = await supabase
        .from('workshops')
        .select('id, title, instructor, organization_id')
        .limit(10);
      
      if (allError) {
        console.error('❌ Error fetching all workshops:', allError);
      } else {
        console.log('📊 All workshops in database:', allWorkshops?.length || 0);
        allWorkshops?.forEach((w, i) => {
          console.log(`   ${i + 1}. "${w.title}" by ${w.instructor} (Org: ${w.organization_id})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugWorkshopsAPI();
