-- =====================================================
-- SIMPLE WORKSHOP ANALYTICS QUERY (PostgreSQL Compatible)
-- =====================================================
-- Simplified version without complex ROUND functions

-- 1. WORKSHOP OVERVIEW
SELECT 'WORKSHOP_OVERVIEW' as section;

SELECT 
    w.id as workshop_id,
    w.title,
    w.status,
    w.featured,
    w.has_learn_content,
    w.learning_objectives,
    w.estimated_learn_time,
    w.learn_difficulty,
    w.instructor,
    w.duration_minutes,
    w.max_participants,
    w.price,
    w.created_at,
    w.updated_at,
    CASE 
        WHEN w.has_learn_content = true THEN '✅ Learn Canvas Enabled'
        ELSE '❌ Learn Canvas Disabled'
    END as learn_canvas_status
FROM workshops w
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
ORDER BY w.created_at DESC;

-- 2. WORKSHOP STATUS BREAKDOWN
SELECT 'WORKSHOP_STATUS_BREAKDOWN' as section;

SELECT 
    status,
    COUNT(*) as count,
    CASE 
        WHEN status = 'published' THEN '✅ Live'
        WHEN status = 'draft' THEN '📝 Draft'
        WHEN status = 'archived' THEN '🗄️ Archived'
        ELSE '❓ Unknown'
    END as status_description
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY status
ORDER BY count DESC;

-- 3. LEARN CANVAS ENABLED WORKSHOPS
SELECT 'LEARN_CANVAS_WORKSHOPS' as section;

SELECT 
    w.id as workshop_id,
    w.title,
    w.status,
    w.learning_objectives,
    w.estimated_learn_time,
    w.learn_difficulty,
    COUNT(wc.id) as chapter_count,
    SUM(wc.estimated_time) as total_chapter_time
FROM workshops w
LEFT JOIN workshop_chapters wc ON w.id = wc.workshop_id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
AND w.has_learn_content = true
GROUP BY w.id, w.title, w.status, w.learning_objectives, w.estimated_learn_time, w.learn_difficulty
ORDER BY w.title;

-- 4. DETAILED CHAPTER BREAKDOWN
SELECT 'CHAPTER_BREAKDOWN' as section;

SELECT 
    w.id as workshop_id,
    w.title as workshop_title,
    w.status as workshop_status,
    wc.id as chapter_id,
    wc.title as chapter_title,
    wc.chapter_slug,
    wc.order_index,
    wc.estimated_time,
    wc.created_at as chapter_created_at
FROM workshops w
JOIN workshop_chapters wc ON w.id = wc.workshop_id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
ORDER BY w.title, wc.order_index;

-- 5. WORKSHOP COMPLETENESS ANALYSIS
SELECT 'WORKSHOP_COMPLETENESS' as section;

SELECT 
    w.id as workshop_id,
    w.title,
    w.status,
    w.has_learn_content,
    COUNT(wc.id) as chapter_count,
    CASE 
        WHEN w.has_learn_content = true AND COUNT(wc.id) > 0 THEN '✅ Complete'
        WHEN w.has_learn_content = true AND COUNT(wc.id) = 0 THEN '⚠️ Missing Chapters'
        WHEN w.has_learn_content = false THEN '📝 Traditional Workshop'
        ELSE '❓ Unknown'
    END as completeness_status,
    CASE 
        WHEN w.status = 'published' AND w.has_learn_content = true AND COUNT(wc.id) > 0 THEN '🚀 Ready for Users'
        WHEN w.status = 'published' AND w.has_learn_content = false THEN '📚 Traditional Workshop Live'
        WHEN w.status = 'draft' THEN '📝 In Development'
        WHEN w.status = 'archived' THEN '🗄️ Archived'
        ELSE '❓ Needs Review'
    END as readiness_status
FROM workshops w
LEFT JOIN workshop_chapters wc ON w.id = wc.workshop_id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY w.id, w.title, w.status, w.has_learn_content
ORDER BY 
    CASE w.status 
        WHEN 'published' THEN 1 
        WHEN 'draft' THEN 2 
        WHEN 'archived' THEN 3 
        ELSE 4 
    END,
    w.title;

-- 6. USER ENGAGEMENT SUMMARY (Simplified)
SELECT 'USER_ENGAGEMENT' as section;

SELECT 
    w.id as workshop_id,
    w.title,
    w.status,
    COUNT(uwp.id) as total_progress_records,
    COUNT(CASE WHEN uwp.completed_at IS NOT NULL THEN 1 END) as completed_chapters,
    COUNT(DISTINCT uwp.user_id) as unique_users,
    -- Simple percentage calculation without ROUND
    CASE 
        WHEN COUNT(uwp.id) > 0 
        THEN (COUNT(CASE WHEN uwp.completed_at IS NOT NULL THEN 1 END) * 100 / COUNT(uwp.id))
        ELSE 0 
    END as completion_rate_percent
FROM workshops w
LEFT JOIN user_workshop_progress uwp ON w.id = uwp.workshop_id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY w.id, w.title, w.status
ORDER BY total_progress_records DESC, w.title;

-- 7. SUMMARY STATISTICS
SELECT 'SUMMARY_STATISTICS' as section;

SELECT 
    'Total Workshops' as metric,
    COUNT(*) as value
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')

UNION ALL

SELECT 
    'Published Workshops' as metric,
    COUNT(*) as value
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
AND status = 'published'

UNION ALL

SELECT 
    'Draft Workshops' as metric,
    COUNT(*) as value
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
AND status = 'draft'

UNION ALL

SELECT 
    'Learn Canvas Enabled' as metric,
    COUNT(*) as value
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
AND has_learn_content = true

UNION ALL

SELECT 
    'Total Chapters' as metric,
    COUNT(*) as value
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')

UNION ALL

SELECT 
    'Active Users' as metric,
    COUNT(DISTINCT user_id) as value
FROM user_workshop_progress uwp
JOIN workshops w ON uwp.workshop_id = w.id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')

ORDER BY metric;
