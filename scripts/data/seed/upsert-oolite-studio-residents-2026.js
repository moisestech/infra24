/**
 * Upserts 2026 Oolite studio residents into artist_profiles, creates one
 * announcement per resident for SmartSign/carousel, and refreshes avatars on
 * the aggregate "2026 Studio Residents" + "Youth Residents" announcements.
 *
 * Run: node scripts/data/seed/upsert-oolite-studio-residents-2026.js
 * Requires .env.local with Supabase URL + service role (or local defaults).
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

const CLOUDINARY_BASE =
  'https://res.cloudinary.com/dkod1at3i/image/upload';

/** Canonical residents: display name, stable synthetic user_id key, studio label, portrait path */
const RESIDENTS = [
  {
    key: 'gonzalo_hernandez',
    name: 'Gonzalo Hernandez',
    studio: '204A',
    portraitPath:
      'v1775590903/gonzalo_hernandez_portrait-full-width-landscape-1_sj3wzu',
  },
  {
    key: 'ana_mosquera',
    name: 'Ana Mosquera',
    studio: '202',
    portraitPath:
      'v1775590869/ana_mosquera_portrait-full-width-landscape-2_rdcpks',
  },
  {
    key: 'diego_gabaldon',
    name: 'Diego Gabaldon',
    studio: '102',
    portraitPath:
      'v1775590891/diego_gabaldon_portrait-full-width-landscape-2_ersvwj',
  },
  {
    key: 'sheherazade_thenard',
    name: 'Sheherazade Thenard',
    studio: '208',
    portraitPath:
      'v1775590908/sheherezade_thenard_portrait-full-width-landscape-2_w4lngt',
  },
  {
    key: 'jose_delgado_zuniga',
    name: 'José Delgado Zúñiga',
    studio: '207',
    portraitPath: 'v1775590856/jose_zuniga_portrait-full-width-landscape-1_vhchzn',
  },
  {
    key: 'bex_mccharen',
    name: 'Bex McCharen',
    studio: '108',
    portraitPath:
      'v1775590860/bex_mccharen_portrait-full-height-vertical_d70fnk',
  },
  {
    key: 'shayla_marshall',
    name: 'Shayla Marshall',
    studio: '209',
    portraitPath:
      'v1775590854/shayla-marshall_portrait-full-width-landscape-1_ajdicl',
  },
  {
    key: 'pangea_kali_virga',
    name: 'Pangea Kali Virga',
    studio: '203',
    portraitPath:
      'v1775590910/pangea_kali_virga_portrait-full-width-landscape-1_wa0lwh',
  },
  {
    key: 'ricardo_e_zulueta',
    name: 'Ricardo E. Zulueta',
    studio: '109',
    portraitPath:
      'v1775590908/ricardo_zulueta_portrait-full-width-landscape-1_tcv2xf',
  },
  {
    key: 'sepideh_kalani',
    name: 'Sepideh Kalani',
    studio: '204',
    portraitPath:
      'v1775590886/sepideh_kalani_portrait-full-height-vertical_zjhbm3',
  },
  {
    key: 'nadia_wolf',
    name: 'Nadia Wolf',
    studio: '110',
    portraitPath:
      'v1775590901/nadia_wolff_portrait-full-width-landscape-2_itf0og',
  },
  {
    key: 'genesis_moreno',
    name: 'Genesis Moreno',
    studio: '210',
    portraitPath:
      'v1775590881/genesis_moreno_portrait-full-width-landscape-2_iwa3fi',
  },
  {
    key: 'lucia_morales',
    name: 'Lucia Morales',
    studio: '101',
    portraitPath:
      'v1775590893/lucia_morales_portrait-full-width-landscape-1_t0jf8z',
  },
];

function portraitUrl(path) {
  return `${CLOUDINARY_BASE}/${path}.jpg`;
}

function normalizePersonKey(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.']/g, '')
    .trim();
}

/** Map announcement people names (incl. Wolff/Wolf) → portrait URL */
function buildAvatarLookup(residents) {
  const map = new Map();
  for (const r of residents) {
    const url = portraitUrl(r.portraitPath);
    map.set(normalizePersonKey(r.name), url);
    if (r.key === 'nadia_wolf') {
      map.set(normalizePersonKey('Nadia Wolff'), url);
    }
    if (r.key === 'jose_delgado_zuniga') {
      map.set(normalizePersonKey('Jose Delgado Zuniga'), url);
    }
  }
  return map;
}

