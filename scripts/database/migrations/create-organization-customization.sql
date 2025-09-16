-- Organization Customization System
-- This script creates tables and data for organization-specific theming and custom announcement types

-- 1. Organization Themes Table
CREATE TABLE IF NOT EXISTS public.organization_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Color Scheme
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#10b981',
  accent_color TEXT DEFAULT '#f59e0b',
  background_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#1f2937',
  
  -- Special Element Colors
  date_text_color TEXT DEFAULT '#ffffff', -- For top-right date display
  badge_color TEXT DEFAULT '#3b82f6', -- For announcement type badges
  highlight_color TEXT DEFAULT '#fbbf24', -- For special highlights
  
  -- Pattern Settings
  background_pattern TEXT DEFAULT 'geometric', -- geometric, bauhaus, dots, stripes, etc.
  pattern_intensity DECIMAL(3,2) DEFAULT 0.3, -- 0.0 to 1.0
  pattern_color TEXT DEFAULT '#e5e7eb',
  
  -- Typography
  heading_font TEXT DEFAULT 'Inter',
  body_font TEXT DEFAULT 'Inter',
  font_weight_heading TEXT DEFAULT 'bold',
  font_weight_body TEXT DEFAULT 'normal',
  
  -- Layout Preferences
  card_style TEXT DEFAULT 'rounded', -- rounded, square, minimal
  shadow_intensity DECIMAL(3,2) DEFAULT 0.1,
  border_radius DECIMAL(3,2) DEFAULT 0.5,
  
  -- Animation Settings
  animation_speed TEXT DEFAULT 'normal', -- slow, normal, fast
  hover_effects BOOLEAN DEFAULT true,
  transition_duration INTEGER DEFAULT 300, -- milliseconds
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id)
);

-- 2. Organization Announcement Types Table
CREATE TABLE IF NOT EXISTS public.organization_announcement_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Type Definition
  type_key TEXT NOT NULL, -- e.g., 'attention_artists', 'attention_public', 'fun_fact', 'promotion'
  type_label TEXT NOT NULL, -- e.g., 'Attention Artists', 'Attention Public', 'Fun Fact', 'Promotion'
  type_description TEXT,
  
  -- Visual Settings
  icon_name TEXT, -- lucide-react icon name
  color TEXT DEFAULT '#3b82f6',
  background_color TEXT DEFAULT '#f3f4f6',
  text_color TEXT DEFAULT '#1f2937',
  
  -- Behavior Settings
  priority INTEGER DEFAULT 0, -- Higher numbers = higher priority
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true, -- Show in public displays
  requires_approval BOOLEAN DEFAULT false,
  
  -- Display Settings
  show_in_carousel BOOLEAN DEFAULT true,
  show_in_list BOOLEAN DEFAULT true,
  show_in_dashboard BOOLEAN DEFAULT true,
  
  -- Special Settings for different types
  is_promotional BOOLEAN DEFAULT false, -- For ads/promotions
  is_fun_fact BOOLEAN DEFAULT false, -- For fun facts
  is_urgent BOOLEAN DEFAULT false, -- For urgent announcements
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, type_key)
);

