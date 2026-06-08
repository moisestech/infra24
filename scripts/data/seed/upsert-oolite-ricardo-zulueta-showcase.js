#!/usr/bin/env node
/**
 * Upserts Ricardo E. Zulueta showcase profile — public directory + CRM People.
 *
 * Run: node scripts/data/seed/upsert-oolite-ricardo-zulueta-showcase.js
 */
require('dotenv').config({ path: '.env.local' });

const PUBLIC_DIRECTORY_TABLE_ID = 'tblvcSA236qoUfjcv';
const CRM_PEOPLE_TABLE_ID = process.env.AIRTABLE_OOLITE_PEOPLE_TABLE_ID || 'tbltHiqscY80ybsGE';
const CRM_PEOPLE_RECORD_ID = 'recr4cXyoOpYyBSqj';
const ORG_RECORD_ID = 'recRiKB2W96uzTfY0';

const HEADSHOT =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993351/Ricardo-E.-Zulueta-headshot_2-705x705_x1q8wx.webp';

const ARTWORK_URLS = [
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862292/ricardo-zulueta-8_Cyberscape_Diptych_No.3_2024__40_x_60_archival_pigment_print-705x513_nczdw7.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862291/ricardo-zulueta-7_Cyberscape_Diptych_No.1_2024__40_x_60_archival_pigment_print-705x514_slvdpm.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862289/ricardo-zulueta-6_Cyberscape_Diptych_No.2_2024__40_x_60_archival_pigment_print-705x513_sy9uuk.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862288/ricardo-zulueta-5_I_am_Not_Your_Robot_2024_dimensions_variable_installation_view_multi_channel_HD_video-705x474_ese1rg.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862287/ricardo-zulueta-4_Networked_Gestures_v.2_2022_installation_view_at_David_Castillo_Gallery_dimensions_variable_acrylic_ink_software_on_canvas_and_video-705x470_ti2ozj.webp',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862286/ricardo-zulueta-3_Networked_Gestures_v.1_2022_dimensions_variable_installation_view_multi_channel_HD_video-1-705x470_oeenj0.jpg',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862285/ricardo-zulueta-2_GRIDS_1_3_4_2022-23_dimensions_variable_installation_view_acrylic_paint_ink_software_on_canvas-705x532_uquqyj.webp',
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862283/ricardo-zulueta-1_Speculative_Cyberscapes_v.1_2024_dimensions_variable_acrylic_paint_ink_on_canvas_printed_vinyl_and_video-705x529_x6lrgd.jpg',
];

const PUBLIC_BIO = `Ricardo E. Zulueta is an interdisciplinary artist and scholar born in Havana, Cuba and based in Miami. Zulueta holds a Ph.D. in Cinema and Media Studies and an MFA in Visual Art from the University of Miami and has served as a Helbein Scholar at New York University. His practice functions across a genealogy of mediums including video, digital imaging, photography, software, mixed-media, painting, sculpture, performance, and installation.

From early analogy large-scale photo-performance stills to more recent immersive multi-media installations, his work consistently explores the intersectionality of mediated expressions of gender, sexuality, behavior, and identity within socio-political landscapes. Through research and praxis, Zulueta examines how technology and media shape, interrogate, and subvert normative notions of identity through experimental modes of storytelling. His projects manifest a vernacular of idiosyncratic codes and symbols of disidentification often informed by film and media studies, art history, queer theory, and cultural studies.

Zulueta is a recipient of the Art Matters Fellowship, New York Foundation for the Arts Fellowship, South Florida Cultural Consortium Artist Fellowship, Cintas Foundation Artist Fellowship, Miami Individual Artist Grant, and Oolite Arts' Ellies Creator Award. His work has been exhibited internationally at venues such as the Smithsonian Institution, Washington, D.C.; Museo Alejandro Otero, Caracas; Steirischer Herbst, Graz; Dazibao Contemporary Art Center, Montreal; Museo Nacional Centro de Arte Reina Sofía, Madrid; Western Front, Vancouver; Artists Space, New York; El Museo del Barrio, New York; International Center for Photography, New York; White Columns, New York; Grey Art Museum at New York University, New York; Bronx Museum of the Arts, New York; Exit Art, New York; Fotofest Biennial, Houston, and Creative Time Summit at Perez Art Museum Miami.`;

const SHORT_AI_SUMMARY =
  'Ricardo E. Zulueta is an interdisciplinary artist and scholar based in Miami whose work spans video, digital imaging, installation, and software, exploring identity, technology, and queer storytelling through experimental media practice.';

function readEnv(key) {
  const v = process.env[key];
  return v?.trim() || undefined;
}

