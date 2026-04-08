-- Add cinematic announcement type for film-poster / program rows (smart sign grid_cinematic).
-- Narrow existing promotion rows that are clearly film/poster content.

ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_type_check;

ALTER TABLE announcements ADD CONSTRAINT announcements_type_check CHECK (
  type IN (
    'general',
    'event',
    'workshop',
    'exhibition',
    'fun_fact',
    'news',
    'promotion',
    'cinematic',
    'urgent',
    'opportunity',
    'facility',
    'administrative',
    'attention_artists',
    'attention_public',
    'gala_announcement'
  )
);

UPDATE announcements
SET type = 'cinematic'
WHERE type = 'promotion'
  AND (
    metadata @> '{"image_only": true}'::jsonb
    OR EXISTS (
      SELECT 1
      FROM unnest(COALESCE(tags, ARRAY[]::text[])) AS t(tag)
      WHERE tag ~* '(film|poster|cinematic)'
    )
  );
