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

async function populateOrganizations() {
  try {
    console.log('🚀 Starting to populate organizations...');

    // Check if organizations already exist
    const { data: existingOrgs, error: checkError } = await supabase
      .from('organizations')
      .select('id, name, slug');

    if (checkError) {
      console.error('❌ Error checking existing organizations:', checkError);
      return;
    }

    if (existingOrgs && existingOrgs.length > 0) {
      console.log('📋 Found existing organizations:', existingOrgs.length);
      existingOrgs.forEach(org => {
        console.log(`  - ${org.name} (${org.slug})`);
      });
      return;
    }

    // Create organizations
    const organizations = [
      {
        id: 'e5c13761-bb53-4b74-94ef-aa08de38bdaf',
        name: 'Oolite Arts',
        slug: 'oolite',
        description: 'A contemporary arts organization supporting artists and creative communities',
        website: 'https://oolitearts.org',
        email: 'info@oolitearts.org',
        phone: '(305) 674-8278',
        address: '924 Lincoln Road',
        city: 'Miami Beach',
        state: 'FL',
        zip_code: '33139',
        country: 'US',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2efcebf3-9750-4ea2-85a0-9501eb698b20',
        name: 'Bakehouse Art Complex',
        slug: 'bakehouse',
        description: 'A community of artists and creative professionals in Miami',
        website: 'https://bacfl.org',
        email: 'info@bacfl.org',
        phone: '(305) 576-2828',
        address: '561 NW 32nd Street',
        city: 'Miami',
        state: 'FL',
        zip_code: '33127',
        country: 'US',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    console.log('📝 Creating organizations...');

    for (const org of organizations) {
      const { data, error } = await supabase
        .from('organizations')
        .insert(org)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating organization "${org.name}":`, error);
      } else {
        console.log(`✅ Created organization: "${org.name}"`);
      }
    }

    console.log('🎉 Finished populating organizations!');

  } catch (error) {
    console.error('❌ Error in populateOrganizations:', error);
  }
}

populateOrganizations();