function airtableConfig() {
  const publicBaseId =
    readEnv('AIRTABLE_OOLITE_ALUMNI_BASE_ID') ||
    readEnv('AIRTABLE_ALUMNI_BASE_ID') ||
    readEnv('AIRTABLE_OOLITE_PROGRAMMING_BASE_ID');
  const peopleBaseId =
    readEnv('AIRTABLE_OOLITE_PROGRAMMING_BASE_ID') || publicBaseId;
  const apiKey =
    readEnv('AIRTABLE_OOLITE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_API_KEY');
  if (!publicBaseId || !peopleBaseId || !apiKey) return null;
  return { publicBaseId, peopleBaseId, apiKey };
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
      return nk === nameKey || dn === 'ricardo e. zulueta';
    });
    if (hit) return hit;
    offset = data.offset;
  } while (offset);
  return null;
}

async function upsertPublicDirectory(baseId, apiKey) {
  const publicFields = {
    'Display Name': 'Ricardo E. Zulueta',
    'Name Key': 'ricardo e zulueta',
    'Public Bio': PUBLIC_BIO,
    'Short AI Summary': SHORT_AI_SUMMARY,
    'Featured Image URL': HEADSHOT,
    'Portrait Vertical URL': HEADSHOT,
    'Portrait Landscape URL': ARTWORK_URLS[0],
    'Additional Image URLs': ARTWORK_URLS.join('\n'),
    'Website URL': 'https://www.ricardo-zulueta.com/',
    'Instagram URL': 'https://instagram.com/re_zulueta',
    'Primary Medium': 'Mixed Media',
    Topics: ['Photography', 'Installation'],
    Themes: ['Identity', 'Memory'],
    'Studio Number': '109',
    'Residency Program': 'Studio Residency',
    'Residency Category': '2026 Studio Resident · 2025 Studio Resident · 2022 Ellies Creator Award',
    'Recency Year': 2026,
    'Current / Alumni Status': 'Current Resident',
    'Public Profile Approved': true,
    'Image Review Status': 'Ready',
    'Preferred Image Orientation': 'Both Available',
    'Cloudinary Folder / Source Batch': 'ricardo-zulueta-showcase-2026',
    'Image Alt Text': 'Ricardo E. Zulueta, Oolite Arts studio resident',
    'Image Credit': 'Oolite Arts',
    'Image Source': 'Cloudinary',
    'Source Notes': 'Seeded via upsert-oolite-ricardo-zulueta-showcase.js',
    'Do Not Use in AI': false,
  };

  const existing = await findPublicDirectoryRecord(baseId, apiKey, 'ricardo e zulueta');
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

async function upsertCrmPeople(baseId, apiKey) {
  const fields = {
    'Full Name': 'Ricardo E. Zulueta',
    'Title / Role': '2026 Oolite Arts Resident Artist',
    Department: 'Artist / Resident Artist',
    Institution: [ORG_RECORD_ID],
    City: 'Miami',
    Bio: PUBLIC_BIO,
    Website: 'https://www.ricardo-zulueta.com/',
    Instagram: '@re_zulueta',
    'Image / Portrait URL': HEADSHOT,
    'Portfolio Image URLs': ARTWORK_URLS.join('\n'),
    'Practice Tags': ['Photography', 'Installation', 'Video', 'Digital Media'],
    'Public AI Approved': true,
  };

  await patchAirtableRecord(baseId, CRM_PEOPLE_TABLE_ID, apiKey, CRM_PEOPLE_RECORD_ID, fields);
  console.log(`✅ CRM People updated: ${CRM_PEOPLE_RECORD_ID}`);
}

async function main() {
  const cfg = airtableConfig();
  if (!cfg) {
    console.error('❌ Airtable not configured in .env.local');
    process.exit(1);
  }

  console.log('🎯 Upserting Ricardo E. Zulueta showcase profile…');
  const publicRecordId = await upsertPublicDirectory(cfg.publicBaseId, cfg.apiKey);
  try {
    await upsertCrmPeople(cfg.peopleBaseId, cfg.apiKey);
  } catch (e) {
    console.warn('⚠️  CRM People patch skipped:', e instanceof Error ? e.message : e);
    console.warn('   Run: npm run import:oolite-2026-cohort');
  }

  console.log('\n📋 Update lib/oolite/airtable-recognitions-config.ts:');
  console.log(`   ricardoEZulueta: '${publicRecordId}'`);
  console.log(`\n   Portrait: ${HEADSHOT}`);
  console.log(`   Artworks: ${ARTWORK_URLS.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
