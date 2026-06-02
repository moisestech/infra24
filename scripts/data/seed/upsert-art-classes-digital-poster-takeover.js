#!/usr/bin/env node
/**
 * Pin the Adult Art Classes digital poster as the first smart-sign takeover slide.
 *
 * Run: node scripts/data/seed/upsert-art-classes-digital-poster-takeover.js
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
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1779989115/Art-Classes-Digital-Poster_ltqgre.jpg';

const POSTER_ROW = {
  title: 'Adult Art Classes',
  body:
    'Spring adult studio classes at Oolite Arts — collage, net art, bookmaking, and more. Scan for details or visit oolitearts.org.',
  status: 'published',
  priority: 'urgent',
  tags: ['adult-art-classes', 'promotion', 'spring-2026', 'signage'],
  visibility: 'public',
  type: 'promotion',
  sub_type: 'general',
  image_url: IMAGE_URL,
  image_layout: 'hero',
  primary_link: 'https://oolitearts.org/workshops',
  is_active: true,
  metadata: {
    program: 'adult_art_classes',
    display_takeover: true,
    evergreen: true,
    media_type: 'image',
    pin_order: 0,
    takeover_qr: 'embedded',
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
    .eq('title', POSTER_ROW.title)
    .maybeSingle();

  const existing = byImage || byTitle;

  if (existing) {
    const mergedMetadata = {
      ...(existing.metadata && typeof existing.metadata === 'object' ? existing.metadata : {}),
      ...POSTER_ROW.metadata,
    };

    const { data, error } = await supabase
      .from('announcements')
      .update({
        ...POSTER_ROW,
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

    console.log('Updated takeover poster:', data);
    return;
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      ...POSTER_ROW,
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

  console.log('Created takeover poster:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
