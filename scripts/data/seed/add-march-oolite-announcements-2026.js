#!/usr/bin/env node
/**
 * Add March 2026 Oolite announcements (no deduplication by title - pure INSERT).
 * Run with: node scripts/data/seed/add-march-oolite-announcements-2026.js
 *
 * Data ingestion: Uses Supabase insert. Skips only if the exact image_url
 * already exists for this org (prevents accidental double-add when re-running).
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// March 2026 Cloudinary image URLs (provided by user)
const MARCH_IMAGES = {
  crossingBridgeRecap: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427571/march-oolite-crossing-the-bridge-opening-reception-recap_jrlatf.jpg',
  weeklyCuratorialTours: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427565/march-oolite-coming-up-weekly-curatorial-tours_czlqgk.jpg',
  alumniGrantDanWeitendorf: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427559/march-oolite-alumni-grant-winner-honoring-dan-weitendorf_nkrvom.jpg'
};

async function addMarchAnnouncements() {
  try {
    console.log('🎯 Adding March 2026 Oolite announcements...');

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

    const now = new Date();
    const imageUrls = Object.values(MARCH_IMAGES);

    // Check for existing announcements with these image_urls (avoid true duplicates)
    const { data: existing } = await supabase
      .from('announcements')
      .select('id, title, image_url')
      .eq('org_id', organization.id)
      .in('image_url', imageUrls);

    const existingImageUrls = new Set((existing || []).map(a => a.image_url));
    const toSkip = [...existingImageUrls];
    if (toSkip.length > 0) {
      console.log('⏭️  Skipping (already exist):', toSkip.length);
      toSkip.forEach(url => {
        const ann = existing.find(e => e.image_url === url);
        console.log(`   - ${ann?.title || url}`);
      });
    }

    const newAnnouncements = [
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge: Opening Reception Recap',
        body: 'A recap of the Crossing the Bridge alumni exhibition opening reception. The exhibition, curated by Claire Breukel and Lauryn Lawrence, celebrates Oolite Arts alumni and the impact of institutional context on artists\' careers.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'alumni', 'recap', 'march-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: MARCH_IMAGES.crossingBridgeRecap,
        image_layout: 'card',
        is_active: true,
        published_at: now.toISOString()
      },
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Coming Up: Weekly Curatorial Tours',
        body: 'Join us for weekly curatorial tours at Oolite Arts. Explore current exhibitions and connect with the work of our residents and alumni.',
        status: 'published',
        priority: 'normal',
        tags: ['tours', 'curatorial', 'events', 'march-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: MARCH_IMAGES.weeklyCuratorialTours,
        image_layout: 'card',
        is_active: true,
        published_at: now.toISOString()
      },
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni Grant Winner: Honoring Dan Weitendorf',
        body: 'Celebrating the Alumni Grant winner and honoring Dan Weitendorf for his 24-year trajectory as Facilities Manager at Oolite Arts. The alumni grant supports artists connected to our community.',
        status: 'published',
        priority: 'high',
        tags: ['alumni', 'grant', 'dan-weitendorf', 'march-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: MARCH_IMAGES.alumniGrantDanWeitendorf,
        image_layout: 'card',
        is_active: true,
        published_at: now.toISOString()
      }
    ].filter(a => !existingImageUrls.has(a.image_url));

    if (newAnnouncements.length === 0) {
      console.log('\n✅ All March announcements already exist. Nothing to add.');
      return;
    }

    const { data: created, error: insertError } = await supabase
      .from('announcements')
      .insert(newAnnouncements)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return;
    }

    console.log(`\n✅ Added ${created?.length || 0} new announcement(s):`);
    (created || []).forEach((a, i) => console.log(`   ${i + 1}. ${a.title}`));
    console.log('\n📺 View at: http://localhost:3000/o/oolite/announcements');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

addMarchAnnouncements();
