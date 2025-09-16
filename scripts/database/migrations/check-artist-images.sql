-- Check Artist Images Status
-- This script shows the current state of artist profile images

-- Get organization ID
SELECT id, name, slug FROM organizations WHERE slug = 'bakehouse';

-- Count artists and their image status
SELECT 
    COUNT(*) as total_artists,
    COUNT(profile_image) as artists_with_images,
    COUNT(*) - COUNT(profile_image) as artists_without_images,
    ROUND((COUNT(profile_image)::decimal / COUNT(*)) * 100, 1) as percentage_with_images
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL;

-- Show all artists with their image status
SELECT 
    name,
    email,
    studio_type,
    CASE 
        WHEN profile_image IS NOT NULL AND profile_image != '' THEN '✅ Has Image'
        ELSE '❌ No Image'
    END as image_status,
    CASE 
        WHEN profile_image IS NOT NULL AND profile_image != '' THEN 
            SUBSTRING(profile_image FROM 'bakehouse_([^_]+_[^_]+)')
        ELSE 'N/A'
    END as image_filename_hint
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
ORDER BY 
    CASE WHEN profile_image IS NOT NULL AND profile_image != '' THEN 0 ELSE 1 END,
    name;

-- Show only artists without images
SELECT 
    'ARTISTS WITHOUT IMAGES' as status,
    name,
    email,
    studio_type
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
  AND (profile_image IS NULL OR profile_image = '')
ORDER BY name;
