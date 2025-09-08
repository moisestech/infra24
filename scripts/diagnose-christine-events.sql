-- Diagnose Christine Cortes Events Script
-- This script checks if the Christine Cortes events were created and why they might be missing

-- ==============================================
-- 1. CHECK IF CHRISTINE EVENTS EXIST
-- ==============================================

-- Look for specific titles from Christine's email
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
    a.title ILIKE '%New World Symphony%' OR
    a.title ILIKE '%BAC BOOKCLUB%' OR
    a.title ILIKE '%Annual Survey%' OR
    a.title ILIKE '%Museum Access Cards%' OR
    a.title ILIKE '%Jennifer Printz%' OR
    a.title ILIKE '%Lujan Candria%' OR
    a.title ILIKE '%CATS%'
  )
ORDER BY a.created_at DESC;

-- ==============================================
-- 2. CHECK RECENT ANNOUNCEMENTS
-- ==============================================

-- Check announcements created in the last hour (in case script was just run)
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
-- 3. CHECK FOR SYSTEM AUTHOR
-- ==============================================

-- Check if there are any announcements with 'system' as author
SELECT 
    a.id,
    a.title,
    a.author_clerk_id,
    a.created_at
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.author_clerk_id = 'system'
ORDER BY a.created_at DESC;

-- ==============================================
-- 4. CHECK ORGANIZATION ID
-- ==============================================

-- Verify the Bakehouse organization ID
SELECT 
    id,
    name,
    slug,
    created_at
FROM organizations 
WHERE slug = 'bakehouse';

-- ==============================================
-- 5. CHECK FOR ERRORS IN RECENT INSERTS
-- ==============================================

-- Check if there are any announcements with unusual data
SELECT 
    a.id,
    a.title,
    a.starts_at,
    a.ends_at,
    a.created_at,
    a.author_clerk_id,
    CASE 
        WHEN a.ends_at < a.starts_at THEN 'END_BEFORE_START'
        WHEN a.author_clerk_id IS NULL THEN 'NULL_AUTHOR'
        WHEN a.title IS NULL THEN 'NULL_TITLE'
        ELSE 'OK'
    END as data_issue
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY a.created_at DESC;

-- ==============================================
-- 6. COUNT TOTAL ANNOUNCEMENTS
-- ==============================================

-- Get total count of announcements
SELECT 
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN type = 'event' THEN 1 END) as events,
    COUNT(CASE WHEN type = 'opportunity' THEN 1 END) as opportunities,
    COUNT(CASE WHEN type = 'administrative' THEN 1 END) as administrative,
    COUNT(CASE WHEN author_clerk_id = 'system' THEN 1 END) as system_authored
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL;
