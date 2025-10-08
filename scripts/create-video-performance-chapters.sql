-- Create Video Performance Workshop Chapters
-- This script creates all 7 chapters for the Video Performance workshop

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: workshop_chapters table already exists in your database
-- Using the existing schema with columns: id, workshop_id, chapter_slug, title, description, order_index, estimated_time, created_at, updated_at

-- Create user_workshop_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_workshop_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES workshop_chapters(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- Insert Video Performance Workshop Chapters
DO $$
DECLARE
    workshop_id UUID;
    chapter_id UUID;
BEGIN
    -- Get the Video Performance workshop ID
    SELECT w.id INTO workshop_id 
    FROM workshops w 
    JOIN organizations o ON w.organization_id = o.id 
    WHERE o.slug = 'madarts' AND w.title = 'Video Performance: Mastering the Camera';
    
    IF workshop_id IS NULL THEN
        RAISE EXCEPTION 'Video Performance workshop not found. Please run create-video-performance-workshop.sql first.';
    END IF;
    
    -- Chapter 1: Introduction to Video Performance
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '01-introduction-to-video-performance',
        'Introduction to Video Performance',
        'Understand the landscape of video performance and set the stage for your learning journey.',
        1,
        30
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 2: Overcoming Camera Anxiety
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '02-overcoming-camera-anxiety',
        'Overcoming Camera Anxiety',
        'Learn practical techniques to feel comfortable and confident when performing for video.',
        2,
        45
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 3: Basic Acting Techniques for Video
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_number,
        title,
        description,
        content_path,
        estimated_time,
        difficulty,
        is_active,
        is_published,
        order_index,
        metadata
    ) VALUES (
        workshop_id,
        3,
        'Basic Acting Techniques for Video',
        'Learn essential acting skills adapted for video performance to enhance authenticity and engagement.',
        'content/workshops/video-performance/chapters/03-basic-acting-techniques-for-video.md',
        60,
        'intermediate',
        true,
        true,
        3,
        '{
            "tags": ["Acting Techniques", "Authenticity", "Video Performance", "Expression"],
            "learning_objectives": [
                "Understand the principles of authenticity and believability on camera",
                "Learn how to be present and emotionally connected to your content",
                "Master body language and gestures that work effectively on screen",
                "Develop facial expressions that convey genuine emotions"
            ]
        }'
    ) ON CONFLICT (workshop_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content_path = EXCLUDED.content_path,
        estimated_time = EXCLUDED.estimated_time,
        difficulty = EXCLUDED.difficulty,
        is_active = EXCLUDED.is_active,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    -- Chapter 4: Voice and Diction for Video
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_number,
        title,
        description,
        content_path,
        estimated_time,
        difficulty,
        is_active,
        is_published,
        order_index,
        metadata
    ) VALUES (
        workshop_id,
        4,
        'Voice and Diction for Video',
        'Optimize your vocal delivery for clarity, impact, and engagement in video performances.',
        'content/workshops/video-performance/chapters/04-voice-and-diction-for-video.md',
        40,
        'intermediate',
        true,
        true,
        4,
        '{
            "tags": ["Voice", "Diction", "Vocal Delivery", "Clarity"],
            "learning_objectives": [
                "Improve articulation and clarity in speech",
                "Learn to control pace, tone, and inflection effectively",
                "Understand the relationship between body language and vocal delivery",
                "Practice diaphragmatic breathing for better voice control"
            ]
        }'
    ) ON CONFLICT (workshop_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content_path = EXCLUDED.content_path,
        estimated_time = EXCLUDED.estimated_time,
        difficulty = EXCLUDED.difficulty,
        is_active = EXCLUDED.is_active,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    -- Chapter 5: Lighting and Framing
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_number,
        title,
        description,
        content_path,
        estimated_time,
        difficulty,
        is_active,
        is_published,
        order_index,
        metadata
    ) VALUES (
        workshop_id,
        5,
        'Lighting and Framing',
        'Understand basic lighting and framing techniques to create professional-looking video performances.',
        'content/workshops/video-performance/chapters/05-lighting-and-framing.md',
        35,
        'beginner',
        true,
        true,
        5,
        '{
            "tags": ["Lighting", "Framing", "Technical Setup", "Professional Appearance"],
            "learning_objectives": [
                "Understand basic lighting principles for video",
                "Learn proper framing and composition techniques",
                "Master the rule of thirds and headroom concepts",
                "Create professional-looking video setups with minimal equipment"
            ]
        }'
    ) ON CONFLICT (workshop_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content_path = EXCLUDED.content_path,
        estimated_time = EXCLUDED.estimated_time,
        difficulty = EXCLUDED.difficulty,
        is_active = EXCLUDED.is_active,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    -- Chapter 6: Movement and Gesture
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_number,
        title,
        description,
        content_path,
        estimated_time,
        difficulty,
        is_active,
        is_published,
        order_index,
        metadata
    ) VALUES (
        workshop_id,
        6,
        'Movement and Gesture in Video Performance',
        'Learn how to use body language, gestures, and movement to enhance your video performance and connect with your audience.',
        'content/workshops/video-performance/chapters/06-movement-and-gesture.md',
        50,
        'intermediate',
        true,
        true,
        6,
        '{
            "tags": ["Movement", "Gesture", "Body Language", "Physical Expression"],
            "learning_objectives": [
                "Understand the power of non-verbal communication in video",
                "Learn effective gesture techniques that stay within frame",
                "Master natural movement patterns for video performance",
                "Develop confident posture and positioning"
            ]
        }'
    ) ON CONFLICT (workshop_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content_path = EXCLUDED.content_path,
        estimated_time = EXCLUDED.estimated_time,
        difficulty = EXCLUDED.difficulty,
        is_active = EXCLUDED.is_active,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    -- Chapter 7: Creating Emotional Connection
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_number,
        title,
        description,
        content_path,
        estimated_time,
        difficulty,
        is_active,
        is_published,
        order_index,
        metadata
    ) VALUES (
        workshop_id,
        7,
        'Creating Emotional Connection with Your Audience',
        'Learn how to build trust, show vulnerability, and create authentic relationships with your audience through video performance.',
        'content/workshops/video-performance/chapters/07-creating-emotional-connection.md',
        55,
        'intermediate',
        true,
        true,
        7,
        '{
            "tags": ["Emotional Connection", "Authenticity", "Vulnerability", "Trust"],
            "learning_objectives": [
                "Understand the importance of emotional connection in video content",
                "Learn techniques for building trust through authenticity",
                "Master strategic vulnerability to create deeper connections",
                "Develop storytelling skills that engage and inspire audiences"
            ]
        }'
    ) ON CONFLICT (workshop_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content_path = EXCLUDED.content_path,
        estimated_time = EXCLUDED.estimated_time,
        difficulty = EXCLUDED.difficulty,
        is_active = EXCLUDED.is_active,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    RAISE NOTICE 'All 7 chapters created/updated for Video Performance workshop (ID: %)', workshop_id;
    
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_workshop_id ON workshop_chapters(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_order_index ON workshop_chapters(workshop_id, order_index);
CREATE INDEX IF NOT EXISTS idx_workshop_chapters_is_published ON workshop_chapters(is_published);

CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_user_id ON user_workshop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_workshop_id ON user_workshop_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_user_workshop_progress_chapter_id ON user_workshop_progress(chapter_id);

-- Enable Row Level Security
ALTER TABLE workshop_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workshop_chapters
CREATE POLICY "Users can view published chapters for workshops in their organization" ON workshop_chapters
    FOR SELECT USING (
        is_published = true AND
        workshop_id IN (
            SELECT w.id FROM workshops w
            JOIN organizations o ON w.organization_id = o.id
            WHERE o.id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

-- RLS Policies for user_workshop_progress
CREATE POLICY "Users can view their own workshop progress" ON user_workshop_progress
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own workshop progress" ON user_workshop_progress
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own workshop progress" ON user_workshop_progress
    FOR UPDATE USING (user_id = auth.uid()::text);
