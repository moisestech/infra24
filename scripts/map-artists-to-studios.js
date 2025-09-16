#!/usr/bin/env node

/**
 * Script to map existing artist profiles to studio numbers
 * This will help us connect the interactive map to real data
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getArtistProfiles() {
  console.log('🎨 Fetching artist profiles...\n');
  
  try {
    // Get all artist profiles with their organization info
    const { data: artists, error } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        bio,
        profile_image_url,
        role,
        org_id,
        status,
        organizations!inner(
          id,
          name,
          slug
        )
      `)
      .eq('status', 'active')
      .order('name');

    if (error) {
      console.error('❌ Error fetching artists:', error);
      return;
    }

    console.log(`📊 Found ${artists.length} claimed artist profiles\n`);

    // Group by organization
    const byOrg = artists.reduce((acc, artist) => {
      const orgSlug = artist.organizations.slug;
      if (!acc[orgSlug]) {
        acc[orgSlug] = {
          name: artist.organizations.name,
          artists: []
        };
      }
      acc[orgSlug].artists.push(artist);
      return acc;
    }, {});

    // Display results
    Object.entries(byOrg).forEach(([orgSlug, orgData]) => {
      console.log(`🏢 ${orgData.name} (${orgSlug})`);
      console.log('=' .repeat(50));
      
      orgData.artists.forEach(artist => {
        console.log(`\n📍 Studio: Not assigned yet`);
        console.log(`   👤 ${artist.name}`);
        console.log(`   🎭 Role: ${artist.role}`);
        console.log(`   🖼️  Avatar: ${artist.profile_image_url || 'Not uploaded'}`);
        if (artist.bio) {
          console.log(`   📝 Bio: ${artist.bio.substring(0, 100)}${artist.bio.length > 100 ? '...' : ''}`);
        }
      });
      console.log('\n');
    });

    // Generate mapping for the interactive map
    console.log('🗺️  STUDIO MAPPING FOR INTERACTIVE MAP');
    console.log('=' .repeat(50));
    
    const bakehouseArtists = artists.filter(a => a.organizations.slug === 'bakehouse');
    if (bakehouseArtists.length > 0) {
      console.log('\n🏠 BAKEHOUSE ART COMPLEX ARTISTS:');
      console.log('These artists need to be assigned to studio numbers:\n');
      
      bakehouseArtists.forEach((artist, index) => {
        console.log(`${index + 1}. ${artist.name} (${artist.role})`);
        console.log(`   - Avatar: ${artist.profile_image_url || 'Default avatar needed'}`);
        console.log(`   - Bio: ${artist.bio || 'No bio provided'}`);
        console.log('');
      });
    }

    // All artists need studio assignments
    console.log('⚠️  ALL ARTISTS NEED STUDIO ASSIGNMENTS:');
    console.log('We need to assign studio numbers to all artists:\n');
    bakehouseArtists.forEach(artist => {
      console.log(`- ${artist.name} (${artist.organizations.slug})`);
    });
    console.log('');

    // Generate SQL to update studio numbers if needed
    console.log('💾 SQL COMMANDS TO ASSIGN STUDIO NUMBERS:');
    console.log('(Run these to assign studios to artists)\n');
    
    bakehouseArtists.forEach((artist, index) => {
      console.log(`-- Assign studio to ${artist.name} (${artist.role})`);
      console.log(`UPDATE artist_profiles SET studio_number = 'STUDIO_NUMBER_HERE' WHERE id = '${artist.id}';`);
      if (index < bakehouseArtists.length - 1) console.log('');
    });

    return artists;

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

async function getStudioNumbersFromSVG() {
  console.log('\n🎯 STUDIO NUMBERS FOUND IN SVG:');
  console.log('=' .repeat(50));
  
  // These are the studio IDs we found in the SVG
  const svgStudios = [
    'Studio A', 'Studio 5', 'Studio 6', 'Studio 7',
    'Studio 8', 'Studio 9', 'Studio 10', 'Studio 11',
    'Studio 12', 'Studio 13', 'Studio 14', 'Studio 15',
    'Studio 16', 'Studio 17', 'Studio 18', 'Studio 19',
    'Studio 20', 'Studio 21', 'Studio 22'
  ];
  
  console.log('Available studio numbers in the SVG:');
  svgStudios.forEach(studio => {
    const number = studio.replace('Studio ', '');
    console.log(`- ${number}`);
  });
  
  return svgStudios;
}

async function main() {
  console.log('🚀 ARTIST-TO-STUDIO MAPPING SCRIPT');
  console.log('=' .repeat(50));
  
  const artists = await getArtistProfiles();
  const svgStudios = await getStudioNumbersFromSVG();
  
  console.log('\n✅ NEXT STEPS:');
  console.log('1. Review the artist profiles above');
  console.log('2. Assign studio numbers to artists without them');
  console.log('3. Update the SVG studio IDs to match database studio numbers');
  console.log('4. Test the interactive map at /o/bakehouse/map');
  console.log('5. Upload artist profile images if missing');
  
  console.log('\n🎨 INTERACTIVE MAP FEATURES:');
  console.log('- Hover over studios to see artist info');
  console.log('- Click on occupied studios to book visits');
  console.log('- Available studios show "Claim Studio" option');
  console.log('- Real-time data from Supabase database');
}

// Run the script
main().catch(console.error);
