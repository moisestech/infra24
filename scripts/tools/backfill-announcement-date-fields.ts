/**
 * Mirror starts_at / ends_at into start_date / end_date where missing.
 *
 * Dry run:
 *   npx tsx scripts/tools/backfill-announcement-date-fields.ts --org=oolite
 *
 * Apply:
 *   npx tsx scripts/tools/backfill-announcement-date-fields.ts --org=oolite --apply
 */

import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SMART_SIGN_DISPLAY_TIMEZONE } from '@/lib/display/announcement-month';

config({ path: path.resolve(process.cwd(), '.env.local') });

function parseArgs() {
  let org = 'oolite';
  let apply = false;
  for (const a of process.argv.slice(2)) {
    if (a === '--apply') apply = true;
    else if (a.startsWith('--org=')) org = a.slice(6).trim();
  }
  return { org, apply };
}

function dateFieldFromIso(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: SMART_SIGN_DISPLAY_TIMEZONE }).format(d);
  return `${ymd}T00:00:00.000Z`;
}

async function main() {
  const { org, apply } = parseArgs();
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

  const { data: rows, error } = await supabase
    .from('announcements')
    .select('id, title, starts_at, ends_at, start_date, end_date, is_active')
    .eq('org_id', organization.id);

  if (error) {
    console.error('Failed to load announcements:', error.message);
    process.exit(1);
  }

  const updates: Array<{ id: string; title: string; patch: Record<string, string> }> = [];

  for (const row of rows || []) {
    const patch: Record<string, string> = {};
    const startFrom = dateFieldFromIso(row.starts_at as string | null);
    const endFrom = dateFieldFromIso(row.ends_at as string | null);

    if (!row.start_date && startFrom) patch.start_date = startFrom;
    if (!row.end_date && endFrom) patch.end_date = endFrom;

    if (Object.keys(patch).length > 0) {
      updates.push({ id: String(row.id), title: String(row.title), patch });
    }
  }

  console.log(`\nOrg: ${organization.name} (${organization.slug})`);
  console.log(`Rows scanned: ${rows?.length ?? 0}`);
  console.log(`Need date backfill: ${updates.length}\n`);

  for (const u of updates) {
    console.log(`${u.title}`);
    console.log(`  → ${JSON.stringify(u.patch)}`);
  }

  if (!apply) {
    console.log('\nDry run only. Pass --apply to write changes.');
    return;
  }

  if (updates.length === 0) {
    console.log('\nNothing to update.');
    return;
  }

  let ok = 0;
  for (const u of updates) {
    const { error: upErr } = await supabase.from('announcements').update(u.patch).eq('id', u.id);
    if (upErr) {
      console.error(`Failed ${u.title}:`, upErr.message);
    } else {
      ok += 1;
    }
  }

  console.log(`\nUpdated ${ok}/${updates.length} announcement(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
