-- Create MadArts Organization with Proper Logo Configuration
-- This script creates the MadArts organization with light/dark mode logos

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert MadArts organization with proper logo configuration
INSERT INTO organizations (
    id,
    name,
    slug,
    description,
    logo_url,
    website,
    email,
    phone,
    address,
    city,
    state,
    zip_code,
    country,
    settings,
    theme,
    is_active
) VALUES (
    uuid_generate_v4(),
    'MadArts',
    'madarts',
    'MadArts is a creative organization focused on video performance, digital storytelling, and multimedia arts education. We provide comprehensive workshops and training programs for artists, content creators, and performers looking to master their craft in the digital age.',
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
    'https://madarts.org',
    'hello@madarts.org',
    '+1 (555) 123-4567',
    '123 Creative District',
    'Los Angeles',
    'CA',
    '90210',
    'US',
    '{
        "features": {
            "workshops": true,
            "learn_canvas": true,
            "bookings": true,
            "resources": true,
            "artist_profiles": true,
            "announcements": true,
            "surveys": true
        },
        "subscription": {
            "tier": "professional",
            "status": "active"
        },
        "logos": {
            "light_mode": "https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png",
            "dark_mode": "https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png"
        }
    }',
    '{
        "primary_color": "#E91E63",
        "secondary_color": "#F48FB1",
        "accent_color": "#FCE4EC",
        "background_color": "#FFFFFF",
        "text_color": "#1F2937",
        "border_color": "#E5E7EB",
        "dark_mode": {
            "primary_color": "#F48FB1",
            "secondary_color": "#E91E63",
            "accent_color": "#1F2937",
            "background_color": "#111827",
            "text_color": "#F9FAFB",
            "border_color": "#374151"
        }
    }',
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    website = EXCLUDED.website,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    settings = EXCLUDED.settings,
    theme = EXCLUDED.theme,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Get the MadArts organization ID for reference
DO $$
DECLARE
    madarts_org_id UUID;
BEGIN
    SELECT id INTO madarts_org_id FROM organizations WHERE slug = 'madarts';
    
    IF madarts_org_id IS NOT NULL THEN
        RAISE NOTICE 'MadArts organization created/updated with ID: %', madarts_org_id;
        RAISE NOTICE 'Light mode logo: https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png';
        RAISE NOTICE 'Dark mode logo: https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png';
    ELSE
        RAISE NOTICE 'Failed to create/update MadArts organization';
    END IF;
END $$;
