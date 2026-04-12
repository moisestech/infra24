-- Film-poster announcements: ensure type is cinematic (not promotion) by stable title.
-- Relies on announcements_type_check including 'cinematic' (see 20260409130000_announcements_type_cinematic.sql).

UPDATE announcements
SET type = 'cinematic',
    updated_at = NOW()
WHERE title IN (
  'Dual Citizen',
  'The Floor Remembers',
  'Old Man and the Parrot',
  'Tropical Park',
  'Colada'
)
  AND type IS DISTINCT FROM 'cinematic';
