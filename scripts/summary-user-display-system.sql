-- Summary: User Display System for Organization
-- This script provides a comprehensive overview of how users are displayed in the organization

-- ==============================================
-- 1. USER DISPLAY COMPONENTS OVERVIEW
-- ==============================================

/*
UI COMPONENTS FOR USER DISPLAY:

1. UserAvatar Component:
   - Shows user photos (imageUrl) or initials
   - Generates colored backgrounds for users without photos
   - Supports sm/md/lg sizes
   - Falls back to email initial if no name

2. UserBadges Component:
   - Shows member type badges (studio_artist, associate, gallery, staff)
   - Shows role badges (super_admin, org_admin, moderator, staff, resident)
   - Color-coded badges with icons
   - Supports multiple tags/badges

3. Artist Profile Display:
   - Profile images from artist_profiles.profile_image
   - Additional images from artist_profile_images table
   - Studio information (number, type, location)
   - Member type and role information
   - Claim status (claimed/unclaimed)

4. Organization User Pages:
   - /o/[slug]/users - List all users with avatars and badges
   - /o/[slug]/artists - Grid view of artist profiles
   - /o/[slug]/users/[userId] - Individual user profile page
*/

-- ==============================================
-- 2. CHECK CURRENT USER DISPLAY DATA
-- ==============================================

-- Get all users with their display information
SELECT 
    om.clerk_user_id,
    om.role as membership_role,
    om.joined_at,
    ap.name as artist_name,
    ap.email as artist_email,
    ap.profile_image,
    ap.studio_number,
    ap.studio_type,
    ap.studio_location,
    ap.profile_type,
    ap.is_claimed,
    ap.claimed_by_clerk_user_id,
    omt.type_key as member_type_key,
    omt.label as member_type_label,
    omt.is_staff as member_type_is_staff,
    o.name as org_name
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
LEFT JOIN artist_profiles ap ON om.clerk_user_id = ap.claimed_by_clerk_user_id AND ap.organization_id = o.id
LEFT JOIN org_member_types omt ON ap.member_type_id = omt.id
WHERE o.slug = 'bakehouse'
ORDER BY om.role, ap.name;

-- ==============================================
-- 3. CHECK ARTIST PROFILE IMAGES
-- ==============================================

-- Get artist profiles with their image information
SELECT 
    ap.name,
    ap.profile_image,
    ap.is_claimed,
    ap.profile_type,
    ap.studio_type,
    COUNT(api.id) as additional_images_count,
    STRING_AGG(api.image_url, ', ') as additional_image_urls
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN artist_profile_images api ON ap.id = api.artist_profile_id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
GROUP BY ap.id, ap.name, ap.profile_image, ap.is_claimed, ap.profile_type, ap.studio_type
ORDER BY ap.name;

-- ==============================================
-- 4. CHECK MEMBER TYPES AND ROLES
-- ==============================================

-- Get all member types with their display properties
SELECT 
    omt.type_key,
    omt.label,
    omt.description,
    omt.is_staff,
    omt.default_role_on_claim,
    omt.sort_order,
    COUNT(ap.id) as artist_count
FROM org_member_types omt
JOIN organizations o ON omt.org_id = o.id
LEFT JOIN artist_profiles ap ON omt.id = ap.member_type_id AND ap.organization_id = o.id AND ap.deleted_at IS NULL
WHERE o.slug = 'bakehouse'
GROUP BY omt.id, omt.type_key, omt.label, omt.description, omt.is_staff, omt.default_role_on_claim, omt.sort_order
ORDER BY omt.sort_order, omt.label;

-- ==============================================
-- 5. CHECK USER TAGS AND TAXONOMIES
-- ==============================================

-- Get artist profiles with their tags
SELECT 
    ap.name,
    ap.profile_type,
    ap.studio_type,
    STRING_AGG(DISTINCT t.label, ', ') as tags,
    STRING_AGG(DISTINCT ot.label, ', ') as tag_categories
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN artist_profile_terms apt ON ap.id = apt.artist_profile_id
LEFT JOIN org_terms t ON apt.term_id = t.id
LEFT JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
GROUP BY ap.id, ap.name, ap.profile_type, ap.studio_type
ORDER BY ap.name;

-- ==============================================
-- 6. DISPLAY READINESS CHECK
-- ==============================================

-- Check what's ready for display vs what needs attention
SELECT 
    'Total Users' as metric,
    COUNT(*) as count,
    'Ready for display' as status
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Users with Photos' as metric,
    COUNT(DISTINCT om.clerk_user_id) as count,
    CASE 
        WHEN COUNT(DISTINCT om.clerk_user_id) > 0 THEN 'Ready for display'
        ELSE 'Need to add photos'
    END as status
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
LEFT JOIN artist_profiles ap ON om.clerk_user_id = ap.claimed_by_clerk_user_id AND ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND (ap.profile_image IS NOT NULL OR EXISTS (
    SELECT 1 FROM artist_profile_images api WHERE api.artist_profile_id = ap.id
  ))

UNION ALL

SELECT 
    'Artist Profiles' as metric,
    COUNT(*) as count,
    'Ready for display' as status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL

UNION ALL

SELECT 
    'Claimed Profiles' as metric,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'Ready for display'
        ELSE 'Need to claim profiles'
    END as status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.is_claimed = true

UNION ALL

SELECT 
    'Profiles with Member Types' as metric,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'Ready for display'
        ELSE 'Need to assign member types'
    END as status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.member_type_id IS NOT NULL

UNION ALL

SELECT 
    'Profiles with Tags' as metric,
    COUNT(DISTINCT ap.id) as count,
    CASE 
        WHEN COUNT(DISTINCT ap.id) > 0 THEN 'Ready for display'
        ELSE 'Need to add tags'
    END as status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM artist_profile_terms apt WHERE apt.artist_profile_id = ap.id
  );

-- ==============================================
-- 7. SAMPLE USER DISPLAY DATA
-- ==============================================

-- Get a sample of users as they would appear in the UI
SELECT 
    om.clerk_user_id,
    COALESCE(ap.name, 'User') as display_name,
    COALESCE(ap.email, 'No email') as display_email,
    ap.profile_image as avatar_url,
    ap.studio_number,
    ap.studio_type,
    om.role as user_role,
    omt.label as member_type_label,
    omt.type_key as member_type_key,
    ap.is_claimed,
    CASE 
        WHEN ap.profile_image IS NOT NULL THEN 'Has photo'
        WHEN EXISTS (SELECT 1 FROM artist_profile_images api WHERE api.artist_profile_id = ap.id) THEN 'Has additional images'
        ELSE 'No photo - will show initials'
    END as avatar_status
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
LEFT JOIN artist_profiles ap ON om.clerk_user_id = ap.claimed_by_clerk_user_id AND ap.organization_id = o.id
LEFT JOIN org_member_types omt ON ap.member_type_id = omt.id
WHERE o.slug = 'bakehouse'
ORDER BY om.role, ap.name
LIMIT 10;
