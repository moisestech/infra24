-- Create Test Announcements Script
-- Use this to create test announcements for debugging

-- First, get the organization ID for bakehouse
-- Replace 'your-org-id-here' with the actual organization ID from the debug script above

-- Example test announcements (uncomment and modify as needed):

-- 1. Create a test event announcement
/*
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
    primary_link,
    created_at,
    published_at
) VALUES (
    '8edfa56a-7c52-47b3-ae53-6860a3c1bffa', -- Use the specific ID that's failing
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'user_2abc123def456ghi', -- Replace with actual clerk user ID
    'Test Exhibition Opening',
    'Join us for the opening of our latest exhibition featuring local artists.',
    'published',
    2,
    ARRAY['exhibition', 'opening', 'art'],
    'both',
    'event',
    'exhibition',
    'Bakehouse Art Complex, Miami FL',
    NOW() + INTERVAL '7 days',
    'https://bacfl.org',
    NOW(),
    NOW()
);
*/

-- 2. Create a test urgent announcement
/*
INSERT INTO announcements (
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
    created_at,
    published_at
) VALUES (
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'user_2abc123def456ghi', -- Replace with actual clerk user ID
    'Facility Maintenance Notice',
    'The studio will be closed for maintenance on Friday.',
    'published',
    4,
    ARRAY['maintenance', 'closure'],
    'internal',
    'urgent',
    'closure',
    NOW(),
    NOW()
);
*/

-- 3. Create a test opportunity announcement
/*
INSERT INTO announcements (
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
    primary_link,
    created_at,
    published_at
) VALUES (
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'user_2abc123def456ghi', -- Replace with actual clerk user ID
    'Open Call for Artists',
    'We are accepting applications for our residency program.',
    'published',
    3,
    ARRAY['residency', 'opportunity', 'artists'],
    'both',
    'opportunity',
    'open_call',
    'https://bacfl.org/apply',
    NOW(),
    NOW()
);
*/

-- 4. Create a test workshop announcement
/*
INSERT INTO announcements (
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
    primary_link,
    created_at,
    published_at
) VALUES (
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'user_2abc123def456ghi', -- Replace with actual clerk user ID
    'Ceramics Workshop',
    'Learn the basics of ceramics in this hands-on workshop.',
    'published',
    2,
    ARRAY['workshop', 'ceramics', 'learning'],
    'both',
    'event',
    'workshop',
    'Studio 101, Bakehouse Art Complex',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
    'https://bacfl.org/workshops',
    NOW(),
    NOW()
);
*/

-- 5. Create a test administrative announcement
/*
INSERT INTO announcements (
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
    created_at,
    published_at
) VALUES (
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'user_2abc123def456ghi', -- Replace with actual clerk user ID
    'Community Survey',
    'Please take a moment to complete our annual community survey.',
    'published',
    1,
    ARRAY['survey', 'feedback', 'community'],
    'internal',
    'administrative',
    'survey',
    NOW(),
    NOW()
);
*/

-- To use this script:
-- 1. First run the debug-announcements.sql script to get the organization ID and user IDs
-- 2. Uncomment the announcements you want to create
-- 3. Replace 'user_2abc123def456ghi' with actual clerk user IDs from your system
-- 4. Run the script in your Supabase SQL editor
