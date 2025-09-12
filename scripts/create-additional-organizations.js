const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const organizations = [
  {
    name: 'Midnight Gallery',
    slug: 'midnight-gallery',
    settings: {
      theme: 'midnight-gallery',
      color_scheme: 'purple-blue',
      pattern_preference: 'bauhaus'
    },
    artist_icon: '🎨',
    banner_image: null
  },
  {
    name: 'Sunset Studios',
    slug: 'sunset-studios', 
    settings: {
      theme: 'sunset-studios',
      color_scheme: 'orange-red',
      pattern_preference: 'memphis'
    },
    artist_icon: '🌅',
    banner_image: null
  },
  {
    name: 'Ocean Workshop',
    slug: 'ocean-workshop',
    settings: {
      theme: 'ocean-workshop',
      color_scheme: 'blue-teal',
      pattern_preference: 'circles'
    },
    artist_icon: '🌊',
    banner_image: null
  },
  {
    name: 'Forest Collective',
    slug: 'forest-collective',
    settings: {
      theme: 'forest-collective',
      color_scheme: 'green-earth',
      pattern_preference: 'voronoi'
    },
    artist_icon: '🌲',
    banner_image: null
  }
];

async function createOrganizations() {
  console.log('Creating additional organizations...');
  
  for (const org of organizations) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert([org])
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${org.name}:`, error);
        continue;
      }

      console.log(`✅ Created organization: ${org.name} (ID: ${data.id})`);
      
      // Create sample announcements for each organization
      await createSampleAnnouncements(data.id, org.slug);
      
    } catch (err) {
      console.error(`Error creating ${org.name}:`, err);
    }
  }
}

async function createSampleAnnouncements(orgId, orgSlug) {
  const announcements = [
    {
      title: `Welcome to ${orgSlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: 'We are excited to announce our new digital presence and community platform.',
      type: 'event',
      sub_type: 'exhibition',
      starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      location: 'Main Gallery',
      organization_id: orgId,
      is_published: true
    },
    {
      title: 'Artist Call for Submissions',
      description: 'We are seeking talented artists to join our upcoming exhibition series.',
      type: 'opportunity',
      sub_type: 'call',
      starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      location: 'Online Application',
      organization_id: orgId,
      is_published: true
    },
    {
      title: 'Studio Maintenance Notice',
      description: 'Please note that our studio will be closed for maintenance next week.',
      type: 'facility',
      sub_type: 'maintenance',
      starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      location: 'All Studios',
      organization_id: orgId,
      is_published: true
    }
  ];

  for (const announcement of announcements) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single();

      if (error) {
        console.error(`Error creating announcement for ${orgSlug}:`, error);
        continue;
      }

      console.log(`  ✅ Created announcement: ${announcement.title}`);
      
    } catch (err) {
      console.error(`Error creating announcement for ${orgSlug}:`, err);
    }
  }
}

async function main() {
  try {
    await createOrganizations();
    console.log('\n🎉 Successfully created additional organizations with sample announcements!');
    console.log('\nYou can now test the new themes by visiting:');
    console.log('- http://localhost:3000/o/midnight-gallery/announcements/carousel');
    console.log('- http://localhost:3000/o/sunset-studios/announcements/carousel');
    console.log('- http://localhost:3000/o/ocean-workshop/announcements/carousel');
    console.log('- http://localhost:3000/o/forest-collective/announcements/carousel');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
