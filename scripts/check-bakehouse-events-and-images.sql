-- Check Bakehouse Events and Image Capabilities
-- This script examines all current events and investigates image support

-- ==============================================
-- 1. CHECK ALL CURRENT ANNOUNCEMENTS IN BAKEHOUSE
-- ==============================================

-- Get all announcements for Bakehouse organization
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.priority,
    a.visibility,
    a.location,
    a.starts_at,
    a.ends_at,
    a.created_at,
    a.published_at,
    a.author_clerk_id,
    a.tags,
    a.image_url,
    a.media,
    a.additional_info
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 2. CHECK ANNOUNCEMENT TYPES AND SUBTYPES
-- ==============================================

-- See what types and sub_types are being used
SELECT 
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT a.title, '; ') as sample_titles
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
GROUP BY a.type, a.sub_type
ORDER BY count DESC;

-- ==============================================
-- 3. CHECK IMAGE AND MEDIA FIELDS
-- ==============================================

-- Check which announcements have images or media
SELECT 
    a.id,
    a.title,
    a.image_url,
    a.media,
    CASE 
        WHEN a.image_url IS NOT NULL THEN 'Has image_url'
        WHEN a.media IS NOT NULL AND a.media != '[]'::jsonb THEN 'Has media'
        ELSE 'No images'
    END as image_status
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 4. CHECK ANNOUNCEMENT SCHEMA FOR IMAGE FIELDS
-- ==============================================

-- Check the structure of the announcements table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'announcements' 
  AND table_schema = 'public'
  AND column_name IN ('image_url', 'media', 'payload')
ORDER BY ordinal_position;

-- ==============================================
-- 5. SAMPLE ANNOUNCEMENT WITH FULL DETAILS
-- ==============================================

-- Get a sample announcement with all fields to see the structure
SELECT 
    a.*,
    o.name as org_name,
    o.slug as org_slug
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC
LIMIT 1;

-- ==============================================
-- 6. CHECK FOR EVENTS SPECIFICALLY
-- ==============================================

-- Focus on events (type = 'event')
SELECT 
    a.id,
    a.title,
    a.sub_type,
    a.status,
    a.location,
    a.starts_at,
    a.ends_at,
    a.image_url,
    a.media,
    a.additional_info,
    a.tags
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.type = 'event'
  AND a.deleted_at IS NULL
ORDER BY a.starts_at DESC;

-- ==============================================
-- 7. CHECK ANNOUNCEMENT STATUS DISTRIBUTION
-- ==============================================

-- See the status distribution
SELECT 
    a.status,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
GROUP BY a.status
ORDER BY count DESC;

-- ==============================================
-- 8. CHECK FOR UPCOMING EVENTS
-- ==============================================

-- Find events that are scheduled for the future
SELECT 
    a.id,
    a.title,
    a.sub_type,
    a.starts_at,
    a.ends_at,
    a.location,
    a.status,
    a.image_url,
    a.tags
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.type = 'event'
  AND a.starts_at > NOW()
  AND a.deleted_at IS NULL
ORDER BY a.starts_at ASC;
