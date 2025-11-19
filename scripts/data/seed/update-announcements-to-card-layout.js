require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function updateAnnouncementsToCardLayout() {
  try {
    console.log('🔄 Updating Oolite announcements to use card layout...');

    // First, get the oolite organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    console.log('✅ Found organization:', organization.name);

    // Get all announcements that need updating
    const { data: announcements, error: fetchError } = await supabase
      .from('announcements')
      .select('id, title, image_layout')
      .or(`organization_id.eq.${organization.id},org_id.eq.${organization.id}`)
      .in('image_layout', ['split-left', 'split-right', 'split']);

    if (fetchError) {
      console.error('❌ Error fetching announcements:', fetchError);
      return;
    }

    if (!announcements || announcements.length === 0) {
      console.log('✅ All announcements already use card layout!');
      return;
    }

    console.log(`📋 Found ${announcements.length} announcements to update:`);
    announcements.forEach((ann, index) => {
      console.log(`   ${index + 1}. ${ann.title} (currently: ${ann.image_layout})`);
    });

    // Update all announcements to use 'card' layout
    const { data: updated, error: updateError } = await supabase
      .from('announcements')
      .update({
        image_layout: 'card',
        updated_at: new Date().toISOString(),
        updated_by: 'system_oolite'
      })
      .or(`organization_id.eq.${organization.id},org_id.eq.${organization.id}`)
      .in('image_layout', ['split-left', 'split-right', 'split']);

    if (updateError) {
      console.error('❌ Error updating announcements:', updateError);
      return;
    }

    console.log(`\n✅ Successfully updated ${announcements.length} announcements to use 'card' layout!`);

    // Verify the update
    const { data: verify, error: verifyError } = await supabase
      .from('announcements')
      .select('id, title, image_layout')
      .or(`organization_id.eq.${organization.id},org_id.eq.${organization.id}`)
      .eq('is_active', true);

    if (!verifyError && verify) {
      const cardCount = verify.filter(a => a.image_layout === 'card').length;
      const nonCard = verify.filter(a => a.image_layout !== 'card');
      
      console.log(`\n📊 Verification:`);
      console.log(`   Total active announcements: ${verify.length}`);
      console.log(`   Using card layout: ${cardCount}`);
      
      if (nonCard.length > 0) {
        console.log(`\n⚠️  Announcements still not using card layout:`);
        nonCard.forEach((ann, index) => {
          console.log(`   ${index + 1}. ${ann.title} (${ann.image_layout})`);
        });
      } else {
        console.log(`   ✅ All announcements now use card layout!`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
updateAnnouncementsToCardLayout();

