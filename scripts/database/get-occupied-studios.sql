-- Get all occupied studios with artist information
-- This query shows which studios are occupied and by which artists

SELECT 
  ap.studio_number,
  ap.name as artist_name,
  ap.profile_image,
  ap.bio,
  ap.specialties,
  ap.website_url,
  ap.instagram_handle,
  ap.is_active,
  o.name as organization_name,
  o.slug as organization_slug
FROM artist_profiles ap
JOIN organizations o ON ap.organization_id = o.id
WHERE 
  ap.studio_number IS NOT NULL 
  AND ap.studio_number != ''
  AND ap.is_active = true
  AND o.slug = 'bakehouse'  -- Filter for Bakehouse specifically
ORDER BY 
  CASE 
    WHEN ap.studio_number ~ '^[0-9]+$' THEN ap.studio_number::integer
    ELSE 999999  -- Put non-numeric studio numbers at the end
  END,
  ap.studio_number;

-- Alternative query to get studio occupancy status
-- This shows all possible studios and whether they're occupied

WITH all_studios AS (
  -- This would need to be populated with all possible studio numbers
  -- For now, we'll get them from the artist_profiles table
  SELECT DISTINCT studio_number
  FROM artist_profiles 
  WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
    AND studio_number IS NOT NULL
    AND studio_number != ''
),
occupied_studios AS (
  SELECT 
    ap.studio_number,
    ap.name as artist_name,
    ap.profile_image,
    ap.specialties,
    ap.is_active
  FROM artist_profiles ap
  JOIN organizations o ON ap.organization_id = o.id
  WHERE 
    ap.studio_number IS NOT NULL 
    AND ap.studio_number != ''
    AND ap.is_active = true
    AND o.slug = 'bakehouse'
)
SELECT 
  s.studio_number,
  CASE 
    WHEN o.artist_name IS NOT NULL THEN 'Occupied'
    ELSE 'Available'
  END as status,
  o.artist_name,
  o.profile_image,
  o.specialties
FROM all_studios s
LEFT JOIN occupied_studios o ON s.studio_number = o.studio_number
ORDER BY 
  CASE 
    WHEN s.studio_number ~ '^[0-9]+$' THEN s.studio_number::integer
    ELSE 999999
  END,
  s.studio_number;

