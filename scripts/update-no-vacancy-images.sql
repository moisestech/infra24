-- Update No Vacancy announcement images with artist-specific images

-- Update Lee Pivnik - Wellspring
UPDATE announcements
SET image_url = 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570105/lee-no-vacancy-nov19th-2025_fji677.jpg'
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND title = 'No Vacancy: Wellspring by Lee Pivnik'
  AND location LIKE '%Shelborne%';

-- Update Fabiola Larios - Heartware
UPDATE announcements
SET image_url = 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/fabiola-no-vacancy-nov19th-2025_xyykbq.jpg'
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND title = 'No Vacancy: Heartware by Fabiola Larios'
  AND location LIKE '%Riviera Suites%';

-- Update Amanda Linares - Tierra Húmeda
UPDATE announcements
SET image_url = 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/amanda-no-vacancy-nov19th-2025_ivloz6.jpg'
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND title = 'No Vacancy: Tierra Húmeda by Amanda Linares'
  AND location LIKE '%EDITION%';

-- Update Edison Peñafiel - Florida Florarium
UPDATE announcements
SET image_url = 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/edison-no-vacancy-nov19th-2025_hgb2rc.jpg'
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND title = 'No Vacancy: Florida Florarium by Edison Peñafiel'
  AND location LIKE '%Catalina%';

-- Verify updates
SELECT 
  title,
  image_url,
  location
FROM announcements
WHERE org_id IN (SELECT id FROM organizations WHERE slug = 'oolite')
  AND title LIKE 'No Vacancy:%'
ORDER BY title;

