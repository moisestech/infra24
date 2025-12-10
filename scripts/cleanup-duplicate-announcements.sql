-- Clean up duplicate announcements for Oolite
-- Keeps the most recent announcement for each unique title

-- First, let's see what we're dealing with
SELECT 
  title,
  COUNT(*) as duplicate_count,
  array_agg(id ORDER BY created_at DESC) as ids,
  array_agg(created_at ORDER BY created_at DESC) as created_dates
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Delete duplicates, keeping only the most recent one for each title
DELETE FROM announcements
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as rn
    FROM announcements
    WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  ) ranked
  WHERE rn > 1
);

-- Verify cleanup
SELECT 
  COUNT(*) as total_after_cleanup,
  COUNT(DISTINCT title) as unique_titles
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite');

