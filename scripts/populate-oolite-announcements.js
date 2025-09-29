const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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

const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

async function populateAnnouncements() {
  try {
    console.log('🚀 Starting to populate Oolite announcements...');

    // Check if announcements already exist
    const { data: existingAnnouncements, error: checkError } = await supabase
      .from('announcements')
      .select('id, title')
      .eq('org_id', OOLITE_ORG_ID);

    if (checkError) {
      console.error('❌ Error checking existing announcements:', checkError);
      return;
    }

    if (existingAnnouncements && existingAnnouncements.length > 0) {
      console.log('📢 Found existing announcements:', existingAnnouncements.length);
      existingAnnouncements.forEach(announcement => {
        console.log(`  - ${announcement.title}`);
      });
      return;
    }

    // Create announcements
    const announcements = [
      {
        org_id: OOLITE_ORG_ID,
        organization_id: OOLITE_ORG_ID,
        title: 'Staff Digital Skills Assessment - Your Input Matters',
        content: 'We\'re conducting a digital skills assessment to better understand our team\'s capabilities and identify areas for growth. Your participation will help us tailor training programs and resources to support your professional development.',
        type: 'general',
        priority: 'high',
        visibility: 'internal',
        is_active: true,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        location: 'Online',
        key_people: ['Digital Lab Team', 'HR Department'],
        metadata: {
          survey_id: 'staff-digital-skills-assessment',
          action_required: true,
          estimated_time: '15 minutes'
        },
        created_by: 'system',
        updated_by: 'system'
      },
      {
        org_id: OOLITE_ORG_ID,
        organization_id: OOLITE_ORG_ID,
        title: 'Welcome to the Digital Lab - New Resources Available',
        content: 'Welcome to Oolite Arts Digital Lab! We\'re excited to introduce you to our state-of-the-art digital creation space. Explore our new equipment, book workshops, and discover the tools that will help bring your creative vision to life.',
        type: 'general',
        priority: 'normal',
        visibility: 'public',
        is_active: true,
        start_date: new Date().toISOString(),
        end_date: null, // No end date for welcome message
        location: 'Digital Lab',
        key_people: ['Digital Lab Team', 'Technical Staff'],
        metadata: {
          category: 'welcome',
          featured: true,
          resources_available: ['Large Format Printer SureColor P8000', 'Makerbot 3D Printer']
        },
        created_by: 'system',
        updated_by: 'system'
      }
    ];

    console.log('📢 Creating announcements...');

    for (const announcement of announcements) {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcement)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating announcement "${announcement.title}":`, error);
      } else {
        console.log(`✅ Created announcement: "${announcement.title}"`);
      }
    }

    console.log('🎉 Finished populating Oolite announcements!');

  } catch (error) {
    console.error('❌ Error in populateAnnouncements:', error);
  }
}

populateAnnouncements();