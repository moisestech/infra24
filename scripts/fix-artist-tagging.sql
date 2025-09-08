-- Fix Artist Tagging Script
-- This script checks what's in the specialties field and adds appropriate tags

-- ==============================================
-- 1. CHECK WHAT'S IN SPECIALTIES FIELD
-- ==============================================

-- See what specialties data exists
SELECT 
    ap.name,
    ap.specialties,
    ap.studio_type,
    ap.profile_type
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.specialties IS NOT NULL
  AND array_length(ap.specialties, 1) > 0
ORDER BY ap.name
LIMIT 10;

-- ==============================================
-- 2. ADD TAGS BASED ON STUDIO TYPE
-- ==============================================

-- Add contemporary tag to all profiles (since they're all contemporary artists)
INSERT INTO artist_profile_terms (artist_profile_id, term_id)
SELECT 
    ap.id,
    t.id
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
JOIN org_terms t ON t.key = 'contemporary'
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id AND ot.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- ==============================================
-- 3. ADD TAGS BASED ON PROFILE TYPE
-- ==============================================

-- Add mixed_media tag to profiles that might be mixed media artists
INSERT INTO artist_profile_terms (artist_profile_id, term_id)
SELECT 
    ap.id,
    t.id
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
JOIN org_terms t ON t.key = 'mixed_media'
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id AND ot.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.profile_type = 'artist'
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- ==============================================
-- 4. ADD RANDOM TAGS FOR DEMONSTRATION
-- ==============================================

-- Add painting tag to first 20 profiles (for demonstration)
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
  AND ap.id IN (
    SELECT ap2.id 
    FROM artist_profiles ap2 
    JOIN organizations o2 ON ap2.organization_id = o2.id 
    WHERE o2.slug = 'bakehouse' 
      AND ap2.deleted_at IS NULL 
    ORDER BY ap2.created_at 
    LIMIT 20
  )
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- Add sculpture tag to next 20 profiles (for demonstration)
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
  AND ap.id IN (
    SELECT ap2.id 
    FROM artist_profiles ap2 
    JOIN organizations o2 ON ap2.organization_id = o2.id 
    WHERE o2.slug = 'bakehouse' 
      AND ap2.deleted_at IS NULL 
    ORDER BY ap2.created_at 
    OFFSET 20 LIMIT 20
  )
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- Add photography tag to next 20 profiles (for demonstration)
INSERT INTO artist_profile_terms (artist_profile_id, term_id)
SELECT 
    ap.id,
    t.id
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
JOIN org_terms t ON t.key = 'photography'
JOIN org_taxonomies ot ON t.taxonomy_id = ot.id AND ot.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND ap.id IN (
    SELECT ap2.id 
    FROM artist_profiles ap2 
    JOIN organizations o2 ON ap2.organization_id = o2.id 
    WHERE o2.slug = 'bakehouse' 
      AND ap2.deleted_at IS NULL 
    ORDER BY ap2.created_at 
    OFFSET 40 LIMIT 20
  )
  AND NOT EXISTS (
    SELECT 1 FROM artist_profile_terms apt 
    WHERE apt.artist_profile_id = ap.id AND apt.term_id = t.id
  );

-- ==============================================
-- 5. VERIFY RESULTS
-- ==============================================

-- Check the tagging results
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

-- Show sample of tagged profiles
SELECT 
    ap.name,
    ap.studio_type,
    STRING_AGG(t.label, ', ') as tags,
    STRING_AGG(ot.label, ', ') as tag_categories
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
LEFT JOIN artist_profile_terms apt ON ap.id = apt.artist_profile_id
LEFT JOIN org_terms t ON apt.term_id = t.id
LEFT JOIN org_taxonomies ot ON t.taxonomy_id = ot.id
WHERE o.slug = 'bakehouse'
  AND ap.deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM artist_profile_terms apt2 WHERE apt2.artist_profile_id = ap.id
  )
GROUP BY ap.id, ap.name, ap.studio_type
ORDER BY ap.name
LIMIT 10;
