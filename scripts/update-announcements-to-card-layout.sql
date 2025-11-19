-- Update all Oolite announcements to use 'card' image_layout
-- This script updates existing announcements in the database to match the seed file changes

UPDATE announcements
SET image_layout = 'card',
    updated_at = NOW(),
    updated_by = 'system_oolite'
WHERE org_id IN (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
AND image_layout IN ('split-left', 'split-right', 'split')
AND image_layout != 'card';

-- Verify the update
SELECT 
    title,
    image_layout,
    updated_at
FROM announcements
WHERE org_id IN (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
ORDER BY title;

