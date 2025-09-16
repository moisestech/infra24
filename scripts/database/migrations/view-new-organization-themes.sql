-- View New Organization Themes and Their Announcements
-- This script focuses on the new organization themes we created for testing

-- ==============================================
-- 1. CHECK NEW ORGANIZATION THEMES
-- ==============================================

-- Get all the new organization themes we created
SELECT 
    o.id,
    o.name,
    o.slug,
    o.artist_icon,
    o.settings,
    COUNT(a.id) as total_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    MAX(a.created_at) as latest_announcement
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
WHERE o.slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
GROUP BY o.id, o.name, o.slug, o.artist_icon, o.settings
ORDER BY o.name;

-- ==============================================
-- 2. ANNOUNCEMENTS FOR EACH NEW THEME
-- ==============================================

-- Get all announcements for the new organization themes
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
-- 3. ANNOUNCEMENT TYPES BY NEW THEME
-- ==============================================

-- See what types and sub_types are being used in new themes
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT a.title, '; ') as sample_titles
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
GROUP BY o.name, o.slug, a.type, a.sub_type
ORDER BY o.name, count DESC;

-- ==============================================
-- 4. UPCOMING EVENTS FOR NEW THEMES
-- ==============================================

-- Find upcoming events for new organization themes
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
WHERE o.slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
  AND a.type = 'event'
  AND a.starts_at > NOW()
  AND a.deleted_at IS NULL
ORDER BY a.starts_at ASC;

-- ==============================================
-- 5. STATUS DISTRIBUTION FOR NEW THEMES
-- ==============================================

-- See the status distribution for new organization themes
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.status,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
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
GROUP BY o.name, o.slug, a.status
ORDER BY o.name, count DESC;

-- ==============================================
-- 6. SAMPLE ANNOUNCEMENT FOR EACH NEW THEME
-- ==============================================

-- Get a sample announcement from each new organization theme
SELECT DISTINCT ON (o.id)
    o.name as organization_name,
    o.slug as org_slug,
    o.artist_icon,
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.starts_at,
    a.location,
    a.tags,
    a.body
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
ORDER BY o.id, a.created_at DESC;

-- ==============================================
-- 7. CHECK FOR ANNOUNCEMENTS WITH CUSTOM TYPES
-- ==============================================

-- Look for any custom announcement types in new themes
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
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
  AND (a.type NOT IN ('event', 'opportunity', 'urgent', 'facility', 'administrative')
       OR a.sub_type NOT IN ('exhibition', 'workshop', 'meeting', 'deadline', 'maintenance', 'policy'))
GROUP BY o.name, o.slug, a.type, a.sub_type
ORDER BY o.name, count DESC;

-- ==============================================
-- 8. ANNOUNCEMENTS BY PRIORITY FOR NEW THEMES
-- ==============================================

-- See announcements by priority level for new themes
SELECT 
    o.name as organization_name,
    o.slug as org_slug,
    a.priority,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
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
GROUP BY o.name, o.slug, a.priority
ORDER BY o.name, a.priority DESC;

-- ==============================================
-- 9. RECENT ANNOUNCEMENTS FOR NEW THEMES (LAST 7 DAYS)
-- ==============================================

-- Get recent announcements for new organization themes
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
WHERE o.slug IN (
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
  AND a.created_at >= NOW() - INTERVAL '7 days'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 10. COMPARE NEW THEMES WITH BAKEHOUSE
-- ==============================================

-- Compare announcement counts between Bakehouse and new themes
SELECT 
    CASE 
        WHEN o.slug = 'bakehouse' THEN 'Bakehouse (Original)'
        ELSE 'New Theme: ' || o.name
    END as theme_category,
    o.slug,
    COUNT(a.id) as total_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN a.type = 'event' THEN 1 END) as event_announcements,
    COUNT(CASE WHEN a.type = 'opportunity' THEN 1 END) as opportunity_announcements,
    COUNT(CASE WHEN a.type = 'urgent' THEN 1 END) as urgent_announcements
FROM organizations o
LEFT JOIN announcements a ON o.id = a.org_id AND a.deleted_at IS NULL
WHERE o.slug IN (
    'bakehouse',
    'primary-colors',
    'midnight-gallery', 
    'sunset-studios',
    'ocean-workshop',
    'forest-collective'
)
GROUP BY o.slug, o.name
ORDER BY 
    CASE WHEN o.slug = 'bakehouse' THEN 0 ELSE 1 END,
    o.name;
