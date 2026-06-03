/**
 * Upserts Amanda Linares (2025 Studio Resident) with Cloudinary headshot + artworks.
 *
 * Run: node scripts/data/seed/upsert-oolite-amanda-linares-2025.js
 */
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const COHORT = '2025';
const RESIDENT_DISPLAY_DATE = '2025-01-01';
const RESIDENT_STARTS_AT = '2025-01-01T12:00:00.000Z';

const AMANDA = {
  key: 'amanda_linares',
  name: 'Amanda Linares',
  studio: '203',
  email: 'amandallinares@gmail.com',
  instagram: '@amandallinares',
  website: 'https://amandallinares.com',
  headshotUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780426999/Amanda_Linares-705x705_ez3wbl.webp',
  artworkUrls: [
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780426999/Cocuyos-Amanda-Linares-09273_v1-1030x687_egdzw9.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780426999/Amanda-Linares-image-1030x694_vkc82a.jpg',
  ],
};

async function ensureStudioResidentType(orgId) {
  const { data: existing } = await supabase
    .from('org_member_types')
    .select('id')
    .eq('org_id', orgId)
    .eq('type_key', 'studio_resident')
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('org_member_types')
    .insert({
      org_id: orgId,
      type_key: 'studio_resident',
      label: 'Studio Resident',
      description: 'Year-round studio artist at Oolite Arts.',
      sort_order: 10,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

async function upsertAmandaArtist(orgId, memberTypeId) {
  const user_id = `oolite_resident_${AMANDA.key}`;
  const portraits = {
    full_width_landscape: AMANDA.artworkUrls,
  };
  const payload = {
    organization_id: orgId,
    user_id,
    name: AMANDA.name,
    bio: `Studio ${AMANDA.studio} · Oolite Arts studio resident (${COHORT}).`,
    avatar_url: AMANDA.headshotUrl,
    profile_image: AMANDA.headshotUrl,
    studio_type: 'Studio',
    studio_location: AMANDA.studio,
    member_type_id: memberTypeId,
    is_public: true,
    is_active: true,
    is_featured: true,
    profile_type: 'artist',
    metadata: {
      constituent_type: 'studio_resident',
      constituent_label: 'Studio Resident',
      member_type_key: 'studio_resident',
      residency_type: 'Studio Resident',
      residency_cohort: COHORT,
      residency_year: COHORT,
      year: COHORT,
      studio: AMANDA.studio,
      studio_resident: true,
      email: AMANDA.email,
      instagram: AMANDA.instagram,
      website: AMANDA.website,
      headshot_url: AMANDA.headshotUrl,
      artwork_url: AMANDA.artworkUrls[0],
      artwork_urls: AMANDA.artworkUrls,
      portraits,
      source: 'seed_oolite_amanda_linares_2025',
      example: true,
    },
  };

  const { data: existing, error: selErr } = await supabase
    .from('artist_profiles')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', user_id)
    .maybeSingle();

  if (selErr) throw new Error(selErr.message);

  if (existing?.id) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase
    .from('artist_profiles')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function upsertResidentAnnouncement(orgId, artistProfileId) {
  const title = `Studio Resident — ${AMANDA.name}`;
  const headshot = AMANDA.headshotUrl;
  const now = new Date().toISOString();

  const announcementRow = {
    organization_id: orgId,
    org_id: orgId,
    author_clerk_id: 'system_oolite',
    created_by: 'system_oolite',
    updated_by: 'system_oolite',
    title,
    body: `${AMANDA.name} is a ${COHORT} studio resident at Oolite Arts (Studio ${AMANDA.studio}).`,
    status: 'published',
    priority: 'normal',
    tags: ['studio-resident', 'artist-spotlight', `oolite-${COHORT}`, 'amanda-linares'],
    visibility: 'public',
    type: 'news',
    sub_type: 'general',
    image_url: headshot,
    image_layout: 'card',
    is_active: true,
    published_at: now,
    start_date: RESIDENT_DISPLAY_DATE,
    starts_at: RESIDENT_STARTS_AT,
    metadata: {
      program: 'artist_spotlight',
      constituent_type: 'studio_resident',
      constituent_label: 'Studio Resident',
      artist_profile_id: artistProfileId,
      studio: AMANDA.studio,
      residency_cohort: COHORT,
      headshot_url: headshot,
      artwork_url: AMANDA.artworkUrls[0],
      artwork_urls: AMANDA.artworkUrls,
      portraits: {
        full_width_landscape: AMANDA.artworkUrls,
      },
      source: 'seed_oolite_amanda_linares_2025',
      example: true,
    },
  };

  const { data: existingRows } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('org_id', orgId)
    .eq('title', title)
    .limit(1);

  const existing = existingRows?.[0];

  if (existing?.id) {
    const { error } = await supabase
      .from('announcements')
      .update(announcementRow)
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
    return existing.id;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert(announcementRow)
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

async function main() {
  console.log('🎯 Upserting Amanda Linares (2025 studio resident)…');

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('❌ Organization oolite not found:', orgError);
    process.exit(1);
  }

  const memberTypeId = await ensureStudioResidentType(organization.id);
  const artist = await upsertAmandaArtist(organization.id, memberTypeId);
  const announcementId = await upsertResidentAnnouncement(organization.id, artist.id);

  console.log(`✅ artist_profiles: ${artist.id}`);
  console.log(`✅ announcement: ${announcementId}`);
  console.log(`   Headshot: ${AMANDA.headshotUrl}`);
  console.log(`   Artworks: ${AMANDA.artworkUrls.length}`);
  console.log('\n🎉 Done. Filter Artists page: Studio Resident + cohort 2025.');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
