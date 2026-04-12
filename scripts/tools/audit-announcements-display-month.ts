/**
 * Read announcements from Supabase, classify by display month + workshop merge rules, print a report.
 * Optionally deactivate non-target-month rows (workshop + artist/resident listing rows are never touched).
 *
 * Dry run:
 *   npx tsx scripts/tools/audit-announcements-display-month.ts --org=oolite --month=2026-04
 *
 * Apply (sets is_active = false where month !== target and row is not workshop-like; skips unknown month):
 *   npx tsx scripts/tools/audit-announcements-display-month.ts --org=oolite --month=2026-04 --apply
 *
 * Env: `.env.local` with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Announcement } from '@/types/announcement';
import { announcementDisplayMonthKey } from '@/lib/display/announcement-month';
import { isAnnouncementSkippedForNonTargetMonthDeactivation } from '@/lib/display/announcement-deactivate-guards';

config({ path: path.resolve(process.cwd(), '.env.local') });

function parseArgs() {
  let org = 'oolite';
  let month = '2026-04';
  let apply = false;
  for (const a of process.argv.slice(2)) {
    if (a === '--apply') apply = true;
    else if (a.startsWith('--org=')) org = a.slice(6).trim();
    else if (a.startsWith('--month=')) month = a.slice(8).trim();
  }
  return { org, month, apply };
}

function snippet(text: string | null | undefined, max = 140): string {
  if (!text) return '';
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
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
  const { org, month, apply } = parseArgs();
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
      'id, title, body, content, type, sub_type, tags, starts_at, ends_at, start_date, end_date, scheduled_at, created_at, is_active, metadata'
    )
    .eq('org_id', organization.id);

  if (annErr) {
    console.error('Failed to load announcements:', annErr.message);
    process.exit(1);
  }

  const list = (rows || []) as Record<string, unknown>[];
  console.log(`\nOrg: ${organization.name} (${organization.slug})`);
  console.log(`Target month: ${month}`);
  console.log(`Rows: ${list.length}\n`);

  const lines: string[] = [
    ['id', 'active', 'month_key', 'protected_ws_artist', 'type', 'title', 'description_snip'].join('\t'),
  ];

  const toDeactivate: string[] = [];

  for (const row of list) {
    const a = rowToAnnouncement(row);
    const mk = announcementDisplayMonthKey(a);
    const prot = isAnnouncementSkippedForNonTargetMonthDeactivation(a);
    const active = row.is_active !== false;
    const title = a.title.replace(/\t/g, ' ');
    const desc = snippet((row.body as string) || (row.content as string) || '');
    lines.push(
      [a.id, active ? '1' : '0', mk ?? '', prot ? '1' : '0', String(a.type ?? ''), title, desc.replace(/\t/g, ' ')].join(
        '\t'
      )
    );

    if (!active) continue;
    if (prot) continue;
    if (mk == null) continue;
    if (mk !== month) toDeactivate.push(a.id);
  }

  console.log(lines.join('\n'));

  console.log(`\n--- Summary ---`);
  console.log(`Active, not protected (workshop/artist), month !== ${month} (candidates for deactivate): ${toDeactivate.length}`);
  const unknown = list.filter((r) => {
    const a = rowToAnnouncement(r);
    return announcementDisplayMonthKey(a) == null && r.is_active !== false;
  }).length;
  console.log(`Active with unknown month key (not auto-deactivated): ${unknown}`);

  if (!apply) {
    console.log('\nDry run only. Pass --apply to set is_active = false on candidates.');
    return;
  }

  if (toDeactivate.length === 0) {
    console.log('\nNothing to deactivate.');
    return;
  }

  const { error: upErr } = await supabase.from('announcements').update({ is_active: false }).in('id', toDeactivate);

  if (upErr) {
    console.error('Update failed:', upErr.message);
    process.exit(1);
  }

  console.log(`\nDeactivated ${toDeactivate.length} announcement(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
