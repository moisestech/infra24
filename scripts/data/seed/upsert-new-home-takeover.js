#!/usr/bin/env node
/**
 * Smart-sign overlay takeover: Our New Home (Little River campus).
 *
 * Run: node scripts/data/seed/upsert-new-home-takeover.js
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

const IMAGE_URL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1779991830/20220315_AMICON_OA_V4_5400px_02-scaled-1X-1500x630_q0v05r.png';

const TITLE = 'Our New Home';

const BODY = `Oolite Arts acquired a new home in the city of Miami so that we can expand to meet the needs of Miami's growing visual arts community. After years of planning, the countdown to our new campus officially kicked off.`;

const ROW = {
  title: TITLE,
  body: BODY,
  status: 'published',
  priority: 'high',
  tags: ['campus', 'expansion', 'little-river', 'signage'],
  visibility: 'public',
  type: 'news',
  sub_type: 'general',
  image_url: IMAGE_URL,
  image_layout: 'hero',
  primary_link: 'https://oolitearts.org/our-new-home/',
  is_active: true,
  metadata: {
    program: 'new_campus',
    display_takeover: true,
    evergreen: true,
    takeover_mode: 'overlay',
    media_type: 'image',
    takeover_qr: 'app',
    show_view_details: true,
    pin_order: 2,
    takeover_overlay: {
      show_date: false,
      show_title: true,
      show_body: true,
      show_location: false,
      show_people: false,
      show_type_badge: false,
      show_qr: true,
      scrim: 'gradient',
    },
  },
};

async function main() {
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', 'oolite')
    .single();

  if (orgError || !organization) {
    console.error('Organization oolite not found:', orgError);
    process.exit(1);
  }

  const orgId = organization.id;
  const now = new Date().toISOString();

  const { data: byImage } = await supabase
    .from('announcements')
    .select('id, title, metadata')
    .eq('org_id', orgId)
    .eq('image_url', IMAGE_URL)
    .maybeSingle();

  const { data: byTitle } = await supabase
    .from('announcements')
    .select('id, title, metadata')
    .eq('org_id', orgId)
    .eq('title', TITLE)
    .maybeSingle();

  const existing = byImage || byTitle;

  if (existing) {
    const mergedMetadata = {
      ...(existing.metadata && typeof existing.metadata === 'object' ? existing.metadata : {}),
      ...ROW.metadata,
    };

    const { data, error } = await supabase
      .from('announcements')
      .update({
        ...ROW,
        metadata: mergedMetadata,
        updated_at: now,
        updated_by: 'system_oolite',
        published_at: now,
      })
      .eq('id', existing.id)
      .select('id, title, image_url, metadata')
      .single();

    if (error) {
      console.error('Update failed:', error);
      process.exit(1);
    }

    console.log('Updated Our New Home takeover:', data);
    return;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      ...ROW,
      organization_id: orgId,
      org_id: orgId,
      author_clerk_id: 'system_oolite',
      created_by: 'system_oolite',
      updated_by: 'system_oolite',
      published_at: now,
    })
    .select('id, title, image_url, metadata')
    .single();

  if (error) {
    console.error('Insert failed:', error);
    process.exit(1);
  }

  console.log('Created Our New Home takeover:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
