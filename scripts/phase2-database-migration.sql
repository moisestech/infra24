-- Phase 2 Database Migration: Event Management & Content System
-- This migration extends the existing booking system to support comprehensive event management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =====================================================
-- 1. EXTEND WORKSHOPS TABLE FOR EVENT MANAGEMENT
-- =====================================================

-- Add event type and category columns to workshops table
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'workshop';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS event_category VARCHAR(100);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS is_series BOOLEAN DEFAULT FALSE;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES workshops(id);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS instructor_id VARCHAR(255);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS prerequisites TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS learning_objectives TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS target_audience VARCHAR(255);
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50) DEFAULT 'beginner';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 20;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS min_participants INTEGER DEFAULT 1;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS refund_policy TEXT;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS equipment_provided TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS materials_included TEXT[];
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '{}';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Add constraints for event types (drop existing if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workshops_event_type_check') THEN
    ALTER TABLE workshops DROP CONSTRAINT workshops_event_type_check;
  END IF;
END $$;

ALTER TABLE workshops ADD CONSTRAINT workshops_event_type_check 
  CHECK (event_type IN ('workshop', 'exhibition', 'performance', 'meeting', 'lecture', 'seminar', 'conference', 'networking', 'social'));

-- Add constraints for difficulty levels (update existing level constraint if needed)
-- First drop existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'workshops_level_check') THEN
    ALTER TABLE workshops DROP CONSTRAINT workshops_level_check;
  END IF;
END $$;

-- Add new constraint for level field
ALTER TABLE workshops ADD CONSTRAINT workshops_level_check 
  CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert', 'all-levels'));

-- =====================================================
-- 2. EVENT MATERIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50),
  file_size BIGINT,
  mime_type VARCHAR(100),
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255)
);

-- Add indexes for event materials
CREATE INDEX IF NOT EXISTS idx_event_materials_event_id ON event_materials(event_id);
CREATE INDEX IF NOT EXISTS idx_event_materials_file_type ON event_materials(file_type);
CREATE INDEX IF NOT EXISTS idx_event_materials_created_at ON event_materials(created_at);

-- =====================================================
-- 3. EVENT FEEDBACK TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  session_id UUID REFERENCES workshop_sessions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
  content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
  venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
  would_recommend BOOLEAN,
  improvement_suggestions TEXT,
  favorite_aspects TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for event feedback
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_user_id ON event_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_rating ON event_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_event_feedback_created_at ON event_feedback(created_at);

-- =====================================================
-- 4. CONTENT MANAGEMENT SYSTEM
-- =====================================================

-- Content items table for MDX-based content
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL, -- MDX content
  excerpt TEXT,
  content_type VARCHAR(50) NOT NULL DEFAULT 'article',
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  author_id VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Add constraints for content types (drop existing if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_items_type_check') THEN
    ALTER TABLE content_items DROP CONSTRAINT content_items_type_check;
  END IF;
END $$;

ALTER TABLE content_items ADD CONSTRAINT content_items_type_check 
  CHECK (content_type IN ('article', 'lesson', 'resource', 'announcement', 'tutorial', 'guide', 'news'));

-- Add indexes for content items
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_organization_id ON content_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_content_items_content_type ON content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);

-- Content versions table for versioning
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL
);

-- Add indexes for content versions
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_version ON content_versions(version);

-- =====================================================
-- 5. COURSE MANAGEMENT SYSTEM
-- =====================================================

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  instructor_id VARCHAR(255),
  category VARCHAR(100),
  difficulty_level VARCHAR(50) DEFAULT 'beginner',
  duration_hours INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  max_students INTEGER,
  min_students INTEGER DEFAULT 1,
  prerequisites TEXT[],
  learning_objectives TEXT[],
  target_audience VARCHAR(255),
  equipment_required TEXT[],
  materials_included TEXT[],
  certification_available BOOLEAN DEFAULT FALSE,
  certification_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  enrollment_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255)
);

-- Add constraints for courses (drop existing if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_difficulty_level_check') THEN
    ALTER TABLE courses DROP CONSTRAINT courses_difficulty_level_check;
  END IF;
END $$;

ALTER TABLE courses ADD CONSTRAINT courses_difficulty_level_check 
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'all-levels'));

-- Add indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_organization_id ON courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_is_public ON courses(is_public);

-- Course lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  lesson_order INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_required BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  audio_url TEXT,
  download_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255)
);

