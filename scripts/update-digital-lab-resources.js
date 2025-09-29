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

async function updateDigitalLabResources() {
  try {
    console.log('🚀 Starting to update digital lab resources...');

    // First, let's see what we currently have
    const { data: currentResources, error: fetchError } = await supabase
      .from('resources')
      .select('id, title, type, category')
      .eq('org_id', OOLITE_ORG_ID);

    if (fetchError) {
      console.error('❌ Error fetching current resources:', fetchError);
      return;
    }

    console.log('📋 Current resources count:', currentResources?.length || 0);
    
    // Delete all existing resources to start fresh
    console.log('🗑️ Deleting existing resources...');
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('org_id', OOLITE_ORG_ID);

    if (deleteError) {
      console.error('❌ Error deleting existing resources:', deleteError);
      return;
    }

    console.log('✅ Deleted existing resources');

    // Create the actual equipment you have
    const actualResources = [
      {
        org_id: OOLITE_ORG_ID,
        type: 'equipment',
        title: 'Large Format Printer - SureColor P8000',
        description: 'Professional large format printer for high-quality prints up to 44 inches wide',
        category: 'Printing',
        capacity: 1,
        duration_minutes: 120,
        price: 0,
        currency: 'USD',
        location: 'Digital Lab',
        requirements: ['Basic computer skills', 'File preparation knowledge'],
        availability_rules: {
          allowed_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          allowed_hours: { start: '09:00', end: '17:00' },
          max_advance_days: 7,
          min_advance_hours: 4
        },
        metadata: {
          specifications: {
            max_width: '44 inches',
            resolution: '2400 x 1200 dpi',
            media_types: ['Photo Paper', 'Canvas', 'Vinyl', 'Banner Material'],
            ink_types: ['Pigment-based inks']
          },
          maintenance_schedule: 'Weekly cleaning required',
          status: 'available',
          image_url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1759182383/smart-sign/orgs/oolite/epson-p8000_kw1m5d.png'
        },
        is_active: true,
        is_bookable: true,
        created_by: 'system',
        updated_by: 'system'
      },
      {
        org_id: OOLITE_ORG_ID,
        type: 'equipment',
        title: 'Makerbot 3D Printer',
        description: 'Professional 3D printer for prototyping and art projects',
        category: '3D Printing',
        capacity: 1,
        duration_minutes: 180,
        price: 0,
        currency: 'USD',
        location: 'Digital Lab',
        requirements: ['3D modeling experience required'],
        availability_rules: {
          allowed_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          allowed_hours: { start: '09:00', end: '18:00' },
          max_advance_days: 7,
          min_advance_hours: 1
        },
        metadata: {
          specifications: {
            materials: ['PLA', 'PETG', 'ABS'],
            build_volume: '300x200x200mm',
            layer_height: '0.1-0.3mm',
            nozzle_diameter: '0.4mm'
          },
          status: 'maintenance',
          image_url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1759182383/smart-sign/orgs/oolite/replicator-1_eal6bf.png'
        },
        is_active: true,
        is_bookable: false, // Currently in maintenance
        created_by: 'system',
        updated_by: 'system'
      }
    ];

    console.log('📝 Creating actual digital lab resources...');

    for (const resource of actualResources) {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating resource "${resource.title}":`, error);
      } else {
        console.log(`✅ Created resource: "${resource.title}"`);
      }
    }

    console.log('🎉 Finished updating digital lab resources!');

  } catch (error) {
    console.error('❌ Error in updateDigitalLabResources:', error);
  }
}

updateDigitalLabResources();
