#!/usr/bin/env node

/**
 * Update Oolite 2025 Artists Script
 * 
 * This script updates the 2025 Oolite artists with proper tagging structure
 * based on the residency types provided by the user.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Oolite organization ID
const OOLITE_ORG_ID = 'b94f704c-ad6a-4419-89c8-d88636f61ab3';

// 2025 Oolite Artists Data
const artists2025 = {
  studioResidents: [
    { name: 'Lee Pivnik', email: 'Leepivnik@gmail.com' },
    { name: 'Carrington Ware', email: 'ceware.art@gmail.com' },
    { name: 'Amanda Linares', email: 'amandallinares@gmail.com' },
    { name: 'Diana Larrea', email: 'lanublada@gmail.com' },
    { name: 'Chire Regans', email: 'artbychire@gmail.com' },
    { name: 'Mark Delmont', email: 'purchasealtworks@gmail.com' },
    { name: 'Diego Gabaldon', email: 'diegogb22@gmail.com' },
    { name: 'Sheherazade Thenard', email: 'sheherazadethenard@gmail.com' },
    { name: 'Ana Mosquera', email: 'anamosquera@gmail.com' },
    { name: 'Sepideh Kalani', email: 'sepidehklni@gmail.com' },
    { name: 'Pangea Kali Virga', email: 'pangeakalivirga@gmail.com' },
    { name: 'Bex McCharen', email: 'bex.mccharen@gmail.com' },
    { name: 'Ricardo E. Zulueta', email: 'artinfo100@gmail.com' }
  ],
  liveInArtResidents: [
    { name: 'Sue Beyer', email: 'suebeyer369@gmail.com' },
    { name: 'Jevon Brown', email: 'novej.studi01999@gmail.com' },
    { name: 'Elaine Defibaugh', email: 'elaine@elainedefibaugh.com' },
    { name: 'Luna Palazzolo', email: 'lunapalazzolo@gmail.com' },
    { name: 'Edison Peñafiel', email: 'hello@edisonpenafiel.com' },
    { name: 'Jacoub Reyes', email: 'jacoubreyes@gmail.com' },
    { name: 'Oscar Rieveling', email: 'rieveling@yahoo.com' },
    { name: 'Zonia Zena', email: 'zoniazena@gmail.com' }
  ],
  cinematicResidents: [
    { name: 'Juan Luis Matos', email: 'juancymatos0@gmail.com' },
    { name: 'Gabriel De Varona', email: 'gdevarona2@gmail.com' },
    { name: 'Greko Sklavounos', email: 'grekotv@gmail.com' },
    { name: 'Emma Cuba', email: 'emmaecuba@gmail.com' },
    { name: 'Michael Ruiz-Unger', email: 'mruizunger@gmail.com' }
  ]
};

// Skills mapping by residency type
const skillsByType = {
  'Studio Resident': ['Visual Arts', 'Mixed Media', 'Installation', 'Sculpture', 'Painting', 'Drawing', 'Printmaking'],
  'Live In Art Resident': ['Performance', 'Community Engagement', 'Public Art', 'Social Practice', 'Installation', 'Mixed Media'],
  'Cinematic Resident': ['Film', 'Video', 'Cinematography', 'Digital Media', 'Storytelling', 'Documentary', 'Animation']
};

// Mediums mapping by residency type
const mediumsByType = {
  'Studio Resident': ['Mixed Media', 'Installation', 'Sculpture', 'Painting', 'Drawing', 'Printmaking', 'Photography'],
  'Live In Art Resident': ['Performance', 'Installation', 'Mixed Media', 'Video', 'Photography', 'Social Practice'],
  'Cinematic Resident': ['Video', 'Film', 'Digital Media', 'Photography', 'Animation', 'Documentary', 'Cinematography']
};

// Map residency types to allowed studio_type values
const studioTypeMapping = {
  'Studio Resident': 'Studio',
  'Live In Art Resident': 'Associate', 
  'Cinematic Resident': 'Gallery'
};

async function updateOolite2025Artists() {
  console.log('🎨 Starting Oolite 2025 Artists Update...\n');
  
  try {
    // Get all current Oolite artists
    const { data: currentArtists, error: fetchError } = await supabase
      .from('artist_profiles')
      .select('id, name, studio_type, studio_location, metadata, skills, mediums')
      .eq('organization_id', OOLITE_ORG_ID);
    
    if (fetchError) {
      console.error('❌ Error fetching current artists:', fetchError);
      return;
    }
    
    console.log(`📋 Found ${currentArtists.length} current Oolite artists`);
    
    // Create a map of all 2025 artists by email for easy lookup
    const all2025Artists = [
      ...artists2025.studioResidents.map(a => ({ ...a, type: 'Studio Resident' })),
      ...artists2025.liveInArtResidents.map(a => ({ ...a, type: 'Live In Art Resident' })),
      ...artists2025.cinematicResidents.map(a => ({ ...a, type: 'Cinematic Resident' }))
    ];
    
    console.log(`📊 Total 2025 artists to process: ${all2025Artists.length}`);
    console.log(`   - Studio Residents: ${artists2025.studioResidents.length}`);
    console.log(`   - Live In Art Residents: ${artists2025.liveInArtResidents.length}`);
    console.log(`   - Cinematic Residents: ${artists2025.cinematicResidents.length}\n`);
    
    let updated = 0;
    let created = 0;
    let notFound = 0;
    
    // Process each 2025 artist
    for (const artist2025 of all2025Artists) {
      // Find existing artist by email (case insensitive)
      const existingArtist = currentArtists.find(artist => 
        artist.metadata?.email?.toLowerCase() === artist2025.email.toLowerCase()
      );
      
      if (existingArtist) {
        // Update existing artist
        const updateData = {
          studio_type: studioTypeMapping[artist2025.type] || 'Studio',
          studio_location: existingArtist.metadata?.studio || existingArtist.metadata?.apartment || 'TBD',
          skills: skillsByType[artist2025.type] || [],
          mediums: mediumsByType[artist2025.type] || [],
          metadata: {
            ...existingArtist.metadata,
            residency_type: artist2025.type,
            year: '2025',
            email: artist2025.email,
            residency_year: '2025',
            residency_category: artist2025.type.replace(' Resident', '').toLowerCase().replace(' ', '_')
          },
          updated_at: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('artist_profiles')
          .update(updateData)
          .eq('id', existingArtist.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${artist2025.name}:`, updateError);
        } else {
          console.log(`✅ Updated: ${artist2025.name} (${artist2025.type})`);
          updated++;
        }
      } else {
        // Create new artist if not found
        const newArtistData = {
          organization_id: OOLITE_ORG_ID,
          user_id: `oolite_${artist2025.name.toLowerCase().replace(/\s+/g, '_')}_2025_${Date.now()}`,
          name: artist2025.name,
          bio: `${artist2025.type} at Oolite Arts for 2025`,
          studio_type: studioTypeMapping[artist2025.type] || 'Studio',
          studio_location: 'TBD',
          skills: skillsByType[artist2025.type] || [],
          mediums: mediumsByType[artist2025.type] || [],
          is_public: true,
          is_featured: artist2025.type === 'Studio Resident',
          metadata: {
            residency_type: artist2025.type,
            year: '2025',
            email: artist2025.email,
            residency_year: '2025',
            residency_category: artist2025.type.replace(' Resident', '').toLowerCase().replace(' ', '_'),
            organization: 'Oolite Arts'
          }
        };
        
        const { error: createError } = await supabase
          .from('artist_profiles')
          .insert(newArtistData);
        
        if (createError) {
          console.error(`❌ Error creating ${artist2025.name}:`, createError);
        } else {
          console.log(`🆕 Created: ${artist2025.name} (${artist2025.type})`);
          created++;
        }
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Created: ${created}`);
    console.log(`   - Not Found: ${notFound}`);
    
    // Verify the results
    const { data: verifyData, error: verifyError } = await supabase
      .from('artist_profiles')
      .select('name, studio_type, metadata')
      .eq('organization_id', OOLITE_ORG_ID)
      .eq('metadata->>year', '2025')
      .order('studio_type, name');
    
    if (verifyError) {
      console.error('❌ Error verifying results:', verifyError);
      return;
    }
    
    console.log(`\n📋 Verification: Found ${verifyData.length} 2025 artists in database`);
    
    // Group by residency type
    const byType = verifyData.reduce((acc, artist) => {
      const type = artist.studio_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 2025 Artists by residency type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    
    console.log('\n🎉 Oolite 2025 artists update completed!');
    console.log('Visit: http://localhost:3001/o/oolite/artists');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
if (require.main === module) {
  updateOolite2025Artists()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { updateOolite2025Artists, artists2025 };
