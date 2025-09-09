const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMarilynLoddiPerformance() {
  try {
    console.log('🎭 Adding Marilyn Loddi performance announcement...');

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

    // Create the Marilyn Loddi performance announcement
    const marilynPerformance = {
      id: crypto.randomUUID(),
      org_id: bakehouseOrg.id,
      author_clerk_id: 'system',
      title: 'Attention Public: Marilyn Loddi Performing at Edge Zones',
      body: 'Join us in celebrating Bakehouse artist Marilyn Loddi as she performs at Edge Zones! This is a special opportunity to see one of our talented community members showcase their work in a unique venue. Don\'t miss this exciting performance that highlights the vibrant arts scene in Miami.',
      type: 'attention_public',
      sub_type: 'performance',
      status: 'published',
      priority: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['performance', 'marilyn_loddi', 'edge_zones', 'artist_spotlight', 'public_event'],
      visibility: 'both',
      starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      location: 'Edge Zones, Miami, FL',
      additional_info: 'Marilyn Loddi is a talented artist from the Bakehouse community. This performance showcases her unique artistic vision and contributes to Miami\'s vibrant cultural landscape.'
    };

    // Insert the announcement
    const { error: insertError } = await supabase
      .from('announcements')
      .upsert([marilynPerformance]);

    if (insertError) {
      console.error('❌ Error inserting Marilyn Loddi performance announcement:', insertError);
    } else {
      console.log('✅ Marilyn Loddi performance announcement inserted successfully');
    }

    // Also create a fun fact about Marilyn Loddi
    const marilynFunFact = {
      id: crypto.randomUUID(),
      org_id: bakehouseOrg.id,
      author_clerk_id: 'system',
      title: 'Did you know Marilyn Loddi is a Bakehouse artist?',
      body: 'Marilyn Loddi is one of the talented artists in our Bakehouse community. Her work represents the diverse and innovative spirit of Miami\'s art scene. When you see Bakehouse artists performing or exhibiting at venues like Edge Zones, you\'re witnessing the impact of our community extending beyond our walls into the broader cultural landscape of Miami.',
      type: 'fun_fact',
      sub_type: 'artist_spotlight',
      status: 'published',
      priority: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['marilyn_loddi', 'artist_spotlight', 'bakehouse_artists', 'community', 'fun_fact'],
      visibility: 'both',
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      additional_info: 'This fun fact highlights the connection between Bakehouse artists and the broader Miami arts community.'
    };

    // Insert the fun fact
    const { error: funFactError } = await supabase
      .from('announcements')
      .upsert([marilynFunFact]);

    if (funFactError) {
      console.error('❌ Error inserting Marilyn Loddi fun fact:', funFactError);
    } else {
      console.log('✅ Marilyn Loddi fun fact inserted successfully');
    }

    // Check what we have now
    const { data: announcements, error: checkError } = await supabase
      .from('announcements')
      .select('id, title, type, sub_type, tags, starts_at')
      .eq('org_id', bakehouseOrg.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (checkError) {
      console.error('❌ Error checking announcements:', checkError);
    } else {
      console.log('\n📋 Latest Bakehouse announcements:');
      announcements.forEach(announcement => {
        console.log(`  - ${announcement.title} (${announcement.type}/${announcement.sub_type})`);
        console.log(`    Tags: ${announcement.tags.join(', ')}`);
        console.log(`    Starts: ${new Date(announcement.starts_at).toLocaleDateString()}`);
        console.log('');
      });
    }

    console.log('\n🎉 Marilyn Loddi announcements setup completed!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
addMarilynLoddiPerformance();
