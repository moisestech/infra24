#!/usr/bin/env node

/**
 * Script to assign studio numbers to Bakehouse artists
 * This will help us connect the interactive map to real data
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Available studio numbers from the SVG
const AVAILABLE_STUDIOS = [
  'A', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 
  '16', '17', '18', '19', '20', '21', '22'
];

async function getBakehouseArtists() {
  console.log('🎨 Fetching Bakehouse artists...\n');
  
  try {
    // Get Bakehouse organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'bakehouse')
      .single();

    if (orgError || !org) {
      console.error('❌ Error fetching Bakehouse organization:', orgError);
      return;
    }

    console.log(`🏢 Found organization: ${org.name} (${org.slug})`);

    // Get all Bakehouse artists
    const { data: artists, error: artistsError } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        studio_number,
        studio_type,
        profile_image,
        bio,
        specialties,
        is_claimed,
        is_active
      `)
      .eq('organization_id', org.id)
      .eq('is_active', true)
      .order('name');

    if (artistsError) {
      console.error('❌ Error fetching artists:', artistsError);
      return;
    }

    console.log(`📊 Found ${artists.length} active artists\n`);

    return { org, artists };

  } catch (error) {
    console.error('❌ Script error:', error);
    return null;
  }
}

async function assignStudiosToArtists(org, artists) {
  console.log('🏠 ASSIGNING STUDIOS TO BAKEHOUSE ARTISTS');
  console.log('=' .repeat(50));
  
  // Filter artists that need studio assignments
  const artistsNeedingStudios = artists.filter(artist => !artist.studio_number);
  const artistsWithStudios = artists.filter(artist => artist.studio_number);
  
  console.log(`✅ Artists already with studios: ${artistsWithStudios.length}`);
  console.log(`⚠️  Artists needing studio assignments: ${artistsNeedingStudios.length}\n`);

  if (artistsWithStudios.length > 0) {
    console.log('📍 CURRENT STUDIO ASSIGNMENTS:');
    artistsWithStudios.forEach(artist => {
      console.log(`   Studio ${artist.studio_number}: ${artist.name} (${artist.studio_type})`);
    });
    console.log('');
  }

  // Show available studios
  const usedStudios = artistsWithStudios.map(a => a.studio_number);
  const availableStudios = AVAILABLE_STUDIOS.filter(studio => !usedStudios.includes(studio));
  
  console.log('🎯 AVAILABLE STUDIO NUMBERS:');
  availableStudios.forEach(studio => {
    console.log(`   - Studio ${studio}`);
  });
  console.log('');

  if (artistsNeedingStudios.length === 0) {
    console.log('✅ All artists already have studio assignments!');
    return;
  }

  // Show artists that need assignments
  console.log('👥 ARTISTS NEEDING STUDIO ASSIGNMENTS:');
  artistsNeedingStudios.forEach((artist, index) => {
    console.log(`${index + 1}. ${artist.name} (${artist.studio_type})`);
    console.log(`   - Bio: ${artist.bio || 'No bio provided'}`);
    console.log(`   - Specialties: ${artist.specialties || 'Not specified'}`);
    console.log(`   - Avatar: ${artist.profile_image ? '✅ Uploaded' : '❌ Missing'}`);
    console.log('');
  });

  // Generate assignment suggestions
  console.log('💡 SUGGESTED STUDIO ASSIGNMENTS:');
  console.log('(You can modify these based on your preferences)\n');
  
  const assignments = [];
  for (let i = 0; i < Math.min(artistsNeedingStudios.length, availableStudios.length); i++) {
    const artist = artistsNeedingStudios[i];
    const studio = availableStudios[i];
    assignments.push({ artist, studio });
    console.log(`Studio ${studio}: ${artist.name} (${artist.studio_type})`);
  }

  if (assignments.length < artistsNeedingStudios.length) {
    console.log(`\n⚠️  Note: ${artistsNeedingStudios.length - assignments.length} artists will need studios beyond the available ones.`);
  }

  return assignments;
}

async function generateUpdateSQL(assignments) {
  if (!assignments || assignments.length === 0) {
    console.log('✅ No studio assignments needed!');
    return;
  }

  console.log('\n💾 SQL COMMANDS TO ASSIGN STUDIOS:');
  console.log('=' .repeat(50));
  console.log('Copy and run these commands in your Supabase SQL editor:\n');
  
  assignments.forEach(({ artist, studio }) => {
    console.log(`-- Assign Studio ${studio} to ${artist.name}`);
    console.log(`UPDATE artist_profiles SET studio_number = '${studio}' WHERE id = '${artist.id}';`);
    console.log('');
  });

  console.log('-- Verify the assignments');
  console.log(`SELECT name, studio_number, studio_type FROM artist_profiles WHERE organization_id = '2efcebf3-9750-4ea2-85a0-9501eb698b20' AND studio_number IS NOT NULL ORDER BY studio_number;`);
}

async function main() {
  console.log('🚀 BAKEHOUSE STUDIO ASSIGNMENT SCRIPT');
  console.log('=' .repeat(50));
  
  const result = await getBakehouseArtists();
  if (!result) return;
  
  const { org, artists } = result;
  const assignments = await assignStudiosToArtists(org, artists);
  await generateUpdateSQL(assignments);
  
  console.log('\n✅ NEXT STEPS:');
  console.log('1. Review the suggested studio assignments above');
  console.log('2. Run the SQL commands to assign studios to artists');
  console.log('3. Test the interactive map at /o/bakehouse/map');
  console.log('4. Verify that studios show the correct artist information');
  console.log('5. Upload missing artist profile images if needed');
  
  console.log('\n🎨 INTERACTIVE MAP FEATURES:');
  console.log('- Hover over studios to see artist info and avatar');
  console.log('- Click on occupied studios to book studio visits');
  console.log('- Available studios show "Claim Studio" option');
  console.log('- Real-time data from Supabase database');
}

// Run the script
main().catch(console.error);
