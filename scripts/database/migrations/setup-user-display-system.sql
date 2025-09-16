-- Setup User Display System Script
-- This script helps understand the current state and provides guidance for setting up user display

-- ==============================================
-- 1. EXAMINE CURRENT ARTIST PROFILES
-- ==============================================

-- Get sample of artist profiles to understand the data
SELECT 
    ap.id,
    ap.name,
    ap.email,
    ap.studio_number,
    ap.studio_type,
    ap.studio_location,
    ap.profile_type,
    ap.is_claimed,
    ap.claimed_by_clerk_user_id,
    ap.profile_image,
    ap.website_url,
    ap.instagram_handle,
    ap.bio,
    ap.specialties,
    ap.is_active,
    ap.created_at
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
ORDER BY ap.created_at DESC
LIMIT 10;

-- ==============================================
-- 2. CHECK MEMBER TYPES ASSIGNMENT
-- ==============================================

-- See which profiles have member types assigned
SELECT 
    ap.name,
    ap.studio_type,
    ap.profile_type,
    omt.type_key,
    omt.label,
    omt.is_staff,
    omt.default_role_on_claim
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN org_member_types omt ON ap.member_type_id = omt.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.member_type_id IS NOT NULL
ORDER BY ap.name;

-- ==============================================
-- 3. CHECK AVAILABLE MEMBER TYPES
-- ==============================================

-- See what member types are available for assignment
SELECT 
    omt.id,
    omt.type_key,
    omt.label,
    omt.description,
    omt.is_staff,
    omt.default_role_on_claim,
    omt.sort_order,
    COUNT(ap.id) as assigned_count
FROM org_member_types omt
JOIN organizations o ON omt.org_id = o.id
LEFT JOIN artist_profiles ap ON omt.id = ap.member_type_id AND ap.organization_id = o.id AND ap.deleted_at IS NULL
WHERE o.slug = 'bakehouse'
GROUP BY omt.id, omt.type_key, omt.label, omt.description, omt.is_staff, omt.default_role_on_claim, omt.sort_order
ORDER BY omt.sort_order;

-- ==============================================
-- 4. CHECK TAXONOMIES AND TERMS FOR TAGGING
-- ==============================================

-- See what tagging system is available
SELECT 
    ot.id,
    ot.key,
    ot.label,
    ot.description,
    COUNT(t.id) as term_count
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
LEFT JOIN org_terms t ON ot.id = t.taxonomy_id
WHERE o.slug = 'bakehouse'
GROUP BY ot.id, ot.key, ot.label, ot.description
ORDER BY ot.label;

-- Get terms for each taxonomy
SELECT 
    ot.label as taxonomy_label,
    t.key,
    t.label,
    t.sort_order
FROM org_terms t
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY ot.label, t.sort_order, t.label;

-- ==============================================
-- 5. SAMPLE PROFILES BY STUDIO TYPE
-- ==============================================

-- See the breakdown by studio type
SELECT 
    ap.studio_type,
    COUNT(*) as count,
    STRING_AGG(ap.name, ', ') as sample_names
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
GROUP BY ap.studio_type
ORDER BY count DESC;

-- ==============================================
-- 6. PROFILES WITH CONTACT INFORMATION
-- ==============================================

-- See which profiles have email addresses (potential for user accounts)
SELECT 
    ap.name,
    ap.email,
    ap.studio_type,
    ap.profile_type,
    CASE 
        WHEN ap.email IS NOT NULL AND ap.email != '' THEN 'Has email'
        ELSE 'No email'
    END as email_status
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
ORDER BY ap.email IS NOT NULL DESC, ap.name
LIMIT 20;

-- ==============================================
-- 7. SETUP RECOMMENDATIONS
-- ==============================================

-- Generate setup recommendations based on current data
SELECT 
    'Total Artist Profiles' as item,
    COUNT(*) as current_count,
    'Ready' as status,
    'These are the artist profiles that can be claimed by users' as recommendation
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL

UNION ALL

SELECT 
    'Profiles with Emails' as item,
    COUNT(*) as current_count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'Ready for user accounts'
        ELSE 'Need to add email addresses'
    END as status,
    'These profiles can have user accounts created' as recommendation
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.email IS NOT NULL AND ap.email != ''

UNION ALL

SELECT 
    'Member Types Available' as item,
    COUNT(*) as current_count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'Ready for assignment'
        ELSE 'Need to create member types'
    END as status,
    'These can be assigned to artist profiles for categorization' as recommendation
FROM org_member_types omt
JOIN organizations o ON omt.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Tagging Taxonomies' as item,
    COUNT(*) as current_count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'Ready for tagging'
        ELSE 'Need to create taxonomies'
    END as status,
    'These can be used to tag artist profiles with specialties' as recommendation
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse';
