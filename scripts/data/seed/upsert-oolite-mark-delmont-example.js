/**
 * Upserts Mark Delmont (2025 Studio Resident; also 2024 + Home + Away) with
 * Cloudinary headshot, studio photo, and artwork images — flagged as a showcase example.
 *
 * Run: node scripts/data/seed/upsert-oolite-mark-delmont-example.js
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

const BIO = `In the vibrant heart of Miami Gardens, more precisely known as Carol City, where cultural diversity thrives, Mark Delmont stands as a dynamic multidisciplinary artist, blending his Jamaican and Haitian roots into a vivid tapestry of creativity.

From a tender age, Delmont sought solace in the world of music and cinema, where icons like Outkast, Curtis Mayfield, and Kendrick Lamar provided him with a sonic backdrop for his journey of self-discovery. Films like "Equilibrium," "Boyz n the Hood," and "Memento" served as portals into the exploration of identity, blackness, and masculinity. These artistic forms became his sanctuaries, freeing him from the confines of societal norms and inviting a celebration of unique individuality.

As Delmont's artistic journey unfolded, he found himself influenced not only by the melodies and narratives of his heroes but also by the mechanical world. His father, a skilled contractor and fabricator, introduced him to a playground of hydraulics, tools, and machinery, instilling in him a curiosity for mechanics.

By the age of 25, Delmont had boldly embraced the realm of self-taught artistry. His creations, characterized by dramatic portraiture and expansive depictions of black iconography within their porous environments, reflect the fusion of construction and art. Paints, construction materials, and fabrics meticulously set on wooden frames bring his experiences, influences, and skills to life.

Delmont's art is an ode to the power of the black experience, where common stories from the neighborhood sound like the new age renaissance. Houses become party masquerades, DJ speakers reflect the king's orchestral symphony, football games distract like those inside the colosseum, and people cheer while we debate over domino tables. We're here; we've been here.`;

const MARK = {
  key: 'mark_delmont',
  name: 'Mark Delmont',
  studio: '204',
  email: 'purchasealtworks@gmail.com',
  phone: '954.842.9734',
  instagram: '@artlovetrap',
  website: 'https://www.markdelmont.com/',
  headshotUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780445426/Mark-Delmont-headshot-2-1-1030x1030_nkzolq.webp',
  studioPhotoUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780445428/mark-delmont-MEL04500-1-1030x687_u231eb.jpg',
  artworkUrls: [
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780445427/mark-delmont-Talking-To-Myself-Again-2024-acrylic-ceramic-tile-on-wood-52-x-82-1030x687_nwhi5h.jpg',
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780445427/mark-delmont-Aint-No-Different-2024-Acrylic-on-wood-96-x-60-1030x687_w7mhyg.jpg',
  ],
  residencyLabels: ['2025 Resident', '2024 Resident', '2024 Home + Away Resident'],
  airtableStagingRecordId: 'recrlJLrfMdS74BIk',
};

const PUBLIC_DIRECTORY_TABLE_ID = 'tblvcSA236qoUfjcv';

const SHORT_AI_SUMMARY =
  'Mark Delmont is a multidisciplinary artist from Carol City (Miami Gardens), blending Jamaican and Haitian roots into dramatic portraiture and mixed-media work that fuses construction materials with Black iconography and neighborhood life.';

function readEnv(key) {
  const v = process.env[key];
  return v?.trim() || undefined;
}

function alumniAirtableConfig() {
  const baseId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_BASE_ID') || readEnv('AIRTABLE_ALUMNI_BASE_ID');
  const stagingTableId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_TABLE_ID') || readEnv('AIRTABLE_ALUMNI_TABLE_ID');
  const apiKey =
    readEnv('AIRTABLE_OOLITE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_API_KEY');
  if (!baseId || !stagingTableId || !apiKey) return null;
  return { baseId, stagingTableId, apiKey };
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
          .toLowerCase() === MARK.name.toLowerCase()
    );
    if (hit) return hit;
    offset = data.offset;
  } while (offset);
  return null;
}

async function upsertMarkAirtable(artistProfileId) {
  const cfg = alumniAirtableConfig();
  if (!cfg) {
    console.warn('⚠️  Airtable alumni env not configured — skipping alumni sync');
    return null;
  }

  const { baseId, stagingTableId, apiKey } = cfg;
  const residencyNote = MARK.residencyLabels.join('; ');
  const additionalImages = [MARK.studioPhotoUrl, ...MARK.artworkUrls].join('\n');

  await patchAirtableRecord(baseId, stagingTableId, apiKey, MARK.airtableStagingRecordId, {
    'Medium':
      'Multidisciplinary — painting, acrylic on wood, construction materials, portraiture',
    Website: MARK.website,
    Notes: BIO,
    'other notes': `${residencyNote}. Studio ${MARK.studio}. Showcase example — synced from seed.`,
  });
  console.log(`✅ Airtable staging (People): ${MARK.airtableStagingRecordId}`);

  const publicFields = {
    'Display Name': MARK.name,
    'Name Key': 'mark delmont',
    'Public Bio': BIO,
    'Short AI Summary': SHORT_AI_SUMMARY,
    'Featured Image URL': MARK.headshotUrl,
    'Portrait Vertical URL': MARK.headshotUrl,
    'Portrait Landscape URL': MARK.studioPhotoUrl,
    'Additional Image URLs': additionalImages,
    'Website URL': MARK.website,
    'Instagram URL': 'https://instagram.com/artlovetrap',
    'Primary Medium': 'Mixed Media',
    Topics: ['Painting', 'Photography'],
    Themes: ['Identity', 'Memory', 'masculinity'],
    'Studio Number': MARK.studio,
    'Residency Program': 'Studio Residency',
    'Residency Category': residencyNote,
    'Recency Year': 2025,
    'Current / Alumni Status': 'Current Resident / Alumni',
    'Public Profile Approved': true,
    'Image Review Status': 'Ready',
    'Preferred Image Orientation': 'Both Available',
    'Cloudinary Folder / Source Batch': 'mark-delmont-example-2026',
    'Image Alt Text': 'Mark Delmont, Oolite Arts studio resident',
    'Image Credit': 'Oolite Arts',
    'Image Source': 'Cloudinary',
    'Oolite Profile URL': `/o/oolite/artists/${artistProfileId}`,
    'Source Notes': 'Seeded via upsert-oolite-mark-delmont-example.js',
    'Do Not Use in AI': false,
  };

  const existingPublic = await findPublicDirectoryRecord(baseId, apiKey, 'mark delmont');
  let publicRecord;
  if (existingPublic?.id) {
    publicRecord = await patchAirtableRecord(
      baseId,
      PUBLIC_DIRECTORY_TABLE_ID,
      apiKey,
      existingPublic.id,
      publicFields
    );
    console.log(`✅ Airtable public directory updated: ${existingPublic.id}`);
  } else {
    publicRecord = await createAirtableRecord(
      baseId,
      PUBLIC_DIRECTORY_TABLE_ID,
      apiKey,
      publicFields
    );
    console.log(`✅ Airtable public directory created: ${publicRecord.id}`);
  }

  return {
    stagingRecordId: MARK.airtableStagingRecordId,
    publicRecordId: publicRecord.id,
  };
}

async function linkAirtableIdsOnArtist(artistId, airtableIds) {
  if (!airtableIds) return;
  const { data: row, error: selErr } = await supabase
    .from('artist_profiles')
    .select('metadata')
    .eq('id', artistId)
    .single();
  if (selErr) throw new Error(selErr.message);

  const metadata = {
    ...(row?.metadata && typeof row.metadata === 'object' ? row.metadata : {}),
    airtable_staging_record_id: airtableIds.stagingRecordId,
    airtable_public_directory_record_id: airtableIds.publicRecordId,
  };

  const { error } = await supabase
    .from('artist_profiles')
    .update({ metadata, updated_at: new Date().toISOString() })
    .eq('id', artistId);
  if (error) throw new Error(error.message);
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

async function findExistingArtist(orgId) {
  const { data: byUser, error: userErr } = await supabase
    .from('artist_profiles')
    .select('id, user_id')
    .eq('organization_id', orgId)
    .eq('user_id', `oolite_resident_${MARK.key}`)
    .maybeSingle();
  if (userErr) throw new Error(userErr.message);
  if (byUser?.id) return byUser;

  const { data: byName, error: nameErr } = await supabase
    .from('artist_profiles')
    .select('id, user_id')
    .eq('organization_id', orgId)
    .ilike('name', MARK.name)
    .maybeSingle();
  if (nameErr) throw new Error(nameErr.message);
  return byName;
}

async function upsertMarkArtist(orgId, memberTypeId) {
  const user_id = `oolite_resident_${MARK.key}`;
  const landscapeUrls = [MARK.studioPhotoUrl, ...MARK.artworkUrls];
  const portraits = {
    full_width_landscape: landscapeUrls,
  };

  const payload = {
    organization_id: orgId,
    user_id,
    name: MARK.name,
    bio: BIO,
    avatar_url: MARK.headshotUrl,
    profile_image: MARK.headshotUrl,
    studio_type: 'Studio',
    studio_location: MARK.studio,
    website_url: MARK.website,
    instagram_handle: MARK.instagram,
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
      residency_labels: MARK.residencyLabels,
      year: COHORT,
      studio: MARK.studio,
      studio_resident: true,
      email: MARK.email,
      phone: MARK.phone,
      instagram: MARK.instagram,
      website: MARK.website,
      medium: 'Multidisciplinary — painting, construction materials, portraiture',
      headshot_url: MARK.headshotUrl,
      artwork_url: MARK.artworkUrls[0],
      artwork_urls: MARK.artworkUrls,
      studio_photo_url: MARK.studioPhotoUrl,
      portraits,
      source: 'seed_oolite_mark_delmont_example',
      example: true,
    },
  };

  const existing = await findExistingArtist(orgId);

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
  const title = `Studio Resident — ${MARK.name}`;
  const headshot = MARK.headshotUrl;
  const now = new Date().toISOString();

  const announcementRow = {
    organization_id: orgId,
    org_id: orgId,
    author_clerk_id: 'system_oolite',
    created_by: 'system_oolite',
    updated_by: 'system_oolite',
    title,
    body: `${MARK.name} is a ${COHORT} studio resident at Oolite Arts (Studio ${MARK.studio}). Multidisciplinary artist rooted in Carol City; also ${MARK.residencyLabels.slice(1).join(', ').toLowerCase()}.`,
    status: 'published',
    priority: 'normal',
    tags: [
      'studio-resident',
      'artist-spotlight',
      `oolite-${COHORT}`,
      'mark-delmont',
      'example',
    ],
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
      studio: MARK.studio,
      residency_cohort: COHORT,
      residency_labels: MARK.residencyLabels,
      headshot_url: headshot,
      artwork_url: MARK.artworkUrls[0],
      artwork_urls: MARK.artworkUrls,
      studio_photo_url: MARK.studioPhotoUrl,
      portraits: {
        full_width_landscape: [MARK.studioPhotoUrl, ...MARK.artworkUrls],
      },
      source: 'seed_oolite_mark_delmont_example',
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
  console.log('🎯 Upserting Mark Delmont (showcase example)…');

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
  const artist = await upsertMarkArtist(organization.id, memberTypeId);
  const announcementId = await upsertResidentAnnouncement(organization.id, artist.id);
  const airtableIds = await upsertMarkAirtable(artist.id);
  await linkAirtableIdsOnArtist(artist.id, airtableIds);

  console.log(`✅ artist_profiles: ${artist.id}`);
  console.log(`✅ announcement: ${announcementId}`);
  if (airtableIds) {
    console.log(`✅ airtable staging: ${airtableIds.stagingRecordId}`);
    console.log(`✅ airtable public directory: ${airtableIds.publicRecordId}`);
  }
  console.log(`   Headshot: ${MARK.headshotUrl}`);
  console.log(`   Studio photo + artworks: ${MARK.artworkUrls.length + 1}`);
  console.log('\n🎉 Done. See /o/oolite/artists, /o/oolite/alumni, and Memory Agent.');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
