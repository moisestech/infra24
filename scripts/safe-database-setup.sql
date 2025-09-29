-- Safe Database Setup Script
-- This script checks for existing tables and only creates what's missing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if organizations table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
        -- Create organizations table
        CREATE TABLE organizations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          logo_url VARCHAR(500),
          favicon_url VARCHAR(500),
          theme_colors JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created organizations table';
    ELSE
        -- Check if theme_colors column exists, if not add it
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'theme_colors') THEN
            ALTER TABLE organizations ADD COLUMN theme_colors JSONB;
            RAISE NOTICE 'Added theme_colors column to organizations table';
        END IF;
        
        -- Check if other columns exist and add them if missing
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'logo_url') THEN
            ALTER TABLE organizations ADD COLUMN logo_url VARCHAR(500);
            RAISE NOTICE 'Added logo_url column to organizations table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'favicon_url') THEN
            ALTER TABLE organizations ADD COLUMN favicon_url VARCHAR(500);
            RAISE NOTICE 'Added favicon_url column to organizations table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'created_at') THEN
            ALTER TABLE organizations ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added created_at column to organizations table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'updated_at') THEN
            ALTER TABLE organizations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to organizations table';
        END IF;
        
        RAISE NOTICE 'Organizations table already exists, updated columns as needed';
    END IF;
END $$;

-- Check if workshops table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workshops') THEN
        -- Create workshops table
        CREATE TABLE workshops (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          content TEXT,
          category VARCHAR(100),
          type VARCHAR(50),
          level VARCHAR(50),
          duration_minutes INTEGER,
          max_participants INTEGER,
          price DECIMAL(10,2),
          instructor VARCHAR(255),
          prerequisites TEXT[],
          materials TEXT[],
          outcomes TEXT[],
          is_active BOOLEAN DEFAULT TRUE,
          is_public BOOLEAN DEFAULT TRUE,
          is_shared BOOLEAN DEFAULT FALSE,
          metadata JSONB,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'draft',
          image_url VARCHAR(500),
          featured BOOLEAN DEFAULT FALSE,
          syllabus TEXT,
          syllabus_sections JSONB,
          learning_objectives TEXT[],
          materials_needed TEXT[],
          what_youll_learn TEXT[],
          workshop_outline TEXT,
          -- Learn Canvas specific fields
          has_learn_content BOOLEAN DEFAULT FALSE,
          learn_syllabus JSONB,
          learn_objectives TEXT[],
          estimated_learn_time INTEGER,
          learn_difficulty VARCHAR(20),
          learn_prerequisites TEXT[],
          learn_materials TEXT[]
        );
        
        RAISE NOTICE 'Created workshops table';
    ELSE
        -- Add missing columns to workshops table
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'has_learn_content') THEN
            ALTER TABLE workshops ADD COLUMN has_learn_content BOOLEAN DEFAULT FALSE;
            RAISE NOTICE 'Added has_learn_content column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'learn_syllabus') THEN
            ALTER TABLE workshops ADD COLUMN learn_syllabus JSONB;
            RAISE NOTICE 'Added learn_syllabus column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'learn_objectives') THEN
            ALTER TABLE workshops ADD COLUMN learn_objectives TEXT[];
            RAISE NOTICE 'Added learn_objectives column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'estimated_learn_time') THEN
            ALTER TABLE workshops ADD COLUMN estimated_learn_time INTEGER;
            RAISE NOTICE 'Added estimated_learn_time column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'learn_difficulty') THEN
            ALTER TABLE workshops ADD COLUMN learn_difficulty VARCHAR(20);
            RAISE NOTICE 'Added learn_difficulty column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'learn_prerequisites') THEN
            ALTER TABLE workshops ADD COLUMN learn_prerequisites TEXT[];
            RAISE NOTICE 'Added learn_prerequisites column to workshops table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workshops' AND column_name = 'learn_materials') THEN
            ALTER TABLE workshops ADD COLUMN learn_materials TEXT[];
            RAISE NOTICE 'Added learn_materials column to workshops table';
        END IF;
        
        RAISE NOTICE 'Workshops table already exists, updated columns as needed';
    END IF;
END $$;

-- Create workshop_chapters table if it doesn't exist
CREATE TABLE IF NOT EXISTS workshop_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, chapter_slug)
);

