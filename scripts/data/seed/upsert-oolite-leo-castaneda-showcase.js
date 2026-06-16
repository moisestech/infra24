#!/usr/bin/env node
/**
 * Upserts Leo Castaneda — Oolite 2018/2019 studio resident showcase:
 * public directory, alumni staging, CRM People, Supabase artist_profiles.
 *
 * Run: node scripts/data/seed/upsert-oolite-leo-castaneda-showcase.js
 */
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const PUBLIC_DIRECTORY_TABLE_ID = 'tblvcSA236qoUfjcv';
const CRM_PEOPLE_TABLE_ID = process.env.AIRTABLE_OOLITE_PEOPLE_TABLE_ID || 'tbltHiqscY80ybsGE';
const ORG_RECORD_ID = 'recRiKB2W96uzTfY0';

const LEO = {
  key: 'leo_castaneda',
  name: 'Leo Castaneda',
  alumniStagingRecordId: 'recPRI16vtqKD2MwX',
  publicDirectoryRecordId: 'recktCg5W9FxR8Swi',
  website: 'https://leocastaneda.format.com/',
  videoUrl: 'https://www.youtube.com/watch?v=MNl-on7ZeQc',
  residencyLabels: ['2018/2019 Studio Resident', '2018 Studio Resident'],
  yearInResidency: '2018',
};

const HEADSHOT =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-LC_Video_in_Perfomance_at_Faena_image_02_JPG-1030x687_gnm5fc.jpg';

const ARTWORK_URLS = [
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-Painting_in_First_room_3-1030x686_c999fb.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-High_Resolution_Screenshot_number_143_ac-1030x736_nkq5ty.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-High_Resolution_Screenshot_number_167_ac-1030x736_uwqoos.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/Leo_Castaneda-Game-Preview_06-1030x580_bqndej.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560942/leo-castaneda-first_room-1030x588_i9izcv.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560942/Leo_Castaneda_Level_One-Preview_Explosion_02-1030x579_kux3xv.jpg',
];

const PUBLIC_BIO = `Leo Castaneda is an artist working at the intersection of virtual reality, gaming, performance and interactive sculpture. Castaneda's work deploys and deconstructs the socio-economic, racial, mythological and post-human anatomies embedded in the structure of video games. Castaneda received his BFA from Cooper Union in 2010, and in 2014 received his MFA at Hunter College. In 2014 he received a grant from the Colección Patricia Phelps de Cisneros (CPPC) to attend SOMA Mexico (Mexico City). Other residencies include, "Of Games III" at Khoj International Artists Association, New Delhi, India (2015), and the Bronx Museum's The Artist in the Marketplace program (2017).`;

const SHORT_AI_SUMMARY =
  'Leo Castaneda is a Miami-based artist working at the intersection of virtual reality, gaming, performance, and interactive sculpture. He was an Oolite Arts studio resident in 2018–2019.';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function readEnv(key) {
  const v = process.env[key];
  return v?.trim() || undefined;
}

function airtableConfig() {
  const publicBaseId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_BASE_ID') ||
    readEnv('AIRTABLE_ALUMNI_BASE_ID') ||
    readEnv('AIRTABLE_OOLITE_PROGRAMMING_BASE_ID');
  const alumniBaseId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_BASE_ID') || readEnv('AIRTABLE_ALUMNI_BASE_ID');
  const alumniTableId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_TABLE_ID') || readEnv('AIRTABLE_ALUMNI_TABLE_ID');
  const peopleBaseId =
    readEnv('AIRTABLE_OOLITE_PROGRAMMING_BASE_ID') || publicBaseId;
  const apiKey =
    readEnv('AIRTABLE_OOLITE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_API_KEY');
  if (!publicBaseId || !peopleBaseId || !apiKey) return null;
  return { publicBaseId, alumniBaseId, alumniTableId, peopleBaseId, apiKey };
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
    const hit = data.records.find((r) => {
      const nk = String(r.fields['Name Key'] || '')
        .trim()
        .toLowerCase();
      const dn = String(r.fields['Display Name'] || '')
        .trim()
        .toLowerCase();
      return nk === nameKey || dn === 'leo castaneda';
    });
    if (hit) return hit;
    offset = data.offset;
  } while (offset);
  return null;
}

