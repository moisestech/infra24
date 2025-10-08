-- Create Video Performance Workshop Chapters (Fixed for actual database schema)
-- This script creates all 7 chapters for the Video Performance workshop

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert Video Performance Workshop Chapters
DO $$
DECLARE
    workshop_id UUID;
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
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '03-basic-acting-techniques-for-video',
        'Basic Acting Techniques for Video',
        'Learn essential acting skills adapted for video performance to enhance authenticity and engagement.',
        3,
        60
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 4: Voice and Diction for Video
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '04-voice-and-diction-for-video',
        'Voice and Diction for Video',
        'Optimize your vocal delivery for clarity, impact, and engagement in video performances.',
        4,
        40
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 5: Lighting and Framing
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '05-lighting-and-framing',
        'Lighting and Framing',
        'Understand basic lighting and framing techniques to create professional-looking video performances.',
        5,
        35
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 6: Movement and Gesture
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '06-movement-and-gesture',
        'Movement and Gesture in Video Performance',
        'Learn how to use body language, gestures, and movement to enhance your video performance and connect with your audience.',
        6,
        50
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    -- Chapter 7: Creating Emotional Connection
    INSERT INTO workshop_chapters (
        workshop_id,
        chapter_slug,
        title,
        description,
        order_index,
        estimated_time
    ) VALUES (
        workshop_id,
        '07-creating-emotional-connection',
        'Creating Emotional Connection with Your Audience',
        'Learn how to build trust, show vulnerability, and create authentic relationships with your audience through video performance.',
        7,
        55
    ) ON CONFLICT (workshop_id, chapter_slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        order_index = EXCLUDED.order_index,
        estimated_time = EXCLUDED.estimated_time,
        updated_at = NOW();
    
    RAISE NOTICE 'All 7 chapters created/updated for Video Performance workshop (ID: %)', workshop_id;
    
END $$;
