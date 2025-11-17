const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testMadArtsWorkshopsAPI() {
  console.log('🧪 Testing MadArts workshops API...');

  try {
    // First, get the MadArts organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'madarts')
      .single();

    if (orgError || !org) {
      console.error('❌ Error fetching MadArts organization:', orgError);
      return;
    }

    console.log('🏢 MadArts Organization:', {
      id: org.id,
      name: org.name,
      slug: org.slug
    });

    // Test the workshops query that the API uses
    console.log('🎓 Testing workshops query for organization:', org.id);
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', org.id)
      .order('created_at', { ascending: false });

    if (workshopsError) {
      console.error('❌ Error fetching workshops:', workshopsError);
      return;
    }

    console.log('📊 Workshops query result:', {
      count: workshops?.length || 0,
      workshops: workshops?.map(w => ({
        id: w.id,
        title: w.title,
        instructor: w.instructor,
        status: w.status,
        featured: w.featured,
        is_public: w.is_public,
        is_active: w.is_active
      }))
    });

    // Test the API endpoint directly
    console.log('\n🌐 Testing API endpoint directly...');
    const apiUrl = `http://localhost:3000/api/organizations/${org.id}/workshops`;
    console.log('🔗 API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl);
      console.log('📡 API Response Status:', response.status);
      
      if (response.ok) {
        const apiData = await response.json();
        console.log('📡 API Response Data:', apiData);
        console.log('📊 API Workshops Count:', apiData.workshops?.length || 0);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
      }
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMadArtsWorkshopsAPI();
