/**
 * Upserts 2026 Oolite studio residents into artist_profiles, creates one
 * announcement per resident for SmartSign/carousel, and refreshes avatars on
 * the aggregate "2026 Studio Residents" + "Youth Artist Residency" announcements.
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

/** Keep in sync with lib/network-builder/constituent-types.ts */
const OOLITE_MEMBER_TYPES = [
  {
    type_key: 'studio_resident',
    label: 'Studio Resident',
    description: 'Year-round studio artist at Oolite Arts (Lincoln Road studios).',
    sort_order: 10,
  },
  {
    type_key: 'youth_resident',
    label: 'Youth Resident',
    description: 'Youth studio and mentorship program resident.',
    sort_order: 20,
  },
  {
    type_key: 'cinematic_resident',
    label: 'Cinematic Resident',
    description: 'Film and cinematic arts residency.',
    sort_order: 30,
  },
  {
    type_key: 'live_in_resident',
    label: 'Live-in Resident',
    description: 'Live-in studio residency.',
    sort_order: 40,
  },
  {
    type_key: 'alumni',
    label: 'Alumni',
    description: 'Former Oolite studio or program participant.',
    sort_order: 50,
  },
  {
    type_key: 'staff',
    label: 'Staff',
    description: 'Oolite Arts staff.',
    sort_order: 90,
    is_staff: true,
  },
];

const STUDIO_RESIDENT_COHORT = '2026';
const RESIDENT_DISPLAY_DATE = '2026-01-01';
const RESIDENT_STARTS_AT = '2026-01-01T12:00:00.000Z';

/**
 * Canonical residents: square headshot + studio portraits by frame
 * (full_width_landscape | full_width_vertical | full_height_vertical).
 */
const RESIDENTS = [
  {
    key: 'gonzalo_hernandez',
    name: 'Gonzalo Hernandez',
    studio: '204A',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Gonzalo-Hernandez_qlql5o.jpg',
    portraits: {
      full_width_landscape: [
        'v1780016689/gonzalo_hernandez_portrait-full-width-landscape-1_bsi706',
        'v1780016696/gonzalo_hernandez_portrait-full-width-landscape-2_mjpzxv',
        'v1780016712/gonzalo_hernandez_portrait-full-width-landscape-3_cj8lyy',
      ],
      full_height_vertical: [
        'v1780016707/gonzalo_hernandez_portrait-full-height-vertical_cxuyve',
      ],
    },
  },
  {
    key: 'ana_mosquera',
    name: 'Ana Mosquera',
    studio: '202',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993353/Ana-Mosquera-Headshot-e1713279418772-705x705_smqec5.jpg',
    artworkPath: 'v1775590869/ana_mosquera_portrait-full-width-landscape-2_rdcpks',
  },
  {
    key: 'diego_gabaldon',
    name: 'Diego Gabaldon',
    studio: '102',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993350/Diego-Gabaldon-705x705_nfpjhw.jpg',
    portraits: {
      full_height_vertical: [
        'v1780016675/diego_gabaldon_portrait-full-height-vertical_u8f2un',
        'v1780016684/diego_gabaldon_portrait-full-height-vertical-2_zf9voc',
      ],
    },
  },
  {
    key: 'sheherazade_thenard',
    name: 'Sheherazade Thénard',
    studio: '208',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993352/Sheherazade-Thenard-705x705_v7shfr.jpg',
    portraits: {
      full_width_landscape: [
        'v1780016718/sheherezade_thenard_portrait-full-width-landscape-2_c8j9uq',
      ],
      full_width_vertical: [
        'v1780016702/sheherezade_thenard_portrait-full-width-vertical-1_ohfy7c',
      ],
      full_height_vertical: [
        'v1780016679/sheherezade_thenard_portrait-full-height-vertical_zkaqwn',
      ],
    },
  },
  {
    key: 'jose_delgado_zuniga',
    name: 'José Delgado Zúñiga',
    studio: '207',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993348/Jose-Zuniga_Headshot-1_athbrd.jpg',
    portraits: {
      full_width_landscape: [
        'v1780016690/jose_zuniga_portrait-full-width-landscape-2_ngapnl',
      ],
      full_height_vertical: [
        'v1780016676/jose_zuniga_portrait-full-height-vertical_mp0lej',
      ],
    },
  },
  {
    key: 'bex_mccharen',
    name: 'Bex McCharen',
    studio: '108',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993573/Bex_McCharen-705x705_qosppg.jpg',
    artworkPath: 'v1775590860/bex_mccharen_portrait-full-height-vertical_d70fnk',
  },
  {
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
  },
  {
    key: 'pangea_kali_virga',
    name: 'Pangea Kali Virga',
    studio: '203',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993351/Pangea-Kali-Virga-705x705_yswfrz.jpg',
    portraits: {
      full_width_landscape: [
        'v1780016687/pangea_kali_virga_portrait-full-width-landscape-1_w17fsj',
      ],
    },
  },
  {
    key: 'ricardo_e_zulueta',
    name: 'Ricardo E. Zulueta',
    studio: '109',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993351/Ricardo-E.-Zulueta-headshot_2-705x705_x1q8wx.webp',
    portraits: {
      full_height_vertical: [
        'v1780016703/ricardo_zulueta_portrait-full-height-vertical_uztqaf',
      ],
    },
  },
  {
    key: 'sepideh_kalani',
    name: 'Sepideh Kalani',
    studio: '204',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993352/Sepideh-Kalani-705x705_qnuhew.jpg',
    portraits: {
      full_height_vertical: [
        'v1780016684/sepideh_kalani_portrait-full-height-vertical_duxcfx',
      ],
    },
  },
  {
    key: 'nadia_wolf',
    name: 'Nadia Wolff',
    studio: '110',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993348/Nadia-Wolff-705x705_gcpwsa.jpg',
    portraits: {
      full_height_vertical: [
        'v1780016675/nadia_wolff_portrait-full-height-vertical_hy5uts',
      ],
    },
  },
  {
    key: 'genesis_moreno',
    name: 'Genesis Moreno',
    studio: '210',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993573/Genesis-Moreno-705x705_xiecyg.jpg',
    portraits: {
      full_height_vertical: [
        'v1780016678/genesis_moreno_portrait-full-height-vertical_wsiavr',
      ],
    },
  },
  {
    key: 'lucia_morales',
    name: 'Lucía Morales',
    studio: '101',
    headshotUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Lucia-Morales-Headshot-photo-credit_-Diana-Larrea-705x705_eox31z.jpg',
    artworkPath: 'v1775590893/lucia_morales_portrait-full-width-landscape-1_t0jf8z',
  },
];

function cloudinaryJpg(path) {
  return `${CLOUDINARY_BASE}/${path}.jpg`;
}

const PORTRAIT_FRAMES = [
  'full_width_landscape',
  'full_width_vertical',
  'full_height_vertical',
];

function inferPortraitFrameFromPath(path) {
  const lower = String(path).toLowerCase();
  if (lower.includes('portrait-full-height-vertical')) return 'full_height_vertical';
  if (lower.includes('portrait-full-width-vertical')) return 'full_width_vertical';
  if (lower.includes('portrait-full-width-landscape')) return 'full_width_landscape';
  return 'full_width_landscape';
}

function resolvePortraitPaths(row) {
  if (row.portraits && typeof row.portraits === 'object') {
    const out = {};
    for (const frame of PORTRAIT_FRAMES) {
      const paths = row.portraits[frame];
      if (Array.isArray(paths) && paths.length > 0) {
        out[frame] = paths.map((p) =>
          String(p).startsWith('http') ? p : cloudinaryJpg(p)
        );
      }
    }
    return out;
  }
  if (!row.artworkPath) return {};
  const url = String(row.artworkPath).startsWith('http')
    ? row.artworkPath
    : cloudinaryJpg(row.artworkPath);
  const frame = inferPortraitFrameFromPath(row.artworkPath);
  return { [frame]: [url] };
}

function primaryPortraitUrl(portraitUrls) {
  return (
    portraitUrls.full_width_landscape?.[0] ??
    portraitUrls.full_height_vertical?.[0] ??
    portraitUrls.full_width_vertical?.[0] ??
    null
  );
}

function resolveArtworkUrl(row) {
  const portraits = resolvePortraitPaths(row);
  const primary = primaryPortraitUrl(portraits);
  if (primary) return primary;
  if (!row.artworkPath) return row.headshotUrl;
  if (String(row.artworkPath).startsWith('http')) return row.artworkPath;
  return cloudinaryJpg(row.artworkPath);
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
    const url = r.headshotUrl;
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

async function ensureOoliteMemberTypes(orgId) {
  const byKey = new Map();
  for (const row of OOLITE_MEMBER_TYPES) {
    const { data: existing } = await supabase
      .from('org_member_types')
      .select('id, type_key')
      .eq('org_id', orgId)
      .eq('type_key', row.type_key)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from('org_member_types')
        .update({
          label: row.label,
          description: row.description,
          sort_order: row.sort_order,
          is_staff: row.is_staff === true,
        })
        .eq('id', existing.id);
      byKey.set(row.type_key, existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from('org_member_types')
      .insert({
        org_id: orgId,
        type_key: row.type_key,
        label: row.label,
        description: row.description,
        sort_order: row.sort_order,
        is_staff: row.is_staff === true,
      })
      .select('id, type_key')
      .single();

    if (error) throw new Error(`insert member type ${row.type_key}: ${error.message}`);
    byKey.set(row.type_key, data.id);
  }
  return byKey;
}

async function upsertResidentArtist(orgId, row, memberTypeId) {
  const user_id = `oolite_resident_${row.key}`;
  const headshot = row.headshotUrl;
  const portraitUrls = resolvePortraitPaths(row);
  const artwork = resolveArtworkUrl(row);
  const payload = {
    organization_id: orgId,
    user_id,
    name: row.name,
    bio: `Studio ${row.studio} · Oolite Arts studio resident.`,
    avatar_url: headshot,
    profile_image: headshot,
    studio_type: 'Studio',
    studio_location: row.studio,
    member_type_id: memberTypeId,
    is_public: true,
    is_active: true,
    profile_type: 'artist',
    metadata: {
      constituent_type: 'studio_resident',
      constituent_label: 'Studio Resident',
      member_type_key: 'studio_resident',
      residency_type: 'Studio Resident',
      residency_cohort: STUDIO_RESIDENT_COHORT,
      studio: row.studio,
      studio_resident: true,
      headshot_url: headshot,
      artwork_url: artwork,
      ...(Array.isArray(row.artworkUrls) && row.artworkUrls.length
        ? { artwork_urls: row.artworkUrls }
        : {}),
      portraits: portraitUrls,
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
  const legacyTitles = [];
  if (row.key === 'sheherazade_thenard') {
    legacyTitles.push(`${ANNOUNCEMENT_TITLE_PREFIX}Sheherazade Thenard`);
  }
  if (row.key === 'nadia_wolf') {
    legacyTitles.push(`${ANNOUNCEMENT_TITLE_PREFIX}Nadia Wolf`);
  }
  if (row.key === 'lucia_morales') {
    legacyTitles.push(`${ANNOUNCEMENT_TITLE_PREFIX}Lucia Morales`);
  }

  const headshot = row.headshotUrl;
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
      studio: row.studio,
      residency_cohort: STUDIO_RESIDENT_COHORT,
      headshot_url: headshot,
      artwork_url: resolveArtworkUrl(row),
      portraits: resolvePortraitPaths(row),
    },
  };

  const { data: existingRows } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('org_id', orgId)
    .in('title', [title, ...legacyTitles])
    .limit(1);

  const existing = existingRows?.[0];

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

function buildStudioLookup(residents) {
  const map = new Map();
  for (const r of residents) {
    map.set(normalizePersonKey(r.name), r.studio);
    if (r.key === 'nadia_wolf') {
      map.set(normalizePersonKey('Nadia Wolff'), r.studio);
    }
  }
  return map;
}

function applyResidentsToPeople(people, avatarByName, studioByName) {
  if (!Array.isArray(people)) return people;
  return people.map((p) => {
    if (!p || typeof p !== 'object' || !p.name) return p;
    const key = normalizePersonKey(p.name);
    const url = avatarByName.get(key);
    const studio = studioByName.get(key);
    const next = { ...p };
    if (url) next.avatar_url = url;
    if (studio) next.role = `Studio ${studio}`;
    return next;
  });
}

async function patchAnnouncementPeopleAvatars(orgId, title, avatarByName, studioByName) {
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

  const next = applyResidentsToPeople(row.people, avatarByName, studioByName);
  const { error: upErr } = await supabase
    .from('announcements')
    .update({ people: next, updated_by: 'system_oolite' })
    .eq('id', row.id);

  if (upErr) {
    console.warn(`⚠️  Could not update people on "${title}":`, upErr.message);
  } else {
    console.log(`✅ Refreshed people (avatars + studio numbers) on "${title}"`);
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
  const studioByName = buildStudioLookup(RESIDENTS);
  const memberTypes = await ensureOoliteMemberTypes(organization.id);
  const studioResidentTypeId = memberTypes.get('studio_resident');
  if (!studioResidentTypeId) {
    throw new Error('studio_resident org_member_type missing after seed');
  }

  for (const row of RESIDENTS) {
    const artist = await upsertResidentArtist(organization.id, row, studioResidentTypeId);
    await upsertResidentAnnouncement(organization.id, row, artist.id);
    console.log(`✅ Resident: ${row.name} (studio ${row.studio})`);
  }

  await patchAnnouncementPeopleAvatars(
    organization.id,
    '2026 Studio Residents',
    avatarByName,
    studioByName
  );
  await patchAnnouncementPeopleAvatars(
    organization.id,
    'Youth Artist Residency',
    avatarByName,
    studioByName
  );

  console.log(`\n🎉 Done. ${RESIDENTS.length} studio residents seeded.`);
  console.log('📺 Resident slides use titles: "Studio Resident — …"');
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
