const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBakehouseCustomTypes() {
  try {
    console.log('🚀 Adding Bakehouse custom announcement types...');

    // First, get the Bakehouse organization ID
    const { data: bakehouseOrg, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'bakehouse')
      .single();

    if (orgError || !bakehouseOrg) {
      console.error('❌ Error finding Bakehouse organization:', orgError);
      return;
    }

    console.log('🏢 Found Bakehouse organization:', bakehouseOrg.id);

    // Add some sample announcements with custom types
    const sampleAnnouncements = [
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Attention Artists: New Studio Space Available',
        body: 'We have a new studio space available for rent. This 500 sq ft space includes natural light, ventilation, and access to shared facilities. Perfect for painters, sculptors, and mixed media artists. Contact us for more information.',
        type: 'attention_artists',
        sub_type: 'studio_space',
        status: 'published',
        priority: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['studio', 'space', 'rental', 'artists'],
        visibility: 'both',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Attention Public: Community Art Exhibition Opening',
        body: 'Join us for the opening of our latest community art exhibition featuring works from local artists. The exhibition will be open to the public from 6-9 PM this Friday. Free admission, refreshments provided.',
        type: 'attention_public',
        sub_type: 'exhibition',
        status: 'published',
        priority: 9,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['exhibition', 'opening', 'community', 'public'],
        visibility: 'both',
        starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Did you know Bakehouse used to make Merita Bread?',
        body: 'Before becoming Miami\'s premier artist community, the Bakehouse Art Complex was originally a commercial bakery that produced Merita Bread. The building\'s industrial architecture and large open spaces made it perfect for conversion into artist studios and galleries. This rich history is part of what makes Bakehouse such a unique and inspiring place for artists to create and collaborate.',
        type: 'fun_fact',
        sub_type: 'historical',
        status: 'published',
        priority: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['history', 'merita', 'bread', 'bakery', 'fun_fact'],
        visibility: 'both',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        org_id: bakehouseOrg.id,
        author_clerk_id: 'system',
        title: 'Did you know our Birthday is coming up? We accept gifts!',
        body: 'Bakehouse Art Complex is celebrating another year of supporting Miami\'s vibrant arts community! As we approach our anniversary, we\'re grateful for the incredible artists, supporters, and community members who make this place special. If you\'d like to show your support, we welcome donations, sponsorships, and of course, your continued participation in our community events and programs.',
        type: 'promotion',
        sub_type: 'gala',
        status: 'published',
        priority: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['birthday', 'anniversary', 'gala', 'gifts', 'donations', 'celebration'],
        visibility: 'both',
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert the sample announcements
    const { error: insertError } = await supabase
      .from('announcements')
      .upsert(sampleAnnouncements);

    if (insertError) {
      console.error('❌ Error inserting sample announcements:', insertError);
    } else {
      console.log('✅ Sample announcements with custom types inserted');
    }

    // Check what we have now
    const { data: announcements, error: checkError } = await supabase
      .from('announcements')
      .select('id, title, type, sub_type, tags')
      .eq('org_id', bakehouseOrg.id)
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('❌ Error checking announcements:', checkError);
    } else {
      console.log('\n📋 Current Bakehouse announcements:');
      announcements.forEach(announcement => {
        console.log(`  - ${announcement.title} (${announcement.type}/${announcement.sub_type})`);
      });
    }

    console.log('\n🎉 Bakehouse custom types setup completed!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
addBakehouseCustomTypes();
