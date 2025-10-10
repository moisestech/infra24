-- Update MadArts Organization with Banner Image and Logo URLs
-- This script updates the MadArts organization with the banner image and correct logo URLs

-- Update MadArts organization with banner image and logo URLs
UPDATE organizations 
SET 
    banner_image = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760057763/smart-sign/orgs/madarts/madarts-banner_symngx.jpg',
    logo_url = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
    logo_url_light = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
    logo_url_dark = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png',
    updated_at = NOW()
WHERE slug = 'madarts';

-- Verify the update
SELECT 
    id,
    name,
    slug,
    banner_image,
    logo_url,
    logo_url_light,
    logo_url_dark,
    updated_at
FROM organizations 
WHERE slug = 'madarts';
