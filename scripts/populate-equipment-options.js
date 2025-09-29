const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

async function populateEquipmentOptions() {
  try {
    console.log('🚀 Starting to populate equipment options...');

    // Check if equipment options already exist
    const { data: existingOptions, error: checkError } = await supabase
      .from('equipment_options')
      .select('id, name, category')
      .eq('org_id', OOLITE_ORG_ID);

    if (checkError) {
      console.error('❌ Error checking existing equipment options:', checkError);
      return;
    }

    if (existingOptions && existingOptions.length > 0) {
      console.log('📋 Found existing equipment options:', existingOptions.length);
      existingOptions.forEach(option => {
        console.log(`  - ${option.name} (${option.category})`);
      });
      return;
    }

    // Create equipment options for voting
    const equipmentOptions = [
      // VR/AR Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'VR/AR Workstation',
        description: 'High-end VR development and content creation station with RTX 4080 GPU',
        category: 'VR/AR',
        estimated_cost: 5000.00,
        priority_level: 'high'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Meta Quest 3 VR Headset',
        description: 'Latest VR headset for immersive art experiences',
        category: 'VR/AR',
        estimated_cost: 500.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Apple Vision Pro',
        description: 'Professional mixed reality headset for creative work',
        category: 'VR/AR',
        estimated_cost: 3500.00,
        priority_level: 'high'
      },

      // 3D Printing Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'Prusa i3 MK4 3D Printer',
        description: 'High-quality 3D printer for detailed prototyping',
        category: '3D Printing',
        estimated_cost: 1200.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Resin 3D Printer',
        description: 'High-resolution resin printer for detailed miniatures and jewelry',
        category: '3D Printing',
        estimated_cost: 800.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Large Format 3D Printer',
        description: '3D printer with 500x500x500mm build volume',
        category: '3D Printing',
        estimated_cost: 3000.00,
        priority_level: 'low'
      },

      // Audio Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'Professional Audio Studio',
        description: 'Complete audio recording and mixing setup',
        category: 'Audio',
        estimated_cost: 8000.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Podcast Recording Booth',
        description: 'Sound-isolated booth for podcast and voice recording',
        category: 'Audio',
        estimated_cost: 2000.00,
        priority_level: 'low'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'MIDI Controller Station',
        description: 'Professional MIDI controllers for music production',
        category: 'Audio',
        estimated_cost: 1500.00,
        priority_level: 'medium'
      },

      // Photography Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'Professional Photography Studio',
        description: 'Complete photography setup with lighting and backdrops',
        category: 'Photography',
        estimated_cost: 10000.00,
        priority_level: 'high'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: '360° Camera Setup',
        description: 'Equipment for creating immersive 360° content',
        category: 'Photography',
        estimated_cost: 2000.00,
        priority_level: 'low'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Drone Photography Kit',
        description: 'Professional drone for aerial photography and videography',
        category: 'Photography',
        estimated_cost: 3000.00,
        priority_level: 'medium'
      },

      // Digital Art Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'Wacom Cintiq Pro 32',
        description: 'Large format drawing tablet for digital art',
        category: 'Digital Art',
        estimated_cost: 3500.00,
        priority_level: 'high'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'iPad Pro with Apple Pencil',
        description: 'Portable digital art creation device',
        category: 'Digital Art',
        estimated_cost: 1200.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Color Calibrated Monitor',
        description: 'Professional monitor for accurate color work',
        category: 'Digital Art',
        estimated_cost: 800.00,
        priority_level: 'medium'
      },

      // AI/ML Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'AI Art Generation Workstation',
        description: 'High-end computer for AI art generation and machine learning',
        category: 'AI/ML',
        estimated_cost: 6000.00,
        priority_level: 'high'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'GPU Server for AI Training',
        description: 'Dedicated server for training custom AI models',
        category: 'AI/ML',
        estimated_cost: 15000.00,
        priority_level: 'low'
      },

      // Fabrication Equipment
      {
        org_id: OOLITE_ORG_ID,
        name: 'Laser Cutter/Engraver',
        description: 'CNC laser for cutting and engraving various materials',
        category: 'Fabrication',
        estimated_cost: 8000.00,
        priority_level: 'high'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'CNC Router',
        description: 'Computer-controlled router for wood and metal work',
        category: 'Fabrication',
        estimated_cost: 12000.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Vinyl Cutter',
        description: 'Professional vinyl cutting machine for signage and decals',
        category: 'Fabrication',
        estimated_cost: 2000.00,
        priority_level: 'medium'
      },

      // Software and Licenses
      {
        org_id: OOLITE_ORG_ID,
        name: 'Adobe Creative Cloud Licenses',
        description: 'Professional software licenses for creative work',
        category: 'Software',
        estimated_cost: 600.00,
        priority_level: 'critical'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Blender Pro License',
        description: 'Professional 3D modeling and animation software',
        category: 'Software',
        estimated_cost: 200.00,
        priority_level: 'medium'
      },
      {
        org_id: OOLITE_ORG_ID,
        name: 'Unity Pro License',
        description: 'Game development and interactive media platform',
        category: 'Software',
        estimated_cost: 400.00,
        priority_level: 'low'
      }
    ];

    console.log('📝 Creating equipment options...');

    for (const option of equipmentOptions) {
      const { data, error } = await supabase
        .from('equipment_options')
        .insert(option)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating equipment option "${option.name}":`, error);
      } else {
        console.log(`✅ Created equipment option: "${option.name}"`);
      }
    }

    console.log('🎉 Finished populating equipment options!');

  } catch (error) {
    console.error('❌ Error in populateEquipmentOptions:', error);
  }
}

populateEquipmentOptions();
