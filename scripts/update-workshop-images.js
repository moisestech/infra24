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

async function updateWorkshopImages() {
  console.log('🎨 Updating workshop images...');

  try {
    // Update "Own Your Digital Presence" workshop
    const digitalPresenceImageUrl = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760114731/smart-sign/workshops/own-your-digital-presence/infra24-workshop-own-your-digital-presence_uvxlmx.png';
    
    const { data: digitalPresenceData, error: digitalPresenceError } = await supabase
      .from('workshops')
      .update({ 
        image_url: digitalPresenceImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('title', 'Own Your Digital Presence')
      .select();

    if (digitalPresenceError) {
      console.error('❌ Error updating Own Your Digital Presence workshop:', digitalPresenceError);
    } else {
      console.log('✅ Updated Own Your Digital Presence workshop image:', digitalPresenceData[0]?.title);
    }

    // Update "SEO Workshop"
    const seoImageUrl = 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760114933/smart-sign/workshops/seo-workshop/infra24-workshop-seo_wyo4eq.png';
    
    const { data: seoData, error: seoError } = await supabase
      .from('workshops')
      .update({ 
        image_url: seoImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('title', 'SEO Workshop')
      .select();

    if (seoError) {
      console.error('❌ Error updating SEO Workshop:', seoError);
    } else {
      console.log('✅ Updated SEO Workshop image:', seoData[0]?.title);
    }

    console.log('🎉 Workshop images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating workshop images:', error);
  }
}

updateWorkshopImages();
