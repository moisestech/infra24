-- Fix exhibition poster announcement to be active
-- This ensures the "Oolite Exhibition Poster" announcement displays in the carousel

UPDATE announcements
SET is_active = true
WHERE title ILIKE '%Exhibition Poster%'
  AND title ILIKE '%Two Are Many More%'
  AND org_id IN (SELECT id FROM organizations WHERE slug = 'oolite');

-- Verify the update
SELECT 
  id,
  title,
  status,
  is_active,
  visibility,
  image_url,
  created_at
FROM announcements
WHERE title ILIKE '%Exhibition Poster%'
  AND title ILIKE '%Two Are Many More%'
  AND org_id IN (SELECT id FROM organizations WHERE slug = 'oolite');

