-- =====================================================
-- Oolite Arts Organization Queries
-- =====================================================
-- Purpose: Common queries for Oolite Arts organization
-- Related Docs: docs/OOLITE_ARTISTS_IMPLEMENTATION.md
-- Organization ID: b94f704c-ad6a-4419-89c8-d88636f61ab3
-- =====================================================

-- Organization Details
-- Use Case: Get basic organization information
SELECT 
    id,
    name,
    slug,
    description,
    website,
    created_at
FROM organizations 
WHERE slug = 'oolite';

-- =====================================================
-- ARTIST QUERIES
-- =====================================================

-- All Oolite Artists with Residency Types
-- Use Case: Get complete artist directory with residency information
-- Related: docs/OOLITE_ARTISTS_IMPLEMENTATION.md
SELECT 
    ap.id,
    ap.name,
    ap.bio,
    ap.studio_type,
    ap.studio_location,
    ap.skills,
    ap.mediums,
    ap.metadata->>'residency_type' as residency_type,
    ap.metadata->>'year' as year,
    ap.metadata->>'email' as email,
    ap.metadata->>'phone' as phone,
    ap.metadata->>'website' as website,
    ap.metadata->>'instagram' as instagram,
    ap.is_public,
    ap.is_featured,
    ap.created_at
FROM artist_profiles ap
WHERE ap.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
ORDER BY ap.studio_type, ap.name;

-- Artists by Residency Type (2025)
-- Use Case: Filter artists by specific residency program
SELECT 
    ap.name,
    ap.studio_type,
    ap.studio_location,
    ap.metadata->>'residency_type' as residency_type,
    ap.skills,
    ap.mediums
FROM artist_profiles ap
WHERE ap.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND ap.metadata->>'year' = '2025'
  AND ap.metadata->>'residency_type' = 'Studio Resident'  -- Change to: 'Live In Art Resident', 'Cinematic Resident'
ORDER BY ap.name;

-- Artist Count by Residency Type
-- Use Case: Get statistics for dashboard or reporting
SELECT 
    ap.metadata->>'residency_type' as residency_type,
    COUNT(*) as count,
    ap.studio_type
FROM artist_profiles ap
WHERE ap.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND ap.metadata->>'year' = '2025'
GROUP BY ap.metadata->>'residency_type', ap.studio_type
ORDER BY count DESC;

-- =====================================================
-- SURVEY QUERIES
-- =====================================================

-- Active Surveys for Oolite
-- Use Case: Get surveys available to users
-- Related: docs/SURVEY_SYSTEM_COMPLETE_SUMMARY.md
SELECT 
    s.id,
    s.title,
    s.description,
    s.status,
    s.is_anonymous,
    s.opens_at,
    s.closes_at,
    s.template_id,
    st.name as template_name,
    s.created_at
FROM surveys s
LEFT JOIN survey_templates st ON s.template_id = st.id
WHERE s.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND s.status = 'active'
ORDER BY s.created_at DESC;

-- Survey Question Count (from templates)
-- Use Case: Display survey complexity to users
SELECT 
    s.id,
    s.title,
    st.template_schema->'sections' as sections,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(st.template_schema->'sections') AS section
        CROSS JOIN jsonb_array_elements(section->'questions') AS question
    ) as total_questions
FROM surveys s
LEFT JOIN survey_templates st ON s.template_id = st.id
WHERE s.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND s.status = 'active';

-- =====================================================
-- ANNOUNCEMENT QUERIES
-- =====================================================

-- Active Announcements for Oolite
-- Use Case: Display announcements on organization page
-- Related: docs/DIGITAL_LAB_ENHANCEMENTS.md
SELECT 
    a.id,
    a.title,
    a.content,
    a.type,
    a.priority,
    a.status,
    a.start_date,
    a.end_date,
    a.location,
    a.metadata,
    a.is_active,
    a.created_at
FROM announcements a
WHERE a.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND a.is_active = true
  AND a.status = 'published'
  AND (a.start_date IS NULL OR a.start_date <= NOW())
  AND (a.end_date IS NULL OR a.end_date >= NOW())
ORDER BY 
    CASE a.priority 
        WHEN 'high' THEN 1 
        WHEN 'normal' THEN 2 
        WHEN 'low' THEN 3 
    END,
    a.created_at DESC;

-- Survey-Related Announcements
-- Use Case: Find announcements that promote surveys
SELECT 
    a.id,
    a.title,
    a.type,
    a.priority,
    a.metadata->>'call_to_action' as call_to_action,
    a.metadata->>'action_url' as action_url
FROM announcements a
WHERE a.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND a.is_active = true
  AND (a.title ILIKE '%survey%' OR a.type = 'survey')
ORDER BY a.priority, a.created_at DESC;

-- =====================================================
-- BOOKING QUERIES (Oolite-specific)
-- =====================================================

-- Available Resources for Booking
-- Use Case: Display bookable resources in calendar
SELECT 
    r.id,
    r.name,
    r.type,
    r.description,
    r.capacity,
    r.metadata,
    r.is_active
FROM resources r
WHERE r.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND r.is_active = true
ORDER BY r.type, r.name;

-- Recent Bookings
-- Use Case: Show recent activity on dashboard
SELECT 
    b.id,
    b.title,
    b.start_time,
    b.end_time,
    b.status,
    r.name as resource_name,
    r.type as resource_type,
    b.created_at
FROM bookings b
JOIN resources r ON b.resource_id = r.id
WHERE r.organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
ORDER BY b.created_at DESC
LIMIT 10;

-- =====================================================
-- ANALYTICS QUERIES
-- =====================================================

-- Organization Overview Stats
-- Use Case: Dashboard summary statistics
SELECT 
    'artists' as metric,
    COUNT(*) as count
FROM artist_profiles 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND is_public = true

UNION ALL

SELECT 
    'surveys' as metric,
    COUNT(*) as count
FROM surveys 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND status = 'active'

UNION ALL

SELECT 
    'announcements' as metric,
    COUNT(*) as count
FROM announcements 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND is_active = true
  AND status = 'published'

UNION ALL

SELECT 
    'resources' as metric,
    COUNT(*) as count
FROM resources 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'
  AND is_active = true;

-- =====================================================
-- UTILITY QUERIES
-- =====================================================

-- Check Organization Data Integrity
-- Use Case: Verify data consistency
SELECT 
    'artist_profiles' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN metadata->>'year' = '2025' THEN 1 END) as records_2025
FROM artist_profiles 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'

UNION ALL

SELECT 
    'surveys' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_records
FROM surveys 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3'

UNION ALL

SELECT 
    'announcements' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM announcements 
WHERE organization_id = 'b94f704c-ad6a-4419-89c8-d88636f61ab3';
