const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupVideoPerformanceWorkshop() {
  console.log('🎬 Setting up Video Performance workshop for MadArts...');

  try {
    // First, get the MadArts organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'madarts')
      .single();

    if (orgError || !org) {
      console.error('❌ Error fetching MadArts organization:', orgError);
      return;
    }

    console.log('🏢 MadArts Organization:', {
      id: org.id,
      name: org.name,
      slug: org.slug
    });

    // Create the Video Performance workshop
    const workshopData = {
      id: '550e8400-e29b-41d4-a716-446655440000', // Fixed UUID for consistency
      title: 'Video Performance Mastery',
      description: 'Master the art of video performance with Tere Garcia. Learn essential techniques for camera presence, emotional connection, and professional video production.',
      level: 'intermediate',
      duration: 120, // 2 hours
      organization_id: org.id,
      image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop&crop=center',
      instructor_name: 'Tere Garcia',
      instructor_bio: 'Tere Garcia is a renowned video performance artist and educator with over 10 years of experience in digital storytelling and multimedia arts.',
      learning_objectives: [
        'Develop confident camera presence',
        'Master emotional connection techniques',
        'Learn professional video production basics',
        'Understand lighting and framing principles',
        'Practice movement and gesture for video'
      ],
      prerequisites: 'Basic understanding of video recording equipment',
      materials_needed: 'Camera or smartphone, good lighting setup, notebook',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('🎬 Creating Video Performance workshop...');
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .insert(workshopData)
      .select()
      .single();

    if (workshopError) {
      console.error('❌ Error creating workshop:', workshopError);
      return;
    }

    console.log('✅ Video Performance workshop created successfully!');
    console.log('🎓 Workshop Details:', {
      id: workshop.id,
      title: workshop.title,
      instructor: workshop.instructor_name,
      duration: workshop.duration,
      level: workshop.level
    });

    // Create workshop chapters
    const chapters = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        workshop_id: workshop.id,
        chapter_slug: 'introduction-to-video-performance',
        title: 'Introduction to Video Performance',
        content: 'Welcome to Video Performance Mastery! In this chapter, we\'ll explore the fundamentals of video performance and what makes a compelling on-camera presence.',
        order_index: 1,
        duration_minutes: 15,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        workshop_id: workshop.id,
        chapter_slug: 'overcoming-camera-anxiety',
        title: 'Overcoming Camera Anxiety',
        content: 'Learn practical techniques to overcome camera anxiety and build confidence in front of the lens.',
        order_index: 2,
        duration_minutes: 20,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        workshop_id: workshop.id,
        chapter_slug: 'basic-acting-techniques',
        title: 'Basic Acting Techniques for Video',
        content: 'Discover essential acting techniques specifically adapted for video performance and digital storytelling.',
        order_index: 3,
        duration_minutes: 25,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        workshop_id: workshop.id,
        chapter_slug: 'voice-and-diction',
        title: 'Voice and Diction for Video',
        content: 'Master your voice and diction to create engaging and professional video content.',
        order_index: 4,
        duration_minutes: 20,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        workshop_id: workshop.id,
        chapter_slug: 'lighting-and-framing',
        title: 'Lighting and Framing',
        content: 'Learn the fundamentals of lighting and framing to create visually appealing video content.',
        order_index: 5,
        duration_minutes: 25,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        workshop_id: workshop.id,
        chapter_slug: 'movement-and-gesture',
        title: 'Movement and Gesture',
        content: 'Understand how movement and gesture can enhance your video performance and storytelling.',
        order_index: 6,
        duration_minutes: 20,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        workshop_id: workshop.id,
        chapter_slug: 'creating-emotional-connection',
        title: 'Creating Emotional Connection',
        content: 'Learn how to create genuine emotional connections with your audience through video performance.',
        order_index: 7,
        duration_minutes: 15,
        created_at: new Date().toISOString()
      }
    ];

    console.log('📚 Creating workshop chapters...');
    const { data: createdChapters, error: chaptersError } = await supabase
      .from('workshop_chapters')
      .insert(chapters)
      .select();

    if (chaptersError) {
      console.error('❌ Error creating chapters:', chaptersError);
    } else {
      console.log('✅ Created', createdChapters?.length || 0, 'chapters successfully!');
      createdChapters?.forEach((chapter, index) => {
        console.log(`   Chapter ${index + 1}: ${chapter.title}`);
      });
    }

    console.log('\n🎉 Video Performance workshop setup completed!');
    console.log('🌐 Test the workshop at: http://localhost:3000/o/madarts/workshops');
    console.log('🎓 Workshop ID:', workshop.id);

  } catch (error) {
    console.error('❌ Failed to setup Video Performance workshop:', error.message);
  }
}

// Run the setup
setupVideoPerformanceWorkshop();
