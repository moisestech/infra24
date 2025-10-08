require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const OOLITE_ORG_ID = '2133fe94-fb12-41f8-ab37-ea4acd4589f6';

async function createBookingResources() {
  try {
    console.log('🚀 Creating booking resources for Oolite...');

    // First, check if resources already exist
    const { data: existingResources } = await supabase
      .from('resources')
      .select('id, title')
      .eq('org_id', OOLITE_ORG_ID)
      .in('title', ['Remote Studio Visit', 'Print Room Consult']);

    if (existingResources && existingResources.length > 0) {
      console.log('📋 Existing booking resources found:');
      existingResources.forEach(resource => {
        console.log(`  - ${resource.title} (${resource.id})`);
      });
      console.log('✅ Booking resources already exist. Skipping creation.');
      return;
    }

    const bookingResources = [
      {
        org_id: OOLITE_ORG_ID,
        type: 'space',
        title: 'Remote Studio Visit',
        description: '30-minute remote consultation with Oolite staff for portfolio feedback, project guidance, and artistic development',
        category: 'Consultation',
        capacity: 1,
        duration_minutes: 30,
        price: 0,
        currency: 'USD',
        location: 'Google Meet/Zoom',
        requirements: ['Stable internet connection', 'Portfolio or project materials ready'],
        availability_rules: {
          timezone: 'America/New_York',
          slot_minutes: 30,
          buffer_before: 10,
          buffer_after: 10,
          max_per_day_per_host: 4,
          windows: [
            {
              by: 'host',
              host: 'mo@oolite.org',
              days: ['Tuesday', 'Wednesday', 'Thursday'],
              start: '12:00',
              end: '16:00'
            },
            {
              by: 'host',
              host: 'fabi@oolite.org',
              days: ['Tuesday', 'Thursday'],
              start: '12:00',
              end: '16:00'
            },
            {
              by: 'host',
              host: 'matt@oolite.org',
              days: ['Wednesday'],
              start: '13:00',
              end: '17:00'
            }
          ],
          blackouts: [
            { date: '2025-10-21' },
            { range: ['2025-11-25', '2025-11-28'] }
          ],
          pooling: 'round_robin'
        },
        metadata: {
          status: 'available',
          booking_type: 'remote_visit',
          default_hosts: ['mo@oolite.org', 'fabi@oolite.org', 'matt@oolite.org'],
          meeting_platform: 'google_meet',
          auto_approve: true
        },
        is_active: true,
        is_bookable: true,
        created_by: 'system',
        updated_by: 'system'
      },
      {
        org_id: OOLITE_ORG_ID,
        type: 'space',
        title: 'Print Room Consult',
        description: '30-minute in-person consultation in the Print Room for technical guidance, equipment training, and project support',
        category: 'Consultation',
        capacity: 1,
        duration_minutes: 30,
        price: 0,
        currency: 'USD',
        location: 'Print Room - Oolite Arts',
        requirements: ['In-person visit required', 'Project materials or questions prepared'],
        availability_rules: {
          timezone: 'America/New_York',
          slot_minutes: 30,
          buffer_before: 15,
          buffer_after: 15,
          max_per_day_per_host: 6,
          windows: [
            {
              by: 'host',
              host: 'mo@oolite.org',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              start: '10:00',
              end: '17:00'
            },
            {
              by: 'host',
              host: 'fabi@oolite.org',
              days: ['Tuesday', 'Wednesday', 'Thursday'],
              start: '10:00',
              end: '16:00'
            }
          ],
          blackouts: [
            { date: '2025-10-21' },
            { range: ['2025-11-25', '2025-11-28'] }
          ],
          pooling: 'round_robin'
        },
        metadata: {
          status: 'available',
          booking_type: 'print_room',
          default_hosts: ['mo@oolite.org', 'fabi@oolite.org'],
          meeting_platform: 'in_person',
          auto_approve: true,
          equipment_required: ['Large Format Printer', '3D Printer']
        },
        is_active: true,
        is_bookable: true,
        created_by: 'system',
        updated_by: 'system'
      }
    ];

    console.log('📝 Creating booking resources...');

    for (const resource of bookingResources) {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating resource "${resource.title}":`, error);
      } else {
        console.log(`✅ Created resource: "${resource.title}" (${data.id})`);
        console.log(`   - Type: ${resource.type}`);
        console.log(`   - Duration: ${resource.duration_minutes} minutes`);
        console.log(`   - Location: ${resource.location}`);
        console.log(`   - Hosts: ${resource.metadata.default_hosts.join(', ')}`);
      }
    }

    console.log('🎉 Finished creating booking resources!');

  } catch (error) {
    console.error('❌ Error in createBookingResources:', error);
  }
}

createBookingResources();

