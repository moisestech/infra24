/**
 * Script to upload and organize artist photos from Cloudinary URLs
 * This script will help you create artist profiles with the provided photos
 */

const artistPhotos = [
  {
    name: "Daniel Arturo Almeida",
    role: "associate",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_daniel_arturo_almeida_associate_lyo5yu.webp"
  },
  {
    name: "Susan Alvarez",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_susan_alvarez_kft10t.webp"
  },
  {
    name: "Alyssa Andrews",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_alyssa_andrews_h17qcs.webp"
  },
  {
    name: "Jason Aponte",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_jason_aponte_cep6ox.webp"
  },
  {
    name: "Javier Barrera",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_javier_barrera_ql6cje.webp"
  },
  {
    name: "Maria Theresa Barbist",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_maria_theresa_barbist_g8jgys.webp"
  },
  {
    name: "Tom Bils",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_tom_bils_pig6rv.webp"
  },
  {
    name: "Leo Castaneda",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_leo_castaneda_fl1pqm.webp"
  },
  {
    name: "Bookleggers Library",
    role: "staff",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_bookleggers_library_wnusmn.webp"
  },
  {
    name: "Maritza Caneca",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_maritza_caneca_palqm4.webp"
  },
  {
    name: "Lujan Candria",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336156/bakehouse_lujan_candria_nric1s.webp"
  },
  {
    name: "Alain Castoriano",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_alain_castoriano_qgucc2.webp"
  },
  {
    name: "Beatriz Chachamovits",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_beatriz_chachamovits_hxgr2m.webp"
  },
  {
    name: "Robert Chambers",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_chambers_kes7sr.webp"
  },
  {
    name: "Robert Colom",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_colom_qnr8ht.webp"
  },
  {
    name: "Nicole Combeau",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336152/bakehouse_nicole_combeau_vknuin.webp"
  },
  {
    name: "Christine Cortes",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_christine_cortes_ecjs3v.webp"
  },
  {
    name: "Morel Doucet",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_morel_doucet_yjts5p.webp"
  },
  {
    name: "Woosler Delisfort",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_woosler_delisfort_crdfgv.webp"
  },
  {
    name: "Agua Dulce",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_agua_dulce_pmashi.webp"
  },
  {
    name: "Jenna Efrein",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336149/bakehouse_jenna_efrein_itobe9.webp"
  },
  {
    name: "Augusto Esquivel",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_augusto_esquivel_q6munu.webp"
  },
  {
    name: "Diana Espin",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_diana_espin_ajg2vr.webp"
  },
  {
    name: "Diana Eusebio",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336147/bakehouse_diana_eusebio_oxpysl.webp"
  },
  {
    name: "Joel Gaitan",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_joel_gaitan_yltdlo.webp"
  },
  {
    name: "Ian Fichman",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_ian_fichman_vxircr.webp"
  },
  {
    name: "Gabriela Gamboa",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336145/bakehouse_gabriela_gamboa_khnjun.webp"
  },
  {
    name: "Gabriela Garcia Dalta",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_gabriela_garcia_dalta_iniaog.webp"
  },
  {
    name: "Jose Luis Garcia",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_jose_luis_garcia_coj8og.webp"
  },
  {
    name: "Juan Pablo Garza",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336143/bakehouse_juan_pablo_garza_cbd6ak.webp"
  },
  {
    name: "Geovanna Gonzalez",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_geovanna_gonzalez_jxkbpu.webp"
  },
  {
    name: "Adler Guerrier",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_adler_guerrier_manhbq.webp"
  },
  {
    name: "Maria Alejandra Icaza Paredes",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336141/bakehouse_maria_alejandra_icaza_paredes_iqbu68.webp"
  },
  {
    name: "Maru Jensen",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336140/bakehouse_maru_jensen_kpyjvh.webp"
  },
  {
    name: "Judith Berk King",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_judith_berk_king_wdlqlb.webp"
  },
  {
    name: "Katelyn Kopenhaver",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_katelyn_kopenhaver_azvclh.webp"
  },
  {
    name: "Fabiola Larios",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_fabiola_larios_zl2wjf.webp"
  },
  {
    name: "Malcolm Lauredo",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_malcolm_lauredo_bnn4jz.webp"
  },
  {
    name: "Monique Lazard",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336137/bakehouse_monique_lazard_pd0dfv.webp"
  },
  {
    name: "Juan Ledesma",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_juan_ledesma_n0sjax.webp"
  },
  {
    name: "Rhea Leonard",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_rhea_leonard_xr7a8d.webp"
  },
  {
    name: "Amanda Linares",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_amanda_linares_uofztm.webp"
  },
  {
    name: "Philip Lique",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_philip_lique_xrtekt.webp"
  },
  {
    name: "Tara Long",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336134/bakehouse_tara_long_z3ntsk.webp"
  },
  {
    name: "Monica Lopez de Victoria",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_monica_lopez_de_victoria_wavnqs.webp"
  },
  {
    name: "Xavier Lujan",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_xavier_lujan_vhesdv.webp"
  },
  {
    name: "Juan Matos",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336132/bakehouse_juan_matos_hv1enm.webp"
  },
  {
    name: "Jillian Mayer",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_jillian_mayer_obkd5e.webp"
  },
  {
    name: "Cici McGonigle",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_cici_mcgonigle_kv6mxs.webp"
  },
  {
    name: "Sean Mick",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336130/bakehouse_sean_mick_yuutdl.webp"
  },
  {
    name: "Pati Monclus",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_pati_monclus_kxvc9j.webp"
  },
  {
    name: "Lauren Monzon",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_lauren_monzon_dr1cae.webp"
  },
  {
    name: "Najja Moon",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_najja_moon_x2muun.webp"
  },
  {
    name: "Shawna Moulton",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_shawna_moulton_l3vdd8.webp"
  },
  {
    name: "Isabela Muci",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336127/bakehouse_isabela_muci_flal63.webp"
  },
  {
    name: "Cristina Muller Karger",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_cristina_muller_karger_fvsobl.webp"
  },
  {
    name: "Bryan Palmer",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_bryan_palmer_khhede.webp"
  },
  {
    name: "Christina Petterson",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_christina_petterson_zyf7ef.webp"
  },
  {
    name: "Lee Pivnik",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_lee_pivnik_fcj2p3.webp"
  },
  {
    name: "Jennifer Anderson Printz",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_jennifer_anderson_printz_ixmxgl.webp"
  },
  {
    name: "Sandra Ramos",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_sandra_ramos_hyq9ot.webp"
  },
  {
    name: "Sterling Rook",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336123/bakehouse_sterling_rook_yc0z12.webp"
  },
  {
    name: "Mark Russell Jr",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_mark_russell_jr_nrw11w.webp"
  },
  {
    name: "Nicole Salcedo",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_nicole_salcedo_ugpixs.webp"
  },
  {
    name: "Smita Sen",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_smita_sen_z8fhhw.webp"
  },
  {
    name: "Carmen Smith",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336121/bakehouse_carmen_smith_mg0atk.webp"
  },
  {
    name: "Moises Sanabria",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_moises_sanabria_juoaea.webp"
  },
  {
    name: "Zoe Schweiger",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_zoe_schweiger_gfi8mu.webp"
  },
  {
    name: "Mateo Serna Zapata",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mateo_serna_zapata_d4wdf7.webp"
  },
  {
    name: "Mary Ellen Scherl",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mary_ellen_scherl_tvacjq.webp"
  },
  {
    name: "Lauren Shapiro",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336119/bakehouse_lauren_shapiro_eukn5p.webp"
  },
  {
    name: "Troy Simmons",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_troy_simmons_rcutms.webp"
  },
  {
    name: "Monica Sorelle",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_monica_sorelle_zv7fak.webp"
  },
  {
    name: "Andrea Spiridonakos",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_andrea_spiridonakos_krntmk.webp"
  },
  {
    name: "Clara Toro",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_clara_toro_ypsysd.webp"
  },
  {
    name: "Juana Valdes",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_juana_valdes_jk7w0g.webp"
  },
  {
    name: "Gerbi Tsesarskaia",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_gerbi_tsesarskaia_wwr5gi.webp"
  },
  {
    name: "Martina Tuaty",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_martina_tuaty_oqfbbn.webp"
  },
  {
    name: "Cornelius Tulloch",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_cornelius_tulloch_sovoiw.webp"
  },
  {
    name: "Tonya Vegas",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tonya_vegas_sjuziz.webp"
  },
  {
    name: "Tom Virgin",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tom_virgin_mgxuav.webp"
  },
  {
    name: "Pedro Wazzan",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_pedro_wazzan_ocbjmv.webp"
  },
  {
    name: "Avi Young",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_avi_young_hbxj20.webp"
  },
  {
    name: "Valeria Yamamoto",
    role: "resident",
    imageUrl: "https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_valeria_yamamoto_lni2hp.webp"
  }
];

