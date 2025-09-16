-- Find Christine Cortes Events Script
-- This script specifically looks for the events we just created

-- ==============================================
-- 1. LOOK FOR SPECIFIC CHRISTINE EVENT TITLES
-- ==============================================

-- Search for exact titles from Christine's email
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.author_clerk_id,
    a.starts_at,
    a.ends_at,
    a.location
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND (
    a.title = 'New World Symphony Orchestra - Recorded Performance' OR
    a.title = 'OPEN STUDIOS' OR
    a.title = 'BAC BOOKCLUB' OR
    a.title = 'Bakehouse Annual Survey 2025' OR
    a.title = 'Your Museum Access Cards are ready for pick up!' OR
    a.title = 'Jennifer Printz "Infinite and Transient" Exhibition' OR
    a.title = 'Lujan Candria - (RE)CHARGE to (RE)NEW Exhibition' OR
    a.title = '"CATS!" The Exhibition!'
  )
ORDER BY a.created_at DESC;

-- ==============================================
-- 2. LOOK FOR RECENT ANNOUNCEMENTS (LAST HOUR)
-- ==============================================

-- Check what was created in the last hour
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.author_clerk_id
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY a.created_at DESC;

-- ==============================================
-- 3. LOOK FOR SYSTEM-AUTHORED RECENT ANNOUNCEMENTS
-- ==============================================

-- Check recent system-authored announcements
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.author_clerk_id
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.author_clerk_id = 'system'
  AND a.created_at >= NOW() - INTERVAL '2 hours'
ORDER BY a.created_at DESC;

-- ==============================================
-- 4. SEARCH FOR PARTIAL TITLE MATCHES
-- ==============================================

-- Look for any announcements with keywords from Christine's email
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.author_clerk_id
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND (
    a.title ILIKE '%symphony%' OR
    a.title ILIKE '%bookclub%' OR
    a.title ILIKE '%survey%' OR
    a.title ILIKE '%museum%' OR
    a.title ILIKE '%jennifer%' OR
    a.title ILIKE '%lujan%' OR
    a.title ILIKE '%cats%'
  )
ORDER BY a.created_at DESC;

-- ==============================================
-- 5. CHECK FOR DUPLICATE TITLES
-- ==============================================

-- See if there are multiple announcements with similar titles
SELECT 
    a.title,
    COUNT(*) as count,
    STRING_AGG(a.id::text, ', ') as ids,
    STRING_AGG(a.status, ', ') as statuses
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
GROUP BY a.title
HAVING COUNT(*) > 1
ORDER BY count DESC;
