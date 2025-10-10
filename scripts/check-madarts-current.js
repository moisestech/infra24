const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkMadArtsCurrent() {
  console.log('🔍 Checking current MadArts organization data...');

  try {
    // Get the current MadArts organization
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', 'madarts')
      .single();

    if (error) {
      console.error('❌ Error fetching MadArts organization:', error.message);
      return;
    }

    if (data) {
      console.log('📊 Current MadArts Organization:');
      console.log(`   ID: ${data.id}`);
      console.log(`   Name: ${data.name}`);
      console.log(`   Slug: ${data.slug}`);
      console.log(`   Banner Image: ${data.banner_image || 'Not set'}`);
      console.log(`   Logo URL: ${data.logo_url || 'Not set'}`);
      console.log('\n📋 Available columns:');
      Object.keys(data).forEach(key => {
        console.log(`   - ${key}: ${typeof data[key]}`);
      });
    } else {
      console.log('❌ No organization found with slug "madarts"');
    }

  } catch (error) {
    console.error('❌ Failed to check MadArts organization:', error.message);
  }
}

// Run the check
checkMadArtsCurrent();