async function upsertResidentArtist(orgId, row) {
  const user_id = `oolite_resident_${row.key}`;
  const image = portraitUrl(row.portraitPath);
  const payload = {
    organization_id: orgId,
    user_id,
    name: row.name,
    bio: `Studio ${row.studio} · Oolite Arts studio resident.`,
    avatar_url: image,
    profile_image: image,
    studio_type: 'Studio',
    studio_location: row.studio,
    is_public: true,
    is_active: true,
    profile_type: 'artist',
    metadata: {
      residency_type: 'Studio Resident',
      studio: row.studio,
      source: 'seed_oolite_studio_residents_2026',
    },
  };

  const { data: existing, error: selErr } = await supabase
    .from('artist_profiles')
    .select('id')
    .eq('organization_id', orgId)
    .eq('user_id', user_id)
    .maybeSingle();

  if (selErr) {
    throw new Error(`lookup artist ${row.name}: ${selErr.message}`);
  }

  if (existing?.id) {
    const { data, error } = await supabase
      .from('artist_profiles')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('id')
      .single();
    if (error) throw new Error(`update artist ${row.name}: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase
    .from('artist_profiles')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(`insert artist ${row.name}: ${error.message}`);
  return data;
}

const ANNOUNCEMENT_TITLE_PREFIX = 'Studio Resident — ';

async function upsertResidentAnnouncement(orgId, row, artistProfileId) {
  const title = `${ANNOUNCEMENT_TITLE_PREFIX}${row.name}`;
  const image = portraitUrl(row.portraitPath);
  const now = new Date().toISOString();

  const announcementRow = {
    organization_id: orgId,
    org_id: orgId,
    author_clerk_id: 'system_oolite',
    created_by: 'system_oolite',
    updated_by: 'system_oolite',
    title,
    body: `Studio ${row.studio} at Oolite Arts. Member directory: resident profiles can be linked from this announcement for programs and SmartSign.`,
    status: 'published',
    priority: 'normal',
    tags: ['studio-resident', 'artist-spotlight', 'oolite-2026'],
    visibility: 'public',
    type: 'news',
    sub_type: 'general',
    image_url: image,
    image_layout: 'card',
    is_active: true,
    published_at: now,
    metadata: {
      program: 'artist_spotlight',
      artist_profile_id: artistProfileId,
      studio: row.studio,
    },
  };

  const { data: existing } = await supabase
    .from('announcements')
    .select('id')
    .eq('org_id', orgId)
    .eq('title', title)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('announcements')
      .update(announcementRow)
      .eq('id', existing.id);
    if (error) throw new Error(`update announcement ${title}: ${error.message}`);
    return existing.id;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert(announcementRow)
    .select('id')
    .single();

  if (error) throw new Error(`insert announcement ${title}: ${error.message}`);
  return data.id;
}

function applyAvatarsToPeople(people, avatarByName) {
  if (!Array.isArray(people)) return people;
  return people.map((p) => {
    if (!p || typeof p !== 'object' || !p.name) return p;
    const url = avatarByName.get(normalizePersonKey(p.name));
    if (!url) return p;
    return { ...p, avatar_url: url };
  });
}

async function patchAnnouncementPeopleAvatars(orgId, title, avatarByName) {
  const { data: rows, error } = await supabase
    .from('announcements')
    .select('id, people, title')
    .eq('org_id', orgId)
    .ilike('title', `%${title}%`)
    .limit(3);

  if (error || !rows?.length) {
    console.warn(
      `⚠️  No announcement matching "${title}" for avatar refresh (run update-oolite-announcements-2026.js first if missing).`
    );
    return;
  }

  const row = rows.find((r) => r.title === title) || rows[0];
  if (!row?.id) {
    console.warn(`⚠️  Could not resolve row for "${title}"`);
    return;
  }

  const next = applyAvatarsToPeople(row.people, avatarByName);
  const { error: upErr } = await supabase
    .from('announcements')
    .update({ people: next, updated_by: 'system_oolite' })
    .eq('id', row.id);

  if (upErr) {
    console.warn(`⚠️  Could not update people on "${title}":`, upErr.message);
  } else {
    console.log(`✅ Refreshed people avatars on "${title}"`);
  }
}

async function main() {
  console.log('🎯 Upserting Oolite 2026 studio residents…');

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('❌ Organization oolite not found:', orgError);
    process.exit(1);
  }

  const avatarByName = buildAvatarLookup(RESIDENTS);

  for (const row of RESIDENTS) {
    const artist = await upsertResidentArtist(organization.id, row);
    await upsertResidentAnnouncement(organization.id, row, artist.id);
    console.log(`✅ Resident: ${row.name} (studio ${row.studio})`);
  }

  await patchAnnouncementPeopleAvatars(
    organization.id,
    '2026 Studio Residents',
    avatarByName
  );
  await patchAnnouncementPeopleAvatars(
    organization.id,
    'Youth Residents',
    avatarByName
  );

  console.log('\n🎉 Done. Artists grid: /o/oolite/artists');
  console.log('📺 Resident slides use titles: "Studio Resident — …"');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
