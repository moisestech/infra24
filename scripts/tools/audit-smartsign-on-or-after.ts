/**
 * Audit smart-sign pool: relevance filter, images, newsletter alignment.
 *
 *   npx tsx scripts/tools/audit-smartsign-on-or-after.ts --org=oolite
 *   npx tsx scripts/tools/audit-smartsign-on-or-after.ts --org=oolite --today=2026-05-20
 */

import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Announcement } from '@/types/announcement';
import {
  announcementStartDateKey,
  announcementEndDateKey,
  filterAnnouncementsRelevantForDisplay,
  filterAnnouncementsOnOrAfterDate,
} from '@/lib/display/announcement-month';
import { isClassOrWorkshopAnnouncement } from '@/lib/display/workshop-announcements-merge';

config({ path: path.resolve(process.cwd(), '.env.local') });

function parseArgs() {
  let org = 'oolite';
  let today = '';
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--org=')) org = a.slice(6).trim();
    else if (a.startsWith('--today=')) today = a.slice(8).trim();
  }
  return { org, today };
}

function rowToAnnouncement(row: Record<string, unknown>): Announcement {
  const tags = Array.isArray(row.tags) ? (row.tags as string[]) : [];
  return {
    id: String(row.id),
    org_id: String(row.org_id ?? ''),
    author_clerk_id: String(row.author_clerk_id ?? ''),
    title: String(row.title ?? ''),
    media: [],
    tags,
    status: 'published',
    priority: typeof row.priority === 'number' ? row.priority : 0,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    body: String(row.body ?? row.content ?? ''),
    additional_info: row.additional_info as string | undefined,
    image_url: row.image_url as string | undefined,
    type: (row.type as Announcement['type']) || 'news',
    sub_type: row.sub_type as Announcement['sub_type'],
    starts_at: row.starts_at as string | undefined,
    ends_at: row.ends_at as string | undefined,
    start_date: row.start_date as string | undefined,
    end_date: row.end_date as string | undefined,
    scheduled_at: row.scheduled_at as string | undefined,
    metadata: row.metadata as Announcement['metadata'],
  } as Announcement;
}

async function main() {
  const { org, today } = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || !key?.trim()) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: organization, error: orgErr } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', org)
    .single();

  if (orgErr || !organization) {
    console.error('Organization not found:', orgErr?.message ?? org);
    process.exit(1);
  }

  const { data: rows, error: annErr } = await supabase
    .from('announcements')
    .select(
      'id, title, body, content, type, sub_type, tags, starts_at, ends_at, start_date, end_date, scheduled_at, created_at, is_active, additional_info, metadata, image_url'
    )
    .eq('org_id', organization.id)
    .eq('is_active', true);

  if (annErr) {
    console.error('Failed to load announcements:', annErr.message);
    process.exit(1);
  }

  const active = (rows || []).map((r) => rowToAnnouncement(r as Record<string, unknown>));
  const todayKey = today || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
  const relevant = filterAnnouncementsRelevantForDisplay(active, todayKey);
  const legacyFloor = filterAnnouncementsOnOrAfterDate(active, '2026-05-20');

  const missingImageActive = active.filter((a) => !a.image_url?.trim());
  const missingImageRelevant = relevant.filter((a) => !a.image_url?.trim());

  console.log(`\nOrg: ${organization.name} (${organization.slug})`);
  console.log(`Reference date (America/New_York): ${todayKey}`);
  console.log(`Active announcements: ${active.length}`);
  console.log(`SmartSign pool (on-view OR upcoming): ${relevant.length}`);
  console.log(`Legacy May 20 start floor (old rule): ${legacyFloor.length}`);
  console.log(`Active missing image_url: ${missingImageActive.length}`);
  console.log(`SmartSign pool missing image_url: ${missingImageRelevant.length}`);

  if (missingImageActive.length > 0) {
    console.log('\n--- ACTIVE WITHOUT IMAGE ---');
    for (const a of missingImageActive) {
      console.log(`  ${a.title}`);
    }
  }

  console.log('\n--- SMART SIGN CAROUSEL POOL ---');
  const sortFn = (a: Announcement, b: Announcement) => {
    const sa = announcementStartDateKey(a) || announcementEndDateKey(a) || '';
    const sb = announcementStartDateKey(b) || announcementEndDateKey(b) || '';
    return sa.localeCompare(sb);
  };
  for (const a of [...relevant].sort(sortFn)) {
    const start = announcementStartDateKey(a) || '?';
    const end = announcementEndDateKey(a) || '—';
    const img = a.image_url?.trim() ? 'img' : 'NO IMG';
    console.log(`${start} → ${end} | ${img} | ${a.title}`);
  }

  const workshopInPool = relevant.filter(isClassOrWorkshopAnnouncement);
  console.log(`\nWorkshop/class rows in SmartSign pool: ${workshopInPool.length}`);

  const NEWSLETTER_NEEDLES = [
    'Crossing the Bridge Alumni Exhibition',
    'Introducing Oolite Arts Conversations',
    'Antoni Miralda',
    'Oolite Arts On the Move',
    'Skills: The Path to Public Art',
    'Mark Delmont: For a Lifetime',
    'Beatriz Chachamovits',
    'Walking Tour + Opening Reception',
    'Crossing the Bridge Panel Discussion',
    'Zinc Plate Lithography',
  ];

  console.log('\n--- NEWSLETTER FEATURES vs SMART SIGN ---');
  for (const needle of NEWSLETTER_NEEDLES) {
    const row = active.find((a) => a.title.includes(needle));
    if (!row) {
      console.log(`MISSING IN DB: ${needle}`);
      continue;
    }
    const inPool = relevant.some((a) => a.id === row.id);
    console.log(`${inPool ? '✓' : '✗'} ${needle}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
