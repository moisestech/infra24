-- Check Organization Users and Profiles Script
-- This script examines how users are displayed in the organization with their photos, roles, and tags

-- ==============================================
-- 1. CHECK ALL USERS IN BAKEHOUSE ORGANIZATION
-- ==============================================

-- Get all users with their membership details
SELECT 
    om.id as membership_id,
    om.clerk_user_id,
    om.role,
    om.org_id,
    om.joined_at,
    o.name as org_name,
    o.slug as org_slug
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY om.role, om.joined_at;

-- ==============================================
-- 2. CHECK ARTIST PROFILES
-- ==============================================

-- Get all artist profiles for Bakehouse
SELECT 
    ap.id,
    ap.name,
    ap.email,
    ap.studio_number,
    ap.studio_type,
    ap.studio_location,
    ap.profile_type,
    ap.is_active,
    ap.is_claimed,
    ap.claimed_by_clerk_user_id,
    ap.claimed_at,
    ap.profile_image,
    ap.website_url,
    ap.instagram_handle,
    ap.bio,
    ap.specialties,
    ap.media,
    ap.created_at,
    ap.updated_at,
    o.name as org_name
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
ORDER BY ap.name;

-- ==============================================
-- 3. CHECK MEMBER TYPES AND TAXONOMIES
-- ==============================================

-- Get all member types for Bakehouse
SELECT 
    omt.id,
    omt.type_key,
    omt.label,
    omt.description,
    omt.is_staff,
    omt.default_role_on_claim,
    omt.sort_order,
    o.name as org_name
FROM org_member_types omt
JOIN organizations o ON omt.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY omt.sort_order, omt.label;

-- ==============================================
-- 4. CHECK TAXONOMIES AND TERMS
-- ==============================================

-- Get all taxonomies for Bakehouse
SELECT 
    ot.id,
    ot.key,
    ot.label,
    ot.description,
    o.name as org_name
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY ot.label;

-- Get all terms for Bakehouse taxonomies
SELECT 
    t.id,
    t.key,
    t.label,
    t.sort_order,
    ot.label as taxonomy_label,
    o.name as org_name
FROM org_terms t
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY ot.label, t.sort_order, t.label;

-- ==============================================
-- 5. CHECK ARTIST PROFILE TERMS (TAGS)
-- ==============================================

-- Get artist profiles with their associated terms/tags
SELECT 
    ap.name as artist_name,
    ap.profile_type,
    ap.studio_type,
    ap.is_active,
    ap.is_claimed,
    STRING_AGG(t.label, ', ') as tags,
    STRING_AGG(ot.label, ', ') as tag_categories
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN artist_profile_terms apt ON ap.id = apt.artist_profile_id
LEFT JOIN org_terms t ON apt.term_id = t.id
LEFT JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
GROUP BY ap.id, ap.name, ap.profile_type, ap.studio_type, ap.is_active, ap.is_claimed
ORDER BY ap.name;

-- ==============================================
-- 6. CHECK ARTIST PROFILE IMAGES
-- ==============================================

-- Get artist profiles with their images
SELECT 
    ap.name as artist_name,
    ap.profile_image,
    api.image_url,
    api.alt_text,
    api.is_primary,
    api.sort_order
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN artist_profile_images api ON ap.id = api.artist_profile_id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
ORDER BY ap.name, api.sort_order;

-- ==============================================
-- 7. CHECK USER CLAIMS AND MEMBERSHIPS
-- ==============================================

-- Get artist profiles with their claim information
SELECT 
    ap.name as artist_name,
    ap.profile_type,
    ap.studio_type,
    ap.is_claimed,
    ap.claimed_by_clerk_user_id,
    ap.claimed_at,
    om.role as member_role,
    om.joined_at as member_joined_at
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN org_memberships om ON ap.claimed_by_clerk_user_id = om.clerk_user_id AND om.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
ORDER BY ap.name;

-- ==============================================
-- 8. CHECK ANNOUNCEMENT AUDIENCE TARGETING
-- ==============================================

-- Get announcements with their audience targeting
SELECT 
    a.title,
    a.type,
    a.sub_type,
    a.visibility,
    STRING_AGG(DISTINCT omt.label, ', ') as target_member_types,
    STRING_AGG(DISTINCT t.label, ', ') as target_terms
FROM announcements a
JOIN organizations o ON a.org_id = o.id
LEFT JOIN announcement_audience_member_types aamt ON a.id = aamt.announcement_id
LEFT JOIN org_member_types omt ON aamt.member_type_id = omt.id
LEFT JOIN announcement_audience_terms aat ON a.id = aat.announcement_id
LEFT JOIN org_terms t ON aat.term_id = t.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL
GROUP BY a.id, a.title, a.type, a.sub_type, a.visibility
ORDER BY a.created_at DESC;

-- ==============================================
-- 9. SUMMARY STATISTICS
-- ==============================================

-- Get summary statistics for the organization
SELECT 
    'Total Members' as metric,
    COUNT(*) as count
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Total Artist Profiles' as metric,
    COUNT(*) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL

UNION ALL

SELECT 
    'Claimed Profiles' as metric,
    COUNT(*) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.is_claimed = true

UNION ALL

SELECT 
    'Staff Profiles' as metric,
    COUNT(*) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.profile_type = 'staff'

UNION ALL

SELECT 
    'Artist Profiles' as metric,
    COUNT(*) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.profile_type = 'artist'

UNION ALL

SELECT 
    'Profiles with Images' as metric,
    COUNT(DISTINCT ap.id) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND (ap.profile_image IS NOT NULL OR EXISTS (
    SELECT 1 FROM artist_profile_images api WHERE api.artist_profile_id = ap.id
  ))

UNION ALL

SELECT 
    'Profiles with Tags' as metric,
    COUNT(DISTINCT ap.id) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM artist_profile_terms apt WHERE apt.artist_profile_id = ap.id
  );
