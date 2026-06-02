#!/usr/bin/env node
/**
 * Smart-sign asset takeover: Now Streaming cinematic poster video.
 *
 * Run: node scripts/data/seed/upsert-now-streaming-video-takeover.js
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

const VIDEO_URL =
  'https://res.cloudinary.com/dkod1at3i/video/upload/v1779992098/cinematic-Now_Streaming_Posters_1920x1080_ixklkb.mp4';

/** First-frame poster for faster load before video buffers */
const POSTER_URL =
  'https://res.cloudinary.com/dkod1at3i/video/upload/so_0/v1779992098/cinematic-Now_Streaming_Posters_1920x1080_ixklkb.jpg';

const TITLE = 'Now Streaming';

const ROW = {
  title: TITLE,
  body: 'Cinematic Arts — full-bleed poster loop for the smart sign cinematic segment.',
  status: 'published',
  priority: 'high',
  tags: ['cinematic', 'now-streaming', 'video', 'signage'],
  visibility: 'public',
  type: 'promotion',
  sub_type: 'general',
  image_url: POSTER_URL,
  image_layout: 'hero',
  primary_link: 'https://oolitearts.org/cinematicarts/',
  qr_destination_url: 'https://oolitearts.org/cinematicarts/',
  is_active: true,
  metadata: {
    program: 'now_streaming',
    display_takeover: true,
    evergreen: true,
    cinematic_segment: true,
    takeover_mode: 'asset',
    media_type: 'video',
    video_url: VIDEO_URL,
    takeover_qr: 'app',
    show_view_details: false,
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

  const { data: byTitle } = await supabase
    .from('announcements')
    .select('id, title, metadata')
    .eq('org_id', orgId)
    .eq('title', TITLE)
    .maybeSingle();

  const { data: byVideoMeta } = await supabase
    .from('announcements')
    .select('id, title, metadata')
    .eq('org_id', orgId)
    .filter('metadata->>video_url', 'eq', VIDEO_URL)
    .maybeSingle();

  const existing = byVideoMeta || byTitle;

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

    console.log('Updated Now Streaming video takeover:', data);
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

  console.log('Created Now Streaming video takeover:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
