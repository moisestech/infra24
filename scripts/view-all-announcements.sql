-- View All Announcements Across All Organizations
-- This script provides comprehensive views of all announcements in the system

-- ==============================================
-- 1. OVERVIEW: ALL ORGANIZATIONS AND THEIR ANNOUNCEMENTS
-- ==============================================

-- Get organization summary with announcement counts
SELECT 
    o.id,
    o.name,
    o.slug,
    o.artist_icon,
    COUNT(a.id) as total_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN a.deleted_at IS NULL THEN 1 END) as active_announcements,
    MAX(a.created_at) as latest_announcement
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
GROUP BY o.id, o.name, o.slug, o.artist_icon
ORDER BY total_announcements DESC;

-- ==============================================
-- 2. ALL ANNOUNCEMENTS BY ORGANIZATION
-- ==============================================

-- Get all announcements with organization details
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    o.artist_icon,
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
    CASE 
        WHEN a.image_url IS NOT NULL THEN 'Has image_url'
        WHEN a.media IS NOT NULL AND a.media != '[]'::jsonb THEN 'Has media'
        ELSE 'No images'
    END as image_status
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
ORDER BY o.name, a.created_at DESC;

-- ==============================================
-- 3. ANNOUNCEMENTS BY TYPE ACROSS ALL ORGANIZATIONS
-- ==============================================

-- See what types and sub_types are being used across all organizations
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT a.title, '; ') as sample_titles
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
GROUP BY o.name, o.slug, a.type, a.sub_type
ORDER BY o.name, count DESC;

-- ==============================================
-- 4. RECENT ANNOUNCEMENTS (LAST 30 DAYS)
-- ==============================================

-- Get recent announcements across all organizations
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.published_at,
    a.starts_at,
    a.location
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.created_at >= NOW() - INTERVAL '30 days'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 5. UPCOMING EVENTS ACROSS ALL ORGANIZATIONS
-- ==============================================

-- Find all upcoming events
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.sub_type,
    a.starts_at,
    a.ends_at,
    a.location,
    a.status,
    a.image_url,
    a.tags
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.type = 'event'
  AND a.starts_at > NOW()
  AND a.deleted_at IS NULL
ORDER BY a.starts_at ASC;

-- ==============================================
-- 6. ANNOUNCEMENT STATUS DISTRIBUTION BY ORGANIZATION
-- ==============================================

-- See the status distribution for each organization
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.status,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
GROUP BY o.name, o.slug, a.status
ORDER BY o.name, count DESC;

-- ==============================================
-- 7. ANNOUNCEMENTS WITH IMAGES/MEDIA
-- ==============================================

-- Check which announcements have images or media
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.image_url,
    a.media,
    CASE 
        WHEN a.image_url IS NOT NULL THEN 'Has image_url'
        WHEN a.media IS NOT NULL AND a.media != '[]'::jsonb THEN 'Has media'
        ELSE 'No images'
    END as image_status
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
  AND (a.image_url IS NOT NULL OR (a.media IS NOT NULL AND a.media != '[]'::jsonb))
ORDER BY o.name, a.created_at DESC;

-- ==============================================
-- 8. SAMPLE ANNOUNCEMENTS FOR EACH ORGANIZATION
-- ==============================================

-- Get a sample announcement from each organization
SELECT DISTINCT ON (o.id)
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.starts_at,
    a.location,
    a.tags
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
ORDER BY o.id, a.created_at DESC;

-- ==============================================
-- 9. ANNOUNCEMENTS BY PRIORITY
-- ==============================================

-- See announcements by priority level
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.priority,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
GROUP BY o.name, o.slug, a.priority
ORDER BY o.name, a.priority DESC;

-- ==============================================
-- 10. ANNOUNCEMENTS BY VISIBILITY
-- ==============================================

-- Check visibility settings
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.visibility,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
GROUP BY o.name, o.slug, a.visibility
ORDER BY o.name, a.visibility;
