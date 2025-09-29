-- =====================================================
-- Announcement Management Queries
-- =====================================================
-- Purpose: Queries for managing announcements and their content
-- Related Docs: docs/DIGITAL_LAB_ENHANCEMENTS.md
-- Related Docs: docs/SURVEY_ONBOARDING_STRATEGY.md
-- =====================================================

-- =====================================================
-- ANNOUNCEMENT QUERIES
-- =====================================================

-- Active Announcements by Organization
-- Use Case: Display announcements on organization pages
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
    a.created_at,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.is_active = true
  AND a.status = 'published'
  AND (a.start_date IS NULL OR a.start_date <= NOW())
  AND (a.end_date IS NULL OR a.end_date >= NOW())
ORDER BY 
    CASE a.priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'normal' THEN 3 
        WHEN 'low' THEN 4 
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
    a.metadata->>'action_url' as action_url,
    a.metadata->>'survey_type' as survey_type,
    a.metadata->>'target_audience' as target_audience,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.is_active = true
  AND (a.title ILIKE '%survey%' OR a.type = 'survey' OR a.metadata->>'survey_type' IS NOT NULL)
ORDER BY a.priority, a.created_at DESC;

-- Digital Lab Related Announcements
-- Use Case: Find announcements about Digital Lab initiatives
SELECT 
    a.id,
    a.title,
    a.content,
    a.type,
    a.priority,
    a.metadata->>'program_type' as program_type,
    a.metadata->>'call_to_action' as call_to_action,
    a.metadata->>'action_url' as action_url,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.is_active = true
  AND (a.title ILIKE '%digital lab%' 
       OR a.content ILIKE '%digital lab%'
       OR a.metadata->>'program_type' = 'digital_lab')
ORDER BY a.priority, a.created_at DESC;

-- =====================================================
-- ANNOUNCEMENT STATISTICS
-- =====================================================

-- Announcement Count by Organization
-- Use Case: Dashboard statistics
SELECT 
    o.name as organization_name,
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN a.is_active = true THEN 1 END) as active_announcements,
    COUNT(CASE WHEN a.status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN a.priority = 'high' OR a.priority = 'urgent' THEN 1 END) as high_priority_announcements
FROM organizations o
LEFT JOIN announcements a ON o.id = a.organization_id
GROUP BY o.id, o.name
ORDER BY total_announcements DESC;

-- Announcement Types Distribution
-- Use Case: Understand content types across organizations
SELECT 
    o.name as organization_name,
    a.type,
    COUNT(*) as count,
    COUNT(CASE WHEN a.is_active = true THEN 1 END) as active_count
FROM organizations o
LEFT JOIN announcements a ON o.id = a.organization_id
GROUP BY o.id, o.name, a.type
ORDER BY o.name, count DESC;

-- =====================================================
-- ANNOUNCEMENT CONTENT ANALYSIS
-- =====================================================

-- Announcements with Call-to-Action
-- Use Case: Find announcements that drive user engagement
SELECT 
    a.id,
    a.title,
    a.metadata->>'call_to_action' as call_to_action,
    a.metadata->>'action_url' as action_url,
    a.priority,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.metadata->>'call_to_action' IS NOT NULL
  AND a.is_active = true
ORDER BY a.priority, a.created_at DESC;

-- Survey Announcement Analysis
-- Use Case: Analyze survey promotion effectiveness
SELECT 
    a.id,
    a.title,
    a.metadata->>'survey_type' as survey_type,
    a.metadata->>'target_audience' as target_audience,
    a.metadata->>'estimated_time' as estimated_time,
    a.priority,
    a.created_at,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.metadata->>'survey_type' IS NOT NULL
ORDER BY a.created_at DESC;

-- =====================================================
-- ANNOUNCEMENT SCHEDULING
-- =====================================================

-- Upcoming Announcements
-- Use Case: Preview scheduled announcements
SELECT 
    a.id,
    a.title,
    a.start_date,
    a.end_date,
    a.priority,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.start_date > NOW()
  AND a.is_active = true
ORDER BY a.start_date ASC;

-- Expiring Announcements
-- Use Case: Manage announcement lifecycle
SELECT 
    a.id,
    a.title,
    a.end_date,
    a.priority,
    o.name as organization_name
FROM announcements a
JOIN organizations o ON a.organization_id = o.id
WHERE a.end_date IS NOT NULL
  AND a.end_date > NOW()
  AND a.end_date <= NOW() + INTERVAL '7 days'
  AND a.is_active = true
ORDER BY a.end_date ASC;

-- =====================================================
-- ANNOUNCEMENT METADATA ANALYSIS
-- =====================================================

-- Program Type Analysis
-- Use Case: Understand announcement categories
SELECT 
    a.metadata->>'program_type' as program_type,
    COUNT(*) as count,
    COUNT(CASE WHEN a.is_active = true THEN 1 END) as active_count
FROM announcements a
WHERE a.metadata->>'program_type' IS NOT NULL
GROUP BY a.metadata->>'program_type'
ORDER BY count DESC;

-- Target Audience Analysis
-- Use Case: Understand announcement targeting
SELECT 
    a.metadata->>'target_audience' as target_audience,
    COUNT(*) as count,
    COUNT(CASE WHEN a.is_active = true THEN 1 END) as active_count
FROM announcements a
WHERE a.metadata->>'target_audience' IS NOT NULL
GROUP BY a.metadata->>'target_audience'
ORDER BY count DESC;

-- =====================================================
-- UTILITY QUERIES
-- =====================================================

-- Announcement System Health Check
-- Use Case: Verify announcement system integrity
SELECT 
    'announcements' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_announcements,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_announcements,
    COUNT(CASE WHEN start_date > NOW() THEN 1 END) as future_announcements
FROM announcements;

-- Find Announcements Without Organization
-- Use Case: Data integrity check
SELECT 
    a.id,
    a.title,
    a.organization_id,
    a.created_at
FROM announcements a
LEFT JOIN organizations o ON a.organization_id = o.id
WHERE o.id IS NULL;

-- Announcement Metadata Completeness
-- Use Case: Check data quality
SELECT 
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN metadata->>'call_to_action' IS NOT NULL THEN 1 END) as with_cta,
    COUNT(CASE WHEN metadata->>'action_url' IS NOT NULL THEN 1 END) as with_action_url,
    COUNT(CASE WHEN metadata->>'target_audience' IS NOT NULL THEN 1 END) as with_target_audience
FROM announcements
WHERE is_active = true;