// Function to create artist profiles
async function createArtistProfiles() {
  const bakehouseOrgId = "2efcebf3-9750-4ea2-85a0-9501eb698b20"; // Replace with actual org ID
  
  console.log(`Creating ${artistPhotos.length} artist profiles...`);
  
  for (const artist of artistPhotos) {
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: artist.name,
          bio: `Artist at Bakehouse Art Complex`,
          profile_image_url: artist.imageUrl,
          role: artist.role,
          org_id: bakehouseOrgId,
          studio: null // You can add studio information later
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Created profile for ${artist.name}`);
      } else {
        console.error(`❌ Failed to create profile for ${artist.name}:`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error creating profile for ${artist.name}:`, error);
    }
  }
}

// Function to generate SQL for bulk insert
function generateSQL() {
  const bakehouseOrgId = "2efcebf3-9750-4ea2-85a0-9501eb698b20";
  
  console.log('-- SQL to create artist profiles');
  console.log('INSERT INTO artist_profiles (name, bio, profile_image_url, role, org_id, status, created_at, updated_at) VALUES');
  
  const values = artistPhotos.map((artist, index) => {
    const isLast = index === artistPhotos.length - 1;
    return `  ('${artist.name.replace(/'/g, "''")}', 'Artist at Bakehouse Art Complex', '${artist.imageUrl}', '${artist.role}', '${bakehouseOrgId}', 'active', NOW(), NOW())${isLast ? ';' : ','}`;
  });
  
  console.log(values.join('\n'));
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    artistPhotos,
    createArtistProfiles,
    generateSQL
  };
}

// If running directly, generate SQL
if (typeof window === 'undefined' && require.main === module) {
  generateSQL();
}


