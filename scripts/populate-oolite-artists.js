#!/usr/bin/env node

/**
 * Populate Oolite Artists Script
 *
 * DATA_SEED_SAFETY: DESTRUCTIVE (org-scoped)
 * -----------------------------------------
 * If any artist_profiles already exist for organization slug "oolite", this script
 * DELETES ALL OF THEM for that org, then inserts the catalog below. Rows not in
 * this file are permanently removed from that org. Does not touch other orgs.
 *
 * Registry: scripts/DATA_SEED_REGISTRY.md
 * Safer alternative for 2026 residents: scripts/data/seed/upsert-oolite-studio-residents-2026.js
 *
 * Populates artist_profiles with Oolite Arts residents (studio / live-in / cinematic / staff).
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OOLITE_SLUG = 'oolite';

function slugifyArtistKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 80);
}

async function resolveOoliteOrganizationId() {
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', OOLITE_SLUG)
    .maybeSingle();

  if (error) {
    console.error('❌ Failed to look up Oolite organization:', error.message);
    return null;
  }
  if (!data?.id) {
    console.error(
      `❌ No organization with slug "${OOLITE_SLUG}". Create it or run supabase db reset so seed runs.`
    );
    return null;
  }
  return data.id;
}

// Artist data organized by residency type
const artistsData = {
  studioResidents: [
    {
      name: "Lee Pivnik",
      email: "Leepivnik@gmail.com",
      studio: "202",
      phone: "786.368.7044",
      instagram: "@eelpicnic",
      website: "Leepivnik.com",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Carrington Ware",
      email: "ceware.art@gmail.com",
      studio: "207",
      phone: "678.918.0559",
      instagram: "@carrington_art",
      website: "https://www.carringtonware.com",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Amanda Linares",
      email: "amandallinares@gmail.com",
      studio: "203",
      phone: "786.474.8306",
      instagram: "@amandallinares",
      website: "amandallinares.com",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Diana Larrea",
      email: "lanublada@gmail.com",
      studio: "204A",
      phone: "954.562.6497",
      instagram: "@parcialmentenublada",
      website: "www.dianalarrea.studio",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Chire Regans",
      email: "artbychire@gmail.com",
      studio: "102",
      phone: "786.599.5197",
      instagram: "@vantablack305",
      website: "https://www.carringtonware.com",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Mark Delmont",
      email: "purchasealtworks@gmail.com",
      studio: "204",
      phone: "954.842.9734",
      instagram: "@artlovetrap",
      website: "https://www.markdelmont.com/",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Diego Gabaldon",
      email: "diegogb22@gmail.com",
      studio: "110",
      phone: "954-803-8010",
      instagram: "@threatappraisal",
      website: "-",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Sheherazade Thenard",
      email: "sheherazadethenard@gmail.com",
      studio: "208",
      phone: "954-695-0247",
      instagram: "@sheherazade.thenard",
      website: "https://sheherazadeart.com/",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Ana Mosquera",
      email: "anamosquera@gmail.com",
      studio: "209",
      phone: "215-758-1978",
      instagram: "@anacaribu",
      website: "https://www.anamosquera.com/",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Sepideh Kalani",
      email: "sepidehklni@gmail.com",
      studio: "101",
      phone: "786-860-8400",
      instagram: "@sepidehklni",
      website: "https://www.behance.net/BLUE_SEPIDEH?locale=en_US",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Pangea Kali Virga",
      email: "pangeakalivirga@gmail.com",
      studio: "210",
      phone: "954-803-8010",
      instagram: "@pangeakalivirga",
      website: "https://www.pangeakalivirga.com/",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Bex McCharen",
      email: "bex.mccharen@gmail.com",
      studio: "108",
      phone: "434-944-5533",
      instagram: "@waterbbex",
      website: "bexwater.com",
      residencyType: "Studio Resident",
      year: "2025"
    },
    {
      name: "Ricardo E. Zulueta",
      email: "artinfo100@gmail.com",
      studio: "109",
      phone: "786-387-6998",
      instagram: "@re_zulueta",
      website: "https://www.ricardo-zulueta.com/",
      residencyType: "Studio Resident",
      year: "2025"
    }
  ],
  
  liveInArtResidents: [
    {
      name: "Sue Beyer",
      email: "suebeyer369@gmail.com",
      studio: "12",
      phone: "1614 02 323 339",
      instagram: "@sue_beyer",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Jevon Brown",
      email: "novej.studi01999@gmail.com",
      studio: "16",
      phone: "786-495-3323",
      instagram: "@novej.studi0",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Elaine Defibaugh",
      email: "elaine@elainedefibaugh.com",
      studio: "9",
      phone: "585.281.6424",
      instagram: "@elainedartist",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Luna Palazzolo",
      email: "lunapalazzolo@gmail.com",
      studio: "19",
      phone: "786-501-6474",
      instagram: "@lunapalazzolo",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Edison Peñafiel",
      email: "hello@edisonpenafiel.com",
      studio: "21",
      phone: "786.599.0978",
      instagram: "@edisonpenafielstudio",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Jacoub Reyes",
      email: "jacoubreyes@gmail.com",
      studio: "20",
      phone: "732.725.2061",
      instagram: "@jacoubreyes",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Oscar Rieveling",
      email: "rieveling@yahoo.com",
      studio: "18",
      phone: "786-241-3121",
      instagram: "@oscar.iii",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    },
    {
      name: "Zonia Zena",
      email: "zoniazena@gmail.com",
      studio: "21",
      phone: "305-724-3783",
      instagram: "@zoniazena",
      website: "",
      residencyType: "Live In Art Resident",
      year: "2025"
    }
  ],
  
  cinematicResidents: [
    {
      name: "Juan Luis Matos",
      email: "juancymatos0@gmail.com",
      studio: "Oolite Satellite",
      phone: "786.535.0348",
      instagram: "@juanluismatos.info",
      website: "https://www.juanluismatos.info",
      residencyType: "Cinematic Resident",
      year: "2025"
    },
    {
      name: "Gabriel De Varona",
      email: "gdevarona2@gmail.com",
      studio: "Oolite Satellite",
      phone: "305.431.0409",
      instagram: "@cocuyo_productions",
      website: "https://cocuyoprod.com/",
      residencyType: "Cinematic Resident",
      year: "2025"
    },
    {
      name: "Greko Sklavounos",
      email: "grekotv@gmail.com",
      studio: "Oolite Satellite",
      phone: "323.459.0930",
      instagram: "@grexodus",
      website: "grekosklavounos.com/",
      residencyType: "Cinematic Resident",
      year: "2025"
    },
    {
      name: "Emma Cuba",
      email: "emmaecuba@gmail.com",
      studio: "Oolite Satellite",
      phone: "305.335.6424",
      instagram: "@emmacubz",
      website: "www.emmacuba.com",
      residencyType: "Cinematic Resident",
      year: "2025"
    },
    {
      name: "Michael Ruiz-Unger",
      email: "mruizunger@gmail.com",
      studio: "Oolite Satellite",
      phone: "305.733-2778",
      instagram: "skywalkerhand",
      website: "https://michaelruizunger.com/",
      residencyType: "Cinematic Resident",
      year: "2025"
    }
  ],
  
  staff: [
    {
      name: "Matthew Forehand",
      email: "matt.4hand850@gmail.com",
      studio: "103",
      phone: "850.377.9728",
      instagram: "@Matt.4hand",
      website: "https://matt4hand.com/",
      residencyType: "Staff",
      year: "2025"
    }
  ]
};

async function populateArtists() {
  console.log('🎨 Starting Oolite Artists Population...\n');

  const OOLITE_ORG_ID = await resolveOoliteOrganizationId();
  if (!OOLITE_ORG_ID) {
    process.exitCode = 1;
    return;
  }
  console.log(`📌 Using organization_id for slug "${OOLITE_SLUG}": ${OOLITE_ORG_ID}\n`);

  try {
    // First, let's check if artists already exist
    const { data: existingArtists, error: checkError } = await supabase
      .from('artist_profiles')
      .select('name, metadata')
      .eq('organization_id', OOLITE_ORG_ID);
    
    if (checkError) {
      console.error('❌ Error checking existing artists:', checkError);
      return;
    }
    
    if (existingArtists && existingArtists.length > 0) {
      console.warn('\n' + '='.repeat(72));
      console.warn('DESTRUCTIVE STEP: Deleting ALL artist_profiles for org', OOLITE_ORG_ID);
      console.warn('(slug oolite). Manual or prior-month rows in this org will be removed.');
      console.warn('Registry: scripts/DATA_SEED_REGISTRY.md');
      console.warn('='.repeat(72) + '\n');
      console.log(`📋 Found ${existingArtists.length} existing artists. Clearing them first...`);

      const { error: deleteError } = await supabase
        .from('artist_profiles')
        .delete()
        .eq('organization_id', OOLITE_ORG_ID);
      
      if (deleteError) {
        console.error('❌ Error deleting existing artists:', deleteError);
        return;
      }
      
      console.log('✅ Cleared existing artists\n');
    }
    
    // Combine all artists
    const allArtists = [
      ...artistsData.studioResidents,
      ...artistsData.liveInArtResidents,
      ...artistsData.cinematicResidents,
      ...artistsData.staff
    ];
    
    console.log(`📊 Total artists to create: ${allArtists.length}`);
    console.log(`   - Studio Residents: ${artistsData.studioResidents.length}`);
    console.log(`   - Live In Art Residents: ${artistsData.liveInArtResidents.length}`);
    console.log(`   - Cinematic Residents: ${artistsData.cinematicResidents.length}`);
    console.log(`   - Staff: ${artistsData.staff.length}\n`);
    
    // Create artists in batches
    const batchSize = 10;
    let created = 0;
    
    for (let i = 0; i < allArtists.length; i += batchSize) {
      const batch = allArtists.slice(i, i + batchSize);
      
      const artistsToInsert = batch.map((artist) => {
        const web =
          artist.website && artist.website !== '-' ? artist.website.trim() : null;
        const ig = artist.instagram ? String(artist.instagram).trim() : null;
        const phone = artist.phone ? String(artist.phone).trim() : null;
        return {
          organization_id: OOLITE_ORG_ID,
          user_id: `oolite_dir_${slugifyArtistKey(artist.name)}`,
          name: artist.name,
          bio: `${artist.residencyType} at Oolite Arts ${artist.year}. ${artist.studio ? `Studio: ${artist.studio}` : ''}`,
          website: web,
          website_url: web,
          instagram: ig,
          instagram_handle: ig,
          phone: phone || null,
          studio_type: artist.residencyType,
          studio_location: artist.studio ? String(artist.studio) : null,
          skills: getSkillsForResidencyType(artist.residencyType),
          mediums: getMediumsForResidencyType(artist.residencyType),
          location: 'Miami, FL',
          is_public: true,
          is_featured: artist.residencyType === 'Studio Resident',
          metadata: {
            residency_type: artist.residencyType,
            year: artist.year,
            studio: artist.studio,
            phone: artist.phone,
            email: artist.email,
            instagram: artist.instagram,
            website: artist.website,
            source: 'oolite_catalog',
          },
        };
      });
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .insert(artistsToInsert)
        .select('name, metadata');
      
      if (error) {
        console.error(`❌ Error creating batch ${Math.floor(i/batchSize) + 1}:`, error);
        continue;
      }
      
      created += data.length;
      console.log(`✅ Created batch ${Math.floor(i/batchSize) + 1}: ${data.length} artists`);
      
      // Show progress
      data.forEach(artist => {
        console.log(`   - ${artist.name} (${artist.metadata?.residency_type || 'Unknown'})`);
      });
    }
    
    console.log(`\n🎉 Successfully created ${created} Oolite artists!`);
    
    // Verify the creation
    const { data: verifyData, error: verifyError } = await supabase
      .from('artist_profiles')
      .select('name, metadata')
      .eq('organization_id', OOLITE_ORG_ID)
      .order('name');
    
    if (verifyError) {
      console.error('❌ Error verifying artists:', verifyError);
      return;
    }
    
    console.log(`\n📊 Verification: Found ${verifyData.length} artists in database`);
    
    // Group by residency type
    const byType = verifyData.reduce((acc, artist) => {
      const type = artist.metadata?.residency_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Artists by residency type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

function getSkillsForResidencyType(residencyType) {
  const skillsMap = {
    "Studio Resident": ["Visual Arts", "Mixed Media", "Installation", "Sculpture", "Painting"],
    "Live In Art Resident": ["Performance", "Community Engagement", "Public Art", "Social Practice"],
    "Cinematic Resident": ["Film", "Video", "Cinematography", "Digital Media", "Storytelling"],
    "Staff": ["Administration", "Education", "Community Outreach", "Printmaking"]
  };
  
  return skillsMap[residencyType] || ["Art", "Creative Practice"];
}

function getMediumsForResidencyType(residencyType) {
  const mediumsMap = {
    "Studio Resident": ["Mixed Media", "Installation", "Sculpture", "Painting", "Drawing"],
    "Live In Art Resident": ["Performance", "Community Art", "Public Installation", "Social Practice"],
    "Cinematic Resident": ["Video", "Film", "Digital Media", "Photography", "Sound"],
    "Staff": ["Printmaking", "Education", "Community Engagement"]
  };
  
  return mediumsMap[residencyType] || ["Mixed Media"];
}

// Run the script
if (require.main === module) {
  populateArtists()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateArtists, artistsData };
