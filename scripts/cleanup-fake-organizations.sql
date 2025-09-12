-- Cleanup Fake Organizations and Their Announcements
-- This script removes the test organizations we created for theme testing

-- ==============================================
-- 1. CHECK WHAT WE'RE ABOUT TO DELETE
-- ==============================================

-- First, let's see what fake organizations and announcements we have
SELECT 
    o.id,
    o.name,
    o.slug,
    COUNT(a.id) as announcement_count
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
WHERE o.slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
GROUP BY o.id, o.name, o.slug
ORDER BY o.name;

-- ==============================================
-- 2. CHECK ANNOUNCEMENTS TO BE DELETED
-- ==============================================

-- See all announcements that will be deleted
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE o.slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
  AND a.deleted_at IS NULL
ORDER BY o.name, a.created_at DESC;

-- ==============================================
-- 3. SOFT DELETE ANNOUNCEMENTS FOR FAKE ORGS
-- ==============================================

-- Soft delete all announcements for fake organizations
UPDATE announcements 
SET deleted_at = NOW()
WHERE org_id IN (
    SELECT id FROM organizations 
    WHERE slug IN (
        'primary-colors',
        'midnight-gallery', 
        'sunset-studios',
        'ocean-workshop',
        'forest-collective'
    )
)
AND deleted_at IS NULL;

-- ==============================================
-- 4. DELETE FAKE ORGANIZATIONS
-- ==============================================

-- Delete the fake organizations
DELETE FROM organizations 
WHERE slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
);

-- ==============================================
-- 5. VERIFY CLEANUP
-- ==============================================

-- Verify that only real organizations remain
SELECT 
    o.id,
    o.name,
    o.slug,
    o.artist_icon,
    COUNT(a.id) as total_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN a.deleted_at IS NULL THEN 1 END) as active_announcements
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id
GROUP BY o.id, o.name, o.slug, o.artist_icon
ORDER BY o.name;

-- ==============================================
-- 6. CHECK REMAINING ANNOUNCEMENTS
-- ==============================================

-- See all remaining active announcements
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.visibility,
    a.created_at,
    a.published_at
FROM organizations o
JOIN announcements a ON o.id = a.org_id
WHERE a.deleted_at IS NULL
ORDER BY o.name, a.created_at DESC;

-- ==============================================
-- 7. SUMMARY OF REAL ORGANIZATIONS
-- ==============================================

-- Get summary of real organizations only
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    o.artist_icon,
    COUNT(a.id) as total_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN a.visibility = 'both' THEN 1 END) as public_announcements,
    COUNT(CASE WHEN a.visibility = 'internal' THEN 1 END) as internal_announcements,
    MAX(a.created_at) as latest_announcement
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
GROUP BY o.id, o.name, o.slug, o.artist_icon
ORDER BY o.name;
