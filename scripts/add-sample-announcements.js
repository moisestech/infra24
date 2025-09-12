const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const organizationSlugs = ['midnight-gallery', 'sunset-studios', 'ocean-workshop', 'forest-collective'];

async function addSampleAnnouncements() {
  console.log('Adding sample announcements to organizations...');
  
  for (const slug of organizationSlugs) {
    try {
      // Get the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', slug)
        .single();

      if (orgError) {
        console.error(`Error finding organization ${slug}:`, orgError);
        continue;
      }

      console.log(`\n📝 Adding announcements for ${org.name}...`);

      const announcements = [
        {
          title: `Welcome to ${org.name}`,
          body: `We are excited to announce our new digital presence and community platform. Join us for upcoming events and exhibitions.`,
          type: 'event',
          sub_type: 'exhibition',
          starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          location: 'Main Gallery',
          org_id: org.id,
          author_clerk_id: 'system',
          status: 'published',
          priority: 1,
          media: [],
          tags: []
        },
        {
          title: 'Artist Call for Submissions',
          body: `We are seeking talented artists to join our upcoming exhibition series. Submit your portfolio by the deadline.`,
          type: 'opportunity',
          sub_type: 'open_call',
          starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          location: 'Online Application',
          org_id: org.id,
          author_clerk_id: 'system',
          status: 'published',
          priority: 2,
          media: [],
          tags: []
        },
        {
          title: 'Studio Maintenance Notice',
          body: 'Please note that our studio will be closed for maintenance next week. Plan accordingly.',
          type: 'facility',
          sub_type: 'maintenance',
          starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          location: 'All Studios',
          org_id: org.id,
          author_clerk_id: 'system',
          status: 'published',
          priority: 3,
          media: [],
          tags: []
        },
        {
          title: 'Upcoming Workshop Series',
          body: `Join us for our monthly workshop series featuring local artists and creative techniques.`,
          type: 'event',
          sub_type: 'workshop',
          starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
          location: 'Workshop Room',
          org_id: org.id,
          author_clerk_id: 'system',
          status: 'published',
          priority: 1,
          media: [],
          tags: []
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
            console.error(`  ❌ Error creating announcement: ${announcement.title}`, error.message);
            continue;
          }

          console.log(`  ✅ Created: ${announcement.title}`);
          
        } catch (err) {
          console.error(`  ❌ Error creating announcement: ${announcement.title}`, err.message);
        }
      }
      
    } catch (err) {
      console.error(`Error processing ${slug}:`, err);
    }
  }
}

async function main() {
  try {
    await addSampleAnnouncements();
    console.log('\n🎉 Successfully added sample announcements!');
    console.log('\nYou can now test the new themes by visiting:');
    console.log('- http://localhost:3000/o/midnight-gallery/announcements/carousel');
    console.log('- http://localhost:3000/o/sunset-studios/announcements/carousel');
    console.log('- http://localhost:3000/o/ocean-workshop/announcements/carousel');
    console.log('- http://localhost:3000/o/forest-collective/announcements/carousel');
    console.log('\nAnd compare with the Bakehouse yellow theme:');
    console.log('- http://localhost:3000/o/bakehouse/announcements/carousel');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
