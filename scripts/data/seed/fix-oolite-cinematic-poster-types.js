/**
 * One-off: set film-poster announcements to type = cinematic for Oolite.
 * Requires migrations through 20260409130000_announcements_type_cinematic.sql
 * (check constraint must allow 'cinematic').
 *
 * Run: node scripts/data/seed/fix-oolite-cinematic-poster-types.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TITLES = [
  'Dual Citizen',
  'The Floor Remembers',
  'Old Man and the Parrot',
  'Tropical Park',
  'Colada',
];

async function main() {
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'oolite')
    .single();

  if (orgErr || !org) {
    console.error('Oolite org not found:', orgErr);
    process.exit(1);
  }

  const { data, error } = await supabase
    .from('announcements')
    .update({ type: 'cinematic', updated_at: new Date().toISOString() })
    .or(`org_id.eq.${org.id},organization_id.eq.${org.id}`)
    .in('title', TITLES)
    .select('id, title, type');

  if (error) {
    console.error('Update failed:', error.message);
    console.error(
      'If you see a check constraint error, apply Supabase migrations through 20260409130000_announcements_type_cinematic.sql first.'
    );
    process.exit(1);
  }

  console.log('Updated rows:', data?.length ?? 0);
  (data || []).forEach((r) => console.log(`  - ${r.title} -> ${r.type}`));
}

main();
