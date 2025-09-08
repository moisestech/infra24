-- Cleanup Duplicate Events Script
-- This script removes duplicate announcements that were created when the script was run multiple times

-- ==============================================
-- 1. IDENTIFY DUPLICATES
-- ==============================================

-- First, let's see what duplicates we have
SELECT 
    a.title,
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(a.id::text, ', ') as ids,
    STRING_AGG(a.created_at::text, ', ') as created_dates
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
  AND a.author_clerk_id = 'system'
  AND a.created_at >= '2025-09-08 13:50:00' -- Only look at recent duplicates
GROUP BY a.title, a.type, a.sub_type
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- ==============================================
-- 2. DELETE DUPLICATES (KEEPING THE NEWEST)
-- ==============================================

-- Delete duplicate "Your Museum Access Cards are ready for pick up!" (keep the newer one)
DELETE FROM announcements 
WHERE id = 'f113c723-8bd1-4616-84b8-82890e82f65a' -- Older duplicate
  AND title = 'Your Museum Access Cards are ready for pick up!'
  AND author_clerk_id = 'system';

-- Delete duplicate "Lujan Candria - (RE)CHARGE to (RE)NEW Exhibition" (keep the newer one)
DELETE FROM announcements 
WHERE id = 'f92be57e-2286-4bdb-8d55-bb65de919cc6' -- Older duplicate
  AND title = 'Lujan Candria - (RE)CHARGE to (RE)NEW Exhibition'
  AND author_clerk_id = 'system';

-- Delete duplicate "CATS! The Exhibition!" (keep the newer one)
DELETE FROM announcements 
WHERE id = '7e23eb6e-0dcd-43d8-9990-39d3cb83d2cf' -- Older duplicate
  AND title = '"CATS!" The Exhibition!'
  AND author_clerk_id = 'system';

-- Delete duplicate "New World Symphony Orchestra - Recorded Performance" (keep the newer one)
DELETE FROM announcements 
WHERE id = '2d9367ef-f275-48b9-a470-e03152539882' -- Older duplicate
  AND title = 'New World Symphony Orchestra - Recorded Performance'
  AND author_clerk_id = 'system';

-- Delete duplicate "OPEN STUDIOS" (keep the newer one)
DELETE FROM announcements 
WHERE id = 'e928321f-a12d-4748-bd05-119f1085ce7f' -- Older duplicate
  AND title = 'OPEN STUDIOS'
  AND author_clerk_id = 'system';

-- Delete duplicate "BAC BOOKCLUB" (keep the newer one)
DELETE FROM announcements 
WHERE id = '85428fac-f463-49ea-983c-f74e85050c9c' -- Older duplicate
  AND title = 'BAC BOOKCLUB'
  AND author_clerk_id = 'system';

-- Delete duplicate "Bakehouse Annual Survey 2025" (keep the newer one)
DELETE FROM announcements 
WHERE id = '6cc85e4a-2f84-42d3-8a11-a1f4873ef02f' -- Older duplicate
  AND title = 'Bakehouse Annual Survey 2025'
  AND author_clerk_id = 'system';

-- Delete duplicate "Jennifer Printz "Infinite and Transient" Exhibition" (keep the newer one)
DELETE FROM announcements 
WHERE id = '6486e151-0032-478d-b1de-69d5a1e05383' -- Older duplicate
  AND title = 'Jennifer Printz "Infinite and Transient" Exhibition'
  AND author_clerk_id = 'system';

-- ==============================================
-- 3. VERIFY CLEANUP
-- ==============================================

-- Check that duplicates are gone
SELECT 
    a.title,
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(a.id::text, ', ') as ids
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
  AND a.author_clerk_id = 'system'
  AND a.created_at >= '2025-09-08 13:50:00'
GROUP BY a.title, a.type, a.sub_type
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- ==============================================
-- 4. FINAL COUNT
-- ==============================================

-- Get final count of Christine events
SELECT 
    COUNT(*) as total_christine_events,
    COUNT(CASE WHEN type = 'event' THEN 1 END) as events,
    COUNT(CASE WHEN type = 'opportunity' THEN 1 END) as opportunities,
    COUNT(CASE WHEN type = 'administrative' THEN 1 END) as administrative
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
  AND a.author_clerk_id = 'system'
  AND a.created_at >= '2025-09-08 13:50:00';

-- ==============================================
-- 5. LIST FINAL CHRISTINE EVENTS
-- ==============================================

-- Show the final clean list of Christine events
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    a.starts_at,
    a.ends_at,
    a.location
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
  AND a.author_clerk_id = 'system'
  AND a.created_at >= '2025-09-08 13:50:00'
ORDER BY a.type, a.created_at;
