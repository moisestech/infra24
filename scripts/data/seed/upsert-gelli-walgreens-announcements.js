#!/usr/bin/env node
/**
 * Upsert Gelli Plate workshop + Walgreens Windows June 3 event announcements.
 *
 * Run: node scripts/data/seed/upsert-gelli-walgreens-announcements.js
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

const OOLITE_LOCATION = 'Oolite Arts, 924 Lincoln Rd., Studio 100, Miami, FL 33139';

const ANNOUNCEMENTS = [
  {
    key: 'gelli-plate-printmaking',
    title: 'Gelli Plate Printmaking One-Day Workshop',
    body: `One-day printmaking workshop at Oolite Arts.

Saturday, May 30, 2026
10:30 a.m. – 3:30 p.m.`,
    status: 'published',
    priority: 'high',
    tags: ['workshop', 'printmaking', 'gelli-plate', 'may-2026'],
    visibility: 'public',
    type: 'event',
    sub_type: 'workshop',
    start_date: '2026-05-30',
    end_date: '2026-05-30',
    starts_at: '2026-05-30T14:30:00.000Z',
    ends_at: '2026-05-30T19:30:00.000Z',
    timezone: 'America/New_York',
    is_all_day: false,
    location: OOLITE_LOCATION,
    image_url:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779992578/Gelli-Plate-Printmaking-705x529_kjrine.jpg',
    image_layout: 'card',
    primary_link: 'https://oolitearts.org/event/gelli-plate-printmaking-2/',
    qr_destination_url: 'https://oolitearts.org/event/gelli-plate-printmaking-2/',
    is_active: true,
  },
  {
    key: 'walgreens-windows-june-3',
    title: 'Walgreens Windows Currents: Labor, Drift, and Collective Navigation',
    body: `Walking Tour + Opening Reception

Celebrate the opening of Walgreens Windows Currents featuring Beatriz Chachamovits and Mark Delmont.

6 – 7 p.m.: Walking Tour, beginning at 74th and Collins Ave. and ending at 67th and Collins Ave.
7 – 9 p.m.: Reception at Normans Tavern, 6770 Collins Ave., Miami Beach`,
    status: 'published',
    priority: 'high',
    tags: ['tour', 'reception', 'windows-walgreens', 'june-2026', 'signage'],
    visibility: 'public',
    type: 'event',
    sub_type: 'general',
    start_date: '2026-06-03',
    end_date: '2026-06-03',
    starts_at: '2026-06-03T22:00:00.000Z',
    ends_at: '2026-06-04T01:00:00.000Z',
    timezone: 'America/New_York',
    is_all_day: false,
    location:
      'Walking tour: 74th & Collins Ave. to 67th & Collins Ave.; Reception: Normans Tavern, 6770 Collins Ave., Miami Beach',
    image_url:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779992603/walgreens_windows_june_3-1500x630_wja8ub.png',
    image_layout: 'hero',
    primary_link: 'https://oolitearts.org',
    qr_destination_url: 'https://oolitearts.org',
    rsvp_label: 'RSVP Now',
    rsvp_url: 'https://oolitearts.org',
    is_active: true,
    metadata: {
      program: 'windows_walgreens',
      display_takeover: true,
      takeover_mode: 'overlay',
      media_type: 'image',
      takeover_qr: 'app',
      show_view_details: true,
      pin_order: 4,
      takeover_overlay: {
        show_date: true,
        show_title: true,
        show_body: true,
        show_location: false,
        show_people: false,
        show_type_badge: false,
        show_qr: true,
        scrim: 'gradient',
      },
    },
    /** Match legacy row if present */
    legacyTitleNeedle: 'Walgreens Windows Currents',
  },
];

async function findExisting(orgId, row) {
  const { data: byImage } = await supabase
    .from('announcements')
    .select('id, title, image_url')
    .eq('org_id', orgId)
    .eq('image_url', row.image_url)
    .maybeSingle();

  if (byImage) return byImage;

  const { data: byTitle } = await supabase
    .from('announcements')
    .select('id, title, image_url')
    .eq('org_id', orgId)
    .eq('title', row.title)
    .maybeSingle();

  if (byTitle) return byTitle;

  if (row.legacyTitleNeedle) {
    const { data: legacyRows } = await supabase
      .from('announcements')
      .select('id, title, image_url')
      .eq('org_id', orgId)
      .ilike('title', `%${row.legacyTitleNeedle}%`);

    if (legacyRows?.length === 1) return legacyRows[0];
    if (legacyRows?.length > 1) {
      const tour = legacyRows.find((r) => /walking tour/i.test(r.title || ''));
      if (tour) return tour;
    }
  }

  return null;
}

async function main() {
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('Organization oolite not found:', orgError);
    process.exit(1);
  }

  const orgId = organization.id;
  const now = new Date().toISOString();

  for (const row of ANNOUNCEMENTS) {
    const { key, legacyTitleNeedle: _legacy, metadata: rowMetadata, ...payload } = row;
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
        .select('id, title, starts_at, ends_at, image_url, status, metadata')
        .single();

      if (error) {
        console.error(`Update failed (${key}):`, error);
        process.exit(1);
      }
      console.log(`Updated ${key}:`, data);
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
      .select('id, title, starts_at, ends_at, image_url, status, metadata')
      .single();

    if (error) {
      console.error(`Insert failed (${key}):`, error);
      process.exit(1);
    }
    console.log(`Created ${key}:`, data);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
