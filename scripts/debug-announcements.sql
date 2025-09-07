-- Debug Announcements Script
-- Use this to debug announcement issues in production Supabase database

-- 1. Check if the specific announcement exists
SELECT 
    id,
    title,
    status,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    deleted_at
FROM announcements 
WHERE id = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa';

-- 2. If not found, check all announcements for the organization
SELECT 
    id,
    title,
    status,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    deleted_at
FROM announcements 
WHERE org_id = (
    SELECT id FROM organizations WHERE slug = 'bakehouse'
)
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check organization details
SELECT 
    id,
    name,
    slug,
    created_at
FROM organizations 
WHERE slug = 'bakehouse';

-- 4. Check user memberships for debugging access issues
SELECT 
    om.id,
    om.clerk_user_id,
    om.role,
    om.org_id,
    o.name as org_name,
    o.slug as org_slug
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse';

-- 5. Check all announcements with their organization info
SELECT 
    a.id,
    a.title,
    a.status,
    a.org_id,
    o.name as org_name,
    o.slug as org_slug,
    a.author_clerk_id,
    a.created_at,
    a.published_at,
    a.deleted_at
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY a.created_at DESC;

-- 6. Check for soft-deleted announcements
SELECT 
    id,
    title,
    status,
    deleted_at,
    org_id
FROM announcements 
WHERE id = '8edfa56a-7c52-47b3-ae53-6860a3c1bffa'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%';

-- 7. Count announcements by status
SELECT 
    status,
    COUNT(*) as count
FROM announcements 
WHERE org_id = (
    SELECT id FROM organizations WHERE slug = 'bakehouse'
)
GROUP BY status;

-- 8. Check recent announcements (last 30 days)
SELECT 
    a.id,
    a.title,
    a.status,
    a.created_at,
    o.name as org_name,
    o.slug as org_slug
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE a.created_at >= NOW() - INTERVAL '30 days'
ORDER BY a.created_at DESC
LIMIT 20;
