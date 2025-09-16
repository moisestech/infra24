-- Optimized Artist Profile Images Upload Script
-- This script uses a more efficient approach with a temporary mapping table
-- to ensure accurate matching between artist names and their Cloudinary URLs

-- Create a temporary table with the image mappings
CREATE TEMP TABLE artist_image_mappings (
    name_pattern TEXT,
    image_url TEXT
);

-- Insert all the image mappings
INSERT INTO artist_image_mappings (name_pattern, image_url) VALUES
('daniel arturo almeida', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_daniel_arturo_almeida_associate_lyo5yu.webp'),
('susan alvarez', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336162/bakehouse_susan_alvarez_kft10t.webp'),
('alyssa andrews', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_alyssa_andrews_h17qcs.webp'),
('jason aponte', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_jason_aponte_cep6ox.webp'),
('javier barrera', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_javier_barrera_ql6cje.webp'),
('maria theresa barbist', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336160/bakehouse_maria_theresa_barbist_g8jgys.webp'),
('tom bils', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336158/bakehouse_tom_bils_pig6rv.webp'),
('leo castaneda', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_leo_castaneda_fl1pqm.webp'),
('bookleggers library', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_bookleggers_library_wnusmn.webp'),
('maritza caneca', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336157/bakehouse_maritza_caneca_palqm4.webp'),
('lujan candria', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336156/bakehouse_lujan_candria_nric1s.webp'),
('alain castoriano', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_alain_castoriano_qgucc2.webp'),
('beatriz chachamovits', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336155/bakehouse_beatriz_chachamovits_hxgr2m.webp'),
('robert chambers', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_chambers_kes7sr.webp'),
('robert colom', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336153/bakehouse_robert_colom_qnr8ht.webp'),
('nicole combeau', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336152/bakehouse_nicole_combeau_vknuin.webp'),
('christine cortes', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_christine_cortes_ecjs3v.webp'),
('morel doucet', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_morel_doucet_yjts5p.webp'),
('woosler delisfort', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336151/bakehouse_woosler_delisfort_crdfgv.webp'),
('agua dulce', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336150/bakehouse_agua_dulce_pmashi.webp'),
('jenna efrein', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336149/bakehouse_jenna_efrein_itobe9.webp'),
('augusto esquivel', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_augusto_esquivel_q6munu.webp'),
('diana espin', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336148/bakehouse_diana_espin_ajg2vr.webp'),
('diana eusebio', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336147/bakehouse_diana_eusebio_oxpysl.webp'),
('joel gaitan', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_joel_gaitan_yltdlo.webp'),
('ian fichman', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336146/bakehouse_ian_fichman_vxircr.webp'),
('gabriela gamboa', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336145/bakehouse_gabriela_gamboa_khnjun.webp'),
('gabriela garcia dalta', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_gabriela_garcia_dalta_iniaog.webp'),
('jose luis garcia', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336144/bakehouse_jose_luis_garcia_coj8og.webp'),
('juan pablo garza', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336143/bakehouse_juan_pablo_garza_cbd6ak.webp'),
('geovanna gonzalez', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_geovanna_gonzalez_jxkbpu.webp'),
('adler guerrier', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336142/bakehouse_adler_guerrier_manhbq.webp'),
('maria alejandra icaza paredes', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336141/bakehouse_maria_alejandra_icaza_paredes_iqbu68.webp'),
('maru jensen', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336140/bakehouse_maru_jensen_kpyjvh.webp'),
('judith berk king', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_judith_berk_king_wdlqlb.webp'),
('katelyn kopenhaver', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336139/bakehouse_katelyn_kopenhaver_azvclh.webp'),
('fabiola larios', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_fabiola_larios_zl2wjf.webp'),
('malcolm lauredo', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336138/bakehouse_malcolm_lauredo_bnn4jz.webp'),
('monique laazard', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336137/bakehouse_monique_lazard_pd0dfv.webp'),
('juan ledesma', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_juan_ledesma_n0sjax.webp'),
('rhea leonard', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336136/bakehouse_rhea_leonard_xr7a8d.webp'),
('amanda linares', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_amanda_linares_uofztm.webp'),
('philip lique', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336135/bakehouse_philip_lique_xrtekt.webp'),
('tara long', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336134/bakehouse_tara_long_z3ntsk.webp'),
('monica lopez de victoria', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_monica_lopez_de_victoria_wavnqs.webp'),
('xavier lujan', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336133/bakehouse_xavier_lujan_vhesdv.webp'),
('juan matos', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336132/bakehouse_juan_matos_hv1enm.webp'),
('jillian mayer', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_jillian_mayer_obkd5e.webp'),
('cici mcgonigle', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336131/bakehouse_cici_mcgonigle_kv6mxs.webp'),
('sean mick', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336130/bakehouse_sean_mick_yuutdl.webp'),
('pati monclus', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_pati_monclus_kxvc9j.webp'),
('lauren monzon', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336129/bakehouse_lauren_monzon_dr1cae.webp'),
('najja moon', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_najja_moon_x2muun.webp'),
('shawna moulton', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336128/bakehouse_shawna_moulton_l3vdd8.webp'),
('isabela muci', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336127/bakehouse_isabela_muci_flal63.webp'),
('cristina muller karger', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_cristina_muller_karger_fvsobl.webp'),
('bryan palmer', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336126/bakehouse_bryan_palmer_khhede.webp'),
('christina petterson', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_christina_petterson_zyf7ef.webp'),
('lee pivnik', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336125/bakehouse_lee_pivnik_fcj2p3.webp'),
('jennifer anderson printz', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_jennifer_anderson_printz_ixmxgl.webp'),
('sandra ramos', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336124/bakehouse_sandra_ramos_hyq9ot.webp'),
('sterling rook', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336123/bakehouse_sterling_rook_yc0z12.webp'),
('mark russell jr', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_mark_russell_jr_nrw11w.webp'),
('nicole salcedo', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_nicole_salcedo_ugpixs.webp'),
('smita sen', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336122/bakehouse_smita_sen_z8fhhw.webp'),
('carmen smith', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336121/bakehouse_carmen_smith_mg0atk.webp'),
('moises sanabria', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_moises_sanabria_juoaea.webp'),
('zoe schweiger', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_zoe_schweiger_gfi8mu.webp'),
('mateo serna zapata', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mateo_serna_zapata_d4wdf7.webp'),
('mary ellen scherl', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336120/bakehouse_mary_ellen_scherl_tvacjq.webp'),
('lauren shapiro', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336119/bakehouse_lauren_shapiro_eukn5p.webp'),
('troy simmons', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_troy_simmons_rcutms.webp'),
('monica sorelle', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_monica_sorelle_zv7fak.webp'),
('andrea spiridonakos', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336118/bakehouse_andrea_spiridonakos_krntmk.webp'),
('clara toro', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_clara_toro_ypsysd.webp'),
('juana valdes', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_juana_valdes_jk7w0g.webp'),
('gerbi tsesarskaia', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_gerbi_tsesarskaia_wwr5gi.webp'),
('martina tuaty', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336117/bakehouse_martina_tuaty_oqfbbn.webp'),
('cornelius tulloch', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336116/bakehouse_cornelius_tulloch_sovoiw.webp'),
('tonya vegas', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tonya_vegas_sjuziz.webp'),
('tom virgin', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_tom_virgin_mgxuav.webp'),
('pedro wazzan', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_pedro_wazzan_ocbjmv.webp'),
('avi young', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_avi_young_hbxj20.webp'),
('valeria yamamoto', 'https://res.cloudinary.com/du1ysiumj/image/upload/v1757336115/bakehouse_valeria_yamamoto_lni2hp.webp');

-- Show current artist profiles before update
SELECT 
    'BEFORE UPDATE' as status,
    COUNT(*) as total_artists,
    COUNT(profile_image) as artists_with_images,
    COUNT(*) - COUNT(profile_image) as artists_without_images
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL;

-- Update artist profiles with their images using the mapping table
UPDATE artist_profiles 
SET profile_image = (
    SELECT image_url 
    FROM artist_image_mappings 
    WHERE LOWER(artist_profiles.name) LIKE '%' || name_pattern || '%'
    LIMIT 1
),
updated_at = NOW()
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
  AND EXISTS (
    SELECT 1 
    FROM artist_image_mappings 
    WHERE LOWER(artist_profiles.name) LIKE '%' || name_pattern || '%'
  );

-- Show results after update
SELECT 
    'AFTER UPDATE' as status,
    COUNT(*) as total_artists,
    COUNT(profile_image) as artists_with_images,
    COUNT(*) - COUNT(profile_image) as artists_without_images
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL;

-- Show detailed results
SELECT 
    name,
    CASE 
        WHEN profile_image IS NOT NULL AND profile_image != '' THEN '✅ Has Image'
        ELSE '❌ No Image'
    END as image_status,
    CASE 
        WHEN profile_image IS NOT NULL AND profile_image != '' THEN 
            SUBSTRING(profile_image FROM 'bakehouse_([^_]+_[^_]+)')
        ELSE 'N/A'
    END as matched_pattern
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
ORDER BY 
    CASE WHEN profile_image IS NOT NULL AND profile_image != '' THEN 0 ELSE 1 END,
    name;

-- Show any artists that didn't get matched
SELECT 
    'UNMATCHED ARTISTS' as status,
    name,
    LOWER(name) as search_name
FROM artist_profiles 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'bakehouse')
  AND deleted_at IS NULL
  AND (profile_image IS NULL OR profile_image = '')
ORDER BY name;
