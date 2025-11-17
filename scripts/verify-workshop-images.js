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

async function verifyWorkshopImages() {
  console.log('🔍 Verifying workshop images...');

  try {
    // Get both workshops
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('id, title, image_url')
      .in('title', ['Own Your Digital Presence', 'SEO Workshop']);

    if (error) {
      console.error('❌ Error fetching workshops:', error);
      return;
    }

    console.log('📋 Workshop images:');
    workshops.forEach(workshop => {
      console.log(`\n🎨 ${workshop.title}:`);
      console.log(`   ID: ${workshop.id}`);
      console.log(`   Image URL: ${workshop.image_url}`);
      
      // Check if it's the expected Cloudinary URL
      if (workshop.title === 'Own Your Digital Presence' && 
          workshop.image_url?.includes('own-your-digital-presence')) {
        console.log('   ✅ Correct image URL for Own Your Digital Presence');
      } else if (workshop.title === 'SEO Workshop' && 
                 workshop.image_url?.includes('seo-workshop')) {
        console.log('   ✅ Correct image URL for SEO Workshop');
      } else {
        console.log('   ⚠️  Image URL may not be updated correctly');
      }
    });

  } catch (error) {
    console.error('❌ Error verifying workshop images:', error);
  }
}

verifyWorkshopImages();
