/**
 * Upserts Shayla Marshall (2026 Studio Resident) with Cloudinary portrait + artworks.
 *
 * Run: node scripts/data/seed/upsert-oolite-shayla-marshall-2026.js
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

const COHORT = '2026';
const RESIDENT_DISPLAY_DATE = '2026-01-01';
const RESIDENT_STARTS_AT = '2026-01-01T12:00:00.000Z';
const PUBLIC_DIRECTORY_TABLE_ID = 'tblvcSA236qoUfjcv';

const SHAYLA = {
  key: 'shayla_marshall',
  name: 'Shayla Marshall',
  studio: '209',
  headshotUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452178/Shayla-Marshall-potrait_tb87ju.jpg',
  artworkUrls: [
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452177/shayla-marshall-The_First_Lady_Hair_Scuplture_Shayla_Marshall-773x1030_kgsoeb.webp',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452176/shayla-marshall-Chess_Not_Checkers_120x60_PaintibgResin_Shayla_Marshall-773x1030_byhhpn.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-The_Queen_Moves_Freely_60x60_Painting_Resin_Shayla_Marshall-773x1030_p05twm.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-Portrait_of_a_Noblewoman_4x5_Tintype_Shayla_Marshall-782x1030_citef1.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452174/shayla-marshall-Da_Crib_Installation_Shayla_Marshall-1-1030x687_rno1ak.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Trina_Hair_Sculpture_Shayla_Marshall-878x1030_hq7xwa.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Soulaani_Hair_Scuplture_Shayla_Marshall-1030x687_senmyt.jpg',
  ],
  portraits: {
    full_height_vertical: [
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452177/shayla-marshall-The_First_Lady_Hair_Scuplture_Shayla_Marshall-773x1030_kgsoeb.webp',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452176/shayla-marshall-Chess_Not_Checkers_120x60_PaintibgResin_Shayla_Marshall-773x1030_byhhpn.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-The_Queen_Moves_Freely_60x60_Painting_Resin_Shayla_Marshall-773x1030_p05twm.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-Portrait_of_a_Noblewoman_4x5_Tintype_Shayla_Marshall-782x1030_citef1.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Trina_Hair_Sculpture_Shayla_Marshall-878x1030_hq7xwa.jpg',
    ],
    full_width_landscape: [
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452174/shayla-marshall-Da_Crib_Installation_Shayla_Marshall-1-1030x687_rno1ak.jpg',
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Soulaani_Hair_Scuplture_Shayla_Marshall-1030x687_senmyt.jpg',
    ],
  },
};

function readEnv(key) {
  const v = process.env[key];
  return v?.trim() || undefined;
}

function alumniAirtableConfig() {
  const baseId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_BASE_ID') || readEnv('AIRTABLE_ALUMNI_BASE_ID');
  const apiKey =
    readEnv('AIRTABLE_OOLITE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_API_KEY');
  if (!baseId || !apiKey) return null;
  return { baseId, apiKey };
}

async function patchAirtableRecord(baseId, tableId, apiKey, recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}/${encodeURIComponent(recordId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Airtable PATCH ${recordId}: ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function createAirtableRecord(baseId, tableId, apiKey, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }] }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Airtable POST: ${res.status} ${JSON.stringify(body)}`);
  }
  return body.records[0];
}

async function findPublicDirectoryRecord(baseId, apiKey, nameKey) {
  let offset;
  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(PUBLIC_DIRECTORY_TABLE_ID)}`
    );
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    const hit = data.records.find(
      (r) =>
        String(r.fields['Name Key'] || '')
          .trim()
          .toLowerCase() === nameKey ||
        String(r.fields['Display Name'] || '')
          .trim()
          .toLowerCase() === SHAYLA.name.toLowerCase()
    );
    if (hit) return hit;
    offset = data.offset;
  } while (offset);
  return null;
}

async function upsertShaylaPublicDirectory(artistProfileId) {
  const cfg = alumniAirtableConfig();
  if (!cfg) {
    console.warn('⚠️  Airtable env not configured — skipping public directory sync');
    return null;
  }

  const { baseId, apiKey } = cfg;
  const additionalImages = SHAYLA.artworkUrls.join('\n');
  const publicFields = {
    'Display Name': SHAYLA.name,
    'Name Key': 'shayla marshall',
    'Featured Image URL': SHAYLA.headshotUrl,
    'Portrait Vertical URL': SHAYLA.headshotUrl,
    'Portrait Landscape URL': SHAYLA.portraits.full_width_landscape[0],
    'Additional Image URLs': additionalImages,
    'Studio Number': SHAYLA.studio,
    'Residency Program': 'Studio Residency',
    'Recency Year': 2026,
    'Current / Alumni Status': 'Current Resident',
    'Public Profile Approved': true,
    'Image Review Status': 'Ready',
    'Preferred Image Orientation': 'Both Available',
    'Cloudinary Folder / Source Batch': 'shayla-marshall-2026',
    'Image Alt Text': 'Shayla Marshall, Oolite Arts studio resident',
    'Image Credit': 'Oolite Arts',
    'Image Source': 'Cloudinary',
    'Oolite Profile URL': `/o/oolite/artists/${artistProfileId}`,
    'Source Notes': 'Seeded via upsert-oolite-shayla-marshall-2026.js',
    'Do Not Use in AI': false,
  };

  const existingPublic = await findPublicDirectoryRecord(baseId, apiKey, 'shayla marshall');
  if (existingPublic?.id) {
    await patchAirtableRecord(
      baseId,
      PUBLIC_DIRECTORY_TABLE_ID,
      apiKey,
      existingPublic.id,
      publicFields
    );
    console.log(`✅ Airtable public directory updated: ${existingPublic.id}`);
    return existingPublic.id;
  }

  const created = await createAirtableRecord(
    baseId,
    PUBLIC_DIRECTORY_TABLE_ID,
    apiKey,
    publicFields
  );
  console.log(`✅ Airtable public directory created: ${created.id}`);
  return created.id;
}

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

async function upsertShaylaArtist(orgId, memberTypeId) {
  const user_id = `oolite_resident_${SHAYLA.key}`;
  const payload = {
    organization_id: orgId,
    user_id,
    name: SHAYLA.name,
    bio: `Studio ${SHAYLA.studio} · Oolite Arts studio resident (${COHORT}).`,
    avatar_url: SHAYLA.headshotUrl,
    profile_image: SHAYLA.headshotUrl,
    studio_type: 'Studio',
    studio_location: SHAYLA.studio,
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
      studio: SHAYLA.studio,
      studio_resident: true,
      headshot_url: SHAYLA.headshotUrl,
      artwork_url: SHAYLA.artworkUrls[0],
      artwork_urls: SHAYLA.artworkUrls,
      portraits: SHAYLA.portraits,
      source: 'seed_oolite_shayla_marshall_2026',
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
  const title = `Studio Resident — ${SHAYLA.name}`;
  const headshot = SHAYLA.headshotUrl;
  const now = new Date().toISOString();

  const announcementRow = {
    organization_id: orgId,
    org_id: orgId,
    author_clerk_id: 'system_oolite',
    created_by: 'system_oolite',
    updated_by: 'system_oolite',
    title,
    body: `${SHAYLA.name} is a ${COHORT} studio resident at Oolite Arts (Studio ${SHAYLA.studio}).`,
    status: 'published',
    priority: 'normal',
    tags: ['studio-resident', 'artist-spotlight', `oolite-${COHORT}`, 'shayla-marshall'],
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
      studio: SHAYLA.studio,
      residency_cohort: COHORT,
      headshot_url: headshot,
      artwork_url: SHAYLA.artworkUrls[0],
      artwork_urls: SHAYLA.artworkUrls,
      portraits: SHAYLA.portraits,
      source: 'seed_oolite_shayla_marshall_2026',
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

async function patchGroupAnnouncementAvatar(orgId) {
  const { data: rows, error } = await supabase
    .from('announcements')
    .select('id, people, title')
    .eq('org_id', orgId)
    .eq('title', '2026 Studio Residents')
    .limit(1);

  if (error || !rows?.[0]?.people) return;

  const people = rows[0].people.map((p) => {
    if (!p?.name || !/shayla\s+marshall/i.test(p.name)) return p;
    return {
      ...p,
      avatar_url: SHAYLA.headshotUrl,
      role: `Studio ${SHAYLA.studio}`,
    };
  });

  await supabase
    .from('announcements')
    .update({ people, updated_by: 'system_oolite' })
    .eq('id', rows[0].id);
  console.log('✅ Refreshed Shayla avatar on "2026 Studio Residents" announcement');
}

async function main() {
  console.log('🎯 Upserting Shayla Marshall (2026 studio resident)…');

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
  const artist = await upsertShaylaArtist(organization.id, memberTypeId);
  const announcementId = await upsertResidentAnnouncement(organization.id, artist.id);
  const publicRecordId = await upsertShaylaPublicDirectory(artist.id);
  await patchGroupAnnouncementAvatar(organization.id);

  console.log(`✅ artist_profiles: ${artist.id}`);
  console.log(`✅ announcement: ${announcementId}`);
  if (publicRecordId) console.log(`✅ airtable public directory: ${publicRecordId}`);
  console.log(`   Portrait: ${SHAYLA.headshotUrl}`);
  console.log(`   Artworks: ${SHAYLA.artworkUrls.length}`);
  console.log('\n🎉 Done. See /o/oolite/artists, /o/oolite/alumni, and Memory Agent.');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
