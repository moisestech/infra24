-- Find User ID for Christine Cortes Events Script
-- Run this first to get the user ID you need

-- 1. Check if Bakehouse organization exists
SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations 
WHERE slug = 'bakehouse';

-- 2. Check all users in Bakehouse organization
SELECT 
    om.id as membership_id,
    om.clerk_user_id,
    om.role,
    om.org_id,
    o.name as org_name,
    o.slug as org_slug,
    om.joined_at
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY om.role, om.joined_at;

-- 3. If no users found, check all organizations and their users
SELECT 
    o.name as org_name,
    o.slug as org_slug,
    om.clerk_user_id,
    om.role,
    om.joined_at
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
ORDER BY o.name, om.role;

-- 4. Check if there are any announcements already (to see what author_clerk_id format looks like)
SELECT 
    a.id,
    a.title,
    a.author_clerk_id,
    a.status,
    a.created_at,
    o.name as org_name
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY a.created_at DESC
LIMIT 5;

-- 5. If you need to create a user first, here's a template:
-- You'll need to create a user through your application or Clerk dashboard first
-- Then add them to the organization with the appropriate role

-- Example of what a clerk_user_id looks like (this is just an example):
-- 'user_2abc123def456ghi789jkl'

-- Once you have a user ID, replace 'YOUR_USER_ID_HERE' in the main script
-- with the actual clerk_user_id value
