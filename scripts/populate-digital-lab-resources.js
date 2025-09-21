require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const digitalLabResources = [
  {
    type: 'equipment',
    title: '3D Printer - Prusa i3 MK3S+',
    description: 'High-resolution 3D printer for prototyping and small production runs. Supports PLA, ABS, PETG, and flexible materials.',
    category: 'Digital Lab Equipment',
    capacity: 1,
    duration_minutes: 120,
    price: 25.00,
    currency: 'USD',
    location: 'Digital Lab - Workstation 1',
    requirements: ['Basic 3D printing knowledge', 'STL file preparation', 'Safety orientation'],
    availability_rules: {
      min_booking_hours: 2,
      max_booking_hours: 8,
      advance_booking_days: 7,
      cancellation_hours: 24
    },
    metadata: {
      specs: {
        build_volume: '250x210x200mm',
        materials: ['PLA', 'ABS', 'PETG', 'TPU'],
        resolution: '0.05mm'
      },
      maintenance: 'Weekly cleaning required'
    }
  },
  {
    type: 'equipment',
    title: 'High-Performance Workstation',
    description: 'Dedicated workstation with RTX 4070 GPU for AI/ML work, 3D modeling, video editing, and creative coding.',
    category: 'Digital Lab Equipment',
    capacity: 1,
    duration_minutes: 60,
    price: 15.00,
    currency: 'USD',
    location: 'Digital Lab - Workstation 2',
    requirements: ['Basic computer skills', 'Project file management'],
    availability_rules: {
      min_booking_hours: 1,
      max_booking_hours: 6,
      advance_booking_days: 14,
      cancellation_hours: 12
    },
    metadata: {
      specs: {
        cpu: 'Intel i7-13700K',
        ram: '32GB DDR5',
        gpu: 'RTX 4070',
        storage: '1TB NVMe SSD'
      },
      software: ['Blender', 'Unreal Engine', 'Adobe Creative Suite', 'Python', 'Jupyter']
    }
  },
  {
    type: 'equipment',
    title: 'Large Format Photo Printer',
    description: 'Professional photo printer for high-quality prints up to 44 inches wide. Perfect for exhibition prints and portfolio work.',
    category: 'Digital Lab Equipment',
    capacity: 1,
    duration_minutes: 90,
    price: 35.00,
    currency: 'USD',
    location: 'Digital Lab - Print Station',
    requirements: ['Print file preparation', 'Color management basics', 'Paper handling'],
    availability_rules: {
      min_booking_hours: 1.5,
      max_booking_hours: 4,
      advance_booking_days: 3,
      cancellation_hours: 6
    },
    metadata: {
      specs: {
        max_width: '44 inches',
        paper_types: ['photo', 'canvas', 'vinyl', 'banner'],
        resolution: '2880x1440 dpi'
      },
      materials: 'Bring your own paper or purchase on-site'
    }
  },
  {
    type: 'equipment',
    title: 'VR/AR Development Kit',
    description: 'Complete VR/AR development setup with Meta Quest 3, hand tracking, and development tools for immersive experiences.',
    category: 'Digital Lab Equipment',
    capacity: 2,
    duration_minutes: 120,
    price: 20.00,
    currency: 'USD',
    location: 'Digital Lab - VR Station',
    requirements: ['Unity or Unreal Engine experience', 'VR safety orientation', 'Motion sickness awareness'],
    availability_rules: {
      min_booking_hours: 2,
      max_booking_hours: 6,
      advance_booking_days: 5,
      cancellation_hours: 24
    },
    metadata: {
      specs: {
        headset: 'Meta Quest 3',
        controllers: 'Hand tracking + Touch Pro',
        development_tools: ['Unity', 'Unreal Engine', 'WebXR']
      },
      safety: '30-minute breaks required every 2 hours'
    }
  },
  {
    type: 'space',
    title: 'Digital Lab Conference Room',
    description: 'Private meeting space with large display, video conferencing, and whiteboard for project discussions and presentations.',
    category: 'Digital Lab Spaces',
    capacity: 8,
    duration_minutes: 60,
    price: 10.00,
    currency: 'USD',
    location: 'Digital Lab - Conference Room',
    requirements: ['Respectful use of shared space', 'Clean up after use'],
    availability_rules: {
      min_booking_hours: 1,
      max_booking_hours: 4,
      advance_booking_days: 7,
      cancellation_hours: 2
    },
    metadata: {
      amenities: ['75-inch 4K display', 'Video conferencing', 'Whiteboard', 'Wireless presentation'],
      capacity: '8 people max'
    }
  },
  {
    type: 'workshop',
    title: 'AI & Creative Coding Workshop',
    description: 'Hands-on workshop covering AI tools for artists, creative coding with p5.js, and digital art techniques.',
    category: 'Digital Lab Workshops',
    capacity: 12,
    duration_minutes: 180,
    price: 45.00,
    currency: 'USD',
    location: 'Digital Lab - Main Space',
    requirements: ['Basic computer skills', 'Bring laptop if possible', 'Creative mindset'],
    availability_rules: {
      min_booking_hours: 3,
      max_booking_hours: 3,
      advance_booking_days: 14,
      cancellation_hours: 48
    },
    metadata: {
      topics: ['AI image generation', 'Creative coding', 'Digital art tools'],
      materials: 'All materials provided',
      skill_level: 'Beginner to Intermediate'
    }
  },
  {
    type: 'workshop',
    title: '3D Modeling & Printing Workshop',
    description: 'Learn 3D modeling with Blender, prepare files for printing, and understand the complete workflow from concept to physical object.',
    category: 'Digital Lab Workshops',
    capacity: 8,
    duration_minutes: 240,
    price: 60.00,
    currency: 'USD',
    location: 'Digital Lab - Main Space',
    requirements: ['Basic computer skills', 'Patience for learning new software', 'Creative project in mind'],
    availability_rules: {
      min_booking_hours: 4,
      max_booking_hours: 4,
      advance_booking_days: 21,
      cancellation_hours: 72
    },
    metadata: {
      topics: ['Blender basics', '3D modeling', 'File preparation', 'Printing process'],
      materials: 'Includes 3D printing materials',
      take_home: 'Keep your printed object'
    }
  },
  {
    type: 'event',
    title: 'Digital Lab Open House',
    description: 'Monthly open house showcasing Digital Lab capabilities, featuring guest artists, and networking opportunities.',
    category: 'Digital Lab Events',
    capacity: 50,
    duration_minutes: 120,
    price: 0.00,
    currency: 'USD',
    location: 'Digital Lab - All Spaces',
    requirements: ['Open to all', 'RSVP required'],
    availability_rules: {
      min_booking_hours: 2,
      max_booking_hours: 2,
      advance_booking_days: 30,
      cancellation_hours: 24
    },
    metadata: {
      schedule: 'First Friday of each month',
      features: ['Equipment demos', 'Guest artists', 'Networking', 'Light refreshments'],
      registration: 'Free but RSVP required'
    }
  }
];