async function findCrmPeopleRecord(baseId, apiKey) {
  let offset;
  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(CRM_PEOPLE_TABLE_ID)}`
    );
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    const hit = data.records.find((r) => {
      const name = String(r.fields['Full Name'] || '')
        .trim()
        .toLowerCase();
      return name === 'leo castaneda';
    });
    if (hit) return hit;
    offset = data.offset;
  } while (offset);
  return null;
}

function publicDirectoryFields(artistProfilePath) {
  return {
    'Display Name': LEO.name,
    'Name Key': 'leo castaneda',
    'Public Bio': PUBLIC_BIO,
    'Short AI Summary': SHORT_AI_SUMMARY,
    'Featured Image URL': HEADSHOT,
    'Portrait Vertical URL': HEADSHOT,
    'Portrait Landscape URL': ARTWORK_URLS[3],
    'Additional Image URLs': ARTWORK_URLS.join('\n'),
    'Website URL': LEO.website,
    'Primary Medium': 'Mixed Media',
    Topics: ['Installation', 'Video'],
    Themes: ['Identity', 'Memory'],
    'Residency Program': 'Studio Residency',
    'Residency Category': LEO.residencyLabels[0],
    'Recency Year': 2019,
    'Current / Alumni Status': 'Alumni',
    'Public Profile Approved': true,
    'Image Review Status': 'Ready',
    'Preferred Image Orientation': 'Both Available',
    'Cloudinary Folder / Source Batch': 'leo-castaneda-showcase',
    'Image Alt Text': 'Leo Castaneda, Oolite Arts studio resident',
    'Image Credit': 'Oolite Arts',
    'Image Source': 'Cloudinary',
    'Source Notes': `Seeded via upsert-oolite-leo-castaneda-showcase.js. Video: ${LEO.videoUrl}`,
    'Do Not Use in AI': false,
    ...(artistProfilePath ? { 'Oolite Profile URL': artistProfilePath } : {}),
  };
}

async function upsertPublicDirectory(baseId, apiKey, artistProfilePath) {
  const publicFields = publicDirectoryFields(artistProfilePath);
  const existing = await findPublicDirectoryRecord(baseId, apiKey, 'leo castaneda');
  if (existing?.id) {
    await patchAirtableRecord(baseId, PUBLIC_DIRECTORY_TABLE_ID, apiKey, existing.id, publicFields);
    console.log(`✅ Public directory updated: ${existing.id}`);
    return existing.id;
  }

  const created = await createAirtableRecord(
    baseId,
    PUBLIC_DIRECTORY_TABLE_ID,
    apiKey,
    publicFields
  );
  console.log(`✅ Public directory created: ${created.id}`);
  return created.id;
}

async function upsertAlumniStaging(cfg) {
  if (!cfg.alumniBaseId || !cfg.alumniTableId) {
    console.warn('⚠️  Alumni staging table not configured — skipping');
    return LEO.alumniStagingRecordId;
  }

  const fields = {
    'Full Name': LEO.name,
    'Name (Display)': LEO.name,
    'First Name': 'Leo',
    'Last Name': 'Castaneda',
    Medium: 'Virtual reality, gaming, performance, interactive sculpture',
    Website: LEO.website,
    Notes: PUBLIC_BIO,
    'other notes': `${LEO.residencyLabels.join('; ')}. Showcase — synced from seed. Video: ${LEO.videoUrl}`,
    'Year in Residency': LEO.yearInResidency,
  };

  await patchAirtableRecord(
    cfg.alumniBaseId,
    cfg.alumniTableId,
    cfg.apiKey,
    LEO.alumniStagingRecordId,
    fields
  );
  console.log(`✅ Alumni staging updated: ${LEO.alumniStagingRecordId}`);
  return LEO.alumniStagingRecordId;
}

async function upsertCrmPeople(baseId, apiKey) {
  const fields = {
    'Full Name': LEO.name,
    'Title / Role': '2018/2019 Oolite Arts Resident Artist',
    Department: 'Artist / Resident Artist',
    Institution: [ORG_RECORD_ID],
    City: 'Miami',
    Bio: PUBLIC_BIO,
    Website: LEO.website,
    'Image / Portrait URL': HEADSHOT,
    'Portfolio Image URLs': ARTWORK_URLS.join('\n'),
    'Practice Tags': ['Installation', 'Video', 'Photography'],
    'Public AI Approved': true,
  };

  const existing = await findCrmPeopleRecord(baseId, apiKey);
  if (existing?.id) {
    await patchAirtableRecord(baseId, CRM_PEOPLE_TABLE_ID, apiKey, existing.id, fields);
    console.log(`✅ CRM People updated: ${existing.id}`);
    return;
  }

  const created = await createAirtableRecord(baseId, CRM_PEOPLE_TABLE_ID, apiKey, fields);
  console.log(`✅ CRM People created: ${created.id}`);
}

async function ensureAlumniMemberType(orgId) {
  const { data: existing } = await supabase
    .from('org_member_types')
    .select('id')
    .eq('org_id', orgId)
    .eq('type_key', 'alumni')
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('org_member_types')
    .insert({
      org_id: orgId,
      type_key: 'alumni',
      label: 'Alumni',
      description: 'Former Oolite studio or program participant.',
      sort_order: 50,
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
    .eq('user_id', `oolite_alumni_${LEO.key}`)
    .maybeSingle();
  if (userErr) throw new Error(userErr.message);
  if (byUser?.id) return byUser;

  const { data: byName, error: nameErr } = await supabase
    .from('artist_profiles')
    .select('id, user_id')
    .eq('organization_id', orgId)
    .ilike('name', LEO.name)
    .maybeSingle();
  if (nameErr) throw new Error(nameErr.message);
  return byName;
}

async function upsertLeoArtist(orgId, memberTypeId, airtableIds) {
  const user_id = `oolite_alumni_${LEO.key}`;
  const portraits = {
    full_width_landscape: [ARTWORK_URLS[3], ARTWORK_URLS[0], ...ARTWORK_URLS.slice(1, 3)],
    full_width_vertical: [HEADSHOT],
  };

  const payload = {
    organization_id: orgId,
    user_id,
    name: LEO.name,
    bio: PUBLIC_BIO,
    avatar_url: HEADSHOT,
    profile_image: HEADSHOT,
    studio_type: 'Alumni',
    website_url: LEO.website,
    member_type_id: memberTypeId,
    is_public: true,
    is_active: true,
    is_featured: false,
    profile_type: 'artist',
    metadata: {
      constituent_type: 'alumni',
      constituent_label: 'Alumni',
      member_type_key: 'alumni',
      residency_type: 'Studio Resident',
      residency_labels: LEO.residencyLabels,
      residency_year: '2019',
      year: '2019',
      headshot_url: HEADSHOT,
      artwork_urls: ARTWORK_URLS,
      artwork_url: ARTWORK_URLS[0],
      portraits,
      website: LEO.website,
      video_url: LEO.videoUrl,
      medium: 'Virtual reality, gaming, performance, interactive sculpture',
      source: 'seed_oolite_leo_castaneda_showcase',
      showcase: true,
      airtable_staging_record_id: airtableIds.stagingRecordId,
      airtable_public_directory_record_id: airtableIds.publicRecordId,
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

async function main() {
  const cfg = airtableConfig();
  if (!cfg) {
    console.error('❌ Airtable not configured in .env.local');
    process.exit(1);
  }

  console.log('🎯 Upserting Leo Castaneda for Oolite (agent + alumni + profile)…');

  let artistId = null;
  let publicRecordId = LEO.publicDirectoryRecordId;

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'oolite')
    .maybeSingle();

  if (orgError || !organization?.id) {
    console.warn('⚠️  Supabase org oolite not found — skipping artist_profiles (Airtable only)');
  } else {
    const memberTypeId = await ensureAlumniMemberType(organization.id);
    const stagingRecordId = await upsertAlumniStaging(cfg);
    publicRecordId = await upsertPublicDirectory(cfg.publicBaseId, cfg.apiKey, null);
    const artist = await upsertLeoArtist(organization.id, memberTypeId, {
      stagingRecordId,
      publicRecordId,
    });
    artistId = artist.id;
    publicRecordId = await upsertPublicDirectory(
      cfg.publicBaseId,
      cfg.apiKey,
      `/o/oolite/artists/${artist.id}`
    );
    console.log(`✅ artist_profiles: ${artist.id}`);
  }

  if (!artistId) {
    await upsertAlumniStaging(cfg);
    publicRecordId = await upsertPublicDirectory(cfg.publicBaseId, cfg.apiKey, null);
  }

  try {
    await upsertCrmPeople(cfg.peopleBaseId, cfg.apiKey);
  } catch (e) {
    console.warn('⚠️  CRM People upsert skipped:', e instanceof Error ? e.message : e);
  }

  console.log('\n📋 lib/oolite/airtable-recognitions-config.ts');
  console.log(`   leoCastaneda: '${publicRecordId}'`);
  console.log(`   Alumni staging: ${LEO.alumniStagingRecordId}`);
  if (artistId) console.log(`   Oolite profile: /o/oolite/artists/${artistId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
