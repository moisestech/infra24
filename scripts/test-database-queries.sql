-- =====================================================
-- DATABASE TEST QUERIES FOR LEARN CANVAS INTEGRATION
-- =====================================================
-- Run these queries in both LOCAL and PRODUCTION databases
-- to verify the Learn Canvas system is working correctly

-- =====================================================
-- 1. ORGANIZATION VERIFICATION
-- =====================================================
SELECT 'ORGANIZATIONS' as test_section;

-- Check if organizations table exists and has data
SELECT 
    id,
    name,
    slug,
    created_at,
    theme_colors
FROM organizations 
WHERE slug = 'oolite'
ORDER BY created_at DESC;

-- =====================================================
-- 2. WORKSHOPS VERIFICATION
-- =====================================================
SELECT 'WORKSHOPS' as test_section;

-- Check workshops table structure and data
SELECT 
    id,
    title,
    status,
    featured,
    has_learn_content,
    learning_objectives,
    estimated_learn_time,
    learn_difficulty,
    created_at
FROM workshops 
WHERE organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
ORDER BY created_at DESC;

-- =====================================================
-- 3. WORKSHOP CHAPTERS VERIFICATION
-- =====================================================
SELECT 'WORKSHOP_CHAPTERS' as test_section;

-- Check if workshop_chapters table exists and has data
SELECT 
    wc.id,
    wc.workshop_id,
    w.title as workshop_title,
    wc.title as chapter_title,
    wc.chapter_slug,
    wc.order_index,
    wc.estimated_time,
    wc.created_at
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
WHERE w.organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
ORDER BY w.title, wc.order_index;

-- =====================================================
-- 4. USER PROGRESS VERIFICATION
-- =====================================================
SELECT 'USER_WORKSHOP_PROGRESS' as test_section;

-- Check if user_workshop_progress table exists
SELECT 
    uwp.id,
    uwp.user_id,
    uwp.workshop_id,
    w.title as workshop_title,
    uwp.chapter_id,
    wc.title as chapter_title,
    uwp.completed,
    uwp.progress_percentage,
    uwp.last_accessed_at,
    uwp.created_at
FROM user_workshop_progress uwp
JOIN workshops w ON uwp.workshop_id = w.id
LEFT JOIN workshop_chapters wc ON uwp.chapter_id = wc.id
WHERE w.organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
ORDER BY uwp.created_at DESC;

-- =====================================================
-- 5. TABLE STRUCTURE VERIFICATION
-- =====================================================
SELECT 'TABLE_STRUCTURE' as test_section;

-- Check if all required tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'organizations',
    'workshops', 
    'workshop_chapters',
    'user_workshop_progress'
)
ORDER BY table_name;

-- =====================================================
-- 6. COLUMN VERIFICATION
-- =====================================================
SELECT 'COLUMN_STRUCTURE' as test_section;

-- Check workshops table columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'workshops'
AND column_name IN (
    'has_learn_content',
    'learning_objectives',
    'estimated_learn_time',
    'learn_difficulty',
    'syllabus',
    'syllabus_sections',
    'materials_needed',
    'what_youll_learn',
    'workshop_outline'
)
ORDER BY column_name;

-- =====================================================
-- 7. SAMPLE DATA VERIFICATION
-- =====================================================
SELECT 'SAMPLE_DATA' as test_section;

-- Get a complete workshop with all Learn Canvas fields
SELECT 
    w.id,
    w.title,
    w.description,
    w.status,
    w.featured,
    w.has_learn_content,
    w.learning_objectives,
    w.estimated_learn_time,
    w.learn_difficulty,
    w.syllabus,
    w.syllabus_sections,
    w.materials_needed,
    w.what_youll_learn,
    w.workshop_outline,
    COUNT(wc.id) as chapter_count
FROM workshops w
LEFT JOIN workshop_chapters wc ON w.id = wc.workshop_id
WHERE w.organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)
AND w.has_learn_content = true
GROUP BY w.id, w.title, w.description, w.status, w.featured, 
         w.has_learn_content, w.learning_objectives, w.estimated_learn_time, 
         w.learn_difficulty, w.syllabus, w.syllabus_sections, 
         w.materials_needed, w.what_youll_learn, w.workshop_outline
ORDER BY w.created_at DESC;

-- =====================================================
-- 8. RLS POLICIES VERIFICATION
-- =====================================================
SELECT 'RLS_POLICIES' as test_section;

-- Check if RLS policies exist for our tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'organizations',
    'workshops',
    'workshop_chapters', 
    'user_workshop_progress'
)
ORDER BY tablename, policyname;

-- =====================================================
-- 9. SUMMARY REPORT
-- =====================================================
SELECT 'SUMMARY_REPORT' as test_section;

-- Generate a summary report
SELECT 
    'Organizations' as table_name,
    COUNT(*) as record_count
FROM organizations
WHERE slug = 'oolite'

UNION ALL

SELECT 
    'Workshops' as table_name,
    COUNT(*) as record_count
FROM workshops
WHERE organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)

UNION ALL

SELECT 
    'Workshop Chapters' as table_name,
    COUNT(*) as record_count
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
WHERE w.organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)

UNION ALL

SELECT 
    'User Progress Records' as table_name,
    COUNT(*) as record_count
FROM user_workshop_progress uwp
JOIN workshops w ON uwp.workshop_id = w.id
WHERE w.organization_id = (
    SELECT id FROM organizations WHERE slug = 'oolite'
)

ORDER BY table_name;
