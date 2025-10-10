const { createClient } = require('@supabase/supabase-js');

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createSimpleVideoPerformanceWorkshop() {
  console.log('🎬 Creating simple Video Performance workshop for MadArts...');

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

    // Create a simple Video Performance workshop with minimal required fields
    const workshopData = {
      title: 'Video Performance Mastery',
      description: 'Master the art of video performance with Tere Garcia. Learn essential techniques for camera presence, emotional connection, and professional video production.',
      content: 'This comprehensive workshop covers all aspects of video performance, from overcoming camera anxiety to creating compelling content that connects with your audience.',
      category: 'Video Production',
      type: 'Workshop',
      level: 'intermediate',
      duration_minutes: 120,
      max_participants: 15,
      price: 0,
      instructor: 'Tere Garcia',
      is_active: true,
      is_public: true,
      is_shared: false,
      status: 'published',
      image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop&crop=center',
      featured: true,
      organization_id: org.id,
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
createSimpleVideoPerformanceWorkshop();
