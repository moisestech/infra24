#!/usr/bin/env node
/**
 * Smart-sign overlay takeover: Duval-Carrié × Guillermina De Ferrari conversation (June 25, 2026).
 *
 * Run: node scripts/data/seed/upsert-duval-conversation-takeover.js
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
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780427837/HERO_IMAGES_DUVAL_RTQ-1500x630_1_mqctsq.webp';

/** Optional vertical/smart-sign poster when available; display mode prefers this over landscape. */
const PORTRAIT_IMAGE_URL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570009/april-Oolite-Arts-Conversations_fo6v2s.jpg';

const TITLE = 'Edouard Duval-Carrié in Conversation with Guillermina De Ferrari';

const BODY = `Join us for the latest installment of Oolite Arts Conversations as Edouard Duval-Carrié and curator Guillermina De Ferrari explore Caribbean and diasporic culture.

Free tickets.`;

/** June 25, 2026, 7 – 9 p.m. Eastern */
const STARTS_AT = '2026-06-25T23:00:00.000Z';
const ENDS_AT = '2026-06-26T01:00:00.000Z';

const ROW = {
  title: TITLE,
  body: BODY,
  status: 'published',
  priority: 'high',
  tags: ['conversations', 'panel', 'june-2026', 'duval-carrie', 'signage'],
  visibility: 'public',
  type: 'event',
  sub_type: 'meeting',
  start_date: '2026-06-25',
  end_date: '2026-06-25',
  starts_at: STARTS_AT,
  ends_at: ENDS_AT,
  timezone: 'America/New_York',
  is_all_day: false,
  location: 'Oolite Arts, 924 Lincoln Rd., Miami Beach, FL 33139',
  image_url: IMAGE_URL,
  image_layout: 'hero',
  primary_link: 'https://oolitearts.org',
  additional_info: 'Free tickets',
  is_active: true,
  metadata: {
    program: 'oolite_conversations',
    display_takeover: true,
    images: {
      landscape: IMAGE_URL,
      portrait: PORTRAIT_IMAGE_URL,
    },
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
      .select('id, title, image_url, starts_at, metadata')
      .single();

    if (error) {
      console.error('Update failed:', error);
      process.exit(1);
    }

    console.log('Updated Duval conversation takeover:', data);
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
    .select('id, title, image_url, starts_at, metadata')
    .single();

  if (error) {
    console.error('Insert failed:', error);
    process.exit(1);
  }

  console.log('Created Duval conversation takeover:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
