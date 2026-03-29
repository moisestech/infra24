-- Check for duplicate Oolite announcements
-- Run against your Supabase project to verify no unintended duplicates

-- 1. Duplicate titles (same title, multiple rows)
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

-- 2. Duplicate image_url (same image, multiple announcements)
SELECT 
  image_url,
  COUNT(*) as duplicate_count,
  array_agg(title) as titles,
  array_agg(id) as ids
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND image_url IS NOT NULL
GROUP BY image_url
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 3. Summary: total vs unique titles
SELECT 
  COUNT(*) as total_announcements,
  COUNT(DISTINCT title) as unique_titles,
  COUNT(*) - COUNT(DISTINCT title) as potential_title_duplicates
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite');
