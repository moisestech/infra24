/**
 * Sets public-facing dates on Oolite 2026 Studio Resident announcement cards.
 *
 * Updates start_date + starts_at only (not created_at / updated_at).
 * Normalizes three title spellings to canonical Airtable names.
 *
 * Run: node scripts/data/seed/update-oolite-studio-resident-announcement-dates-2026.js
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

const DISPLAY_DATE = '2026-01-01';
const STARTS_AT = '2026-01-01T12:00:00.000Z';
const TITLE_PREFIX = 'Studio Resident — ';

/** canonical title → legacy CMS titles that may exist in DB */
const RESIDENTS = [
  { canonical: 'Gonzalo Hernandez' },
  { canonical: 'Ana Mosquera' },
  { canonical: 'Diego Gabaldon' },
  { canonical: 'Sheherazade Thénard', legacy: ['Sheherazade Thenard'] },
  { canonical: 'José Delgado Zúñiga' },
  { canonical: 'Bex McCharen' },
  { canonical: 'Shayla Marshall' },
  { canonical: 'Pangea Kali Virga' },
  { canonical: 'Ricardo E. Zulueta' },
  { canonical: 'Sepideh Kalani' },
  { canonical: 'Nadia Wolff', legacy: ['Nadia Wolf'] },
  { canonical: 'Genesis Moreno' },
  { canonical: 'Lucía Morales', legacy: ['Lucia Morales'] },
];

function titlesForResident(row) {
  const titles = [`${TITLE_PREFIX}${row.canonical}`];
  for (const alt of row.legacy || []) {
    titles.push(`${TITLE_PREFIX}${alt}`);
  }
  return titles;
}

async function main() {
  console.log('📅 Updating Studio Resident announcement display dates…');

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgErr || !org) {
    console.error('❌ Organization oolite not found:', orgErr);
    process.exit(1);
  }

  const allTitles = RESIDENTS.flatMap(titlesForResident);

  const { data: beforeRows, error: fetchErr } = await supabase
    .from('announcements')
    .select('id, title, start_date, starts_at, created_at, updated_at')
    .eq('org_id', org.id)
    .in('title', allTitles)
    .order('title');

  if (fetchErr) {
    console.error('❌ Fetch failed:', fetchErr.message);
    process.exit(1);
  }

  console.log('\n── Before ──');
  console.table(
    (beforeRows || []).map((r) => ({
      id: r.id,
      title: r.title,
      start_date: r.start_date,
      starts_at: r.starts_at,
      created_at: r.created_at,
    }))
  );

  const updated = [];

  for (const resident of RESIDENTS) {
    const canonicalTitle = `${TITLE_PREFIX}${resident.canonical}`;
    const matchTitles = titlesForResident(resident);
    const row = (beforeRows || []).find((r) => matchTitles.includes(r.title));

    if (!row) {
      console.warn(`⚠️  No row found for ${resident.canonical}`);
      continue;
    }

    const patch = {
      start_date: DISPLAY_DATE,
      starts_at: STARTS_AT,
      updated_by: 'system_oolite',
    };
    if (row.title !== canonicalTitle) {
      patch.title = canonicalTitle;
    }

    const { error: upErr } = await supabase
      .from('announcements')
      .update(patch)
      .eq('id', row.id);

    if (upErr) {
      console.error(`❌ Update failed for ${row.title}:`, upErr.message);
      process.exit(1);
    }

    updated.push({
      id: row.id,
      title_before: row.title,
      title_after: canonicalTitle,
      start_date_before: row.start_date,
      starts_at_before: row.starts_at,
      start_date_after: DISPLAY_DATE,
      starts_at_after: STARTS_AT,
    });
    console.log(`✅ ${row.title}${row.title !== canonicalTitle ? ` → ${canonicalTitle}` : ''}`);
  }

  const { data: afterRows, error: verifyErr } = await supabase
    .from('announcements')
    .select('id, title, start_date, starts_at, created_at')
    .eq('org_id', org.id)
    .in(
      'title',
      RESIDENTS.map((r) => `${TITLE_PREFIX}${r.canonical}`)
    )
    .order('title');

  if (verifyErr) {
    console.error('❌ Verification fetch failed:', verifyErr.message);
    process.exit(1);
  }

  console.log('\n── Summary ──');
  console.log('Table: announcements');
  console.log('Date fields updated: start_date, starts_at');
  console.log(`Records updated: ${updated.length}`);

  console.log('\n── After ──');
  console.table(
    (afterRows || []).map((r) => ({
      id: r.id,
      title: r.title,
      start_date: r.start_date,
      starts_at: r.starts_at,
      created_at: r.created_at,
    }))
  );

  if (afterRows?.length !== RESIDENTS.length) {
    console.warn(
      `⚠️  Expected ${RESIDENTS.length} rows after update, found ${afterRows?.length ?? 0}`
    );
    process.exit(1);
  }

  console.log('\n🎉 Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
