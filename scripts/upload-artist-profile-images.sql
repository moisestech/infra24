-- Upload Artist Profile Images Script
-- This script updates all Bakehouse artist profiles with their corresponding profile images from Cloudinary
-- Generated from the provided Cloudinary URLs

-- First, let's see what artists we currently have
SELECT 
    id,
    name,
    email,
    studio_type,
    profile_image,
    is_claimed
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
ORDER BY name;

-- Update artist profiles with their profile images
-- Using a CASE statement to match artist names with their Cloudinary URLs

UPDATE artist_profiles 
SET profile_image = CASE 
    -- Daniel Arturo Almeida
    WHEN LOWER(name) LIKE '%daniel%arturo%almeida%' OR LOWER(name) LIKE '%daniel almeida%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_daniel_arturo_almeida_associate_lyo5yu.webp'
    
    -- Susan Alvarez
    WHEN LOWER(name) LIKE '%susan%alvarez%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_susan_alvarez_kft10t.webp'
    
    -- Alyssa Andrews
    WHEN LOWER(name) LIKE '%alyssa%andrews%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_alyssa_andrews_h17qcs.webp'
    
    -- Jason Aponte
    WHEN LOWER(name) LIKE '%jason%aponte%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_jason_aponte_cep6ox.webp'
    
    -- Javier Barrera
    WHEN LOWER(name) LIKE '%javier%barrera%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_javier_barrera_ql6cje.webp'
    
    -- Maria Theresa Barbist
    WHEN LOWER(name) LIKE '%maria%theresa%barbist%' OR LOWER(name) LIKE '%maria barbist%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_maria_theresa_barbist_g8jgys.webp'
    
    -- Tom Bils
    WHEN LOWER(name) LIKE '%tom%bils%' OR LOWER(name) LIKE '%thomas bils%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_tom_bils_pig6rv.webp'
    
    -- Leo Castaneda
    WHEN LOWER(name) LIKE '%leo%castaneda%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_leo_castaneda_fl1pqm.webp'
    
    -- Bookleggers Library
    WHEN LOWER(name) LIKE '%bookleggers%library%' OR LOWER(name) LIKE '%bookleggers%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_bookleggers_library_wnusmn.webp'
    
    -- Maritza Caneca
    WHEN LOWER(name) LIKE '%maritza%caneca%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_maritza_caneca_palqm4.webp'
    
    -- Lujan Candria
    WHEN LOWER(name) LIKE '%lujan%candria%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336156/bakehouse_lujan_candria_nric1s.webp'
    
    -- Alain Castoriano
    WHEN LOWER(name) LIKE '%alain%castoriano%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_alain_castoriano_qgucc2.webp'
    
    -- Beatriz Chachamovits
    WHEN LOWER(name) LIKE '%beatriz%chachamovits%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_beatriz_chachamovits_hxgr2m.webp'
    
    -- Robert Chambers
    WHEN LOWER(name) LIKE '%robert%chambers%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_chambers_kes7sr.webp'
    
    -- Robert Colom
    WHEN LOWER(name) LIKE '%robert%colom%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_colom_qnr8ht.webp'
    
    -- Nicole Combeau
    WHEN LOWER(name) LIKE '%nicole%combeau%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336152/bakehouse_nicole_combeau_vknuin.webp'
    
    -- Christine Cortes
    WHEN LOWER(name) LIKE '%christine%cortes%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_christine_cortes_ecjs3v.webp'
    
    -- Morel Doucet
    WHEN LOWER(name) LIKE '%morel%doucet%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_morel_doucet_yjts5p.webp'
    
    -- Woosler Delisfort
    WHEN LOWER(name) LIKE '%woosler%delisfort%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_woosler_delisfort_crdfgv.webp'
    
    -- Agua Dulce
    WHEN LOWER(name) LIKE '%agua%dulce%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_agua_dulce_pmashi.webp'
    
    -- Jenna Efrein
    WHEN LOWER(name) LIKE '%jenna%efrein%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336149/bakehouse_jenna_efrein_itobe9.webp'
    
    -- Augusto Esquivel
    WHEN LOWER(name) LIKE '%augusto%esquivel%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_augusto_esquivel_q6munu.webp'
    
    -- Diana Espin
    WHEN LOWER(name) LIKE '%diana%espin%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_diana_espin_ajg2vr.webp'
    
    -- Diana Eusebio
    WHEN LOWER(name) LIKE '%diana%eusebio%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336147/bakehouse_diana_eusebio_oxpysl.webp'
    
    -- Joel Gaitan
    WHEN LOWER(name) LIKE '%joel%gaitan%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_joel_gaitan_yltdlo.webp'
    
    -- Ian Fichman
    WHEN LOWER(name) LIKE '%ian%fichman%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_ian_fichman_vxircr.webp'
    
    -- Gabriela Gamboa
    WHEN LOWER(name) LIKE '%gabriela%gamboa%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336145/bakehouse_gabriela_gamboa_khnjun.webp'
    
    -- Gabriela Garcia Dalta
    WHEN LOWER(name) LIKE '%gabriela%garcia%dalta%' OR LOWER(name) LIKE '%gabriela garcia%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_gabriela_garcia_dalta_iniaog.webp'
    
    -- Jose Luis Garcia
    WHEN LOWER(name) LIKE '%jose%luis%garcia%' OR LOWER(name) LIKE '%jose garcia%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_jose_luis_garcia_coj8og.webp'
    
    -- Juan Pablo Garza
    WHEN LOWER(name) LIKE '%juan%pablo%garza%' OR LOWER(name) LIKE '%juan garza%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336143/bakehouse_juan_pablo_garza_cbd6ak.webp'
    
    -- Geovanna Gonzalez
    WHEN LOWER(name) LIKE '%geovanna%gonzalez%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_geovanna_gonzalez_jxkbpu.webp'
    
    -- Adler Guerrier
    WHEN LOWER(name) LIKE '%adler%guerrier%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_adler_guerrier_manhbq.webp'
    
    -- Maria Alejandra Icaza Paredes
    WHEN LOWER(name) LIKE '%maria%alejandra%icaza%paredes%' OR LOWER(name) LIKE '%maria icaza%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336141/bakehouse_maria_alejandra_icaza_paredes_iqbu68.webp'
    
    -- Maru Jensen
    WHEN LOWER(name) LIKE '%maru%jensen%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336140/bakehouse_maru_jensen_kpyjvh.webp'
    
    -- Judith Berk King
    WHEN LOWER(name) LIKE '%judith%berk%king%' OR LOWER(name) LIKE '%judith king%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_judith_berk_king_wdlqlb.webp'
    
    -- Katelyn Kopenhaver
    WHEN LOWER(name) LIKE '%katelyn%kopenhaver%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_katelyn_kopenhaver_azvclh.webp'
    
    -- Fabiola Larios
    WHEN LOWER(name) LIKE '%fabiola%larios%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_fabiola_larios_zl2wjf.webp'
    
    -- Malcolm Lauredo
    WHEN LOWER(name) LIKE '%malcolm%lauredo%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_malcolm_lauredo_bnn4jz.webp'
    
    -- Monique Lazard
    WHEN LOWER(name) LIKE '%monique%lazard%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336137/bakehouse_monique_lazard_pd0dfv.webp'
    
    -- Juan Ledesma
    WHEN LOWER(name) LIKE '%juan%ledesma%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_juan_ledesma_n0sjax.webp'
    
    -- Rhea Leonard
    WHEN LOWER(name) LIKE '%rhea%leonard%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_rhea_leonard_xr7a8d.webp'
    
    -- Amanda Linares
    WHEN LOWER(name) LIKE '%amanda%linares%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_amanda_linares_uofztm.webp'
    
    -- Philip Lique
    WHEN LOWER(name) LIKE '%philip%lique%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_philip_lique_xrtekt.webp'
    
    -- Tara Long
    WHEN LOWER(name) LIKE '%tara%long%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336134/bakehouse_tara_long_z3ntsk.webp'
    
    -- Monica Lopez de Victoria
    WHEN LOWER(name) LIKE '%monica%lopez%de%victoria%' OR LOWER(name) LIKE '%monica lopez%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_monica_lopez_de_victoria_wavnqs.webp'
    
    -- Xavier Lujan
    WHEN LOWER(name) LIKE '%xavier%lujan%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_xavier_lujan_vhesdv.webp'
    
    -- Juan Matos
    WHEN LOWER(name) LIKE '%juan%matos%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336132/bakehouse_juan_matos_hv1enm.webp'
    
    -- Jillian Mayer
    WHEN LOWER(name) LIKE '%jillian%mayer%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_jillian_mayer_obkd5e.webp'
    
    -- Cici McGonigle
    WHEN LOWER(name) LIKE '%cici%mcgonigle%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_cici_mcgonigle_kv6mxs.webp'
    
    -- Sean Mick
    WHEN LOWER(name) LIKE '%sean%mick%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336130/bakehouse_sean_mick_yuutdl.webp'
    
    -- Pati Monclus
    WHEN LOWER(name) LIKE '%pati%monclus%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_pati_monclus_kxvc9j.webp'
    
    -- Lauren Monzon
    WHEN LOWER(name) LIKE '%lauren%monzon%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_lauren_monzon_dr1cae.webp'
    
    -- Najja Moon
    WHEN LOWER(name) LIKE '%najja%moon%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_najja_moon_x2muun.webp'
    
    -- Shawna Moulton
    WHEN LOWER(name) LIKE '%shawna%moulton%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_shawna_moulton_l3vdd8.webp'
    
    -- Isabela Muci
    WHEN LOWER(name) LIKE '%isabela%muci%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336127/bakehouse_isabela_muci_flal63.webp'
    
    -- Cristina Muller Karger
    WHEN LOWER(name) LIKE '%cristina%muller%karger%' OR LOWER(name) LIKE '%cristina muller%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_cristina_muller_karger_fvsobl.webp'
    
    -- Bryan Palmer
    WHEN LOWER(name) LIKE '%bryan%palmer%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_bryan_palmer_khhede.webp'
    
    -- Christina Petterson
    WHEN LOWER(name) LIKE '%christina%petterson%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_christina_petterson_zyf7ef.webp'
    
    -- Lee Pivnik
    WHEN LOWER(name) LIKE '%lee%pivnik%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_lee_pivnik_fcj2p3.webp'
    
    -- Jennifer Anderson Printz
    WHEN LOWER(name) LIKE '%jennifer%anderson%printz%' OR LOWER(name) LIKE '%jennifer printz%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_jennifer_anderson_printz_ixmxgl.webp'
    
    -- Sandra Ramos
    WHEN LOWER(name) LIKE '%sandra%ramos%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_sandra_ramos_hyq9ot.webp'
    
    -- Sterling Rook
    WHEN LOWER(name) LIKE '%sterling%rook%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336123/bakehouse_sterling_rook_yc0z12.webp'
    
    -- Mark Russell Jr
    WHEN LOWER(name) LIKE '%mark%russell%jr%' OR LOWER(name) LIKE '%mark russell%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_mark_russell_jr_nrw11w.webp'
    
    -- Nicole Salcedo
    WHEN LOWER(name) LIKE '%nicole%salcedo%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_nicole_salcedo_ugpixs.webp'
    
    -- Smita Sen
    WHEN LOWER(name) LIKE '%smita%sen%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_smita_sen_z8fhhw.webp'
    
    -- Carmen Smith
    WHEN LOWER(name) LIKE '%carmen%smith%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336121/bakehouse_carmen_smith_mg0atk.webp'
    
    -- Moises Sanabria
    WHEN LOWER(name) LIKE '%moises%sanabria%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_moises_sanabria_juoaea.webp'
    
    -- Zoe Schweiger
    WHEN LOWER(name) LIKE '%zoe%schweiger%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_zoe_schweiger_gfi8mu.webp'
    
    -- Mateo Serna Zapata
    WHEN LOWER(name) LIKE '%mateo%serna%zapata%' OR LOWER(name) LIKE '%mateo serna%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mateo_serna_zapata_d4wdf7.webp'
    
    -- Mary Ellen Scherl
    WHEN LOWER(name) LIKE '%mary%ellen%scherl%' OR LOWER(name) LIKE '%mary scherl%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mary_ellen_scherl_tvacjq.webp'
    
    -- Lauren Shapiro
    WHEN LOWER(name) LIKE '%lauren%shapiro%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336119/bakehouse_lauren_shapiro_eukn5p.webp'
    
    -- Troy Simmons
    WHEN LOWER(name) LIKE '%troy%simmons%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_troy_simmons_rcutms.webp'
    
    -- Monica Sorelle
    WHEN LOWER(name) LIKE '%monica%sorelle%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_monica_sorelle_zv7fak.webp'
    
    -- Andrea Spiridonakos
    WHEN LOWER(name) LIKE '%andrea%spiridonakos%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_andrea_spiridonakos_krntmk.webp'
    
    -- Clara Toro
    WHEN LOWER(name) LIKE '%clara%toro%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_clara_toro_ypsysd.webp'
    
    -- Juana Valdes
    WHEN LOWER(name) LIKE '%juana%valdes%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_juana_valdes_jk7w0g.webp'
    
    -- Gerbi Tsesarskaia
    WHEN LOWER(name) LIKE '%gerbi%tsesarskaia%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_gerbi_tsesarskaia_wwr5gi.webp'
    
    -- Martina Tuaty
    WHEN LOWER(name) LIKE '%martina%tuaty%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_martina_tuaty_oqfbbn.webp'
    
    -- Cornelius Tulloch
    WHEN LOWER(name) LIKE '%cornelius%tulloch%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_cornelius_tulloch_sovoiw.webp'
    
    -- Tonya Vegas
    WHEN LOWER(name) LIKE '%tonya%vegas%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tonya_vegas_sjuziz.webp'
    
    -- Tom Virgin
    WHEN LOWER(name) LIKE '%tom%virgin%' OR LOWER(name) LIKE '%thomas virgin%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tom_virgin_mgxuav.webp'
    
    -- Pedro Wazzan
    WHEN LOWER(name) LIKE '%pedro%wazzan%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_pedro_wazzan_ocbjmv.webp'
    
    -- Avi Young
    WHEN LOWER(name) LIKE '%avi%young%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_avi_young_hbxj20.webp'
    
    -- Valeria Yamamoto
    WHEN LOWER(name) LIKE '%valeria%yamamoto%' THEN 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_valeria_yamamoto_lni2hp.webp'
    
    ELSE profile_image -- Keep existing image if no match
END,
updated_at = NOW()
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL;

-- Verify the updates
SELECT 
    name,
    profile_image,
    CASE 
        WHEN profile_image IS NOT NULL AND profile_image != '' THEN '✅ Has Image'
        ELSE '❌ No Image'
    END as image_status
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
ORDER BY name;

-- Count how many artists now have images
SELECT 
    COUNT(*) as total_artists,
    COUNT(profile_image) as artists_with_images,
    COUNT(*) - COUNT(profile_image) as artists_without_images
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL;
