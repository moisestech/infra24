-- Create Video Performance Workshop for MadArts Organization
-- This script creates the Video Performance workshop with all necessary fields

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
    
    -- Insert the workshop
    INSERT INTO workshops (
        id,
        organization_id,
        title,
        description,
        content,
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
        syllabus,
        learning_objectives,
        materials_needed,
        what_youll_learn,
        workshop_outline,
        -- Learn Canvas specific fields
        has_learn_content,
        learn_objectives,
        estimated_learn_time,
        learn_difficulty,
        learn_prerequisites,
        learn_materials,
        metadata,
        created_by,
        created_at,
        updated_at
    ) VALUES (
        workshop_id,
        madarts_org_id,
        'Video Performance: Mastering the Camera',
        'Learn to perform confidently and effectively for video, from overcoming anxiety to optimizing your on-screen presence. This comprehensive workshop covers everything from basic acting techniques to advanced presentation skills, helping you create engaging video content that connects with your audience.',
        'Video Performance: Mastering the Camera is a comprehensive workshop designed to help content creators, artists, and professionals master the art of performing for video. Through practical exercises, real-world examples, and personalized feedback, participants will develop the skills and confidence needed to create compelling video content.',
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
        'Video Performance: Mastering the Camera is a comprehensive 4-hour workshop designed to help content creators, artists, and professionals master the art of performing for video. Through practical exercises, real-world examples, and personalized feedback, participants will develop the skills and confidence needed to create compelling video content that engages and connects with their audience.',
        ARRAY[
            'Overcome camera anxiety and build confidence',
            'Master basic acting techniques for video',
            'Optimize voice, diction, and body language for on-screen presence',
            'Understand fundamental lighting and framing principles',
            'Develop engaging presentation skills for various video formats'
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
        '{
            "modules": [
                {
                    "section": "Module 1: Foundations of On-Camera Presence",
                    "duration": "60 min",
                    "topics": [
                        "Introduction to Video Performance",
                        "Understanding the Camera as Your Audience",
                        "Overcoming Camera Anxiety: Practical Exercises",
                        "Building Confidence: Mindset and Preparation"
                    ]
                },
                {
                    "section": "Module 2: Acting & Delivery Techniques",
                    "duration": "60 min",
                    "topics": [
                        "Basic Acting for Video: Authenticity and Expression",
                        "Body Language and Gestures: What Works on Screen",
                        "Voice and Diction: Clarity, Pacing, and Tone",
                        "Eye Contact and Gaze: Connecting with the Viewer"
                    ]
                },
                {
                    "section": "Module 3: Technical Aspects & Presentation",
                    "duration": "60 min",
                    "topics": [
                        "Basic Lighting for Video: Key, Fill, Backlight",
                        "Framing and Composition: Rule of Thirds and Headroom",
                        "Audio Essentials: Microphone Placement and Noise Reduction",
                        "Engaging Your Audience: Storytelling and Pacing"
                    ]
                },
                {
                    "section": "Module 4: Practice & Feedback",
                    "duration": "60 min",
                    "topics": [
                        "Guided Practice Sessions",
                        "Peer Feedback and Self-Critique",
                        "Developing Your Unique On-Screen Persona",
                        "Q&A with Tere Garcia"
                    ]
                }
            ]
        }',
        -- Learn Canvas specific fields
        true,
        ARRAY[
            'Overcome camera anxiety and build confidence',
            'Master basic acting techniques for video',
            'Optimize voice, diction, and body language for on-screen presence',
            'Understand fundamental lighting and framing principles',
            'Develop engaging presentation skills for various video formats'
        ],
        240, -- 4 hours total
        'beginner',
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
        '{
            "instructor": {
                "name": "Tere Garcia",
                "bio": "Tere Garcia is a professional video performance coach with over 10 years of experience helping content creators, artists, and professionals master their on-camera presence. She has worked with clients ranging from social media influencers to corporate executives, helping them develop authentic and engaging video performances.",
                "specialties": ["Video Performance", "Acting for Camera", "Presentation Skills", "Confidence Building"],
                "experience": "10+ years",
                "certifications": ["Certified Acting Coach", "Video Production Specialist"]
            },
            "workshop_type": "interactive",
            "delivery_method": "in-person",
            "certification": true,
            "follow_up_support": true
        }',
        'system', -- Created by system
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content = EXCLUDED.content,
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
        syllabus = EXCLUDED.syllabus,
        learning_objectives = EXCLUDED.learning_objectives,
        materials_needed = EXCLUDED.materials_needed,
        what_youll_learn = EXCLUDED.what_youll_learn,
        workshop_outline = EXCLUDED.workshop_outline,
        has_learn_content = EXCLUDED.has_learn_content,
        learn_objectives = EXCLUDED.learn_objectives,
        estimated_learn_time = EXCLUDED.estimated_learn_time,
        learn_difficulty = EXCLUDED.learn_difficulty,
        learn_prerequisites = EXCLUDED.learn_prerequisites,
        learn_materials = EXCLUDED.learn_materials,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    
    RAISE NOTICE 'Video Performance workshop created/updated with ID: %', workshop_id;
    RAISE NOTICE 'Workshop is associated with MadArts organization: %', madarts_org_id;
    
END $$;
