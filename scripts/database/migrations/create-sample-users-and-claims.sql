-- Create Sample Users and Claims Script
-- This script helps set up the user system by creating sample users and claiming artist profiles

-- ==============================================
-- 1. CREATE SAMPLE MEMBER TYPES (if needed)
-- ==============================================

-- Create member types for different artist categories
INSERT INTO org_member_types (org_id, type_key, label, description, is_staff, default_role_on_claim, sort_order)
SELECT 
    o.id,
    'studio_artist',
    'Studio Artist',
    'Full-time studio artist with dedicated studio space',
    false,
    'resident',
    1
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_member_types omt 
    WHERE omt.org_id = o.id AND omt.type_key = 'studio_artist'
  );

INSERT INTO org_member_types (org_id, type_key, label, description, is_staff, default_role_on_claim, sort_order)
SELECT 
    o.id,
    'associate',
    'Associate Artist',
    'Part-time or associate artist',
    false,
    'resident',
    2
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_member_types omt 
    WHERE omt.org_id = o.id AND omt.type_key = 'associate'
  );

INSERT INTO org_member_types (org_id, type_key, label, description, is_staff, default_role_on_claim, sort_order)
SELECT 
    o.id,
    'gallery',
    'Gallery Artist',
    'Artist with gallery representation',
    false,
    'resident',
    3
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_member_types omt 
    WHERE omt.org_id = o.id AND omt.type_key = 'gallery'
  );

INSERT INTO org_member_types (org_id, type_key, label, description, is_staff, default_role_on_claim, sort_order)
SELECT 
    o.id,
    'staff',
    'Staff',
    'Bakehouse staff member',
    true,
    'moderator',
    4
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_member_types omt 
    WHERE omt.org_id = o.id AND omt.type_key = 'staff'
  );

-- ==============================================
-- 2. CREATE SAMPLE TAXONOMIES FOR TAGGING
-- ==============================================

-- Create taxonomies for artist specialties
INSERT INTO org_taxonomies (org_id, key, label, description)
SELECT 
    o.id,
    'art_medium',
    'Art Medium',
    'Primary art medium or technique'
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_taxonomies ot 
    WHERE ot.org_id = o.id AND ot.key = 'art_medium'
  );

INSERT INTO org_taxonomies (org_id, key, label, description)
SELECT 
    o.id,
    'art_style',
    'Art Style',
    'Artistic style or movement'
FROM organizations o
WHERE o.slug = 'bakehouse'
  AND NOT EXISTS (
    SELECT 1 FROM org_taxonomies ot 
    WHERE ot.org_id = o.id AND ot.key = 'art_style'
  );

-- ==============================================
-- 3. CREATE SAMPLE TERMS FOR TAGGING
-- ==============================================

-- Create terms for art mediums
INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'painting',
    'Painting',
    1
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_medium'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'painting'
  );

INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'sculpture',
    'Sculpture',
    2
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_medium'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'sculpture'
  );

INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'photography',
    'Photography',
    3
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_medium'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'photography'
  );

INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'mixed_media',
    'Mixed Media',
    4
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_medium'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'mixed_media'
  );

-- Create terms for art styles
INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'contemporary',
    'Contemporary',
    1
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_style'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'contemporary'
  );

INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'abstract',
    'Abstract',
    2
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_style'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'abstract'
  );

INSERT INTO org_terms (taxonomy_id, key, label, sort_order)
SELECT 
    ot.id,
    'figurative',
    'Figurative',
    3
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse' AND ot.key = 'art_style'
  AND NOT EXISTS (
    SELECT 1 FROM org_terms t 
    WHERE t.taxonomy_id = ot.id AND t.key = 'figurative'
  );

-- ==============================================
-- 4. ASSIGN MEMBER TYPES TO SAMPLE PROFILES
-- ==============================================

-- Assign studio_artist type to profiles with studio numbers
UPDATE artist_profiles 
SET member_type_id = (
    SELECT omt.id 
    FROM org_member_types omt 
    JOIN organizations o ON omt.org_id = o.id 
    WHERE o.slug = 'bakehouse' 
      AND omt.type_key = 'studio_artist'
)
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND studio_number IS NOT NULL 
  AND studio_number != ''
  AND member_type_id IS NULL
  AND deleted_at IS NULL;

-- Assign associate type to profiles without studio numbers
UPDATE artist_profiles 
SET member_type_id = (
    SELECT omt.id 
    FROM org_member_types omt 
    JOIN organizations o ON omt.org_id = o.id 
    WHERE o.slug = 'bakehouse' 
      AND omt.type_key = 'associate'
)
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND (studio_number IS NULL OR studio_number = '')
  AND member_type_id IS NULL
  AND deleted_at IS NULL;

-- ==============================================
-- 5. ADD SAMPLE TAGS TO PROFILES
-- ==============================================

-- Add painting tag to profiles with 'painting' in their specialties
INSERT INTO artist_profile_terms (artist_profile_id, term_id)
SELECT 
    ap.id,
    t.id
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
JOIN org_terms t ON t.key = 'painting'
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id AND ot.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND (ap.specialties::text ILIKE '%painting%' OR ap.specialties::text ILIKE '%paint%')
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- Add sculpture tag to profiles with 'sculpture' in their specialties
INSERT INTO artist_profile_terms (artist_profile_id, term_id)
SELECT 
    ap.id,
    t.id
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
JOIN org_terms t ON t.key = 'sculpture'
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id AND ot.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND (ap.specialties::text ILIKE '%sculpture%' OR ap.specialties::text ILIKE '%sculpt%')
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- ==============================================
-- 6. VERIFY SETUP
-- ==============================================

-- Check the results
SELECT 
    'Member Types Created' as item,
    COUNT(*) as count
FROM org_member_types omt
JOIN organizations o ON omt.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Taxonomies Created' as item,
    COUNT(*) as count
FROM org_taxonomies ot
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Terms Created' as item,
    COUNT(*) as count
FROM org_terms t
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
JOIN organizations o ON ot.org_id = o.id
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
    'Profiles with Member Types' as item,
    COUNT(*) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.member_type_id IS NOT NULL

UNION ALL

SELECT 
    'Profiles with Tags' as item,
    COUNT(DISTINCT ap.id) as count
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM artist_profile_terms apt WHERE apt.artist_profile_id = ap.id
  );