-- 3. Organization Announcement Type Mappings
CREATE TABLE IF NOT EXISTS public.organization_announcement_type_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Map standard types to custom types
  standard_type TEXT NOT NULL, -- 'event', 'urgent', 'opportunity', etc.
  standard_sub_type TEXT, -- 'exhibition', 'workshop', etc.
  custom_type_key TEXT NOT NULL, -- References organization_announcement_types.type_key
  
  -- Conditions for mapping
  condition_key TEXT, -- 'title_contains', 'body_contains', 'tag_contains', etc.
  condition_value TEXT, -- The value to match against
  
  priority INTEGER DEFAULT 0, -- Higher numbers = higher priority
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, standard_type, standard_sub_type, condition_key, condition_value)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_themes_org_id ON organization_themes(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_announcement_types_org_id ON organization_announcement_types(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_announcement_types_active ON organization_announcement_types(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_organization_type_mappings_org_id ON organization_announcement_type_mappings(organization_id);

-- 5. Insert Bakehouse-specific theme
INSERT INTO organization_themes (
  organization_id,
  primary_color,
  secondary_color,
  accent_color,
  date_text_color,
  badge_color,
  highlight_color,
  background_pattern,
  pattern_intensity,
  pattern_color,
  card_style,
  shadow_intensity,
  border_radius
) 
SELECT 
  o.id,
  '#1e40af', -- Bright primary blue
  '#dc2626', -- Bright primary red
  '#fbbf24', -- Bright yellow
  '#fbbf24', -- Bright yellow for dates
  '#1e40af', -- Blue for badges
  '#fbbf24', -- Yellow for highlights
  'bauhaus', -- Bauhaus pattern
  0.4, -- Medium intensity
  '#e5e7eb', -- Light gray pattern
  'rounded', -- Rounded cards
  0.15, -- Slightly more shadow
  0.75 -- More rounded corners
FROM organizations o 
WHERE o.slug = 'bakehouse'
ON CONFLICT (organization_id) DO UPDATE SET
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  date_text_color = EXCLUDED.date_text_color,
  badge_color = EXCLUDED.badge_color,
  highlight_color = EXCLUDED.highlight_color,
  background_pattern = EXCLUDED.background_pattern,
  pattern_intensity = EXCLUDED.pattern_intensity,
  pattern_color = EXCLUDED.pattern_color,
  card_style = EXCLUDED.card_style,
  shadow_intensity = EXCLUDED.shadow_intensity,
  border_radius = EXCLUDED.border_radius,
  updated_at = NOW();

-- 6. Insert Bakehouse-specific announcement types
INSERT INTO organization_announcement_types (
  organization_id,
  type_key,
  type_label,
  type_description,
  icon_name,
  color,
  background_color,
  text_color,
  priority,
  is_promotional,
  is_fun_fact,
  is_urgent
) 
SELECT 
  o.id,
  'attention_artists',
  'Attention Artists',
  'Important announcements specifically for artists',
  'Palette',
  '#1e40af', -- Blue
  '#dbeafe', -- Light blue background
  '#1e40af', -- Blue text
  10,
  false,
  false,
  false
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'attention_public',
  'Attention Public',
  'Important announcements for the general public',
  'Users',
  '#dc2626', -- Red
  '#fee2e2', -- Light red background
  '#dc2626', -- Red text
  9,
  false,
  false,
  false
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'fun_fact',
  'Fun Fact',
  'Interesting facts about Bakehouse history and community',
  'Lightbulb',
  '#fbbf24', -- Yellow
  '#fef3c7', -- Light yellow background
  '#92400e', -- Dark yellow text
  5,
  false,
  true,
  false
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'promotion',
  'Promotion',
  'Special promotions, events, and announcements',
  'Gift',
  '#7c3aed', -- Purple
  '#ede9fe', -- Light purple background
  '#7c3aed', -- Purple text
  8,
  true,
  false,
  false
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'gala_announcement',
  'Gala Announcement',
  'Special announcements about the annual gala',
  'Crown',
  '#dc2626', -- Red
  '#fee2e2', -- Light red background
  '#dc2626', -- Red text
  15,
  true,
  false,
  true
FROM organizations o 
WHERE o.slug = 'bakehouse'

ON CONFLICT (organization_id, type_key) DO UPDATE SET
  type_label = EXCLUDED.type_label,
  type_description = EXCLUDED.type_description,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color,
  background_color = EXCLUDED.background_color,
  text_color = EXCLUDED.text_color,
  priority = EXCLUDED.priority,
  is_promotional = EXCLUDED.is_promotional,
  is_fun_fact = EXCLUDED.is_fun_fact,
  is_urgent = EXCLUDED.is_urgent,
  updated_at = NOW();

-- 7. Insert type mappings for automatic categorization
INSERT INTO organization_announcement_type_mappings (
  organization_id,
  standard_type,
  standard_sub_type,
  custom_type_key,
  condition_key,
  condition_value,
  priority
) 
SELECT 
  o.id,
  'event',
  'exhibition',
  'attention_artists',
  'title_contains',
  'exhibition',
  5
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'event',
  'workshop',
  'attention_artists',
  'title_contains',
  'workshop',
  5
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'opportunity',
  'open_call',
  'attention_artists',
  'title_contains',
  'open call',
  5
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'event',
  'social',
  'attention_public',
  'title_contains',
  'gala',
  10
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'event',
  'social',
  'gala_announcement',
  'title_contains',
  'birthday',
  15
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  o.id,
  'event',
  'social',
  'gala_announcement',
  'body_contains',
  'gift',
  15
FROM organizations o 
WHERE o.slug = 'bakehouse'

ON CONFLICT (organization_id, standard_type, standard_sub_type, condition_key, condition_value) DO UPDATE SET
  custom_type_key = EXCLUDED.custom_type_key,
  priority = EXCLUDED.priority,
  updated_at = NOW();

-- 8. Create a view for easy querying of organization themes with announcements
CREATE OR REPLACE VIEW organization_announcements_with_theme AS
SELECT 
  a.*,
  o.name as organization_name,
  o.slug as organization_slug,
  ot.primary_color,
  ot.secondary_color,
  ot.accent_color,
  ot.date_text_color,
  ot.badge_color,
  ot.highlight_color,
  ot.background_pattern,
  ot.pattern_intensity,
  ot.pattern_color,
  ot.card_style,
  ot.shadow_intensity,
  ot.border_radius,
  oat.type_key as custom_type_key,
  oat.type_label as custom_type_label,
  oat.icon_name as custom_icon_name,
  oat.color as custom_type_color,
  oat.background_color as custom_type_background_color,
  oat.text_color as custom_type_text_color,
  oat.is_promotional,
  oat.is_fun_fact,
  oat.is_urgent
FROM announcements a
JOIN organizations o ON a.org_id = o.id
LEFT JOIN organization_themes ot ON o.id = ot.organization_id
LEFT JOIN organization_announcement_types oat ON (
  o.id = oat.organization_id 
  AND oat.is_active = true
  AND (
    -- Direct type mapping
    (a.type = oat.type_key) OR
    -- Check type mappings
    EXISTS (
      SELECT 1 FROM organization_announcement_type_mappings oatm
      WHERE oatm.organization_id = o.id
      AND oatm.custom_type_key = oat.type_key
      AND (
        (oatm.standard_type = a.type AND (oatm.standard_sub_type IS NULL OR oatm.standard_sub_type = a.sub_type)) OR
        (oatm.condition_key = 'title_contains' AND LOWER(a.title) LIKE '%' || LOWER(oatm.condition_value) || '%') OR
        (oatm.condition_key = 'body_contains' AND LOWER(a.body) LIKE '%' || LOWER(oatm.condition_value) || '%') OR
        (oatm.condition_key = 'tag_contains' AND EXISTS (
          SELECT 1 FROM unnest(a.tags) as tag 
          WHERE LOWER(tag) LIKE '%' || LOWER(oatm.condition_value) || '%'
        ))
      )
      ORDER BY oatm.priority DESC
      LIMIT 1
    )
  )
)
ORDER BY oat.priority DESC, a.created_at DESC;

-- 9. Create function to get organization theme
CREATE OR REPLACE FUNCTION get_organization_theme(org_slug TEXT)
RETURNS TABLE (
  organization_id UUID,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  date_text_color TEXT,
  badge_color TEXT,
  highlight_color TEXT,
  background_pattern TEXT,
  pattern_intensity DECIMAL,
  pattern_color TEXT,
  card_style TEXT,
  shadow_intensity DECIMAL,
  border_radius DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ot.organization_id,
    ot.primary_color,
    ot.secondary_color,
    ot.accent_color,
    ot.date_text_color,
    ot.badge_color,
    ot.highlight_color,
    ot.background_pattern,
    ot.pattern_intensity,
    ot.pattern_color,
    ot.card_style,
    ot.shadow_intensity,
    ot.border_radius
  FROM organization_themes ot
  JOIN organizations o ON ot.organization_id = o.id
  WHERE o.slug = org_slug;
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to get organization announcement types
CREATE OR REPLACE FUNCTION get_organization_announcement_types(org_slug TEXT)
RETURNS TABLE (
  type_key TEXT,
  type_label TEXT,
  type_description TEXT,
  icon_name TEXT,
  color TEXT,
  background_color TEXT,
  text_color TEXT,
  priority INTEGER,
  is_promotional BOOLEAN,
  is_fun_fact BOOLEAN,
  is_urgent BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oat.type_key,
    oat.type_label,
    oat.type_description,
    oat.icon_name,
    oat.color,
    oat.background_color,
    oat.text_color,
    oat.priority,
    oat.is_promotional,
    oat.is_fun_fact,
    oat.is_urgent
  FROM organization_announcement_types oat
  JOIN organizations o ON oat.organization_id = o.id
  WHERE o.slug = org_slug
  AND oat.is_active = true
  ORDER BY oat.priority DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. Add some sample fun facts for Bakehouse
INSERT INTO announcements (
  id,
  org_id,
  author_clerk_id,
  title,
  body,
  type,
  sub_type,
  status,
  priority,
  created_at,
  updated_at,
  tags,
  visibility,
  starts_at,
  ends_at
) 
SELECT 
  uuid_generate_v4(),
  o.id,
  'system', -- System-generated
  'Did you know Bakehouse used to make Merita Bread?',
  'Before becoming Miami''s premier artist community, the Bakehouse Art Complex was originally a commercial bakery that produced Merita Bread. The building''s industrial architecture and large open spaces made it perfect for conversion into artist studios and galleries. This rich history is part of what makes Bakehouse such a unique and inspiring place for artists to create and collaborate.',
  'fun_fact',
  'historical',
  'published',
  5,
  NOW(),
  NOW(),
  ARRAY['history', 'merita', 'bread', 'bakery', 'fun_fact'],
  'both',
  NOW(),
  NOW() + INTERVAL '30 days'
FROM organizations o 
WHERE o.slug = 'bakehouse'

UNION ALL

SELECT 
  uuid_generate_v4(),
  o.id,
  'system', -- System-generated
  'Did you know our Birthday is coming up? We accept gifts!',
  'Bakehouse Art Complex is celebrating another year of supporting Miami''s vibrant arts community! As we approach our anniversary, we''re grateful for the incredible artists, supporters, and community members who make this place special. If you''d like to show your support, we welcome donations, sponsorships, and of course, your continued participation in our community events and programs.',
  'promotion',
  'gala',
  'published',
  10,
  NOW(),
  NOW(),
  ARRAY['birthday', 'anniversary', 'gala', 'gifts', 'donations', 'celebration'],
  'both',
  NOW(),
  NOW() + INTERVAL '60 days'
FROM organizations o 
WHERE o.slug = 'bakehouse'

ON CONFLICT (id) DO NOTHING;

-- 12. Create RLS policies for security
ALTER TABLE organization_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_announcement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_announcement_type_mappings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to themes and types
CREATE POLICY "Allow public read access to organization themes" ON organization_themes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to organization announcement types" ON organization_announcement_types
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to organization type mappings" ON organization_announcement_type_mappings
  FOR SELECT USING (true);

-- Allow organization admins to modify their own themes and types
CREATE POLICY "Allow org admins to modify their themes" ON organization_themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = organization_themes.organization_id
      AND om.clerk_user_id = auth.uid()
      AND om.role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Allow org admins to modify their announcement types" ON organization_announcement_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = organization_announcement_types.organization_id
      AND om.clerk_user_id = auth.uid()
      AND om.role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Allow org admins to modify their type mappings" ON organization_announcement_type_mappings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = organization_announcement_type_mappings.organization_id
      AND om.clerk_user_id = auth.uid()
      AND om.role IN ('org_admin', 'super_admin')
    )
  );

-- 13. Add comments for documentation
COMMENT ON TABLE organization_themes IS 'Organization-specific visual themes and styling preferences';
COMMENT ON TABLE organization_announcement_types IS 'Custom announcement types for each organization';
COMMENT ON TABLE organization_announcement_type_mappings IS 'Mappings between standard and custom announcement types';
COMMENT ON VIEW organization_announcements_with_theme IS 'View combining announcements with organization themes and custom types';

COMMENT ON FUNCTION get_organization_theme(TEXT) IS 'Get theme settings for an organization by slug';
COMMENT ON FUNCTION get_organization_announcement_types(TEXT) IS 'Get custom announcement types for an organization by slug';
