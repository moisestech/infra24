-- =====================================================
-- TEST USER PROGRESS TABLE STRUCTURE
-- =====================================================
-- Run this query in production to verify the user_workshop_progress table structure

-- 1. Check table structure
SELECT 'TABLE_STRUCTURE' as test_section;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_workshop_progress'
ORDER BY ordinal_position;

-- 2. Check if table has any data
SELECT 'SAMPLE_DATA' as test_section;

SELECT 
    id,
    user_id,
    workshop_id,
    chapter_id,
    completed_at,
    progress_percentage,
    time_spent,
    created_at,
    updated_at
FROM user_workshop_progress 
LIMIT 5;

-- 3. Test completion logic
SELECT 'COMPLETION_TEST' as test_section;

SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_records,
    COUNT(CASE WHEN completed_at IS NULL THEN 1 END) as incomplete_records
FROM user_workshop_progress;

-- 4. Workshop progress summary (if data exists)
SELECT 'WORKSHOP_PROGRESS_SUMMARY' as test_section;

SELECT 
    w.title as workshop_title,
    COUNT(uwp.id) as total_progress_records,
    COUNT(CASE WHEN uwp.completed_at IS NOT NULL THEN 1 END) as completed_chapters,
    COUNT(DISTINCT uwp.user_id) as unique_users,
    ROUND(
        CASE 
            WHEN COUNT(uwp.id) > 0 
            THEN (COUNT(CASE WHEN uwp.completed_at IS NOT NULL THEN 1 END)::numeric / COUNT(uwp.id)::numeric) * 100
            ELSE 0 
        END::numeric, 2
    ) as completion_rate_percent
FROM workshops w
LEFT JOIN user_workshop_progress uwp ON w.id = uwp.workshop_id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
GROUP BY w.id, w.title
ORDER BY total_progress_records DESC;
