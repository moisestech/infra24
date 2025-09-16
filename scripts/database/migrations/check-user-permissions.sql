-- Check User Permissions Script
-- Use this to debug user access issues

-- 1. Check all users in the bakehouse organization
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

-- 2. Check if there are any users with admin roles
SELECT 
    om.clerk_user_id,
    om.role,
    o.name as org_name
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse' 
  AND om.role IN ('super_admin', 'org_admin', 'moderator')
ORDER BY om.role;

-- 3. Check announcement authors
SELECT DISTINCT
    a.author_clerk_id,
    COUNT(*) as announcement_count
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
GROUP BY a.author_clerk_id
ORDER BY announcement_count DESC;

-- 4. Check if announcement authors are still members
SELECT 
    a.author_clerk_id,
    a.title,
    a.status,
    CASE 
        WHEN om.clerk_user_id IS NOT NULL THEN 'Still a member'
        ELSE 'Not a member'
    END as membership_status,
    om.role
FROM announcements a
JOIN organizations o ON a.org_id = o.id
LEFT JOIN org_memberships om ON a.author_clerk_id = om.clerk_user_id AND om.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY a.created_at DESC;

-- 5. Check the specific failing announcement's author
SELECT 
    a.id,
    a.title,
    a.author_clerk_id,
    a.status,
    om.role as author_role,
    CASE 
        WHEN om.clerk_user_id IS NOT NULL THEN 'Author is still a member'
        ELSE 'Author is not a member'
    END as author_membership_status
FROM announcements a
LEFT JOIN org_memberships om ON a.author_clerk_id = om.clerk_user_id
WHERE a.id = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';
