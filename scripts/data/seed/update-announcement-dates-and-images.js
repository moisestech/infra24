#!/usr/bin/env node
/**
 * Update Oolite announcement dates and images per user request.
 * - Panel Discussion: Edouard Duval-Carrié and Yanira Collado → Apr 29, 2026 6–8 p.m., add Cloudinary image
 * - The Floor Remembers → April 14th
 * - Tropical Park → April 18th
 * - Dual Citizen → April 14th
 * - The Old Man and The Parrot → April 15th
 * - Colada → April 12th
 *
 * Run with: node scripts/data/seed/update-announcement-dates-and-images.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const UPDATES = [
  {
    title: 'Panel Discussion: Edouard Duval-Carrié and Yanira Collado',
    starts_at: new Date('2026-04-29T18:00:00').toISOString(),
    image_url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773588683/Edouard_Duval-Carrie-Yanira-Collado_gpefa5.png'
  },
  {
    title: 'The Floor Remembers',
    starts_at: new Date('2026-04-14T21:00:00').toISOString()
  },
  {
    title: 'Tropical Park',
    starts_at: new Date('2026-04-18T14:45:00').toISOString()
  },
  {
    title: 'Dual Citizen',
    starts_at: new Date('2026-04-14T19:30:00').toISOString()
  },
  {
    title: 'The Old Man and the Parrot',
    starts_at: new Date('2026-04-15T19:15:00').toISOString()
  },
  {
    title: 'Colada',
    starts_at: new Date('2026-04-12T12:00:00').toISOString()
  }
];

async function updateAnnouncements() {
  try {
    console.log('🎯 Updating Oolite announcement dates and images...');

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    for (const update of UPDATES) {
      const { title, starts_at, image_url } = update;
      const updatePayload = { starts_at };
      if (image_url) updatePayload.image_url = image_url;

      const { data, error } = await supabase
        .from('announcements')
        .update(updatePayload)
        .eq('org_id', organization.id)
        .eq('title', title)
        .select('id, title, starts_at, image_url');

      if (error) {
        console.error(`❌ Error updating "${title}":`, error);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ Updated: ${title}`);
        if (image_url) console.log(`   → image: ${image_url}`);
        console.log(`   → starts_at: ${starts_at}`);
      } else {
        console.log(`⚠️  No match for: ${title}`);
      }
    }

    console.log('\n📺 View at: http://localhost:3000/o/oolite/announcements/display');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateAnnouncements();