-- Create user_workshop_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_workshop_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES workshop_chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshops_organization_id ON workshops(organization_id);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_featured ON workshops(featured);
CREATE INDEX IF NOT EXISTS idx_workshops_has_learn_content ON workshops(has_learn_content);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order ON workshop_chapters(workshop_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust as needed)
DO $$
BEGIN
    -- Organizations policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Organizations are viewable by everyone') THEN
        CREATE POLICY "Organizations are viewable by everyone" ON organizations FOR SELECT USING (true);
    END IF;
    
    -- Workshops policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'workshops' AND policyname = 'Workshops are viewable by everyone') THEN
        CREATE POLICY "Workshops are viewable by everyone" ON workshops FOR SELECT USING (true);
    END IF;
    
    -- Workshop chapters policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'workshop_chapters' AND policyname = 'Workshop chapters are viewable by everyone') THEN
        CREATE POLICY "Workshop chapters are viewable by everyone" ON workshop_chapters FOR SELECT USING (true);
    END IF;
    
    -- User progress policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_workshop_progress' AND policyname = 'User progress is viewable by user') THEN
        CREATE POLICY "User progress is viewable by user" ON user_workshop_progress FOR SELECT USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Insert sample organization (Oolite Arts) if it doesn't exist
DO $$
DECLARE
    oolite_org_id UUID;
BEGIN
    -- Check if organization exists and get its ID
    SELECT id INTO oolite_org_id FROM organizations WHERE slug = 'oolite';
    
    IF oolite_org_id IS NULL THEN
        -- Create new organization
        INSERT INTO organizations (name, slug, description, logo_url, theme_colors) VALUES (
          'Oolite Arts',
          'oolite',
          'A cultural infrastructure platform supporting artists and creative communities.',
          '/oolite-logo.png',
          '{
            "primary": "#47abc4",
            "primaryLight": "#6bb8d1", 
            "primaryDark": "#3a8ba3",
            "primaryAlpha": "rgba(71, 171, 196, 0.1)",
            "primaryAlphaLight": "rgba(71, 171, 196, 0.05)",
            "primaryAlphaDark": "rgba(71, 171, 196, 0.15)"
          }'
        ) RETURNING id INTO oolite_org_id;
        RAISE NOTICE 'Inserted Oolite Arts organization with ID: %', oolite_org_id;
    ELSE
        -- Update existing organization with theme colors if missing
        UPDATE organizations 
        SET theme_colors = '{
            "primary": "#47abc4",
            "primaryLight": "#6bb8d1", 
            "primaryDark": "#3a8ba3",
            "primaryAlpha": "rgba(71, 171, 196, 0.1)",
            "primaryAlphaLight": "rgba(71, 171, 196, 0.05)",
            "primaryAlphaDark": "rgba(71, 171, 196, 0.15)"
          }',
          updated_at = NOW()
        WHERE slug = 'oolite' AND theme_colors IS NULL;
        RAISE NOTICE 'Updated existing Oolite Arts organization with ID: %', oolite_org_id;
    END IF;
    
    -- Store the organization ID for use in workshop creation
    PERFORM set_config('app.oolite_org_id', oolite_org_id::text, true);
END $$;

-- Insert sample workshops with learn content if they don't exist
DO $$
DECLARE
    oolite_org_id UUID;
