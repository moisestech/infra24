const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsaG9zdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzY2OTk5OTYsImV4cCI6MjA1MjI3NTk5Nn0.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

const orgId = '2133fe94-fb12-41f8-ab37-ea4acd4589f6'

const sampleResources = [
  // Equipment
  {
    org_id: orgId,
    title: 'VR Headset - Oculus Quest 2',
    type: 'equipment',
    category: 'vr',
    description: 'High-quality VR headset for immersive experiences and development',
    location: 'Digital Lab - Station 1',
    capacity: 1,
    duration_minutes: 60,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      brand: 'Meta',
      model: 'Quest 2',
      features: ['Wireless', 'Hand Tracking', 'Room Scale']
    }
  },
  {
    org_id: orgId,
    title: '3D Printer - Prusa i3 MK3S+',
    type: 'equipment',
    category: '3d_printing',
    description: 'Professional 3D printer for prototyping and production',
    location: 'Digital Lab - Station 2',
    capacity: 1,
    duration_minutes: 120,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      brand: 'Prusa',
      model: 'i3 MK3S+',
      features: ['Auto Bed Leveling', 'Filament Sensor', 'Power Panic']
    }
  },
  {
    org_id: orgId,
    title: 'Camera - Canon EOS R5',
    type: 'equipment',
    category: 'photography',
    description: 'Professional mirrorless camera for high-quality photography and video',
    location: 'Digital Lab - Station 3',
    capacity: 1,
    duration_minutes: 90,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      brand: 'Canon',
      model: 'EOS R5',
      features: ['8K Video', '45MP Sensor', 'In-Body Stabilization']
    }
  },
  {
    org_id: orgId,
    title: 'MacBook Pro - M2 Max',
    type: 'equipment',
    category: 'computing',
    description: 'High-performance laptop for creative work and development',
    location: 'Digital Lab - Station 4',
    capacity: 1,
    duration_minutes: 120,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      brand: 'Apple',
      model: 'MacBook Pro M2 Max',
      features: ['32GB RAM', '1TB SSD', 'Liquid Retina XDR']
    }
  },

  // Spaces
  {
    org_id: orgId,
    title: 'Meeting Room - Conference Room A',
    type: 'space',
    category: 'meeting',
    description: 'Professional meeting room with video conferencing capabilities',
    location: 'Second Floor - Room 201',
    capacity: 8,
    duration_minutes: 60,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      amenities: ['Video Conference', 'Whiteboard', 'Projector'],
      max_capacity: 8
    }
  },
  {
    org_id: orgId,
    title: 'Studio Space - Creative Studio',
    type: 'space',
    category: 'studio',
    description: 'Large open studio space for creative projects and collaboration',
    location: 'First Floor - Studio 101',
    capacity: 12,
    duration_minutes: 120,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      amenities: ['Natural Light', 'High Ceilings', 'Flexible Layout'],
      max_capacity: 12
    }
  },

  // Workshops
  {
    org_id: orgId,
    title: 'VR Development Workshop',
    type: 'workshop',
    category: 'programming',
    description: 'Learn to create immersive VR experiences using Unity and C#',
    location: 'Digital Lab - Workshop Area',
    capacity: 6,
    duration_minutes: 180,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      instructor: 'Sarah Wilson',
      prerequisites: ['Basic programming knowledge'],
      materials: ['VR Headset', 'Unity License', 'Laptop']
    }
  },
  {
    org_id: orgId,
    title: '3D Printing Basics',
    type: 'workshop',
    category: 'making',
    description: 'Introduction to 3D printing, design, and post-processing',
    location: 'Digital Lab - 3D Printing Area',
    capacity: 8,
    duration_minutes: 120,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      instructor: 'Mike Johnson',
      prerequisites: ['None'],
      materials: ['3D Printer', 'Filament', 'Design Software']
    }
  },

  // People
  {
    org_id: orgId,
    title: 'Sarah Wilson - VR Specialist',
    type: 'person',
    category: 'mentor',
    description: 'Expert consultation on VR development and immersive experiences',
    location: 'Digital Lab - Consultation Area',
    capacity: 1,
    duration_minutes: 60,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      expertise: ['VR Development', 'Unity', '3D Design'],
      availability: 'Mon-Fri 9AM-5PM'
    }
  },
  {
    org_id: orgId,
    title: 'Mike Johnson - 3D Printing Expert',
    type: 'person',
    category: 'mentor',
    description: 'Professional guidance on 3D printing and digital fabrication',
    location: 'Digital Lab - 3D Printing Area',
    capacity: 1,
    duration_minutes: 60,
    price: 0.00,
    currency: 'USD',
    is_bookable: true,
    status: 'active',
    metadata: {
      expertise: ['3D Printing', 'CAD Design', 'Post-Processing'],
      availability: 'Tue-Thu 10AM-4PM'
    }
  }
]

async function addSampleResources() {
  console.log('🔄 Adding sample resources to database...')
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert(sampleResources)
      .select()

    if (error) {
      console.error('❌ Error adding resources:', error)
      return
    }

    console.log('✅ Successfully added', data.length, 'sample resources:')
    data.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.title} (${resource.type})`)
    })
    
    console.log('\n🎉 Sample resources added! You can now test the booking system.')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

addSampleResources()