-- Add indexes for course lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_lesson_order ON course_lessons(lesson_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_is_published ON course_lessons(is_published);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  certificate_issued_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_currency VARCHAR(3) DEFAULT 'USD',
  payment_date TIMESTAMP WITH TIME ZONE,
  refunded BOOLEAN DEFAULT FALSE,
  refund_amount DECIMAL(10,2),
  refund_date TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for course enrollments
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_enrolled_at ON course_enrollments(enrolled_at);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_completed_at ON course_enrollments(completed_at);

-- =====================================================
-- 6. MEDIA MANAGEMENT
-- =====================================================

-- Media files table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- image, video, audio, document
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for video/audio files in seconds
  alt_text TEXT,
  caption TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by VARCHAR(255) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints for media file types (drop existing if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_files_type_check') THEN
    ALTER TABLE media_files DROP CONSTRAINT media_files_type_check;
  END IF;
END $$;

ALTER TABLE media_files ADD CONSTRAINT media_files_type_check 
  CHECK (file_type IN ('image', 'video', 'audio', 'document', 'archive', 'other'));

-- Add indexes for media files
CREATE INDEX IF NOT EXISTS idx_media_files_organization_id ON media_files(organization_id);
CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE event_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Event materials policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view event materials for their organization" ON event_materials;
DROP POLICY IF EXISTS "Admins can manage event materials for their organization" ON event_materials;

CREATE POLICY "Users can view event materials for their organization" ON event_materials
  FOR SELECT USING (true); -- Allow all authenticated users to view

CREATE POLICY "Admins can manage event materials for their organization" ON event_materials
  FOR ALL USING (true); -- Allow all authenticated users to manage (will be restricted by application logic)

-- Event feedback policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view feedback for their organization's events" ON event_feedback;
DROP POLICY IF EXISTS "Users can create feedback for events they attended" ON event_feedback;

CREATE POLICY "Users can view feedback for their organization's events" ON event_feedback
  FOR SELECT USING (true); -- Allow all authenticated users to view

CREATE POLICY "Users can create feedback for events they attended" ON event_feedback
  FOR INSERT WITH CHECK (true); -- Allow all authenticated users to create (will be restricted by application logic)

-- Content items policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view published content for their organization" ON content_items;
DROP POLICY IF EXISTS "Admins can manage content for their organization" ON content_items;

CREATE POLICY "Users can view published content for their organization" ON content_items
  FOR SELECT USING (published = true); -- Allow all authenticated users to view published content

CREATE POLICY "Admins can manage content for their organization" ON content_items
  FOR ALL USING (true); -- Allow all authenticated users to manage (will be restricted by application logic)

-- Courses policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view public courses for their organization" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses for their organization" ON courses;

CREATE POLICY "Users can view public courses for their organization" ON courses
  FOR SELECT USING (is_public = true); -- Allow all authenticated users to view public courses

CREATE POLICY "Admins can manage courses for their organization" ON courses
  FOR ALL USING (true); -- Allow all authenticated users to manage (will be restricted by application logic)

-- Course enrollments policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollment progress" ON course_enrollments;

CREATE POLICY "Users can view their own enrollments" ON course_enrollments
  FOR SELECT USING (true); -- Allow all authenticated users to view (will be restricted by application logic)

CREATE POLICY "Users can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (true); -- Allow all authenticated users to enroll (will be restricted by application logic)

CREATE POLICY "Users can update their own enrollment progress" ON course_enrollments
  FOR UPDATE USING (true); -- Allow all authenticated users to update (will be restricted by application logic)

-- Media files policies (simplified for Clerk auth)
DROP POLICY IF EXISTS "Users can view public media for their organization" ON media_files;
DROP POLICY IF EXISTS "Admins can manage media for their organization" ON media_files;

CREATE POLICY "Users can view public media for their organization" ON media_files
  FOR SELECT USING (is_public = true); -- Allow all authenticated users to view public media

CREATE POLICY "Admins can manage media for their organization" ON media_files
  FOR ALL USING (true); -- Allow all authenticated users to manage (will be restricted by application logic)

-- =====================================================
-- 8. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers (drop existing if they exist)
DROP TRIGGER IF EXISTS update_event_materials_updated_at ON event_materials;
DROP TRIGGER IF EXISTS update_event_feedback_updated_at ON event_feedback;
DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON course_lessons;
DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON course_enrollments;
DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;

CREATE TRIGGER update_event_materials_updated_at BEFORE UPDATE ON event_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_feedback_updated_at BEFORE UPDATE ON event_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update course enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses SET enrollment_count = enrollment_count - 1 WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Add enrollment count trigger (drop existing if it exists)
DROP TRIGGER IF EXISTS update_course_enrollment_count_trigger ON course_enrollments;

CREATE TRIGGER update_course_enrollment_count_trigger
  AFTER INSERT OR DELETE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Function to update course completion count
CREATE OR REPLACE FUNCTION update_course_completion_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    UPDATE courses SET completion_count = completion_count + 1 WHERE id = NEW.course_id;
  ELSIF NEW.completed_at IS NULL AND OLD.completed_at IS NOT NULL THEN
    UPDATE courses SET completion_count = completion_count - 1 WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add completion count trigger (drop existing if it exists)
DROP TRIGGER IF EXISTS update_course_completion_count_trigger ON course_enrollments;

CREATE TRIGGER update_course_completion_count_trigger
  AFTER UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_completion_count();

-- =====================================================
-- 9. SEED DATA FOR TESTING
-- =====================================================

-- Insert sample event types and categories
INSERT INTO workshops (
  id, organization_id, title, description, event_type, event_category,
  category, level, duration_minutes, max_participants, price, is_active, created_by
) VALUES 
  (
    uuid_generate_v4(),
    '73339522-c672-40ac-a464-e027e9c99d13', -- Oolite org ID
    'Digital Art Exhibition Opening',
    'Join us for the opening of our latest digital art exhibition featuring works by local artists.',
    'exhibition',
    'Art Exhibition',
    'digital_art',
    'all-levels',
    120,
    50,
    0,
    true,
    'system'
  ),
  (
    uuid_generate_v4(),
    '73339522-c672-40ac-a464-e027e9c99d13',
    'Artist Networking Event',
    'Connect with fellow artists and creative professionals in our community.',
    'networking',
    'Networking',
    'community',
    'all-levels',
    90,
    30,
    0,
    true,
    'system'
  ),
  (
    uuid_generate_v4(),
    '73339522-c672-40ac-a464-e027e9c99d13',
    'Photography Lecture Series',
    'Learn from professional photographers about advanced techniques and industry insights.',
    'lecture',
    'Educational',
    'photography',
    'intermediate',
    60,
    25,
    25,
    true,
    'system'
  )
ON CONFLICT DO NOTHING;

-- Insert sample content items
INSERT INTO content_items (
  title, slug, content, content_type, category, author_id, organization_id, published
) VALUES 
  (
    'Introduction to Digital Art',
    'introduction-to-digital-art',
    '# Introduction to Digital Art\n\nDigital art is a form of artistic expression that uses digital technology as an essential part of the creative process...',
    'lesson',
    'Digital Art',
    'system',
    '73339522-c672-40ac-a464-e027e9c99d13',
    true
  ),
  (
    'Photography Tips and Techniques',
    'photography-tips-techniques',
    '# Photography Tips and Techniques\n\nMaster the art of photography with these essential tips and techniques...',
    'article',
    'Photography',
    'system',
    '73339522-c672-40ac-a464-e027e9c99d13',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 10. COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE event_materials IS 'Stores materials and resources associated with events';
COMMENT ON TABLE event_feedback IS 'Collects feedback and ratings for events';
COMMENT ON TABLE content_items IS 'MDX-based content management system';
COMMENT ON TABLE content_versions IS 'Version history for content items';
COMMENT ON TABLE courses IS 'Course management system';
COMMENT ON TABLE course_lessons IS 'Individual lessons within courses';
COMMENT ON TABLE course_enrollments IS 'User enrollments and progress in courses';
COMMENT ON TABLE media_files IS 'Media file management and storage';

COMMENT ON COLUMN workshops.event_type IS 'Type of event: workshop, exhibition, performance, meeting, lecture, etc.';
COMMENT ON COLUMN workshops.event_category IS 'Category within event type for better organization';
COMMENT ON COLUMN workshops.is_series IS 'Whether this event is part of a series';
COMMENT ON COLUMN workshops.series_id IS 'Reference to parent event if this is part of a series';
COMMENT ON COLUMN workshops.instructor_id IS 'ID of the instructor/leader for this event';
COMMENT ON COLUMN workshops.prerequisites IS 'Array of prerequisites for this event';
COMMENT ON COLUMN workshops.learning_objectives IS 'Array of learning objectives';
COMMENT ON COLUMN workshops.target_audience IS 'Intended audience for this event';
COMMENT ON COLUMN workshops.difficulty_level IS 'Difficulty level: beginner, intermediate, advanced, expert, all-levels';
COMMENT ON COLUMN workshops.max_participants IS 'Maximum number of participants allowed';
COMMENT ON COLUMN workshops.min_participants IS 'Minimum number of participants required';
COMMENT ON COLUMN workshops.registration_deadline IS 'Deadline for registration';
COMMENT ON COLUMN workshops.cancellation_policy IS 'Policy for event cancellation';
COMMENT ON COLUMN workshops.refund_policy IS 'Policy for refunds';
COMMENT ON COLUMN workshops.equipment_provided IS 'Array of equipment provided by the organization';
COMMENT ON COLUMN workshops.materials_included IS 'Array of materials included in the event';
COMMENT ON COLUMN workshops.external_links IS 'JSON object containing external links and resources';
COMMENT ON COLUMN workshops.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN workshops.featured IS 'Whether this event is featured';
COMMENT ON COLUMN workshops.featured_until IS 'Until when this event should be featured';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Phase 2 database migration completed successfully!';
  RAISE NOTICE 'Added event management, content system, and course management capabilities.';
  RAISE NOTICE 'New tables: event_materials, event_feedback, content_items, content_versions, courses, course_lessons, course_enrollments, media_files';
  RAISE NOTICE 'Extended workshops table with event management fields';
  RAISE NOTICE 'Added RLS policies and triggers for data integrity';
END $$;
