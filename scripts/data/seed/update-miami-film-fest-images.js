#!/usr/bin/env node
/**
 * Update Miami Film Festival announcement images to use Cloudinary URLs.
 * Run with: node scripts/data/seed/update-miami-film-fest-images.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const IMAGE_UPDATES = {
  'The Old Man and the Parrot': 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773506297/old-man-and-the-parrot-Mar-14_yb3qje.jpg',
  'The Floor Remembers': 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773506068/the-floor-remembers-jayme-gershen_ucqogy.jpg',
};

async function updateMiamiFilmFestImages() {
  try {
    console.log('🎯 Updating Miami Film Festival announcement images...');

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    const titles = Object.keys(IMAGE_UPDATES);
    const { data: announcements, error: fetchError } = await supabase
      .from('announcements')
      .select('id, title, image_url')
      .eq('org_id', organization.id)
      .in('title', titles);

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return;
    }

    if (!announcements?.length) {
      console.log('\n⚠️ No matching announcements found.');
      return;
    }

    for (const a of announcements) {
      const newUrl = IMAGE_UPDATES[a.title];
      if (!newUrl) continue;

      const { error: updateError } = await supabase
        .from('announcements')
        .update({ image_url: newUrl })
        .eq('id', a.id);

      if (updateError) {
        console.error(`❌ Failed to update "${a.title}":`, updateError);
      } else {
        console.log(`✅ Updated "${a.title}"`);
      }
    }

    console.log('\n📺 View at: http://localhost:3000/o/oolite/announcements/display');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateMiamiFilmFestImages();
