/**
 * Create Bakehouse Bookings with Real Data
 * This script creates actual booking data for Bakehouse using existing resources and artists
 * Run with: node scripts/data/seed/create-bakehouse-bookings.js
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

async function createBakehouseBookings() {
  console.log('🎯 Creating bookings for Bakehouse Art Complex...');

  const bakehouseOrgId = '2efcebf3-9750-4ea2-85a0-9501eb698b20';

  try {
    // Get Bakehouse resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .eq('org_id', bakehouseOrgId);

    if (resourcesError) {
      console.error('❌ Error fetching resources:', resourcesError);
      return;
    }

    // Get Bakehouse artists
    const { data: artists, error: artistsError } = await supabase
      .from('artist_profiles')
      .select('id, name')
      .eq('organization_id', bakehouseOrgId)
      .limit(5);

    if (artistsError) {
      console.error('❌ Error fetching artists:', artistsError);
      return;
    }

    console.log(`✅ Found ${resources.length} resources and ${artists.length} artists`);

    if (resources.length === 0 || artists.length === 0) {
      console.log('⚠️  No resources or artists found for Bakehouse');
      return;
    }

    const bookings = [];

    // Create bookings using real data
    for (let i = 0; i < Math.min(3, resources.length); i++) {
      const resource = resources[i];
      const artist = artists[i % artists.length];

      const startTime = new Date();
      startTime.setDate(startTime.getDate() + (i + 1) * 7);
      startTime.setHours(10 + (i * 2), 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (resource.duration_minutes || 120));

      const booking = {
        org_id: bakehouseOrgId,
        user_id: 'mock-user-' + (i + 1),
        resource_type: resource.type,
        resource_id: resource.id,
        title: resource.title,
        description: resource.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: i === 0 ? 'confirmed' : 'pending',
        capacity: resource.capacity,
        current_participants: Math.floor(resource.capacity * 0.7),
        price: resource.price,
        currency: resource.currency,
        location: resource.location,
        requirements: resource.requirements,
        notes: `Booking with ${artist.name} for ${resource.title}`,
        metadata: {
          instructor_id: artist.id,
          instructor_name: artist.name,
          contact_name: `Contact ${i + 1}`,
          contact_email: `contact${i + 1}@bakehouse.org`,
          contact_phone: `+1-305-555-${String(i + 1).padStart(4, '0')}`
        },
        created_by: 'system',
        updated_by: 'system'
      };

      bookings.push(booking);
    }

    // Insert bookings
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert(bookings);

    if (bookingError) {
      console.error('❌ Error creating bookings:', bookingError);
    } else {
      console.log(`✅ Created ${bookings.length} bookings for Bakehouse`);

      // Get created bookings to add participants
      const { data: createdBookings } = await supabase
        .from('bookings')
        .select('id, current_participants')
        .eq('org_id', bakehouseOrgId)
        .order('created_at', { ascending: false })
        .limit(bookings.length);

      if (createdBookings) {
        const participants = [];
        for (const booking of createdBookings) {
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
            console.error('❌ Error creating participants:', participantError);
          } else {
            console.log(`✅ Created ${participants.length} participants`);
          }
        }
      }
    }

    console.log('🎉 Bakehouse booking data created successfully!');

  } catch (error) {
    console.error('❌ Error creating Bakehouse bookings:', error);
    process.exit(1);
  }
}

// Run the script
createBakehouseBookings();
