-- Add Sample Emails Script
-- This script adds sample email addresses to artist profiles so they can be claimed by users

-- ==============================================
-- 1. ADD SAMPLE EMAIL ADDRESSES
-- ==============================================

-- Add sample emails to profiles that don't have them
-- This will allow users to claim their profiles

-- Add unique emails using ID to ensure uniqueness
UPDATE artist_profiles 
SET email = LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '.'), '''', ''), '-', '')) || '.' || SUBSTRING(id::text, 1, 8) || '@bakehouse-artist.com'
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND (email IS NULL OR email = '')
  AND deleted_at IS NULL;

-- ==============================================
-- 2. ADD SPECIFIC STAFF EMAILS
-- ==============================================

-- Add specific emails for staff members
UPDATE artist_profiles 
SET email = CASE 
    WHEN name ILIKE '%cortes%' OR name ILIKE '%christine%' THEN 'christine.cortes@bacfl.org'
    WHEN name ILIKE '%leff%' OR name ILIKE '%cathy%' THEN 'cathy.leff@bacfl.org'
    WHEN name ILIKE '%krys%' OR name ILIKE '%ortega%' THEN 'krys.ortega@bacfl.org'
    WHEN name ILIKE '%rene%' OR name ILIKE '%morales%' THEN 'rene.morales@bacfl.org'
    WHEN name ILIKE '%jenna%' OR name ILIKE '%efrein%' THEN 'jenna.efrein@bacfl.org'
    WHEN profile_type = 'staff' AND email IS NULL THEN LOWER(REPLACE(REPLACE(name, ' ', '.'), '''', '')) || '@bacfl.org'
END
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
  AND (name ILIKE '%cortes%' OR name ILIKE '%christine%' OR name ILIKE '%leff%' OR name ILIKE '%cathy%' 
       OR name ILIKE '%krys%' OR name ILIKE '%ortega%' OR name ILIKE '%rene%' OR name ILIKE '%morales%'
       OR name ILIKE '%jenna%' OR name ILIKE '%efrein%' OR profile_type = 'staff');

-- ==============================================
-- 3. VERIFY EMAIL ADDITIONS
-- ==============================================

-- Check how many profiles now have emails
SELECT 
    'Profiles with Emails' as metric,
    COUNT(*) as count,
    'Ready for user accounts' as status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.email IS NOT NULL 
  AND ap.email != '';

-- Show sample of profiles with emails
SELECT 
    ap.name,
    ap.email,
    ap.studio_type,
    ap.profile_type,
    omt.label as member_type
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN org_member_types omt ON ap.member_type_id = omt.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.email IS NOT NULL 
  AND ap.email != ''
ORDER BY ap.profile_type, ap.name
LIMIT 15;

-- ==============================================
-- 4. SUMMARY OF READY PROFILES
-- ==============================================

-- Show breakdown by profile type
SELECT 
    ap.profile_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN ap.email IS NOT NULL AND ap.email != '' THEN 1 END) as profiles_with_emails,
    COUNT(CASE WHEN ap.member_type_id IS NOT NULL THEN 1 END) as profiles_with_member_types,
    COUNT(CASE WHEN EXISTS (SELECT 1 FROM artist_profile_terms apt WHERE apt.artist_profile_id = ap.id) THEN 1 END) as profiles_with_tags
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
GROUP BY ap.profile_type
ORDER BY ap.profile_type;
