-- =====================================================
-- QUICK DATABASE TEST QUERIES
-- =====================================================
-- Copy and paste these queries into your Supabase SQL Editor
-- to quickly verify the Learn Canvas system is working

-- 1. Check Oolite organization
SELECT 'Oolite Organization' as test_name;
SELECT id, name, slug, created_at FROM organizations WHERE slug = 'oolite';

-- 2. Check workshops with Learn Canvas fields
SELECT 'Workshops with Learn Content' as test_name;
SELECT 
    id,
    title,
    status,
    featured,
    has_learn_content,
    learning_objectives,
    estimated_learn_time,
    learn_difficulty
FROM workshops 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
ORDER BY created_at DESC;

-- 3. Check workshop chapters
SELECT 'Workshop Chapters' as test_name;
SELECT 
    wc.id,
    w.title as workshop_title,
    wc.title as chapter_title,
    wc.chapter_slug,
    wc.order_index,
    wc.estimated_time
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
ORDER BY w.title, wc.order_index;

-- 4. Summary counts
SELECT 'Summary Counts' as test_name;
SELECT 
    'Organizations' as table_name,
    COUNT(*) as count
FROM organizations
WHERE slug = 'oolite'
UNION ALL
SELECT 
    'Workshops' as table_name,
    COUNT(*) as count
FROM workshops
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
UNION ALL
SELECT 
    'Workshop Chapters' as table_name,
    COUNT(*) as count
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite')
UNION ALL
SELECT 
    'User Progress Records' as table_name,
    COUNT(*) as count
FROM user_workshop_progress uwp
JOIN workshops w ON uwp.workshop_id = w.id
WHERE w.organization_id = (SELECT id FROM organizations WHERE slug = 'oolite');
