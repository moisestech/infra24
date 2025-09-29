#!/usr/bin/env node

/**
 * Populate Bakehouse Artists Script
 * 
 * This script populates the artist_profiles table with all Bakehouse Art Complex artists
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Bakehouse organization ID
const BAKEHOUSE_ORG_ID = 'd61cbe65-c359-4b80-9e29-e51eb8d072bd';

// Artist data from the SQL script
const artistsData = [
  { name: 'Daniel Arturo Almeida', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_daniel_arturo_almeida_associate_lyo5yu.webp', studio_type: 'Associate' },
  { name: 'Susan Alvarez', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_susan_alvarez_kft10t.webp', studio_type: 'Studio' },
  { name: 'Alyssa Andrews', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_alyssa_andrews_h17qcs.webp', studio_type: 'Studio' },
  { name: 'Jason Aponte', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_jason_aponte_cep6ox.webp', studio_type: 'Studio' },
  { name: 'Javier Barrera', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_javier_barrera_ql6cje.webp', studio_type: 'Studio' },
  { name: 'Maria Theresa Barbist', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_maria_theresa_barbist_g8jgys.webp', studio_type: 'Studio' },
  { name: 'Tom Bils', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_tom_bils_pig6rv.webp', studio_type: 'Studio' },
  { name: 'Leo Castaneda', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_leo_castaneda_fl1pqm.webp', studio_type: 'Studio' },
  { name: 'Bookleggers Library', bio: 'Library and community space at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_bookleggers_library_wnusmn.webp', studio_type: 'Staff' },
  { name: 'Maritza Caneca', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_maritza_caneca_palqm4.webp', studio_type: 'Studio' },
  { name: 'Lujan Candria', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336156/bakehouse_lujan_candria_nric1s.webp', studio_type: 'Studio' },
  { name: 'Alain Castoriano', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_alain_castoriano_qgucc2.webp', studio_type: 'Studio' },
  { name: 'Beatriz Chachamovits', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_beatriz_chachamovits_hxgr2m.webp', studio_type: 'Studio' },
  { name: 'Robert Chambers', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_chambers_kes7sr.webp', studio_type: 'Studio' },
  { name: 'Robert Colom', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_colom_qnr8ht.webp', studio_type: 'Studio' },
  { name: 'Nicole Combeau', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336152/bakehouse_nicole_combeau_vknuin.webp', studio_type: 'Studio' },
  { name: 'Christine Cortes', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_christine_cortes_ecjs3v.webp', studio_type: 'Studio' },
  { name: 'Morel Doucet', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_morel_doucet_yjts5p.webp', studio_type: 'Studio' },
  { name: 'Woosler Delisfort', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_woosler_delisfort_crdfgv.webp', studio_type: 'Studio' },
  { name: 'Agua Dulce', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_agua_dulce_pmashi.webp', studio_type: 'Studio' },
  { name: 'Jenna Efrein', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336149/bakehouse_jenna_efrein_itobe9.webp', studio_type: 'Studio' },
  { name: 'Augusto Esquivel', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_augusto_esquivel_q6munu.webp', studio_type: 'Studio' },
  { name: 'Diana Espin', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_diana_espin_ajg2vr.webp', studio_type: 'Studio' },
  { name: 'Diana Eusebio', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336147/bakehouse_diana_eusebio_oxpysl.webp', studio_type: 'Studio' },
  { name: 'Joel Gaitan', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_joel_gaitan_yltdlo.webp', studio_type: 'Studio' },
  { name: 'Ian Fichman', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_ian_fichman_vxircr.webp', studio_type: 'Studio' },
  { name: 'Gabriela Gamboa', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336145/bakehouse_gabriela_gamboa_khnjun.webp', studio_type: 'Studio' },
  { name: 'Gabriela Garcia Dalta', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_gabriela_garcia_dalta_iniaog.webp', studio_type: 'Studio' },
  { name: 'Jose Luis Garcia', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_jose_luis_garcia_coj8og.webp', studio_type: 'Studio' },
  { name: 'Juan Pablo Garza', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336143/bakehouse_juan_pablo_garza_cbd6ak.webp', studio_type: 'Studio' },
  { name: 'Geovanna Gonzalez', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_geovanna_gonzalez_jxkbpu.webp', studio_type: 'Studio' },
  { name: 'Adler Guerrier', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_adler_guerrier_manhbq.webp', studio_type: 'Studio' },
  { name: 'Maria Alejandra Icaza Paredes', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336141/bakehouse_maria_alejandra_icaza_paredes_iqbu68.webp', studio_type: 'Studio' },
  { name: 'Maru Jensen', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336140/bakehouse_maru_jensen_kpyjvh.webp', studio_type: 'Studio' },
  { name: 'Judith Berk King', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_judith_berk_king_wdlqlb.webp', studio_type: 'Studio' },
  { name: 'Katelyn Kopenhaver', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_katelyn_kopenhaver_azvclh.webp', studio_type: 'Studio' },
  { name: 'Fabiola Larios', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_fabiola_larios_zl2wjf.webp', studio_type: 'Studio' },
  { name: 'Malcolm Lauredo', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_malcolm_lauredo_bnn4jz.webp', studio_type: 'Studio' },
  { name: 'Monique Lazard', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336137/bakehouse_monique_lazard_pd0dfv.webp', studio_type: 'Studio' },
  { name: 'Juan Ledesma', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_juan_ledesma_n0sjax.webp', studio_type: 'Studio' },
  { name: 'Rhea Leonard', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_rhea_leonard_xr7a8d.webp', studio_type: 'Studio' },
  { name: 'Amanda Linares', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_amanda_linares_uofztm.webp', studio_type: 'Studio' },
  { name: 'Philip Lique', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_philip_lique_xrtekt.webp', studio_type: 'Studio' },
  { name: 'Tara Long', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336134/bakehouse_tara_long_z3ntsk.webp', studio_type: 'Studio' },
  { name: 'Monica Lopez de Victoria', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_monica_lopez_de_victoria_wavnqs.webp', studio_type: 'Studio' },
  { name: 'Xavier Lujan', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_xavier_lujan_vhesdv.webp', studio_type: 'Studio' },
  { name: 'Juan Matos', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336132/bakehouse_juan_matos_hv1enm.webp', studio_type: 'Studio' },
  { name: 'Jillian Mayer', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_jillian_mayer_obkd5e.webp', studio_type: 'Studio' },
  { name: 'Cici McGonigle', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_cici_mcgonigle_kv6mxs.webp', studio_type: 'Studio' },
  { name: 'Sean Mick', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336130/bakehouse_sean_mick_yuutdl.webp', studio_type: 'Studio' },
  { name: 'Pati Monclus', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_pati_monclus_kxvc9j.webp', studio_type: 'Studio' },
  { name: 'Lauren Monzon', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_lauren_monzon_dr1cae.webp', studio_type: 'Studio' },
  { name: 'Najja Moon', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_najja_moon_x2muun.webp', studio_type: 'Studio' },
  { name: 'Shawna Moulton', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_shawna_moulton_l3vdd8.webp', studio_type: 'Studio' },
  { name: 'Isabela Muci', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336127/bakehouse_isabela_muci_flal63.webp', studio_type: 'Studio' },
  { name: 'Cristina Muller Karger', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_cristina_muller_karger_fvsobl.webp', studio_type: 'Studio' },
  { name: 'Bryan Palmer', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_bryan_palmer_khhede.webp', studio_type: 'Studio' },
  { name: 'Christina Petterson', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_christina_petterson_zyf7ef.webp', studio_type: 'Studio' },
  { name: 'Lee Pivnik', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_lee_pivnik_fcj2p3.webp', studio_type: 'Studio' },
  { name: 'Jennifer Anderson Printz', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_jennifer_anderson_printz_ixmxgl.webp', studio_type: 'Studio' },
  { name: 'Sandra Ramos', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_sandra_ramos_hyq9ot.webp', studio_type: 'Studio' },
  { name: 'Sterling Rook', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336123/bakehouse_sterling_rook_yc0z12.webp', studio_type: 'Studio' },
  { name: 'Mark Russell Jr', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_mark_russell_jr_nrw11w.webp', studio_type: 'Studio' },
  { name: 'Nicole Salcedo', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_nicole_salcedo_ugpixs.webp', studio_type: 'Studio' },
  { name: 'Smita Sen', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_smita_sen_z8fhhw.webp', studio_type: 'Studio' },
  { name: 'Carmen Smith', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336121/bakehouse_carmen_smith_mg0atk.webp', studio_type: 'Studio' },
  { name: 'Moises Sanabria', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_moises_sanabria_juoaea.webp', studio_type: 'Studio' },
  { name: 'Zoe Schweiger', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_zoe_schweiger_gfi8mu.webp', studio_type: 'Studio' },
  { name: 'Mateo Serna Zapata', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mateo_serna_zapata_d4wdf7.webp', studio_type: 'Studio' },
  { name: 'Mary Ellen Scherl', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mary_ellen_scherl_tvacjq.webp', studio_type: 'Studio' },
  { name: 'Lauren Shapiro', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336119/bakehouse_lauren_shapiro_eukn5p.webp', studio_type: 'Studio' },
  { name: 'Troy Simmons', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_troy_simmons_rcutms.webp', studio_type: 'Studio' },
  { name: 'Monica Sorelle', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_monica_sorelle_zv7fak.webp', studio_type: 'Studio' },
  { name: 'Andrea Spiridonakos', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_andrea_spiridonakos_krntmk.webp', studio_type: 'Studio' },
  { name: 'Clara Toro', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_clara_toro_ypsysd.webp', studio_type: 'Studio' },
  { name: 'Juana Valdes', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_juana_valdes_jk7w0g.webp', studio_type: 'Studio' },
  { name: 'Gerbi Tsesarskaia', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_gerbi_tsesarskaia_wwr5gi.webp', studio_type: 'Studio' },
  { name: 'Martina Tuaty', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_martina_tuaty_oqfbbn.webp', studio_type: 'Studio' },
  { name: 'Cornelius Tulloch', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_cornelius_tulloch_sovoiw.webp', studio_type: 'Studio' },
  { name: 'Tonya Vegas', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tonya_vegas_sjuziz.webp', studio_type: 'Studio' },
  { name: 'Tom Virgin', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tom_virgin_mgxuav.webp', studio_type: 'Studio' },
  { name: 'Pedro Wazzan', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_pedro_wazzan_ocbjmv.webp', studio_type: 'Studio' },
  { name: 'Avi Young', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_avi_young_hbxj20.webp', studio_type: 'Studio' },
  { name: 'Valeria Yamamoto', bio: 'Artist at Bakehouse Art Complex', image: 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_valeria_yamamoto_lni2hp.webp', studio_type: 'Studio' }
];

async function populateBakehouseArtists() {
  console.log('🏠 Starting Bakehouse Artists Population...\n');
  
  try {
    // First, let's check if artists already exist
    const { data: existingArtists, error: checkError } = await supabase
      .from('artist_profiles')
      .select('name, metadata')
      .eq('organization_id', BAKEHOUSE_ORG_ID);
    
    if (checkError) {
      console.error('❌ Error checking existing artists:', checkError);
      return;
    }
    
    if (existingArtists && existingArtists.length > 0) {
      console.log(`📋 Found ${existingArtists.length} existing artists. Clearing them first...`);
      
      // Delete existing artists
      const { error: deleteError } = await supabase
        .from('artist_profiles')
        .delete()
        .eq('organization_id', BAKEHOUSE_ORG_ID);
      
      if (deleteError) {
        console.error('❌ Error deleting existing artists:', deleteError);
        return;
      }
      
      console.log('✅ Cleared existing artists\n');
    }
    
    console.log(`📊 Total artists to create: ${artistsData.length}`);
    
    // Create artists in batches
    const batchSize = 10;
    let created = 0;
    
    for (let i = 0; i < artistsData.length; i += batchSize) {
      const batch = artistsData.slice(i, i + batchSize);
      
      const artistsToInsert = batch.map(artist => ({
        organization_id: BAKEHOUSE_ORG_ID,
        user_id: `bakehouse_${artist.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name: artist.name,
        bio: artist.bio,
        profile_image: artist.image,
        studio_type: artist.studio_type,
        is_active: true,
        is_public: true,
        is_featured: artist.studio_type === 'Studio',
        metadata: {
          organization: 'Bakehouse Art Complex',
          studio_type: artist.studio_type
        }
      }));
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .insert(artistsToInsert)
        .select('name, studio_type');
      
      if (error) {
        console.error(`❌ Error creating batch ${Math.floor(i/batchSize) + 1}:`, error);
        continue;
      }
      
      created += data.length;
      console.log(`✅ Created batch ${Math.floor(i/batchSize) + 1}: ${data.length} artists`);
      
      // Show progress
      data.forEach(artist => {
        console.log(`   - ${artist.name} (${artist.studio_type})`);
      });
    }
    
    console.log(`\n🎉 Successfully created ${created} Bakehouse artists!`);
    
    // Verify the creation
    const { data: verifyData, error: verifyError } = await supabase
      .from('artist_profiles')
      .select('name, studio_type')
      .eq('organization_id', BAKEHOUSE_ORG_ID)
      .order('name');
    
    if (verifyError) {
      console.error('❌ Error verifying artists:', verifyError);
      return;
    }
    
    console.log(`\n📊 Verification: Found ${verifyData.length} artists in database`);
    
    // Group by studio type
    const byType = verifyData.reduce((acc, artist) => {
      const type = artist.studio_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Artists by studio type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
if (require.main === module) {
  populateBakehouseArtists()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateBakehouseArtists, artistsData };