BEGIN
    -- Get the Oolite organization ID
    SELECT id INTO oolite_org_id FROM organizations WHERE slug = 'oolite';
    
    IF oolite_org_id IS NULL THEN
        RAISE NOTICE 'Oolite organization not found, skipping workshop creation';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using Oolite organization ID: %', oolite_org_id;
    
    -- Insert SEO Workshop if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM workshops WHERE title = 'SEO Workshop' AND organization_id = oolite_org_id) THEN
        INSERT INTO workshops (
          organization_id,
          title,
          description,
          instructor,
          duration_minutes,
          max_participants,
          price,
          status,
          featured,
          has_learn_content,
          learning_objectives,
          estimated_learn_time,
          learn_difficulty,
          prerequisites,
          materials_needed
        ) VALUES (
          oolite_org_id,
          'SEO Workshop',
          'Learn the fundamentals of search engine optimization to improve your website''s visibility and attract more organic traffic.',
          'Digital Marketing Expert',
          120,
          20,
          150.00,
          'published',
          true,
          true,
          ARRAY[
            'Understand the fundamentals of SEO',
            'Learn keyword research techniques',
            'Master on-page optimization',
            'Analyze website performance with analytics'
          ],
          120,
          'beginner',
          ARRAY[
            'Basic understanding of websites',
            'Access to a website or blog'
          ],
          ARRAY[
            'Computer with internet access',
            'Google Analytics account (free)',
            'Google Search Console account (free)'
          ]
        );
        RAISE NOTICE 'Inserted SEO Workshop';
    ELSE
        -- Update existing SEO Workshop with Learn Canvas fields
        UPDATE workshops 
        SET has_learn_content = true,
            learning_objectives = ARRAY[
              'Understand the fundamentals of SEO',
              'Learn keyword research techniques',
              'Master on-page optimization',
              'Analyze website performance with analytics'
            ],
            estimated_learn_time = 120,
            learn_difficulty = 'beginner',
            updated_at = NOW()
        WHERE title = 'SEO Workshop' AND organization_id = oolite_org_id;
        RAISE NOTICE 'Updated existing SEO Workshop';
    END IF;

    -- Insert Digital Presence Workshop if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM workshops WHERE title = 'Digital Presence Workshop' AND organization_id = oolite_org_id) THEN
        INSERT INTO workshops (
          organization_id,
          title,
          description,
          instructor,
          duration_minutes,
          max_participants,
          price,
          status,
          featured,
          has_learn_content,
          learning_objectives,
          estimated_learn_time,
          learn_difficulty,
          prerequisites,
          materials_needed
        ) VALUES (
          oolite_org_id,
          'Digital Presence Workshop',
          'Build a strong online identity and create engaging content that establishes your professional brand across digital platforms.',
          'Brand Strategy Specialist',
          180,
          15,
          200.00,
          'published',
          true,
          true,
          ARRAY[
            'Build a strong online identity',
            'Create engaging content strategies',
            'Develop effective social media presence',
            'Build meaningful professional relationships'
          ],
          150,
          'intermediate',
          ARRAY[
            'Basic computer skills',
            'Access to social media accounts'
          ],
          ARRAY[
            'Computer or smartphone',
            'Social media accounts (LinkedIn, Instagram, Twitter)',
            'Portfolio or work samples'
          ]
        );
        RAISE NOTICE 'Inserted Digital Presence Workshop';
    ELSE
        -- Update existing Digital Presence Workshop with Learn Canvas fields
        UPDATE workshops 
        SET has_learn_content = true,
            learning_objectives = ARRAY[
              'Build a strong online identity',
              'Create engaging content strategies',
              'Develop effective social media presence',
              'Build meaningful professional relationships'
            ],
            estimated_learn_time = 150,
            learn_difficulty = 'intermediate',
            updated_at = NOW()
        WHERE title = 'Digital Presence Workshop' AND organization_id = oolite_org_id;
        RAISE NOTICE 'Updated existing Digital Presence Workshop';
    END IF;
END $$;

-- Insert sample chapters for SEO Workshop
DO $$
DECLARE
    oolite_org_id UUID;
BEGIN
    -- Get the Oolite organization ID
    SELECT id INTO oolite_org_id FROM organizations WHERE slug = 'oolite';
    
    IF oolite_org_id IS NULL THEN
        RAISE NOTICE 'Oolite organization not found, skipping chapter creation';
        RETURN;
    END IF;
    
    -- Insert chapters for SEO Workshop
    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'introduction-to-seo',
      'Introduction to SEO',
      'Learn the basics of search engine optimization and why it matters for your business.',
      1,
      30
    FROM workshops w 
    WHERE w.title = 'SEO Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'keyword-research',
      'Keyword Research',
      'Discover how to find and analyze keywords that your audience is searching for.',
      2,
      45
    FROM workshops w 
    WHERE w.title = 'SEO Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'on-page-optimization',
      'On-Page Optimization',
      'Learn how to optimize your website content and structure for better search rankings.',
      3,
      30
    FROM workshops w 
    WHERE w.title = 'SEO Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'analytics-and-tracking',
      'Analytics and Tracking',
      'Set up and use Google Analytics and Search Console to measure your SEO success.',
      4,
      15
    FROM workshops w 
    WHERE w.title = 'SEO Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    -- Insert chapters for Digital Presence Workshop
    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'building-your-online-identity',
      'Building Your Online Identity',
      'Learn how to create a strong, consistent digital presence across all platforms.',
      1,
      40
    FROM workshops w 
    WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'content-creation-strategies',
      'Content Creation Strategies',
      'Learn how to create engaging, valuable content that builds your digital presence.',
      2,
      50
    FROM workshops w 
    WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'social-media-strategy',
      'Social Media Strategy',
      'Build and engage with your community across different platforms to maximize your digital presence.',
      3,
      45
    FROM workshops w 
    WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

    INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
    SELECT 
      w.id,
      'networking-and-relationship-building',
      'Networking and Relationship Building',
      'Leverage your digital presence to build meaningful professional relationships and grow your network.',
      4,
      35
    FROM workshops w 
    WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = oolite_org_id
    ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;
    
    RAISE NOTICE 'Created all workshop chapters';
END $$;

-- Final success message
SELECT 'Database setup completed successfully!' as status;
