const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testStudioConnections() {
  try {
    console.log('🔍 Testing studio connections...');
    
    // Get all occupied studios with artist information
    const { data: studios, error } = await supabase
      .from('artist_profiles')
      .select(`
        studio_number,
        name,
        profile_image,
        specialties,
        is_active
      `)
      .eq('organization_id', '2efcebf3-9750-4ea2-85a0-9501eb698b20') // Bakehouse org ID
      .eq('is_active', true)
      .not('studio_number', 'is', null)
      .neq('studio_number', '')
      .order('studio_number');
    
    if (error) {
      console.error('❌ Error fetching studios:', error);
      return;
    }
    
    console.log(`✅ Found ${studios.length} occupied studios`);
    
    // Group by studio number
    const studioGroups = {};
    studios.forEach(artist => {
      if (!studioGroups[artist.studio_number]) {
        studioGroups[artist.studio_number] = [];
      }
      studioGroups[artist.studio_number].push(artist);
    });
    
    console.log(`\n📊 Studio Summary:`);
    console.log(`Total unique studios: ${Object.keys(studioGroups).length}`);
    
    // Show some examples
    console.log(`\n🎨 Sample Studios:`);
    const sampleStudios = Object.entries(studioGroups).slice(0, 10);
    sampleStudios.forEach(([studioNumber, artists]) => {
      console.log(`  Studio ${studioNumber}: ${artists.map(a => a.name).join(', ')}`);
    });
    
    // Check for studios with multiple artists
    const multiArtistStudios = Object.entries(studioGroups).filter(([_, artists]) => artists.length > 1);
    console.log(`\n👥 Studios with multiple artists: ${multiArtistStudios.length}`);
    multiArtistStudios.forEach(([studioNumber, artists]) => {
      console.log(`  Studio ${studioNumber}: ${artists.map(a => a.name).join(', ')}`);
    });
    
    // Check studio number patterns
    const numericStudios = studios.filter(s => /^\d+$/.test(s.studio_number));
    const letterStudios = studios.filter(s => /^[A-Z]$/.test(s.studio_number));
    const mixedStudios = studios.filter(s => !/^\d+$/.test(s.studio_number) && !/^[A-Z]$/.test(s.studio_number));
    
    console.log(`\n📋 Studio Number Patterns:`);
    console.log(`  Numeric studios (1, 2, 3...): ${numericStudios.length}`);
    console.log(`  Letter studios (A, B, C...): ${letterStudios.length}`);
    console.log(`  Mixed studios (1A, 10U, 1,15...): ${mixedStudios.length}`);
    
    console.log(`\n✅ Studio connections test completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error testing studio connections:', error);
  }
}

// Run the test
testStudioConnections();
