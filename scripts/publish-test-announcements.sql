-- Publish Test Announcements Script
-- Use this to publish some announcements for testing

-- Update the specific announcement that was failing to published status
UPDATE announcements 
SET 
    status = 'published',
    published_at = NOW()
WHERE id = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';

-- Update a few more announcements to published status for testing
UPDATE announcements 
SET 
    status = 'published',
    published_at = NOW()
WHERE id IN (
    'b8f36297-c441-44da-95dd-4f754d784db4', -- Mindy Solomon Women's Group Studio Visit
    '6b3cbf63-b29c-4447-9d1f-fcaac32e357b', -- Artist Meet + Greet with René Morales
    '18f2efa8-87c1-4d79-8768-e77ba527aeed'  -- Open Studios
);

-- Add some rich data to make them more interesting for the carousel
UPDATE announcements 
SET 
    type = 'event',
    sub_type = 'exhibition',
    location = 'Bakehouse Art Complex, Miami FL',
    starts_at = NOW() + INTERVAL '7 days',
    primary_link = 'https://bacfl.org'
WHERE id = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';

UPDATE announcements 
SET 
    type = 'event',
    sub_type = 'workshop',
    location = 'Studio 101, Bakehouse Art Complex',
    starts_at = NOW() + INTERVAL '14 days',
    primary_link = 'https://bacfl.org/events'
WHERE id = 'b8f36297-c441-44da-95dd-4f754d784db4';

UPDATE announcements 
SET 
    type = 'event',
    sub_type = 'talk',
    location = 'Main Gallery, Bakehouse Art Complex',
    starts_at = NOW() + INTERVAL '21 days',
    primary_link = 'https://bacfl.org/artist-talks'
WHERE id = '6b3cbf63-b29c-4447-9d1f-fcaac32e357b';

UPDATE announcements 
SET 
    type = 'event',
    sub_type = 'open_studios',
    location = 'All Studios, Bakehouse Art Complex',
    starts_at = NOW() + INTERVAL '28 days',
    primary_link = 'https://bacfl.org/open-studios'
WHERE id = '18f2efa8-87c1-4d79-8768-e77ba527aeed';

-- Verify the updates
SELECT 
    id,
    title,
    status,
    type,
    sub_type,
    location,
    starts_at,
    published_at
FROM announcements 
WHERE id IN (
    '8edfa56a-7c52-47b3-ae53-6860a3c1bffa',
    'b8f36297-c441-44da-95dd-4f754d784db4',
    '6b3cbf63-b29c-4447-9d1f-fcaac32e357b',
    '18f2efa8-87c1-4d79-8768-e77ba527aeed'
);
