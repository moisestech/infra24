-- Debug Event Query Script
-- This script helps understand why we're not seeing all events

-- ==============================================
-- 1. CHECK ALL EVENTS WITHOUT FILTERS
-- ==============================================

-- Get all events without any date or status filters
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.starts_at,
    a.ends_at,
    a.location,
    a.created_at,
    a.author_clerk_id
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.type = 'event'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 2. CHECK WHAT THE ORIGINAL QUERY WAS FILTERING
-- ==============================================

-- This is what the original query was doing - let's see what it filters out
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.starts_at,
    a.ends_at,
    a.location,
    a.created_at,
    a.author_clerk_id,
    CASE 
        WHEN a.starts_at > NOW() THEN 'FUTURE'
        WHEN a.starts_at <= NOW() THEN 'PAST_OR_CURRENT'
        WHEN a.starts_at IS NULL THEN 'NO_START_DATE'
        ELSE 'OTHER'
    END as date_status
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.type = 'event'
  AND a.deleted_at IS NULL
ORDER BY a.starts_at DESC;

-- ==============================================
-- 3. CHECK FOR EVENTS WITH NULL STARTS_AT
-- ==============================================

-- Look for events that might not have start dates
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.starts_at,
    a.ends_at,
    a.created_at,
    a.author_clerk_id
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.type = 'event'
  AND a.starts_at IS NULL
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 4. CHECK ALL ANNOUNCEMENTS BY TYPE
-- ==============================================

-- See the breakdown by type
SELECT 
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
GROUP BY a.type, a.sub_type
ORDER BY count DESC;

-- ==============================================
-- 5. CHECK FOR RECENT CREATIONS
-- ==============================================

-- Look for anything created in the last 2 hours
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
  AND a.created_at >= NOW() - INTERVAL '2 hours'
ORDER BY a.created_at DESC;
