/**
 * Upsert Oolite Spring 2026 adult studio class announcements from
 * data/oolite/adult-art-classes-spring-2026.json (same source as workshop seed).
 *
 * Run after seed-oolite-workshops-catalog.js so workshop rows exist.
 * Run: node scripts/data/seed/upsert-oolite-adult-art-classes-spring-2026.js
 */
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DATA_PATH = path.join(
  __dirname,
  '../../../data/oolite/adult-art-classes-spring-2026.json'
);

/** Eastern (America/New_York) one-day starts for carousel sorting */
const STARTS_AT_BY_SLUG = {
  'collage-as-symbol-spring-2026': '2026-04-09T22:00:00.000Z',
  'vibe-coding-net-art-spring-2026': '2026-04-25T18:00:00.000Z',
  'stitched-memories-bookmaking-spring-2026': '2026-05-02T14:00:00.000Z',
};

const OOLITE_LOCATION =
  'Oolite Arts, 924 Lincoln Rd., Studio 100, Miami, FL 33139';

function loadItems() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  if (!data.workshops || !Array.isArray(data.workshops)) {
    throw new Error('adult-art-classes JSON must contain workshops array');
  }
  return data.workshops;
}

function buildBody(entry) {
  const parts = [];
  if (entry.content) parts.push(entry.content.trim());
  if (entry.schedule) parts.push(entry.schedule.trim());
  return parts.join('\n\n');
}

function buildAnnouncementRow(organization, entry) {
  const meta = entry.metadata || {};
  const slug = meta.slug;
  if (!slug) {
    throw new Error(`Missing metadata.slug for ${entry.title}`);
  }

  const title = meta.announcement_title || entry.title;
  const image_url = entry.image_url && String(entry.image_url).trim();
  if (!image_url) {
    throw new Error(`Missing image_url for announcement: ${title}`);
  }

  const extra = entry.announcement_extra || {};
  const discipline = meta.discipline || 'studio';
  const format = meta.format || 'multi_week';

  const tags = new Set([
    'adult-art-classes',
    discipline,
    format,
    'spring-2026',
  ]);
  if (Array.isArray(extra.tags)) {
    extra.tags.forEach((t) => tags.add(t));
  }

  const now = new Date().toISOString();

  return {
    organization_id: organization.id,
    org_id: organization.id,
    author_clerk_id: 'system_oolite',
    created_by: 'system_oolite',
    updated_by: 'system_oolite',
    title,
    body: buildBody(entry),
    status: 'published',
    priority: extra.priority || 'normal',
    tags: Array.from(tags),
    visibility: 'public',
    type: 'event',
    sub_type: 'workshop',
    start_date: entry.start_date || null,
    end_date: entry.end_date || null,
    starts_at: STARTS_AT_BY_SLUG[slug] || null,
    location: OOLITE_LOCATION,
    image_url,
    image_layout: 'card',
    primary_link: extra.primary_link || null,
    is_active: true,
    published_at: now,
    metadata: {
      program: 'adult_art_classes',
      workshop_slug: slug,
      discipline,
      format,
    },
  };
}

async function main() {
  const items = loadItems();
  console.log('Loaded', items.length, 'adult class rows from JSON');

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('Organization oolite not found:', orgError);
    process.exit(1);
  }

  const rows = items.map((entry) => buildAnnouncementRow(organization, entry));

  const missing = rows.filter((r) => !r.image_url);
  if (missing.length) {
    throw new Error(
      `Missing image_url: ${missing.map((m) => m.title).join(', ')}`
    );
  }

  const titles = rows.map((r) => r.title);
  const { data: existingAnnouncements } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('org_id', organization.id)
    .in('title', titles);

  const existingByTitle = new Map();
  (existingAnnouncements || []).forEach((a) =>
    existingByTitle.set(a.title, a.id)
  );

  const toUpdate = [];
  const toInsert = [];
  for (const row of rows) {
    const id = existingByTitle.get(row.title);
    if (id) toUpdate.push({ id, ...row });
    else toInsert.push(row);
  }

  if (toUpdate.length) {
    console.log('Updating', toUpdate.length, 'announcements…');
    for (const ann of toUpdate) {
      const { id, ...data } = ann;
      const { error } = await supabase
        .from('announcements')
        .update(data)
        .eq('id', id);
      if (error) {
        console.error('Update failed:', ann.title, error);
      } else {
        console.log('Updated:', ann.title);
      }
    }
  }

  if (toInsert.length) {
    console.log('Inserting', toInsert.length, 'announcements…');
    const { data: created, error } = await supabase
      .from('announcements')
      .insert(toInsert)
      .select('id, title');
    if (error) {
      console.error('Insert failed:', error);
      process.exit(1);
    }
    (created || []).forEach((c) => console.log('Created:', c.title));
  }

  console.log('Done. View /o/oolite/announcements');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
