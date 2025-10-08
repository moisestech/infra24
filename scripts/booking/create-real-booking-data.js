/**
 * Create Real Booking Data for Testing
 * This script creates actual booking data using the existing resources and artists
 * Run with: node scripts/data/seed/create-real-booking-data.js
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

async function createRealBookingData() {
  console.log('🎯 Creating real booking data using existing resources and artists...');

  try {
    // Get existing organizations
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug, name')
      .limit(5);

    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError);
      return;
    }

    console.log(`✅ Found ${organizations.length} organizations`);

    // Get existing resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .limit(10);

    if (resourcesError) {
      console.error('❌ Error fetching resources:', resourcesError);
      return;
    }

    console.log(`✅ Found ${resources.length} resources`);

    // Get existing artists
    const { data: artists, error: artistsError } = await supabase
      .from('artist_profiles')
      .select('id, name, organization_id')
      .limit(10);

    if (artistsError) {
      console.error('❌ Error fetching artists:', artistsError);
      return;
    }

    console.log(`✅ Found ${artists.length} artists`);

    // Create bookings for each organization
    for (const org of organizations) {
      console.log(`📅 Creating bookings for ${org.name} (${org.slug})...`);

      // Get resources for this organization
      const orgResources = resources.filter(r => r.org_id === org.id);
      const orgArtists = artists.filter(a => a.organization_id === org.id);

      if (orgResources.length === 0 || orgArtists.length === 0) {
        console.log(`⚠️  Skipping ${org.name} - no resources or artists found`);
        continue;
      }

      const bookings = [];

      // Create 2-3 bookings per organization
      for (let i = 0; i < Math.min(3, orgResources.length); i++) {
        const resource = orgResources[i];
        const artist = orgArtists[i % orgArtists.length]; // Cycle through artists

        const startTime = new Date();
        startTime.setDate(startTime.getDate() + (i + 1) * 7); // Next few weeks
        startTime.setHours(10 + (i * 2), 0, 0, 0); // 10 AM, 12 PM, 2 PM

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (resource.duration_minutes || 120));

        const booking = {
          org_id: org.id,
          user_id: 'mock-user-' + (i + 1),
          resource_type: resource.type,
          resource_id: resource.id,
          title: resource.title,
          description: resource.description,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: i === 0 ? 'confirmed' : 'pending',
          capacity: resource.capacity,
          current_participants: Math.floor(resource.capacity * 0.7), // 70% full
          price: resource.price,
          currency: resource.currency,
          location: resource.location,
          requirements: resource.requirements,
          notes: `Booking created for ${artist.name} to lead ${resource.title}`,
          metadata: {
            instructor_id: artist.id,
            instructor_name: artist.name,
            contact_name: `Contact ${i + 1}`,
            contact_email: `contact${i + 1}@example.com`,
            contact_phone: `+1-555-${String(i + 1).padStart(4, '0')}`
          },
          created_by: 'system',
          updated_by: 'system'
        };

        bookings.push(booking);
      }

      if (bookings.length > 0) {
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert(bookings);

        if (bookingError) {
          console.error(`❌ Error creating bookings for ${org.name}:`, bookingError);
        } else {
          console.log(`✅ Created ${bookings.length} bookings for ${org.name}`);

          // Create booking participants
          const { data: createdBookings } = await supabase
            .from('bookings')
            .select('id, current_participants')
            .eq('org_id', org.id)
            .order('created_at', { ascending: false })
            .limit(bookings.length);

          if (createdBookings) {
            const participants = [];
            for (const booking of createdBookings) {
              // Add participants based on current_participants count
              for (let i = 0; i < booking.current_participants; i++) {
                participants.push({
                  booking_id: booking.id,
                  user_id: `participant-${booking.id}-${i + 1}`,
                  status: 'confirmed',
                  registered_at: new Date().toISOString(),
                  confirmed_at: new Date().toISOString(),
                  notes: `Participant ${i + 1} for ${booking.id}`
                });
              }
            }

            if (participants.length > 0) {
              const { error: participantError } = await supabase
                .from('booking_participants')
                .insert(participants);

              if (participantError) {
                console.error(`❌ Error creating participants for ${org.name}:`, participantError);
              } else {
                console.log(`✅ Created ${participants.length} participants for ${org.name}`);
              }
            }
          }
        }
      }
    }

    console.log('\n🎉 Real booking data creation completed!');
    console.log('\n📊 Summary:');
    console.log('- Real bookings created using existing resources and artists');
    console.log('- Participants added to bookings');
    console.log('- Ready for testing the booking system with real data');

  } catch (error) {
    console.error('❌ Error creating real booking data:', error);
    process.exit(1);
  }
}

// Run the script
createRealBookingData();

