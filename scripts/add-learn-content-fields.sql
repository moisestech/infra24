-- Add learn content fields to workshops table
-- This script adds the necessary fields to support interactive learning content

-- Add learn content fields to workshops table
ALTER TABLE workshops 
ADD COLUMN IF NOT EXISTS has_learn_content BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS learn_syllabus JSONB,
ADD COLUMN IF NOT EXISTS learn_objectives TEXT[],
ADD COLUMN IF NOT EXISTS estimated_learn_time INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS learn_difficulty VARCHAR(20) CHECK (learn_difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS learn_prerequisites TEXT[],
ADD COLUMN IF NOT EXISTS learn_materials TEXT[];

-- Create workshop chapters table for organizing learn content
CREATE TABLE IF NOT EXISTS workshop_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, chapter_slug)
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_workshop_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES workshop_chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order ON workshop_chapters(workshop_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id);

-- Add RLS policies for multi-tenant access
ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY;

-- RLS policy for workshop_chapters - users can read chapters for workshops in their organization
CREATE POLICY "Users can read workshop chapters for their organization" ON workshop_chapters
  FOR SELECT USING (
    workshop_id IN (
      SELECT w.id FROM workshops w
      JOIN organizations o ON w.organization_id = o.id
      WHERE o.id = (
        SELECT organization_id FROM user_organizations 
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS policy for user_workshop_progress - users can only access their own progress
CREATE POLICY "Users can access their own workshop progress" ON user_workshop_progress
  FOR ALL USING (user_id = auth.uid()::text);

-- RLS policy for user_workshop_progress - users can read progress for workshops in their organization
CREATE POLICY "Users can read workshop progress for their organization" ON user_workshop_progress
  FOR SELECT USING (
    workshop_id IN (
      SELECT w.id FROM workshops w
      JOIN organizations o ON w.organization_id = o.id
      WHERE o.id = (
        SELECT organization_id FROM user_organizations 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Add comments for documentation
COMMENT ON COLUMN workshops.has_learn_content IS 'Indicates if this workshop has interactive learning content';
COMMENT ON COLUMN workshops.learn_syllabus IS 'JSON structure containing the workshop syllabus and curriculum';
COMMENT ON COLUMN workshops.learn_objectives IS 'Array of learning objectives for this workshop';
COMMENT ON COLUMN workshops.estimated_learn_time IS 'Total estimated time to complete all learning content in minutes';
COMMENT ON COLUMN workshops.learn_difficulty IS 'Difficulty level of the learning content';
COMMENT ON COLUMN workshops.learn_prerequisites IS 'Array of prerequisites needed before starting this workshop';
COMMENT ON COLUMN workshops.learn_materials IS 'Array of materials needed for this workshop';

COMMENT ON TABLE workshop_chapters IS 'Individual chapters/lessons within a workshop';
COMMENT ON TABLE user_workshop_progress IS 'Tracks user progress through workshop chapters';

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_workshop_chapters_updated_at 
  BEFORE UPDATE ON workshop_chapters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workshop_progress_updated_at 
  BEFORE UPDATE ON user_workshop_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- This will add learn content to the existing SEO Workshop
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

-- Insert sample chapters for the SEO Workshop
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
