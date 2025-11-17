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

async function checkWorkshopTitles() {
  console.log('🔍 Checking all workshop titles...');

  try {
    // Get all workshops
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('id, title, image_url')
      .order('title');

    if (error) {
      console.error('❌ Error fetching workshops:', error);
      return;
    }

    console.log(`📋 Found ${workshops.length} workshops:`);
    workshops.forEach((workshop, index) => {
      console.log(`${index + 1}. "${workshop.title}"`);
      console.log(`   ID: ${workshop.id}`);
      console.log(`   Image URL: ${workshop.image_url || 'No image'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking workshop titles:', error);
  }
}

checkWorkshopTitles();
