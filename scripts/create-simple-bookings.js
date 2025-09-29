#!/usr/bin/env node

/**
 * Create Simple Bookings Script
 * 
 * This script creates simple booking data for testing
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Organization ID
const OOLITE_ORG_ID = 'e5c13761-bb53-4b74-94ef-aa08de38bdaf';

async function createSimpleBookings() {
  console.log('🎯 Creating simple booking data...\n');
  
  try {
    // First, let's check if there are any resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('id, title, type')
      .eq('org_id', OOLITE_ORG_ID);
    
    if (resourcesError) {
      console.error('❌ Error fetching resources:', resourcesError);
      return;
    }
    
    if (!resources || resources.length === 0) {
      console.log('📦 No resources found. Creating basic resources first...');
      
      // Create basic resources
      const basicResources = [
        {
          org_id: OOLITE_ORG_ID,
          type: 'space',
          title: 'Digital Lab',
          description: 'Main digital art workspace',
          capacity: 12,
          duration_minutes: 60,
          price: 0,
          currency: 'USD',
          location: 'Building A, Room 101',
          is_active: true,
          is_bookable: true,
          created_by: 'system',
          updated_by: 'system'
        },
        {
          org_id: OOLITE_ORG_ID,
          type: 'equipment',
          title: '3D Printer',
          description: 'High-quality 3D printer for prototyping',
          capacity: 1,
          duration_minutes: 180,
          price: 0,
          currency: 'USD',
          location: 'Digital Lab',
          is_active: true,
          is_bookable: true,
          created_by: 'system',
          updated_by: 'system'
        }
      ];
      
      const { data: createdResources, error: createError } = await supabase
        .from('resources')
        .insert(basicResources)
        .select('id, title, type');
      
      if (createError) {
        console.error('❌ Error creating resources:', createError);
        return;
      }
      
      console.log(`✅ Created ${createdResources.length} resources`);
      resources.push(...createdResources);
    }
    
    console.log(`📋 Found ${resources.length} resources`);
    
    // Create some simple bookings
    const now = new Date();
    const bookings = [];
    
    for (let i = 0; i < 5; i++) {
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const bookingDate = new Date(now);
      bookingDate.setDate(now.getDate() + i);
      
      const startTime = new Date(bookingDate);
      startTime.setHours(10 + (i * 2), 0, 0, 0); // 10am, 12pm, 2pm, 4pm, 6pm
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 2);
      
      const booking = {
        org_id: OOLITE_ORG_ID,
        resource_id: resource.id,
        resource_type: resource.type,
        title: `Booking for ${resource.title}`,
        description: `Test booking for ${resource.title}`,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'confirmed',
        user_id: 'system',
        created_by_clerk_id: 'system',
        created_by: 'system',
        updated_by: 'system'
      };
      
      bookings.push(booking);
    }
    
    // Insert bookings
    const { data: createdBookings, error: bookingsError } = await supabase
      .from('bookings')
      .insert(bookings)
      .select('id, title, start_time, end_time, status');
    
    if (bookingsError) {
      console.error('❌ Error creating bookings:', bookingsError);
      return;
    }
    
    console.log(`✅ Created ${createdBookings.length} bookings`);
    
    // Show created bookings
    createdBookings.forEach(booking => {
      console.log(`   - ${booking.title} (${booking.status}) - ${new Date(booking.start_time).toLocaleDateString()}`);
    });
    
    console.log('\n🎉 Simple booking data created successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
if (require.main === module) {
  createSimpleBookings()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSimpleBookings };
