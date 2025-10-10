const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createVideoPerformanceWorkshop() {
  console.log('🎬 Creating Video Performance workshop for MadArts...');

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

    // Create the Video Performance workshop with correct schema
    const workshopData = {
      title: 'Video Performance Mastery',
      description: 'Master the art of video performance with Tere Garcia. Learn essential techniques for camera presence, emotional connection, and professional video production.',
      content: 'This comprehensive workshop covers all aspects of video performance, from overcoming camera anxiety to creating compelling content that connects with your audience.',
      category: 'Video Production',
      type: 'Workshop',
      level: 'intermediate',
      duration_minutes: 120, // 2 hours
      max_participants: 15,
      price: 0, // Free for MadArts members
      instructor: 'Tere Garcia',
      prerequisites: ['Basic understanding of video recording equipment'],
      materials: ['Camera or smartphone', 'Good lighting setup', 'Notebook'],
      outcomes: [
        'Develop confident camera presence',
        'Master emotional connection techniques',
        'Learn professional video production basics',
        'Understand lighting and framing principles',
        'Practice movement and gesture for video'
      ],
      is_active: true,
      is_public: true,
      is_shared: false,
      status: 'published',
      image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop&crop=center',
      featured: true,
      organization_id: org.id,
      learning_objectives: [
        'Develop confident camera presence',
        'Master emotional connection techniques',
        'Learn professional video production basics',
        'Understand lighting and framing principles',
        'Practice movement and gesture for video'
      ],
      materials_needed: ['Camera or smartphone', 'Good lighting setup', 'Notebook'],
      what_youll_learn: [
        'Camera presence and confidence building',
        'Emotional connection with audience',
        'Professional video production techniques',
        'Lighting and framing fundamentals',
        'Movement and gesture for video'
      ],
      workshop_outline: [
        'Introduction to Video Performance (15 min)',
        'Overcoming Camera Anxiety (20 min)',
        'Basic Acting Techniques (25 min)',
        'Voice and Diction (20 min)',
        'Lighting and Framing (25 min)',
        'Movement and Gesture (20 min)',
        'Creating Emotional Connection (15 min)'
      ],
      has_learn_content: true,
      learn_syllabus: {
        chapters: [
          { title: 'Introduction to Video Performance', duration: 15 },
          { title: 'Overcoming Camera Anxiety', duration: 20 },
          { title: 'Basic Acting Techniques', duration: 25 },
          { title: 'Voice and Diction', duration: 20 },
          { title: 'Lighting and Framing', duration: 25 },
          { title: 'Movement and Gesture', duration: 20 },
          { title: 'Creating Emotional Connection', duration: 15 }
        ]
      },
      learn_objectives: [
        'Develop confident camera presence',
        'Master emotional connection techniques',
        'Learn professional video production basics'
      ],
      estimated_learn_time: { hours: 2, minutes: 0 },
      learn_difficulty: 'intermediate',
      learn_prerequisites: ['Basic understanding of video recording equipment'],
      learn_materials: ['Camera or smartphone', 'Good lighting setup', 'Notebook'],
      course_available: true,
      interest_count: 0,
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
      instructor: workshop.instructor,
      duration: workshop.duration_minutes,
      level: workshop.level,
      organization_id: workshop.organization_id
    });

    console.log('\n🎉 Video Performance workshop setup completed!');
    console.log('🌐 Test the workshop at: http://localhost:3000/o/madarts/workshops');
    console.log('🎓 Workshop ID:', workshop.id);

  } catch (error) {
    console.error('❌ Failed to create Video Performance workshop:', error.message);
  }
}

// Run the creation
createVideoPerformanceWorkshop();
