/**
 * Create Mock Booking Data for Testing
 * This script creates sample booking data for testing the booking system
 * Run with: node scripts/data/seed/create-mock-booking-data.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMockBookingData() {
  console.log('🎯 Creating mock booking data for testing...');

  try {
    // Get organization IDs
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug')
      .in('slug', ['bakehouse', 'oolite']);

    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError);
      return;
    }

    if (!organizations || organizations.length === 0) {
      console.error('❌ No organizations found. Please run the database migration first.');
      return;
    }

    console.log(`✅ Found ${organizations.length} organizations`);

    // Create mock bookings for each organization
    for (const org of organizations) {
      console.log(`📅 Creating mock bookings for ${org.slug}...`);

      const mockBookings = [
        {
          organization_id: org.id,
          user_id: 'mock-user-1',
          resource_type: 'workshop',
          resource_id: 'ai-art-fundamentals',
          title: 'AI Art Fundamentals Workshop',
          description: 'Learn the basics of AI-generated art and creative tools',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Tomorrow + 2 hours
          status: 'confirmed',
          capacity: 15,
          current_participants: 12,
          price: 50.00,
          currency: 'USD',
          location: 'Digital Lab',
          requirements: ['Laptop', 'Internet connection', 'Basic computer skills'],
          notes: 'Mock booking for testing',
          metadata: {
            instructor_id: 'artist-1',
            contact_name: 'Sarah Johnson',
            contact_email: 'sarah@example.com',
            contact_phone: '+1-555-0123'
          },
          created_by: 'mock-user-1',
          updated_by: 'mock-user-1'
        },
        {
          organization_id: org.id,
          user_id: 'mock-user-2',
          resource_type: 'equipment',
          resource_id: '3d-printer-1',
          title: '3D Printer Session',
          description: 'Book time on our 3D printer for your project',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // Day after tomorrow + 3 hours
          status: 'pending',
          capacity: 1,
          current_participants: 1,
          price: 25.00,
          currency: 'USD',
          location: 'Fabrication Lab',
          requirements: ['3D modeling software', 'Safety glasses'],
          notes: 'Need to print a prototype for my art project',
          metadata: {
            contact_name: 'Mike Chen',
            contact_email: 'mike@example.com',
            contact_phone: '+1-555-0456'
          },
          created_by: 'mock-user-2',
          updated_by: 'mock-user-2'
        },
        {
          organization_id: org.id,
          user_id: 'mock-user-3',
          resource_type: 'workshop',
          resource_id: 'creative-coding',
          title: 'Creative Coding Lab',
          description: 'Explore the intersection of programming and art',
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 3 days from now + 2 hours
          status: 'confirmed',
          capacity: 12,
          current_participants: 8,
          price: 40.00,
          currency: 'USD',
          location: 'Digital Lab',
          requirements: ['Laptop', 'Internet access'],
          notes: 'Interactive art workshop',
          metadata: {
            instructor_id: 'artist-3',
            contact_name: 'Alex Rivera',
            contact_email: 'alex@example.com',
            contact_phone: '+1-555-0789'
          },
          created_by: 'mock-user-3',
          updated_by: 'mock-user-3'
        }
      ];

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert(mockBookings);

      if (bookingError) {
        console.error(`❌ Error creating bookings for ${org.slug}:`, bookingError);
      } else {
        console.log(`✅ Created ${mockBookings.length} mock bookings for ${org.slug}`);
      }

      // Create mock booking participants
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, capacity, current_participants')
        .eq('organization_id', org.id)
        .limit(3);

      if (bookings) {
        const participants = [];
        for (const booking of bookings) {
          // Add participants based on current_participants count
          for (let i = 0; i < booking.current_participants; i++) {
            participants.push({
              booking_id: booking.id,
              user_id: `mock-participant-${i + 1}`,
              status: 'confirmed',
              registered_at: new Date().toISOString(),
              confirmed_at: new Date().toISOString(),
              notes: `Mock participant ${i + 1}`
            });
          }
        }

        if (participants.length > 0) {
          const { error: participantError } = await supabase
            .from('booking_participants')
            .insert(participants);

          if (participantError) {
            console.error(`❌ Error creating participants for ${org.slug}:`, participantError);
          } else {
            console.log(`✅ Created ${participants.length} mock participants for ${org.slug}`);
          }
        }
      }
    }

    console.log('🎉 Mock booking data creation completed!');
    console.log('\n📊 Summary:');
    console.log('- Mock bookings created for each organization');
    console.log('- Mock participants added to bookings');
    console.log('- Ready for testing the booking system');

  } catch (error) {
    console.error('❌ Error creating mock booking data:', error);
    process.exit(1);
  }
}

// Run the script
createMockBookingData();
