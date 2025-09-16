-- Test Single Christine Event Script
-- This script creates just one event to test if the insert works

-- First, let's test with a simple event
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    'TEST: New World Symphony Orchestra - Recorded Performance',
    'A series called "Places We Love" led by The New World Symphony Orchestra has selected Bakehouse as the next location to record 3 musicians inside The Audrey Love Gallery.',
    'published',
    2,
    ARRAY['performance', 'music', 'recording', 'new-world-symphony', 'test'],
    'internal',
    'event',
    'performance',
    'Audrey Love Gallery, Bakehouse Art Complex',
    '2024-09-08 12:30:00-04:00',
    '2024-09-08 14:30:00-04:00',
    'If you are interested in attending, please arrive by 12:30 to begin seating. Performance begins promptly at 1pm-2:30pm. Must sign film release waiver.',
    NOW(),
    NOW()
);

-- Check if it was created
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.author_clerk_id,
    a.starts_at,
    a.ends_at
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.title ILIKE '%TEST: New World Symphony%'
ORDER BY a.created_at DESC;
