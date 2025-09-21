#!/usr/bin/env node

/**
 * Script to insert Oolite Arts announcements
 * Run with: node scripts/insert-oolite-announcements.js
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function insertAnnouncements() {
  try {
    console.log('🚀 Starting announcement insertion...');

    // First, get the Oolite organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !org) {
      console.error('❌ Error finding Oolite organization:', orgError);
      return;
    }

    console.log('✅ Found organization:', org);

    // Insert Welcome announcement
    const { data: welcomeAnnouncement, error: welcomeError } = await supabase
      .from('announcements')
      .insert({
        org_id: org.id,
        author_clerk_id: 'system',
        title: 'Welcome to Oolite Arts Digital Lab',
        body: `Welcome to the Oolite Arts Digital Lab! Our mission is to support artists and build community through contemporary art. We offer a comprehensive range of workshops, services, and resources designed to help artists develop their skills, connect with peers, and advance their creative practice.

Our workshops cover everything from digital art techniques and multimedia production to professional development and business skills for artists. Whether you're a beginner exploring new mediums or an established artist looking to expand your practice, our programs are designed to meet you where you are.

Join our community of artists, residents, and staff as we explore the intersection of art and technology, foster creative collaboration, and build a vibrant cultural ecosystem in Miami and beyond.`,
        type: 'general',
        priority: 1,
        visibility: 'external',
        status: 'published',
        published_at: new Date().toISOString(),
        tags: ['welcome', 'digital-lab', 'mission', 'workshops'],
        payload: { featured: true, category: 'welcome' }
      })
      .select()
      .single();

    if (welcomeError) {
      console.error('❌ Error inserting welcome announcement:', welcomeError);
    } else {
      console.log('✅ Welcome announcement inserted:', welcomeAnnouncement.id);
    }

    // Insert Survey announcement
    const { data: surveyAnnouncement, error: surveyError } = await supabase
      .from('announcements')
      .insert({
        org_id: org.id,
        author_clerk_id: 'system',
        title: 'Staff and Residents: Complete Your Needs Assessment Survey',
        body: `Attention all staff and residents! We're conducting a comprehensive needs assessment to better understand your requirements and improve our services.

Your input is crucial in helping us:
• Identify areas where we can enhance our support
• Plan future workshops and programs
• Allocate resources more effectively
• Strengthen our community connections

Please take a few minutes to complete the survey. Your responses will help shape the future of Oolite Arts and ensure we're meeting the needs of our community.

[Complete the survey here] - This will help us tailor our programs to better serve you.`,
        type: 'survey',
        priority: 2,
        visibility: 'both',
        status: 'published',
        published_at: new Date().toISOString(),
        tags: ['survey', 'needs-assessment', 'staff', 'residents', 'feedback'],
        payload: { 
          survey_link: '/o/oolite/surveys/needs-assessment', 
          target_audience: ['staff', 'residents'] 
        }
      })
      .select()
      .single();

    if (surveyError) {
      console.error('❌ Error inserting survey announcement:', surveyError);
    } else {
      console.log('✅ Survey announcement inserted:', surveyAnnouncement.id);
    }

    console.log('🎉 Announcement insertion completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
insertAnnouncements();
