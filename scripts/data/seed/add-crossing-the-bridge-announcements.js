#!/usr/bin/env node
/**
 * Add Crossing the Bridge exhibition announcements (from press release).
 * Run with: node scripts/data/seed/add-crossing-the-bridge-announcements.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const IMAGES = {
  crossingBridge: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-crossing-the-bridge-oolite-arts-feb5th-to-nay24th_c1xxut.jpg',
  crossingBridgeRecap: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427571/march-oolite-crossing-the-bridge-opening-reception-recap_jrlatf.jpg',
  studentShowcase: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620758/feb-oolite-arts-student-showcase-exhibition-opening-feb-25-2026_xkp5mu.jpg',
  panelDiscussion: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773588683/Edouard_Duval-Carrie-Yanira-Collado_gpefa5.png',
};

function placeholderImage(width = 150, height = 150, text = '') {
  const encodedText = encodeURIComponent(text || 'Oolite Arts');
  return `https://placehold.co/${width}x${height}/47abc4/ffffff?text=${encodedText}`;
}

async function addCrossingTheBridgeAnnouncements() {
  try {
    console.log('🎯 Adding Crossing the Bridge announcements...');

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
    const feb25_2026 = new Date('2026-02-25T18:00:00');
    const may24_2026 = new Date('2026-05-24T17:00:00');
    const apr8_2026 = new Date('2026-04-08T18:00:00');
    const apr29_2026 = new Date('2026-04-29T18:00:00');

    const announcements = [
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge: Exhibition Opening',
        body: 'Join us for the opening reception of Crossing the Bridge, curated by Claire Breukel and Lauryn Lawrence. Feb. 25, 6–9 p.m. On view through May 24, 2026. Featuring Edouard Duval-Carrié, Kerry Phillips, Najja Moon, Susan Lee-Chun and Yanira Collado.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'alumni', 'crossing-the-bridge', 'opening'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb25_2026.toISOString(),
        ends_at: may24_2026.toISOString(),
        location: 'Oolite Arts, Miami Beach',
        image_url: IMAGES.crossingBridge,
        image_layout: 'card',
        is_active: true,
        people: [
          { name: 'Claire Breukel', role: 'curator', avatar_url: placeholderImage(150, 150, 'CB') },
          { name: 'Lauryn Lawrence', role: 'curator', avatar_url: placeholderImage(150, 150, 'LL') },
          { name: 'Edouard Duval-Carrié', role: 'artist', avatar_url: placeholderImage(150, 150, 'EDC') },
          { name: 'Kerry Phillips', role: 'artist', avatar_url: placeholderImage(150, 150, 'KP') },
          { name: 'Najja Moon', role: 'artist', avatar_url: placeholderImage(150, 150, 'NM') },
          { name: 'Susan Lee-Chun', role: 'artist', avatar_url: placeholderImage(150, 150, 'SLC') },
          { name: 'Yanira Collado', role: 'artist', avatar_url: placeholderImage(150, 150, 'YC') }
        ],
        published_at: now.toISOString()
      },
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge: On View',
        body: 'Crossing the Bridge explores alumni as an active and abstract relationship. Mon–Fri, noon–5 p.m. Free admission. Oolite Arts, Miami Beach.',
        status: 'published',
        priority: 'normal',
        tags: ['exhibition', 'alumni', 'crossing-the-bridge'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb25_2026.toISOString(),
        ends_at: may24_2026.toISOString(),
        location: 'Oolite Arts, Miami Beach',
        image_url: IMAGES.crossingBridge,
        image_layout: 'card',
        is_active: true,
        additional_info: 'Feb. 25 – May 24, 2026. Monday–Friday, noon–5 p.m. Admission: Free.',
        published_at: now.toISOString()
      },
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Assemblage Building Workshop with Kerry Phillips',
        body: 'Reflect on objects that have shaped your work and create an assemblage. Wed, April 8, 2026, 6–8 p.m. Free.',
        status: 'published',
        priority: 'high',
        tags: ['workshop', 'kerry-phillips', 'crossing-the-bridge', 'programming'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: apr8_2026.toISOString(),
        location: 'Oolite Arts, Miami Beach',
        image_url: IMAGES.crossingBridge,
        image_layout: 'card',
        is_active: true,
        people: [
          { name: 'Kerry Phillips', role: 'host', avatar_url: placeholderImage(150, 150, 'KP') }
        ],
        additional_info: 'This workshop invites guests to reflect on the objects they have leaned on to make their work, tell their stories and hold memories. Participants will create an assemblage that rejuvenates these objects.',
        published_at: now.toISOString()
      },
      {
        org_id: organization.id,
        organization_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Panel Discussion: Edouard Duval-Carrié and Yanira Collado',
        body: 'Moderated by Lauryn Lawrence. Wed, April 29, 2026, 6–8 p.m. Free.',
        status: 'published',
        priority: 'high',
        tags: ['panel', 'crossing-the-bridge', 'programming'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        starts_at: apr29_2026.toISOString(),
        location: 'Oolite Arts, Miami Beach',
        image_url: IMAGES.panelDiscussion,
        image_layout: 'card',
        is_active: true,
        people: [
          { name: 'Edouard Duval-Carrié', role: 'panelist', avatar_url: placeholderImage(150, 150, 'EDC') },
          { name: 'Yanira Collado', role: 'panelist', avatar_url: placeholderImage(150, 150, 'YC') },
          { name: 'Lauryn Lawrence', role: 'moderator', avatar_url: placeholderImage(150, 150, 'LL') }
        ],
        published_at: now.toISOString()
      }
    ];

    // Check for existing by title to avoid duplicates
    const titles = announcements.map(a => a.title);
    const { data: existing } = await supabase
      .from('announcements')
      .select('id, title')
      .eq('org_id', organization.id)
      .in('title', titles);

    const existingTitles = new Set((existing || []).map(a => a.title));
    const toInsert = announcements.filter(a => !existingTitles.has(a.title));

    if (toInsert.length === 0) {
      console.log('\n✅ All Crossing the Bridge announcements already exist.');
      return;
    }

    const { data: created, error: insertError } = await supabase
      .from('announcements')
      .insert(toInsert)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return;
    }

    console.log(`\n✅ Added ${created?.length || 0} announcement(s):`);
    (created || []).forEach((a, i) => console.log(`   ${i + 1}. ${a.title}`));
    console.log('\n📺 View at: http://localhost:3000/o/oolite/announcements/display');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

addCrossingTheBridgeAnnouncements();
