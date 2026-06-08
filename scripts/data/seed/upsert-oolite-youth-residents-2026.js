/**
 * Upserts 2026 Oolite Youth Artist Residents into artist_profiles and refreshes
 * avatars on the "Youth Artist Residency" announcement.
 *
 * Run: node scripts/data/seed/upsert-oolite-youth-residents-2026.js
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

const HEADSHOT_URL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg';

const GONZALO_HEADSHOT =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Gonzalo-Hernandez_qlql5o.jpg';

const YOUTH_RESIDENT_COHORT = '2026';
const RESIDENT_DISPLAY_DATE = '2026-01-13';
const RESIDENT_STARTS_AT = '2026-01-13T12:00:00.000Z';

const YOUTH_RESIDENTS = [
  { key: 'ana_blanco', name: 'Ana Blanco' },
  { key: 'noa_garcia', name: 'Noa Garcia' },
  { key: 'melina_walsh', name: 'Melina Walsh' },
  { key: 'tj_wright', name: 'TJ Wright' },
  { key: 'emely_yanji', name: 'Emely Yanji' },
];

function normalizePersonKey(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildAvatarLookup(residents) {
  const map = new Map();
  for (const r of residents) {
    map.set(normalizePersonKey(r.name), r.headshotUrl || HEADSHOT_URL);
  }
  map.set(normalizePersonKey('Gonzalo Hernandez'), GONZALO_HEADSHOT);
  return map;
}

async function ensureYouthMemberType(orgId) {
  const { data: existing } = await supabase
    .from('org_member_types')
    .select('id, type_key')
    .eq('org_id', orgId)
    .eq('type_key', 'youth_resident')
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('org_member_types')
    .insert({
      org_id: orgId,
      type_key: 'youth_resident',
      label: 'Youth Resident',
      description: 'Youth studio and mentorship program resident.',
      sort_order: 20,
      is_staff: false,
    })
    .select('id')
    .single();

  if (error) throw new Error(`insert youth_resident type: ${error.message}`);
  return data.id;
}

async function upsertYouthResidentArtist(orgId, row, memberTypeId) {
  const user_id = `oolite_youth_resident_${row.key}`;
  const payload = {
    organization_id: orgId,
    user_id,
    name: row.name,
    bio: `Youth Artist Resident · Oolite Arts ${YOUTH_RESIDENT_COHORT} cohort.`,
    avatar_url: HEADSHOT_URL,
    profile_image: HEADSHOT_URL,
    member_type_id: memberTypeId,
    is_public: true,
    is_active: true,
    profile_type: 'artist',
    metadata: {
      constituent_type: 'youth_resident',
      constituent_label: 'Youth Artist Resident',
      member_type_key: 'youth_resident',
      residency_type: 'Youth Artist Resident',
      residency_cohort: YOUTH_RESIDENT_COHORT,
      youth_resident: true,
      headshot_url: HEADSHOT_URL,
      source: 'seed_oolite_youth_residents_2026',
    },
  };

  const { data: existing, error: selErr } = await supabase
    .from('artist_profiles')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', user_id)
    .maybeSingle();

  if (selErr) {
    throw new Error(`lookup youth artist ${row.name}: ${selErr.message}`);
  }

  if (existing?.id) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('id')
      .single();
    if (error) throw new Error(`update youth artist ${row.name}: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase
    .from('artist_profiles')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(`insert youth artist ${row.name}: ${error.message}`);
  return data;
}

async function patchYouthResidencyAnnouncement(orgId, avatarByName) {
  const titles = ['Youth Artist Residency', 'Youth Residents'];
  const { data: rows, error } = await supabase
    .from('announcements')
    .select('id, people, title')
    .eq('org_id', orgId)
    .in('title', titles)
    .limit(5);

  if (error || !rows?.length) {
    console.warn(
      '⚠️  No Youth Artist Residency announcement found (run update-oolite-announcements-2026.js first).'
    );
    return;
  }

  const row = rows.find((r) => r.title === 'Youth Artist Residency') || rows[0];
  if (!row?.id || !Array.isArray(row.people)) return;

  const nextPeople = row.people.map((p) => {
    if (!p || typeof p !== 'object' || !p.name) return p;
    const url = avatarByName.get(normalizePersonKey(p.name));
    if (!url) return p;
    return { ...p, avatar_url: url };
  });

  const { error: upErr } = await supabase
    .from('announcements')
    .update({ people: nextPeople, updated_by: 'system_oolite' })
    .eq('id', row.id);

  if (upErr) {
    console.warn(`⚠️  Could not update "${row.title}" people:`, upErr.message);
  } else {
    console.log(`✅ Refreshed people avatars on "${row.title}"`);
  }
}

async function main() {
  console.log('🎯 Upserting Oolite 2026 Youth Artist Residents…');

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('❌ Organization oolite not found:', orgError);
    process.exit(1);
  }

  const memberTypeId = await ensureYouthMemberType(organization.id);
  const avatarByName = buildAvatarLookup(YOUTH_RESIDENTS);

  for (const row of YOUTH_RESIDENTS) {
    await upsertYouthResidentArtist(organization.id, row, memberTypeId);
    console.log(`✅ Youth resident: ${row.name}`);
  }

  await patchYouthResidencyAnnouncement(organization.id, avatarByName);

  console.log(`\n🎉 Done. ${YOUTH_RESIDENTS.length} youth residents seeded.`);
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
