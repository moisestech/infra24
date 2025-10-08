-- Create Video Performance Workshop (Simplified for actual database schema)
-- This script creates the Video Performance workshop with only the basic columns that exist

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert Video Performance Workshop
DO $$
DECLARE
    madarts_org_id UUID;
    workshop_id UUID;
BEGIN
    -- Get MadArts organization ID
    SELECT id INTO madarts_org_id FROM organizations WHERE slug = 'madarts';
    
    IF madarts_org_id IS NULL THEN
        RAISE EXCEPTION 'MadArts organization not found. Please run create-madarts-organization.sql first.';
    END IF;
    
    -- Generate workshop ID
    workshop_id := uuid_generate_v4();
    
    -- Insert the workshop with only basic columns that exist in your schema
    INSERT INTO workshops (
        id,
        organization_id,
        title,
        description,
        category,
        type,
        level,
        duration_minutes,
        max_participants,
        price,
        instructor,
        prerequisites,
        materials,
        outcomes,
        is_active,
        is_public,
        is_shared,
        status,
        image_url,
        featured,
        has_learn_content,
        estimated_learn_time,
        learn_difficulty,
        learn_prerequisites,
        learn_materials
    ) VALUES (
        workshop_id,
        madarts_org_id,
        'Video Performance: Mastering the Camera',
        'Learn to perform confidently and effectively for video, from overcoming anxiety to optimizing your on-screen presence. This comprehensive workshop covers everything from basic acting techniques to advanced presentation skills, helping you create engaging video content that connects with your audience.',
        'Video Production',
        'workshop',
        'beginner',
        240, -- 4 hours total
        20,
        99.00,
        'Tere Garcia',
        ARRAY[
            'Basic understanding of video recording (e.g., using a smartphone)',
            'A desire to improve on-camera performance'
        ],
        ARRAY[
            'Smartphone or webcam for recording',
            'Tripod (optional, but recommended)',
            'Good lighting source (natural light or simple lamp)',
            'Quiet space for practice'
        ],
        ARRAY[
            'Overcome camera anxiety and build confidence',
            'Master basic acting techniques for video',
            'Optimize voice, diction, and body language for on-screen presence',
            'Understand fundamental lighting and framing principles',
            'Develop engaging presentation skills for various video formats'
        ],
        true,
        true,
        true, -- Can be shared with other organizations
        'available',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop',
        true,
        true, -- has_learn_content
        240, -- estimated_learn_time
        'beginner', -- learn_difficulty
        ARRAY[
            'Basic understanding of video recording (e.g., using a smartphone)',
            'A desire to improve on-camera performance'
        ], -- learn_prerequisites
        ARRAY[
            'Smartphone or webcam for recording',
            'Tripod (optional, but recommended)',
            'Good lighting source (natural light or simple lamp)',
            'Quiet space for practice'
        ] -- learn_materials
    ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        type = EXCLUDED.type,
        level = EXCLUDED.level,
        duration_minutes = EXCLUDED.duration_minutes,
        max_participants = EXCLUDED.max_participants,
        price = EXCLUDED.price,
        instructor = EXCLUDED.instructor,
        prerequisites = EXCLUDED.prerequisites,
        materials = EXCLUDED.materials,
        outcomes = EXCLUDED.outcomes,
        is_active = EXCLUDED.is_active,
        is_public = EXCLUDED.is_public,
        is_shared = EXCLUDED.is_shared,
        status = EXCLUDED.status,
        image_url = EXCLUDED.image_url,
        featured = EXCLUDED.featured,
        has_learn_content = EXCLUDED.has_learn_content,
        estimated_learn_time = EXCLUDED.estimated_learn_time,
        learn_difficulty = EXCLUDED.learn_difficulty,
        learn_prerequisites = EXCLUDED.learn_prerequisites,
        learn_materials = EXCLUDED.learn_materials,
        updated_at = NOW();
    
    RAISE NOTICE 'Video Performance workshop created/updated with ID: %', workshop_id;
    RAISE NOTICE 'Workshop is associated with MadArts organization: %', madarts_org_id;
    
END $$;
