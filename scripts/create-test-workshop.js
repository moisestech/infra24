const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestWorkshop() {
  try {
    console.log('🎓 Creating test workshop...')

    // Get Oolite organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'oolite')
      .single()

    if (orgError || !org) {
      console.error('❌ Error finding Oolite organization:', orgError)
      return
    }

    console.log('✅ Found Oolite organization:', org.id)

    // Get a resource for the workshop
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('id, title')
      .eq('organization_id', org.id)
      .eq('is_bookable', true)
      .limit(1)
      .single()

    if (resourceError || !resource) {
      console.error('❌ Error finding resource:', resourceError)
      return
    }

    console.log('✅ Found resource:', resource.title)

    // Create test workshop
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .insert({
        organization_id: org.id,
        title: 'AI Art Creation Workshop',
        description: 'Learn to create stunning digital art using AI tools and techniques. Perfect for beginners and experienced artists alike.',
        max_participants: 12,
        is_public: true,
        is_active: true,
        level: 'beginner',
        duration_minutes: 180, // 3 hours
        type: 'workshop',
        category: 'digital_art',
        instructor: 'AI Art Specialist',
        materials: ['laptop', 'digital tablet', 'software access'],
        outcomes: ['Create AI-generated art', 'Understand AI art tools', 'Develop artistic workflow'],
        created_by: 'system',
        metadata: {
          skill_level: 'beginner',
          duration_hours: 3,
          materials_provided: true
        }
      })
      .select()
      .single()

    if (workshopError) {
      console.error('❌ Error creating workshop:', workshopError)
      return
    }

    console.log('✅ Created workshop:', workshop.title)

    // Create workshop announcement
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .insert({
        organization_id: org.id,
        title: '🎓 New Workshop: AI Art Creation',
        content: `Join us for "AI Art Creation Workshop"! Learn to create stunning digital art using AI tools and techniques. Perfect for beginners and experienced artists alike.

📅 Capacity: ${workshop.max_participants} participants
📍 Location: ${resource.title}
⏰ Duration: 3 hours
🎨 Materials provided

Register now to secure your spot!`,
        type: 'workshop',
        priority: 'normal',
        visibility: 'public',
        is_active: true,
        created_by: 'system',
        updated_by: 'system',
        metadata: {
          workshop_id: workshop.id,
          workshop_title: workshop.title,
          workshop_capacity: workshop.max_participants,
          workshop_resource: resource.title,
          announcement_type: 'workshop_promotion'
        }
      })
      .select()
      .single()

    if (announcementError) {
      console.error('❌ Error creating announcement:', announcementError)
      return
    }

    console.log('✅ Created announcement:', announcement.title)

    console.log('\n🎉 Test data created successfully!')
    console.log('📊 Workshop ID:', workshop.id)
    console.log('📢 Announcement ID:', announcement.id)
    console.log('\n🔗 Test URLs:')
    console.log('- Workshop Management: http://localhost:3002/o/oolite/admin/workshops')
    console.log('- Workshop Catalog: http://localhost:3002/o/oolite/workshop-catalog')
    console.log('- Announcements: http://localhost:3002/o/oolite/announcements')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createTestWorkshop()
