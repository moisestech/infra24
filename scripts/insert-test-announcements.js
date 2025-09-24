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

async function insertTestAnnouncements() {
  try {
    console.log('🔍 Getting Oolite organization...');
    
    // Get the Oolite organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    console.log('✅ Found organization:', organization);

    // Insert test announcements
    const announcements = [
      {
        organization_id: organization.id,
        title: 'Welcome to Oolite Arts Digital Lab',
        content: 'We are excited to welcome you to our digital platform. Explore our workshops, connect with artists, and discover new opportunities in digital arts.',
        type: 'general',
        priority: 'normal',
        visibility: 'public',
        is_active: true,
        created_by: 'system',
        updated_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        organization_id: organization.id,
        title: 'Staff Digital Skills Survey',
        content: 'Please complete the digital skills assessment survey to help us understand your current skill level and training needs. This will help us tailor our workshops and resources.',
        type: 'general',
        priority: 'high',
        visibility: 'public',
        is_active: true,
        created_by: 'system',
        updated_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    console.log('📝 Inserting announcements...');
    
    for (const announcement of announcements) {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcement)
        .select();

      if (error) {
        console.error('❌ Error inserting announcement:', error);
      } else {
        console.log('✅ Inserted announcement:', data[0].title);
      }
    }

    console.log('🎉 Test announcements inserted successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

insertTestAnnouncements();
