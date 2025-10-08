-- Verify that the Video Performance workshop was created successfully
-- This script checks if the workshop exists and shows its details

-- Check if MadArts organization exists
SELECT 
    'MadArts Organization' as check_type,
    id,
    name,
    slug,
    is_active
FROM organizations 
WHERE slug = 'madarts';

-- Check if Video Performance workshop exists
SELECT 
    'Video Performance Workshop' as check_type,
    w.id,
    w.title,
    w.instructor,
    w.duration_minutes,
    w.price,
    w.has_learn_content,
    w.estimated_learn_time,
    w.learn_difficulty,
    o.name as organization_name,
    o.slug as organization_slug
FROM workshops w
JOIN organizations o ON w.organization_id = o.id
WHERE o.slug = 'madarts' 
AND w.title = 'Video Performance: Mastering the Camera';

-- Check if any chapters exist for the workshop
SELECT 
    'Workshop Chapters' as check_type,
    wc.id,
    wc.chapter_slug,
    wc.title,
    wc.order_index,
    wc.estimated_time,
    w.title as workshop_title
FROM workshop_chapters wc
JOIN workshops w ON wc.workshop_id = w.id
JOIN organizations o ON w.organization_id = o.id
WHERE o.slug = 'madarts' 
AND w.title = 'Video Performance: Mastering the Camera'
ORDER BY wc.order_index;
