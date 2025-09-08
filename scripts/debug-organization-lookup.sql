-- Debug Organization Lookup Script
-- This script helps debug organization lookup issues

-- 1. Check if the organization exists with the slug 'bakehouse'
SELECT 
  id,
  name,
  slug,
  logo_url,
  created_at,
  updated_at
FROM organizations 
WHERE slug = 'bakehouse';

-- 2. Check all organizations to see what slugs exist
SELECT 
  id,
  name,
  slug,
  created_at
FROM organizations 
ORDER BY created_at DESC;

-- 3. Check if there are any announcements for the bakehouse organization
SELECT 
  a.id,
  a.title,
  a.status,
  a.org_id,
  o.name as org_name,
  o.slug as org_slug
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY a.created_at DESC;

-- 4. Check user memberships for the bakehouse organization
SELECT 
  om.id,
  om.clerk_user_id,
  om.role,
  om.org_id,
  o.name as org_name,
  o.slug as org_slug,
  om.joined_at
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY om.joined_at DESC;

-- 5. Check if there are any issues with the organization data
SELECT 
  id,
  name,
  slug,
  CASE 
    WHEN slug IS NULL THEN 'NULL slug'
    WHEN slug = '' THEN 'Empty slug'
    WHEN LENGTH(slug) < 2 THEN 'Too short slug'
    ELSE 'OK'
  END as slug_status,
  created_at
FROM organizations 
WHERE slug = 'bakehouse' OR name ILIKE '%bakehouse%';
