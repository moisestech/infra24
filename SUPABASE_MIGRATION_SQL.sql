-- Learn Canvas Database Migration
-- Run this SQL in your Supabase dashboard

-- Add learn content fields to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS has_learn_content BOOLEAN DEFAULT FALSE;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_syllabus JSONB;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_objectives TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS estimated_learn_time INTEGER;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_difficulty VARCHAR(20);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_prerequisites TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learn_materials TEXT[];

-- Create workshop_chapters table
CREATE TABLE IF NOT EXISTS workshop_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order ON workshop_chapters(workshop_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id);

-- Enable RLS
ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY;

-- Add sample data for SEO Workshop (replace with your actual workshop ID)
-- First, find your SEO workshop ID and update it below
UPDATE workshops 
SET 
  has_learn_content = TRUE,
  learn_objectives = ARRAY[
    'Understand the fundamentals of SEO',
    'Learn keyword research techniques', 
    'Master on-page optimization',
    'Analyze website performance with analytics'
  ],
  estimated_learn_time = 120,
  learn_difficulty = 'beginner',
  learn_prerequisites = ARRAY[
    'Basic understanding of websites',
    'Access to a website or blog'
  ],
  learn_materials = ARRAY[
    'Computer with internet access',
    'Google Analytics account (free)',
    'Google Search Console account (free)'
  ]
WHERE title ILIKE '%SEO%' AND organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

-- Add sample chapters (replace workshop_id with your actual SEO workshop ID)
INSERT INTO workshop_chapters (workshop_id, chapter_slug, title, description, order_index, estimated_time)
SELECT 
  w.id,
  'introduction-to-seo',
  'Introduction to SEO',
  'Learn the basics of search engine optimization and why it matters for your business.',
  1,
  30
FROM workshops w 
WHERE w.title ILIKE '%SEO%' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title ILIKE '%SEO%' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title ILIKE '%SEO%' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
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
WHERE w.title ILIKE '%SEO%' AND w.organization_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'
ON CONFLICT (workshop_id, chapter_slug) DO NOTHING;
