-- Create MadArts Organization for Video Performance Workshop
-- This script creates the MadArts organization and sets up the Video Performance workshop

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert MadArts organization
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
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
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
            "artist_profiles": true
        },
        "subscription": {
            "tier": "professional",
            "status": "active"
        }
    }',
    '{
        "primary_color": "#8B5CF6",
        "secondary_color": "#A78BFA",
        "accent_color": "#C4B5FD",
        "background_color": "#1F2937",
        "text_color": "#F9FAFB",
        "border_color": "#374151"
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
    ELSE
        RAISE NOTICE 'Failed to create/update MadArts organization';
    END IF;
END $$;
