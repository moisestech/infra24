const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateMadArtsBanner() {
  console.log('🎨 Updating MadArts organization with banner image and logos...');

  try {
    // Update the MadArts organization
    const { data, error } = await supabase
      .from('organizations')
      .update({
        banner_image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760057763/smart-sign/orgs/madarts/madarts-banner_symngx.jpg',
        logo_url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
        logo_url_light: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
        logo_url_dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png',
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'madarts')
      .select();

    if (error) {
      console.error('❌ Error updating MadArts organization:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ MadArts organization updated successfully!');
      console.log('📊 Updated Organization Details:');
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Name: ${data[0].name}`);
      console.log(`   Slug: ${data[0].slug}`);
      console.log('🖼️  Banner Image:');
      console.log(`   ${data[0].banner_image}`);
      console.log('🎨 Logo Configuration:');
      console.log(`   Default: ${data[0].logo_url}`);
      console.log(`   Light Mode: ${data[0].logo_url_light}`);
      console.log(`   Dark Mode: ${data[0].logo_url_dark}`);
      console.log('\n🌐 Test the updated organization:');
      console.log('   http://localhost:3000/o/madarts');
    } else {
      console.log('❌ No organization found with slug "madarts"');
    }

  } catch (error) {
    console.error('❌ Failed to update MadArts organization:', error.message);
  }
}

// Run the update
updateMadArtsBanner();
