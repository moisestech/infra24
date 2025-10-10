const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateMadArtsBanner() {
  console.log('🎨 Updating MadArts organization with banner image...');

  try {
    // Update the MadArts organization with banner image
    const { data, error } = await supabase
      .from('organizations')
      .update({
        banner_image: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760057763/smart-sign/orgs/madarts/madarts-banner_symngx.jpg',
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
      console.log('🎨 Logo URL:');
      console.log(`   ${data[0].logo_url}`);
      console.log('\n🌐 Test the updated organization:');
      console.log('   http://localhost:3000/o/madarts');
      console.log('\n✨ The banner image should now appear on the MadArts dashboard!');
    } else {
      console.log('❌ No organization found with slug "madarts"');
    }

  } catch (error) {
    console.error('❌ Failed to update MadArts organization:', error.message);
  }
}

// Run the update
updateMadArtsBanner();
