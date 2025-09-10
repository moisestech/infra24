const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPrimaryColorsOrganization() {
  try {
    console.log('🎨 Adding Primary Colors organization example...');

    // Create a sample organization with primary colors theme
    const primaryColorsOrg = {
      id: crypto.randomUUID(),
      name: 'Primary Colors Art Collective',
      slug: 'primary-colors',
      logo_url: null,
      settings: {},
      artist_icon: 'Palette',
      banner_image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the organization
    const { error: orgError } = await supabase
      .from('organizations')
      .upsert([primaryColorsOrg]);

    if (orgError) {
      console.error('❌ Error creating Primary Colors organization:', orgError);
      return;
    }

    console.log('✅ Primary Colors organization created:', primaryColorsOrg.id);

    // Create sample announcements for the primary colors organization
    const sampleAnnouncements = [
      {
        id: crypto.randomUUID(),
        org_id: primaryColorsOrg.id,
        author_clerk_id: 'system',
        title: 'Primary Red Exhibition Opening',
        body: 'Join us for the opening of our Primary Red exhibition, featuring bold works that explore the power and passion of the color red. This exhibition showcases how artists use red to convey emotion, energy, and intensity.',
        type: 'event',
        sub_type: 'exhibition',
        status: 'published',
        priority: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['exhibition', 'red', 'primary_colors', 'opening'],
        visibility: 'both',
        starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Primary Colors Gallery, Miami, FL'
      },
      {
        id: crypto.randomUUID(),
        org_id: primaryColorsOrg.id,
        author_clerk_id: 'system',
        title: 'Primary Blue Workshop Series',
        body: 'Explore the depth and tranquility of primary blue in our workshop series. Learn techniques for using blue in various media and discover how this fundamental color can create powerful artistic statements.',
        type: 'event',
        sub_type: 'workshop',
        status: 'published',
        priority: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['workshop', 'blue', 'primary_colors', 'education'],
        visibility: 'both',
        starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Primary Colors Studio, Miami, FL'
      },
      {
        id: crypto.randomUUID(),
        org_id: primaryColorsOrg.id,
        author_clerk_id: 'system',
        title: 'Primary Yellow Community Mural Project',
        body: 'Help us create a vibrant community mural using primary yellow as the foundation. This collaborative project brings together artists and community members to create a lasting piece of public art that celebrates the energy and optimism of yellow.',
        type: 'opportunity',
        sub_type: 'community_project',
        status: 'published',
        priority: 9,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['mural', 'yellow', 'primary_colors', 'community', 'collaboration'],
        visibility: 'both',
        starts_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Community Center, Miami, FL'
      }
    ];

    // Insert the sample announcements
    const { error: insertError } = await supabase
      .from('announcements')
      .upsert(sampleAnnouncements);

    if (insertError) {
      console.error('❌ Error inserting Primary Colors announcements:', insertError);
    } else {
      console.log('✅ Primary Colors sample announcements inserted');
    }

    // Check what we have now
    const { data: announcements, error: checkError } = await supabase
      .from('announcements')
      .select('id, title, type, sub_type, tags, starts_at')
      .eq('org_id', primaryColorsOrg.id)
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('❌ Error checking announcements:', checkError);
    } else {
      console.log('\n📋 Primary Colors organization announcements:');
      announcements.forEach(announcement => {
        console.log(`  - ${announcement.title} (${announcement.type}/${announcement.sub_type})`);
        console.log(`    Tags: ${announcement.tags.join(', ')}`);
        console.log(`    Starts: ${new Date(announcement.starts_at).toLocaleDateString()}`);
        console.log('');
      });
    }

    console.log('\n🎉 Primary Colors organization setup completed!');
    console.log('📝 Note: To see the primary colors theme in action, you would need to:');
    console.log('   1. Add primary colors color schemes to BackgroundPattern.tsx');
    console.log('   2. Update the organization-specific logic to use white backgrounds');
    console.log('   3. Use primary red, blue, and yellow patterns');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
addPrimaryColorsOrganization();