async function populateDigitalLabResources() {
  try {
    console.log('🚀 Starting Digital Lab resources population...');

    // Get organizations
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .in('slug', ['oolite', 'bakehouse', 'locust']);

    if (orgError) {
      console.error('Error fetching organizations:', orgError);
      return;
    }

    console.log(`📋 Found ${organizations.length} organizations:`, organizations.map(o => o.name));

    // Insert resources for each organization
    for (const org of organizations) {
      console.log(`\n🏢 Processing ${org.name}...`);
      
      for (const resource of digitalLabResources) {
        const { data, error } = await supabase
          .from('resources')
          .insert({
            organization_id: org.id,
            ...resource,
            created_by: 'system',
            updated_by: 'system'
          })
          .select();

        if (error) {
          console.error(`❌ Error inserting ${resource.title} for ${org.name}:`, error);
        } else {
          console.log(`✅ Created: ${resource.title} for ${org.name}`);
        }
      }
    }

    console.log('\n🎉 Digital Lab resources population completed!');
    
    // Verify the data
    const { data: allResources, error: verifyError } = await supabase
      .from('resources')
      .select(`
        id,
        title,
        category,
        price,
        organizations!inner(name, slug)
      `)
      .eq('category', 'Digital Lab Equipment');

    if (verifyError) {
      console.error('Error verifying resources:', verifyError);
    } else {
      console.log(`\n📊 Verification: Found ${allResources.length} Digital Lab resources`);
      allResources.forEach(resource => {
        console.log(`  - ${resource.title} (${resource.organizations.name}): $${resource.price}`);
      });
    }

  } catch (error) {
    console.error('❌ Error in populateDigitalLabResources:', error);
  }
}

populateDigitalLabResources();
