#!/usr/bin/env node
/**
 * Smart-sign + public announcements for Oolite promotion stack:
 * - 2027 Open Calls (Apply Now)
 * - From Within exhibition (on view hero)
 *
 * Also run after programming import:
 *   npx tsx scripts/import-oolite-programming.ts
 *   node scripts/data/seed/upsert-new-home-takeover.js
 *
 * Run: node scripts/data/seed/upsert-oolite-promotion-announcements.js
 */
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ELLIES_OPEN_CALLS = 'https://oolitearts.org/ellies-open-calls/';
const SUBMITTABLE = 'https://oolitearts.submittable.com/submit';
const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://oolitearts.org').replace(/\/$/, '');
const GET_INVOLVED_URL = `${SITE_BASE}/o/oolite/get-involved`;

const ANNOUNCEMENTS = [
  {
    key: 'open-calls-2027',
    title: 'Apply Now — 2027 Open Calls',
    body: `Applications open for 2027 opportunities
June 1 – July 31, 2026

The Ellies · Studio Residency · Home + Away · Cinematic Residency`,
    status: 'published',
    priority: 'high',
    tags: ['open-call', 'ellies', 'residency', '2027', 'signage'],
    visibility: 'public',
    type: 'opportunity',
    sub_type: 'open_call',
    start_date: '2026-06-01',
    end_date: '2026-07-31',
    starts_at: '2026-06-01T04:00:00.000Z',
    ends_at: '2026-08-01T03:59:59.000Z',
    timezone: 'America/New_York',
    is_all_day: true,
    location: 'Apply online · Submittable',
    image_url:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968673/january-ellies-2026_xtllmg.gif',
    image_layout: 'hero',
    primary_link: SUBMITTABLE,
    qr_destination_url: ELLIES_OPEN_CALLS,
    rsvp_label: 'Apply Now',
    rsvp_url: SUBMITTABLE,
    is_active: true,
    metadata: {
      program: 'open_calls_2027',
      display_takeover: true,
      takeover_mode: 'overlay',
      media_type: 'image',
      takeover_qr: 'app',
      show_view_details: true,
      pin_order: 1,
      takeover_overlay: {
        show_date: true,
        show_title: true,
        show_body: true,
        show_location: false,
        show_people: false,
        show_type_badge: true,
        show_qr: true,
        scrim: 'gradient',
      },
    },
  },
  {
    key: 'from-within-exhibition',
    title: 'From Within',
    body: `On View · July 8 – Oct. 4, 2026

Youth Artist Residents at the Oolite Arts Vitrine — Ana Blanco, Noa Garcia, Emely Yanji, Melina Walsh, and TJ Wright.

924 Lincoln Rd., Miami Beach`,
    status: 'published',
    priority: 'high',
    tags: ['exhibition', 'youth residents', 'vitrine', 'from-within', 'signage'],
    visibility: 'public',
    type: 'event',
    sub_type: 'exhibition',
    start_date: '2026-07-08',
    end_date: '2026-10-04',
    starts_at: '2026-07-08T04:00:00.000Z',
    ends_at: '2026-10-05T03:59:59.000Z',
    timezone: 'America/New_York',
    is_all_day: true,
    location: 'Oolite Arts Vitrine, 924 Lincoln Rd., Miami Beach, FL 33139',
    image_url:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780505821/teens-resident-TJ-PHOTO-scaled_diiopj.jpg',
    image_layout: 'hero',
    primary_link: 'https://oolitearts.org',
    qr_destination_url: GET_INVOLVED_URL.startsWith('http') ? GET_INVOLVED_URL : ELLIES_OPEN_CALLS,
    is_active: true,
    metadata: {
      program: 'from_within',
      display_takeover: true,
      takeover_mode: 'overlay',
      media_type: 'image',
      takeover_qr: 'app',
      show_view_details: true,
      pin_order: 3,
      takeover_overlay: {
        show_date: true,
        show_title: true,
        show_body: true,
        show_location: true,
        show_people: false,
        show_type_badge: true,
        show_qr: true,
        scrim: 'gradient',
      },
    },
  },
];

async function findExisting(orgId, row) {
  const { data: byTitle } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('org_id', orgId)
    .eq('title', row.title)
    .maybeSingle();
  if (byTitle) return byTitle;

  const { data: byImage } = await supabase
    .from('announcements')
    .select('id, title')
    .eq('org_id', orgId)
    .eq('image_url', row.image_url)
    .maybeSingle();
  return byImage;
}

async function main() {
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'oolite')
    .maybeSingle();

  if (orgError || !organization?.id) {
    console.warn('⚠️  Organization oolite not found — skipping announcements (run against prod Supabase)');
    console.warn(orgError?.message || 'No org row');
    process.exit(0);
  }

  const orgId = organization.id;
  const now = new Date().toISOString();

  for (const row of ANNOUNCEMENTS) {
    const { key, metadata: rowMetadata, ...payload } = row;
    const existing = await findExisting(orgId, row);

    if (existing) {
      const { data: existingRow } = await supabase
        .from('announcements')
        .select('metadata')
        .eq('id', existing.id)
        .single();

      const mergedMetadata = {
        ...(existingRow?.metadata && typeof existingRow.metadata === 'object'
          ? existingRow.metadata
          : {}),
        ...(rowMetadata || {}),
      };

      const { data, error } = await supabase
        .from('announcements')
        .update({
          ...payload,
          metadata: mergedMetadata,
          updated_at: now,
          updated_by: 'system_oolite',
          published_at: now,
        })
        .eq('id', existing.id)
        .select('id, title, primary_link, metadata')
        .single();

      if (error) {
        console.error(`Update failed (${key}):`, error);
        process.exit(1);
      }
      console.log(`✅ Updated ${key}:`, data?.id);
      continue;
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...payload,
        metadata: rowMetadata || {},
        organization_id: orgId,
        org_id: orgId,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        published_at: now,
      })
      .select('id, title, primary_link, metadata')
      .single();

    if (error) {
      console.error(`Insert failed (${key}):`, error);
      process.exit(1);
    }
    console.log(`✅ Created ${key}:`, data?.id);
  }

  console.log('\n📋 Next: npx tsx scripts/import-oolite-programming.ts');
  console.log('   node scripts/data/seed/upsert-new-home-takeover.js');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
