// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrganizations() {
  console.log('🔍 Checking organizations...');

  try {
    // Get all organizations
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name');

    if (error) {
      console.error('❌ Error fetching organizations:', error);
      return;
    }

    console.log(`📋 Found ${organizations.length} organizations:`);
    organizations.forEach((org, index) => {
      console.log(`${index + 1}. "${org.name}" (${org.slug})`);
      console.log(`   ID: ${org.id}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking organizations:', error);
  }
}

checkOrganizations();
