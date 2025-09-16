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

async function createTestAnnouncements() {
  try {
    console.log('🎯 Creating test announcements for SmartSign...');

    // First, get the bakehouse organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'bakehouse')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    console.log('✅ Found organization:', organization.name);

    // Create test announcements
    const testAnnouncements = [
      {
        org_id: organization.id,
        author_clerk_id: 'user_test_123', // Mock user ID
        title: 'Open Studios Weekend',
        body: 'Join us for our monthly Open Studios Weekend! Meet the artists, see their latest work, and enjoy refreshments.',
        status: 'published',
        priority: 3,
        tags: ['event', 'open-studios', 'community'],
        visibility: 'internal',
        type: 'event',
        sub_type: 'open_studios',
        starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        location: 'Bakehouse Art Complex',
        primary_link: 'https://bakehouse.org/open-studios',
        people: [
          {
            name: 'Sarah Johnson',
            role: 'curator',
            avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'Michael Chen',
            role: 'artist',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }
        ],
        external_orgs: [
          {
            name: 'Miami Art Museum',
            logo_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop'
          }
        ]
      },
      {
        org_id: organization.id,
        author_clerk_id: 'user_test_123',
        title: 'Artist Residency Applications Open',
        body: 'Applications are now open for our 2024 Artist Residency Program. Deadline: March 15th.',
        status: 'published',
        priority: 4,
        tags: ['opportunity', 'residency', 'application'],
        visibility: 'internal',
        type: 'opportunity',
        sub_type: 'residency',
        starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        location: 'Bakehouse Art Complex',
        primary_link: 'https://bakehouse.org/residency-application',
        people: [
          {
            name: 'Dr. Maria Rodriguez',
            role: 'program-director',
            avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          }
        ]
      },
      {
        org_id: organization.id,
        author_clerk_id: 'user_test_123',
        title: 'Digital Art Workshop',
        body: 'Learn the fundamentals of digital art creation with professional software. All skill levels welcome.',
        status: 'published',
        priority: 2,
        tags: ['workshop', 'digital-art', 'education'],
        visibility: 'internal',
        type: 'event',
        sub_type: 'workshop',
        starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
        location: 'Studio 205, Bakehouse Art Complex',
        primary_link: 'https://bakehouse.org/workshops',
        people: [
          {
            name: 'Alex Thompson',
            role: 'instructor',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          }
        ]
      },
      {
        org_id: organization.id,
        author_clerk_id: 'user_test_123',
        title: 'Gallery Opening: New Perspectives',
        body: 'Join us for the opening of our latest exhibition featuring emerging artists from the Miami area.',
        status: 'published',
        priority: 5,
        tags: ['exhibition', 'opening', 'gallery'],
        visibility: 'internal',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        ends_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        location: 'Main Gallery, Bakehouse Art Complex',
        primary_link: 'https://bakehouse.org/exhibitions',
        people: [
          {
            name: 'Elena Vasquez',
            role: 'curator',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
          },
          {
            name: 'David Park',
            role: 'artist',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          }
        ],
        external_orgs: [
          {
            name: 'Miami-Dade Cultural Affairs',
            logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
          }
        ]
      }
    ];

    // Insert announcements
    const { data: announcements, error: insertError } = await supabase
      .from('announcements')
      .insert(testAnnouncements)
      .select();

    if (insertError) {
      console.error('❌ Error creating announcements:', insertError);
      return;
    }

    console.log('✅ Created', announcements.length, 'test announcements:');
    announcements.forEach((announcement, index) => {
      console.log(`   ${index + 1}. ${announcement.title} (${announcement.type})`);
    });

    console.log('\n🎉 SmartSign test data created successfully!');
    console.log('📺 You can now view the SmartSign at: http://localhost:3000/o/bakehouse/announcements/display');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createTestAnnouncements();
