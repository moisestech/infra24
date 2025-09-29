-- Complete Database Schema Setup for Learn Canvas
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
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

-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
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

-- Create workshop_chapters table
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

-- Create user_workshop_progress table
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
CREATE POLICY "Organizations are viewable by everyone" ON organizations FOR SELECT USING (true);
CREATE POLICY "Workshops are viewable by everyone" ON workshops FOR SELECT USING (true);
CREATE POLICY "Workshop chapters are viewable by everyone" ON workshop_chapters FOR SELECT USING (true);
CREATE POLICY "User progress is viewable by user" ON user_workshop_progress FOR SELECT USING (auth.uid()::text = user_id);

-- Insert sample organization (Oolite Arts)
INSERT INTO organizations (id, name, slug, description, logo_url, theme_colors) VALUES (
  '2133fe94-fb12-41f8-ab37-ea4acd4589f6',
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
) ON CONFLICT (id) DO NOTHING;

-- Insert sample workshops with learn content
INSERT INTO workshops (
  id,
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
  uuid_generate_v4(),
  '2133fe94-fb12-41f8-ab37-ea4acd4589f6',
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
), (
  uuid_generate_v4(),
  '2133fe94-fb12-41f8-ab37-ea4acd4589f6',
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
) ON CONFLICT DO NOTHING;

-- Insert sample chapters for SEO Workshop
INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
SELECT 
  w.id,
  'introduction-to-seo',
  'Introduction to SEO',
  'Learn the basics of search engine optimization and why it matters for your business.',
  1,
  30
FROM workshops w 
WHERE w.title = 'SEO Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'SEO Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'SEO Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'SEO Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;

-- Insert sample chapters for Digital Presence Workshop
INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
SELECT 
  w.id,
  'building-your-online-identity',
  'Building Your Online Identity',
  'Learn how to create a strong, consistent digital presence across all platforms.',
  1,
  40
FROM workshops w 
WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title = 'Digital Presence Workshop' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;
