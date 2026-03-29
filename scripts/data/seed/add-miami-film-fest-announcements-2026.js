#!/usr/bin/env node
/**
 * Add Miami Film Festival 2026 film announcements to Oolite.
 * Run with: node scripts/data/seed/add-miami-film-fest-announcements-2026.js
 *
 * Uses placeholder images; replace image_url with Cloudinary URLs once posters
 * are downloaded from poster_source_priority sources in metadata.
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function placeholderImage(width = 150, height = 150, text = '') {
  const encodedText = encodeURIComponent(text || 'Oolite Arts');
  return `https://placehold.co/${width}x${height}/47abc4/ffffff?text=${encodedText}`;
}

const CLOUDINARY = {
  'The Old Man and the Parrot': 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773506297/old-man-and-the-parrot-Mar-14_yb3qje.jpg',
  'The Floor Remembers': 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773506068/the-floor-remembers-jayme-gershen_ucqogy.jpg',
};

const FILMS = [
  {
    title: 'The Old Man and the Parrot',
    type: 'feature',
    director: 'Gabriel de Varona',
    runtime_min: 84,
    screening: { date: '2026-04-15', time: '19:15', venue: 'Olympia Theater' },
    festival_program: null,
    poster_source_priority: [
      { kind: 'instagram_post', label: 'Miami Film Fest screening post', url: 'https://www.instagram.com/p/DV1I5AYkRJg/' },
      { kind: 'instagram_post', label: 'Film page / review-style IG post', url: 'https://www.instagram.com/p/DVWOeMQjQ_d/?__d=1%2F' },
      { kind: 'instagram_profile', label: 'Cocuyo Productions profile', url: 'https://www.instagram.com/cocuyo_productions/' }
    ],
    notes: 'This one clearly has public promo art/posts online, so you should be able to pull a usable poster or key art from one of the IG sources.'
  },
  {
    title: 'Dual Citizen',
    type: 'feature',
    director: 'Rachelle Salnave',
    runtime_min: 78,
    screening: { date: '2026-04-14', time: '19:30', venue: 'Little Haiti Cultural Center' },
    festival_program: null,
    poster_source_priority: [
      { kind: 'instagram_post', label: 'Premiere announcement post', url: 'https://www.instagram.com/p/DVwDaUFgPu_/' },
      { kind: 'instagram_post', label: 'BDC-New York promo post', url: 'https://www.instagram.com/p/DVwzgVSDmIS/' }
    ],
    notes: 'Public announcement posts confirm the premiere and are the best current leads for poster art.'
  },
  {
    title: 'Tropical Park',
    type: 'feature',
    director: 'Hansel Porras Garcia',
    runtime_min: 85,
    screening: { date: '2026-04-18', time: '14:45', venue: 'Koubek Center' },
    festival_program: null,
    poster_source_priority: [
      { kind: 'event_page', label: 'Eventive page with film thumbnail/key art', url: 'https://watch.eventive.org/nofs/play/68c9cece5ffea036e67ef0e9' },
      { kind: 'instagram_post', label: 'Festival announcement post', url: 'https://www.instagram.com/p/DUTlQCniYav/' },
      { kind: 'instagram_post', label: 'Tropical Park promo / title-card style post', url: 'https://www.instagram.com/p/DISPE7BPDVQ/?__d=1%2F' }
    ],
    notes: 'The Eventive page definitely exposes a film image; if you want a vertical poster specifically, the IG promo posts are worth checking first.'
  },
  {
    title: 'The Floor Remembers',
    type: 'short',
    director: 'Jayme Kaye Gershen',
    runtime_min: 15,
    screening: { date: '2026-04-14', time: '21:00', venue: 'The Bill Cosford Cinema' },
    festival_program: 'Welcome to Miami: Florida Doc Shorts',
    poster_source_priority: [
      { kind: 'instagram_post', label: 'Official poster reveal', url: 'https://www.instagram.com/p/DVjTJtKDr4Z/' },
      { kind: 'instagram_reel', label: 'Miami Roller Rink promo', url: 'https://www.instagram.com/reel/DVwC2_zDSw1/' }
    ],
    notes: 'This is the strongest one in the batch — search results explicitly mention a poster reveal.'
  },
  {
    title: 'Colada',
    type: 'short',
    director: 'Carmen Pelaez',
    runtime_min: 11,
    screening: { date: '2026-04-12', time: '12:00', venue: 'The Bill Cosford Cinema' },
    festival_program: 'Far From the Shallow: Drama Shorts',
    poster_source_priority: [
      { kind: 'instagram_profile', label: 'Carmen Pelaez profile announcement', url: 'https://www-fallback.instagram.com/carmenmpelaez/' },
      { kind: 'facebook_photo', label: 'Carmen Pelaez promo image/photo', url: 'https://www.facebook.com/100034179076702/photos/1190987015383923/' }
    ],
    notes: 'I found public premiere announcements, but not a clearly indexed standalone poster page yet.'
  }
];

async function addMiamiFilmFestAnnouncements() {
  try {
    console.log('🎯 Adding Miami Film Festival 2026 announcements...');

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
    const baseFields = {
      org_id: organization.id,
      organization_id: organization.id,
      author_clerk_id: 'system_oolite',
      created_by: 'system_oolite',
      updated_by: 'system_oolite',
      status: 'published',
      priority: 'normal',
      visibility: 'public',
      type: 'event',
      sub_type: 'general',
      image_layout: 'card',
      is_active: true,
      published_at: now.toISOString()
    };

    const announcements = FILMS.map((film) => {
      const body = `${film.title} — ${film.runtime_min} min. Directed by ${film.director}.${film.festival_program ? ` Part of ${film.festival_program}.` : ''} Screening at Miami Film Festival.`;
      const startsAt = new Date(`${film.screening.date}T${film.screening.time}`).toISOString();
      return {
        ...baseFields,
        title: film.title,
        body,
        tags: ['miami-film-fest', 'film', film.type === 'feature' ? 'feature' : 'short'],
        starts_at: startsAt,
        location: film.screening.venue,
        image_url: CLOUDINARY[film.title] || placeholderImage(400, 600, film.title),
        metadata: {
          poster_source_priority: film.poster_source_priority,
          notes: film.notes
        }
      };
    });

    const titles = announcements.map((a) => a.title);
    const { data: existing } = await supabase
      .from('announcements')
      .select('id, title')
      .eq('org_id', organization.id)
      .in('title', titles);

    const existingTitles = new Set((existing || []).map((a) => a.title));
    const toInsert = announcements.filter((a) => !existingTitles.has(a.title));

    if (toInsert.length === 0) {
      console.log('\n✅ All Miami Film Festival announcements already exist.');
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

addMiamiFilmFestAnnouncements();
