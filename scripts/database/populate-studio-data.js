const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Real studio data from the user
const studioData = [
  {
    "studio_number": "2",
    "status": "Occupied",
    "artist_name": "Tom Virgin / Extra Virgin Press",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tom_virgin_mgxuav.webp",
    "specialties": null
  },
  {
    "studio_number": "3",
    "status": "Occupied",
    "artist_name": "Troy Simmons",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_troy_simmons_rcutms.webp",
    "specialties": null
  },
  {
    "studio_number": "4",
    "status": "Occupied",
    "artist_name": "Valeria Yamamoto",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_valeria_yamamoto_lni2hp.webp",
    "specialties": null
  },
  {
    "studio_number": "8",
    "status": "Occupied",
    "artist_name": "Lujan Candria",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336156/bakehouse_lujan_candria_nric1s.webp",
    "specialties": null
  },
  {
    "studio_number": "9",
    "status": "Occupied",
    "artist_name": "Cornelius Tulloch",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_cornelius_tulloch_sovoiw.webp",
    "specialties": null
  },
  {
    "studio_number": "10",
    "status": "Occupied",
    "artist_name": "Joel Gaitan",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_joel_gaitan_yltdlo.webp",
    "specialties": null
  },
  {
    "studio_number": "11",
    "status": "Occupied",
    "artist_name": "Zoe Schweiger",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_zoe_schweiger_gfi8mu.webp",
    "specialties": null
  },
  {
    "studio_number": "12",
    "status": "Occupied",
    "artist_name": "Susan Alvarez",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_susan_alvarez_kft10t.webp",
    "specialties": null
  },
  {
    "studio_number": "12",
    "status": "Occupied",
    "artist_name": "Monique Lazard",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336137/bakehouse_monique_lazard_pd0dfv.webp",
    "specialties": null
  },
  {
    "studio_number": "12",
    "status": "Occupied",
    "artist_name": "Cici McGonigle",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_cici_mcgonigle_kv6mxs.webp",
    "specialties": null
  },
  {
    "studio_number": "13",
    "status": "Occupied",
    "artist_name": "Gabriela Gamboa",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336145/bakehouse_gabriela_gamboa_khnjun.webp",
    "specialties": null
  },
  {
    "studio_number": "14",
    "status": "Occupied",
    "artist_name": "Maria Theresa Barbist",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_maria_theresa_barbist_g8jgys.webp",
    "specialties": null
  },
  {
    "studio_number": "16",
    "status": "Occupied",
    "artist_name": "Alain Castoriano",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_alain_castoriano_qgucc2.webp",
    "specialties": null
  },
  {
    "studio_number": "18",
    "status": "Occupied",
    "artist_name": "Morel Doucet",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_morel_doucet_yjts5p.webp",
    "specialties": null
  },
  {
    "studio_number": "19",
    "status": "Occupied",
    "artist_name": "Andrea Spiridonakos",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_andrea_spiridonakos_krntmk.webp",
    "specialties": null
  },
  {
    "studio_number": "20",
    "status": "Occupied",
    "artist_name": "Gabriela García D'Alta",
    "profile_image": "https://your-cdn/profile-images/edc2d482-646a-49e3-ac4e-c8fa874d9047.jpg",
    "specialties": null
  },
  {
    "studio_number": "21",
    "status": "Occupied",
    "artist_name": "Philip Lique",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_philip_lique_xrtekt.webp",
    "specialties": null
  },
  {
    "studio_number": "22",
    "status": "Occupied",
    "artist_name": "Lauren Shapiro",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336119/bakehouse_lauren_shapiro_eukn5p.webp",
    "specialties": null
  },
  {
    "studio_number": "23",
    "status": "Occupied",
    "artist_name": "Gerbi Tsesarskaia",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_gerbi_tsesarskaia_wwr5gi.webp",
    "specialties": null
  },
  {
    "studio_number": "24",
    "status": "Occupied",
    "artist_name": "Mary Ellen Scherl",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mary_ellen_scherl_tvacjq.webp",
    "specialties": null
  },
  {
    "studio_number": "25",
    "status": "Occupied",
    "artist_name": "Pati Monclus",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_pati_monclus_kxvc9j.webp",
    "specialties": null
  },
  {
    "studio_number": "26",
    "status": "Occupied",
    "artist_name": "Sterling Rook",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336123/bakehouse_sterling_rook_yc0z12.webp",
    "specialties": null
  },
  {
    "studio_number": "27",
    "status": "Occupied",
    "artist_name": "Nicole Salcedo",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_nicole_salcedo_ugpixs.webp",
    "specialties": null
  },
  {
    "studio_number": "28",
    "status": "Occupied",
    "artist_name": "Monica Lopez de Victoria",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_monica_lopez_de_victoria_wavnqs.webp",
    "specialties": null
  },
  {
    "studio_number": "29",
    "status": "Occupied",
    "artist_name": "GeoVanna Gonzalez",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_geovanna_gonzalez_jxkbpu.webp",
    "specialties": null
  },
  {
    "studio_number": "30",
    "status": "Occupied",
    "artist_name": "Beatriz Chachamovitz",
    "profile_image": "https://your-cdn/profile-images/505b71f1-a332-47e4-a3b2-06d08be52f5a.jpg",
    "specialties": null
  },
  {
    "studio_number": "31",
    "status": "Occupied",
    "artist_name": "Judith Berk King",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_judith_berk_king_wdlqlb.webp",
    "specialties": null
  },
  {
    "studio_number": "32",
    "status": "Occupied",
    "artist_name": "Rhea Leonard",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_rhea_leonard_xr7a8d.webp",
    "specialties": null
  },
  {
    "studio_number": "33",
    "status": "Occupied",
    "artist_name": "Maru Jensen",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336140/bakehouse_maru_jensen_kpyjvh.webp",
    "specialties": null
  },
  {
    "studio_number": "33",
    "status": "Occupied",
    "artist_name": "Shawna Moulton",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_shawna_moulton_l3vdd8.webp",
    "specialties": null
  },
  {
    "studio_number": "35",
    "status": "Occupied",
    "artist_name": "Tonya Vegas",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tonya_vegas_sjuziz.webp",
    "specialties": null
  },
  {
    "studio_number": "36",
    "status": "Occupied",
    "artist_name": "Jennifer Printz",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_jennifer_anderson_printz_ixmxgl.webp",
    "specialties": null
  },
  {
    "studio_number": "37",
    "status": "Occupied",
    "artist_name": "Xavier Lujan",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_xavier_lujan_vhesdv.webp",
    "specialties": null
  },
  {
    "studio_number": "38",
    "status": "Occupied",
    "artist_name": "Jason Aponte",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_jason_aponte_cep6ox.webp",
    "specialties": null
  },
  {
    "studio_number": "40",
    "status": "Occupied",
    "artist_name": "Fabiola Larios",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_fabiola_larios_zl2wjf.webp",
    "specialties": null
  },
  {
    "studio_number": "41",
    "status": "Occupied",
    "artist_name": "Maritza Caneca",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_maritza_caneca_palqm4.webp",
    "specialties": null
  },
  {
    "studio_number": "42",
    "status": "Occupied",
    "artist_name": "Malcolm Lauredo",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_malcolm_lauredo_bnn4jz.webp",
    "specialties": null
  },
  {
    "studio_number": "43",
    "status": "Occupied",
    "artist_name": "Moises Sanabria",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_moises_sanabria_juoaea.webp",
    "specialties": null
  },
  {
    "studio_number": "44",
    "status": "Occupied",
    "artist_name": "Juan Matos",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336132/bakehouse_juan_matos_hv1enm.webp",
    "specialties": null
  },
  {
    "studio_number": "45",
    "status": "Occupied",
    "artist_name": "Katelyn Kopenhaver",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_katelyn_kopenhaver_azvclh.webp",
    "specialties": null
  },
  {
    "studio_number": "46",
    "status": "Occupied",
    "artist_name": "Tom Bils",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_tom_bils_pig6rv.webp",
    "specialties": null
  },
  {
    "studio_number": "47",
    "status": "Occupied",
    "artist_name": "Christina Pettersson",
    "profile_image": "https://your-cdn/profile-images/f44f300b-491f-4ef5-af3f-f57a4913c346.jpg",
    "specialties": null
  },
  {
    "studio_number": "48",
    "status": "Occupied",
    "artist_name": "Woosler Delisfort",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_woosler_delisfort_crdfgv.webp",
    "specialties": null
  },
  {
    "studio_number": "48",
    "status": "Occupied",
    "artist_name": "Clara Toro",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_clara_toro_ypsysd.webp",
    "specialties": null
  },
  {
    "studio_number": "54",
    "status": "Occupied",
    "artist_name": "Sandra Ramos",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_sandra_ramos_hyq9ot.webp",
    "specialties": null
  },
  {
    "studio_number": "55",
    "status": "Occupied",
    "artist_name": "Leo Castañeda",
    "profile_image": "https://your-cdn/profile-images/62de11f0-f415-43bf-bbdc-1344700fbc9e.jpg",
    "specialties": null
  },
  {
    "studio_number": "55",
    "status": "Occupied",
    "artist_name": "Lauren Monzón",
    "profile_image": "https://your-cdn/profile-images/2e689605-885a-487f-bdc4-d00d214f4f50.jpg",
    "specialties": null
  },
  {
    "studio_number": "58",
    "status": "Occupied",
    "artist_name": "Jenna Efrein",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336149/bakehouse_jenna_efrein_itobe9.webp",
    "specialties": null
  },
  {
    "studio_number": "65",
    "status": "Occupied",
    "artist_name": "Jillian Mayer",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_jillian_mayer_obkd5e.webp",
    "specialties": null
  },
  {
    "studio_number": "1,15",
    "status": "Occupied",
    "artist_name": "Ian Fichman",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_ian_fichman_vxircr.webp",
    "specialties": null
  },
  {
    "studio_number": "10U",
    "status": "Occupied",
    "artist_name": "Juan Ledesma",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_juan_ledesma_n0sjax.webp",
    "specialties": null
  },
  {
    "studio_number": "11U",
    "status": "Occupied",
    "artist_name": "Adler Guerrier",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_adler_guerrier_manhbq.webp",
    "specialties": null
  },
  {
    "studio_number": "1A",
    "status": "Occupied",
    "artist_name": "Juan Pablo Garza",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336143/bakehouse_juan_pablo_garza_cbd6ak.webp",
    "specialties": null
  },
  {
    "studio_number": "1U",
    "status": "Occupied",
    "artist_name": "Najja Moon",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_najja_moon_x2muun.webp",
    "specialties": null
  },
  {
    "studio_number": "2U",
    "status": "Occupied",
    "artist_name": "Martina Tuaty",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_martina_tuaty_oqfbbn.webp",
    "specialties": null
  },
  {
    "studio_number": "4U",
    "status": "Occupied",
    "artist_name": "Augusto Esquivel",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_augusto_esquivel_q6munu.webp",
    "specialties": null
  },
  {
    "studio_number": "56A",
    "status": "Occupied",
    "artist_name": "Tara Long",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336134/bakehouse_tara_long_z3ntsk.webp",
    "specialties": null
  },
  {
    "studio_number": "6U",
    "status": "Occupied",
    "artist_name": "Diana Eusebio",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336147/bakehouse_diana_eusebio_oxpysl.webp",
    "specialties": null
  },
  {
    "studio_number": "7U",
    "status": "Occupied",
    "artist_name": "Robert Chambers",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_chambers_kes7sr.webp",
    "specialties": null
  },
  {
    "studio_number": "8U",
    "status": "Occupied",
    "artist_name": "Monica Sorelle",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_monica_sorelle_zv7fak.webp",
    "specialties": null
  },
  {
    "studio_number": "8U",
    "status": "Occupied",
    "artist_name": "Mateo Serna Zapata",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mateo_serna_zapata_d4wdf7.webp",
    "specialties": null
  },
  {
    "studio_number": "9U",
    "status": "Occupied",
    "artist_name": "Nicole Combeau",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336152/bakehouse_nicole_combeau_vknuin.webp",
    "specialties": null
  },
  {
    "studio_number": "A",
    "status": "Occupied",
    "artist_name": "Bookleggers Library",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_bookleggers_library_wnusmn.webp",
    "specialties": null
  },
  {
    "studio_number": "J",
    "status": "Occupied",
    "artist_name": "Robert Colom",
    "profile_image": "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_colom_qnr8ht.webp",
    "specialties": null
  }
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function populateStudioData() {
  try {
    console.log('🎨 Starting to populate studio data...');
    
    // First, get the Bakehouse organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'bakehouse')
      .single();
    
    if (orgError) {
      console.error('❌ Error fetching organization:', orgError);
      return;
    }
    
    console.log('✅ Found Bakehouse organization:', org.id);
    
    // Group artists by studio number (some studios have multiple artists)
    const studioGroups = {};
    studioData.forEach(artist => {
      if (!studioGroups[artist.studio_number]) {
        studioGroups[artist.studio_number] = [];
      }
      studioGroups[artist.studio_number].push(artist);
    });
    
    console.log(`📊 Found ${Object.keys(studioGroups).length} unique studios with artists`);
    
    // Update or insert artist profiles
    for (const [studioNumber, artists] of Object.entries(studioGroups)) {
      console.log(`\n🏠 Processing Studio ${studioNumber} with ${artists.length} artist(s):`);
      
      for (const artist of artists) {
        console.log(`  👤 Processing ${artist.artist_name}`);
        
        // Check if artist already exists
        const { data: existingArtist, error: checkError } = await supabase
          .from('artist_profiles')
          .select('id, name, studio_number')
          .eq('name', artist.artist_name)
          .eq('organization_id', org.id)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`    ❌ Error checking artist:`, checkError);
          continue;
        }
        
        const artistData = {
          name: artist.artist_name,
          studio_number: studioNumber,
          profile_image: artist.profile_image,
          organization_id: org.id,
          is_active: true,
          specialties: artist.specialties || ['Mixed Media'], // Default specialty
          bio: `Resident artist at Bakehouse Art Complex, Studio ${studioNumber}`,
          website_url: null,
          instagram_handle: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        if (existingArtist) {
          // Update existing artist
          const { error: updateError } = await supabase
            .from('artist_profiles')
            .update({
              studio_number: studioNumber,
              profile_image: artist.profile_image,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingArtist.id);
          
          if (updateError) {
            console.error(`    ❌ Error updating artist:`, updateError);
          } else {
            console.log(`    ✅ Updated ${artist.artist_name} in Studio ${studioNumber}`);
          }
        } else {
          // Insert new artist
          const { error: insertError } = await supabase
            .from('artist_profiles')
            .insert(artistData);
          
          if (insertError) {
            console.error(`    ❌ Error inserting artist:`, insertError);
          } else {
            console.log(`    ✅ Created ${artist.artist_name} in Studio ${studioNumber}`);
          }
        }
      }
    }
    
    console.log('\n🎉 Studio data population completed!');
    
    // Show summary
    const { data: summary, error: summaryError } = await supabase
      .from('artist_profiles')
      .select('studio_number, name')
      .eq('organization_id', org.id)
      .eq('is_active', true)
      .order('studio_number');
    
    if (!summaryError) {
      console.log('\n📋 Summary of populated studios:');
      const studioSummary = {};
      summary.forEach(artist => {
        if (!studioSummary[artist.studio_number]) {
          studioSummary[artist.studio_number] = [];
        }
        studioSummary[artist.studio_number].push(artist.name);
      });
      
      Object.entries(studioSummary).forEach(([studio, artists]) => {
        console.log(`  Studio ${studio}: ${artists.join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error populating studio data:', error);
  }
}

// Run the script
populateStudioData();
