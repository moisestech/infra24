/**
 * Oolite announcements bulk upsert for 2026 (titles + Cloudinary assets).
 *
 * DATA_SEED_SAFETY: MUTATING
 * --------------------------
 * - Upserts by exact title: updates matching rows, inserts new titles.
 * - Sets is_active = false for hardcoded legacy titles (archiveTitles). Review
 *   that list before each run; it hides announcements app-wide for this org.
 * - Does NOT delete the announcements table or drop other months by default.
 *
 * Registry: scripts/DATA_SEED_REGISTRY.md
 *
 * Smart sign QR: use real https:// URLs in `primary_link` and/or `qr_destination_url` on each
 * row. Placeholder `#` means no scan target until updated in admin or here.
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Use defaults for local Supabase if env vars not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('⚠️  Using default local Supabase URL:', supabaseUrl);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️  Using default local Supabase service key');
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// January 2026 Cloudinary image URLs
const IMAGES = {
  ceoMessage: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968667/january-message-from-the-ceo_kntq1z.jpg',
  studioResidents: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968671/january-2026-studio-residents_hyxwic.png',
  youthResidents: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620757/feb-first-ever-youth-artist-residents-at-oolite-arts_jyydm1.jpg',
  ellies: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968673/january-ellies-2026_xtllmg.gif',
  artistTalk: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968658/january-artist-talk-when-one-becomes-two_geubnt.jpg',
  transitMemory: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968641/january-transit-memory_mjukod.png',
  alumniNews: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-alumni-news_hmvtub.jpg',
  alumniWhitneyBiennial: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968658/january-whitney-biennial-leo_uzkemy.jpg',
  cinematicNews: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968665/january-cinematic-arts.-sffilmjpg_abcr5j.jpg',
  media: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968665/january-oolite-in-media_lnlhta.png',
  winterClasses: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968658/january-winter-art-classes_cx1yse.jpg',
  miamiArtWeek: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968665/january-mia-art-week-moment-in-motion_mlh7cu.jpg',
  campusUpdate: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620759/feb-a-world-class-campus-1_p28ygx.jpg',
  // February 2026
  crossingTheBridge: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-crossing-the-bridge-oolite-arts-feb5th-to-nay24th_c1xxut.jpg',
  lieneBosque: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-liene-bosque-before-miami-design-preservation-league-iii_sngkrp.webp',
  amandaKeeley: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620765/feb-amanda-season-keeley-language-is-liquid-on-view-feb-11-may-3-2026-windows-walgreens_vgvi0t.jpg',
  studentShowcase: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620758/feb-oolite-arts-student-showcase-exhibition-opening-feb-25-2026_xkp5mu.jpg',
  welcome2026Residents: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-welcome-2026-resideents-oolite-arts_qixk3b.jpg',
  campusProgress2: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-a-world-class-campus-2_goz0an.jpg',
  campusProgress3: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620755/feb-a-world-class-campus-3_dabwcj.jpg',
  untitledArtPodcast: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1771620756/feb-untitled-art-podcast_mqk5h0.jpg',
  // March 2026
  crossingBridgeRecap: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427571/march-oolite-crossing-the-bridge-opening-reception-recap_jrlatf.jpg',
  weeklyCuratorialTours: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427565/march-oolite-coming-up-weekly-curatorial-tours_czlqgk.jpg',
  alumniGrantDanWeitendorf: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1773427559/march-oolite-alumni-grant-winner-honoring-dan-weitendorf_nkrvom.jpg',
  // April/May 2026
  ellies2026April: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570009/april-Oolite-Arts-Conversations_fo6v2s.jpg',
  weeklyCuratorialToursApril: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570010/april-Weekly-Curatorial-Tours-led-by-co-curator-Lauryn-Lawrence_zzv9qs.jpg',
  assemblageWorkshop: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570008/april-Assemblage-Building-Workshop-with-Alumni-Kerry-Phillips_wpmk5b.jpg',
  crossingBridgePanel: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570010/april-Panel-Discussion-with-Edouard-Duval-Carrie-and-Yanira-Collado_nqgz7e.png',
  ooliteConversations: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570009/april-Oolite-Arts-Conversations_fo6v2s.jpg',
  skillsIpAi: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570010/april-Skills-Intellectual-Property-in-the-Age-of-Al_cayr7v.png',
  skillsSpeakingArtWorld: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570383/april-GrahamBell_grahamwbell_laura-3-2048x1367_lkozgp.jpg',
  skillsPathToPublicArt: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570010/april-kills-Speaking-Art-World-Engaging-Curators-Gallerists-and-other-Gatekeepers_mhcaep.png',
  vibeCodingNetArt: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775603504/oolite-april-vibe-code-and-net-art_pqjut1.webp',
  dualCitizenPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775568901/Dual_Citizen_1920x1080_nvgqmh.png',
  floorRemembersPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775568901/The_Floor_Remembers_1920x1080_cfavha.png',
  oldManParrotPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775568900/Old_Man_and_the_Parrot_1920x1080_jhbvpr.png',
  tropicalParkPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775568900/Tropical_Park_1920x1080_cekrpp.png',
  coladaPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1775568900/Colada_1920x1080_sooqns.png'
};

// Helper function for avatar placeholders
function placeholderImage(width = 150, height = 150, text = '') {
  const encodedText = encodeURIComponent(text || 'Oolite Arts');
  return `https://placehold.co/${width}x${height}/47abc4/ffffff?text=${encodedText}`;
}

async function updateOoliteAnnouncements() {
  try {
    console.log('🎯 Updating Oolite Arts announcements for 2026...');

    // First, get the oolite organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'oolite')
      .single();

    if (orgError || !organization) {
      console.error('❌ Organization not found:', orgError);
      return;
    }

    console.log('✅ Found organization:', organization.name);

    const now = new Date();
    
    // Parse dates from content
    const jan10_2026 = new Date('2026-01-10T00:00:00');
    const jan31_2026 = new Date('2026-01-31T23:59:59');
    const feb11_2026 = new Date('2026-02-11T00:00:00');
    const feb22_2026 = new Date('2026-02-22T23:59:59');
    const feb25_2026 = new Date('2026-02-25T18:00:00');
    const mar8_2026 = new Date('2026-03-08T00:00:00');
    const mar22_2026 = new Date('2026-03-22T23:59:59');
    const may3_2026 = new Date('2026-05-03T23:59:59');
    const may24_2026 = new Date('2026-05-24T23:59:59');
    const apr22_2026 = new Date('2026-04-22T00:00:00');
    const dec31_2025 = new Date('2025-12-31T00:00:00');

    const apr6_2026 = new Date('2026-04-06T18:00:00');
    const apr9_2026 = new Date('2026-04-09T18:00:00');
    const apr13_2026 = new Date('2026-04-13T18:00:00');
    const apr14_2026 = new Date('2026-04-14T18:00:00');
    const apr20_2026 = new Date('2026-04-20T18:00:00');
    const apr22_2026_7pm = new Date('2026-04-22T19:00:00');
    const apr25_2026 = new Date('2026-04-25T14:00:00');
    const apr27_2026 = new Date('2026-04-27T18:00:00');
    const apr29_2026 = new Date('2026-04-29T18:00:00');
    /** Month anchor for image-only film posters (month filter + April preset) */
    const apr15_2026 = new Date('2026-04-15T12:00:00');
    const may21_2026 = new Date('2026-05-21T18:00:00');

    // Create announcements from the provided content
    const announcements = [
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'A Message from CEO John Abodeely',
        body: 'A new year and new possibilities. CEO John Abodeely shares what\'s next at Oolite Arts!',
        status: 'published',
        priority: 'high',
        tags: ['ceo', 'leadership', 'news', '2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.ceoMessage,
        image_layout: 'card',
        primary_link: '#', // Will be updated with actual audio link
        people: [
          {
            name: 'John Abodeely',
            role: 'CEO',
            avatar_url: placeholderImage(150, 150, 'JA')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: '2026 Studio Residents',
        body: 'Welcome to 2026! We\'re excited to support this new cohort of artists with time, space, and resources at our Miami Beach studios as they experiment, connect, and develop bold new work within a vibrant creative community. We kicked off the year with an orientation to welcome our residents.\n\nTop right, Diego Gabaldon; first row (left-to-right) Gonzalo Hernandez, Sepideh Kalani, and Shayla Marshall; second Row (l-to-r) Bex McCharen, Lucia Morales, and Genesis Moreno; third row (l-to-r) Ana Mosquera, Sheherazade Thenard, and Pangea Kali Virga; fourth row (l-to-r) Nadia Wolff, Ricardo E. Zulueta, and José Delgado Zúñiga',
        status: 'published',
        priority: 'high',
        tags: ['residents', 'studio-residency', '2026', 'artists'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.welcome2026Residents,
        image_layout: 'card',
        people: [
          { name: 'Diego Gabaldon', role: 'resident', avatar_url: placeholderImage(150, 150, 'DG') },
          { name: 'Gonzalo Hernandez', role: 'resident', avatar_url: placeholderImage(150, 150, 'GH') },
          { name: 'Sepideh Kalani', role: 'resident', avatar_url: placeholderImage(150, 150, 'SK') },
          { name: 'Shayla Marshall', role: 'resident', avatar_url: placeholderImage(150, 150, 'SM') },
          { name: 'Bex McCharen', role: 'resident', avatar_url: placeholderImage(150, 150, 'BM') },
          { name: 'Lucia Morales', role: 'resident', avatar_url: placeholderImage(150, 150, 'LM') },
          { name: 'Genesis Moreno', role: 'resident', avatar_url: placeholderImage(150, 150, 'GM') },
          { name: 'Ana Mosquera', role: 'resident', avatar_url: placeholderImage(150, 150, 'AM') },
          { name: 'Sheherazade Thenard', role: 'resident', avatar_url: placeholderImage(150, 150, 'ST') },
          { name: 'Pangea Kali Virga', role: 'resident', avatar_url: placeholderImage(150, 150, 'PKV') },
          { name: 'Nadia Wolff', role: 'resident', avatar_url: placeholderImage(150, 150, 'NW') },
          { name: 'Ricardo E. Zulueta', role: 'resident', avatar_url: placeholderImage(150, 150, 'REZ') },
          { name: 'José Delgado Zúñiga', role: 'resident', avatar_url: placeholderImage(150, 150, 'JDZ') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Youth Residents',
        body: 'We are excited to welcome five emerging young artists to the Oolite Arts community as they begin the inaugural Youth Residency this January.\n\nUnder the mentorship of Oolite Arts Resident Gonzalo Hernandez, these artists will develop their studio practice, gain hands-on experience, and build the creative foundation that will shape their future careers. This groundbreaking new program is designed to elevate their work, strengthen their voices, and position them as the next generation of Miami\'s artistic talent.',
        status: 'published',
        priority: 'high',
        tags: ['youth-residency', 'education', 'mentorship', '2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: IMAGES.youthResidents,
        image_layout: 'card',
        people: [
          { name: 'Ana Blanco', role: 'youth-resident', avatar_url: placeholderImage(150, 150, 'AB') },
          { name: 'Noa Garcia', role: 'youth-resident', avatar_url: placeholderImage(150, 150, 'NG') },
          { name: 'Melina Walsh', role: 'youth-resident', avatar_url: placeholderImage(150, 150, 'MW') },
          { name: 'TJ Wright', role: 'youth-resident', avatar_url: placeholderImage(150, 150, 'TJ') },
          { name: 'Emely Yanji', role: 'youth-resident', avatar_url: placeholderImage(150, 150, 'EY') },
          { name: 'Gonzalo Hernandez', role: 'mentor', avatar_url: placeholderImage(150, 150, 'GH') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Artist Talk: When One Becomes Two: Creating a Scene, Then and Now',
        body: 'Moderated by curator Gean Moreno, this panel brings together artists across generations to reflect on Miami\'s cultural ecosystem with a focus on the cinematic culture that emerged in the early 1990s and continues to affect Miami\'s current scene. Moreno, along with Barron Sherer, Jillian Mayer; and william cordova will examine the role of shared resources and effort amongst the artistic community.\n\nTake part in an informative conversation examining Oolite Arts\' past and present impact on artists and creative communities.',
        status: 'published',
        priority: 'normal',
        tags: ['artist-talk', 'panel', 'event', 'miami-scene'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        image_url: IMAGES.artistTalk,
        image_layout: 'card',
        rsvp_label: 'RSVP',
        rsvp_url: '#', // Will be updated with actual RSVP link
        people: [
          { name: 'Gean Moreno', role: 'moderator', avatar_url: placeholderImage(150, 150, 'GM') },
          { name: 'Barron Sherer', role: 'artist', avatar_url: placeholderImage(150, 150, 'BS') },
          { name: 'Jillian Mayer', role: 'artist', avatar_url: placeholderImage(150, 150, 'JM') },
          { name: 'william cordova', role: 'artist', avatar_url: placeholderImage(150, 150, 'WC') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: '"Transit Memory" Exhibition',
        body: 'Baker—Hall is pleased to partner with Oolite Arts on an exhibition entitled "Transit Memory" featuring a selection of artists from Oolite Arts 2025 Studio and Live.In.Art Residencies. "Transit Memory" brings together four artists: Sepideh Kalani, Diana Larrea, Ana Mosquera, and Zonia Zena.\n\n"Transit Memory" considers how identity is constructed, negotiated, and reassembled across shifting cultural, political, and geographic terrains. Each artist examines systems that shape selfhood, bureaucracy, migration, censorship, and inherited traditions revealing how belonging and autonomy persist under conditions of displacement and uncertainty.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'partnership', 'residents', 'baker-hall'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: jan10_2026.toISOString(),
        ends_at: feb22_2026.toISOString(),
        location: 'Baker—Hall Gallery, 1294 NW 29th St., Miami, FL 33142',
        image_url: IMAGES.transitMemory,
        image_layout: 'card',
        people: [
          { name: 'Sepideh Kalani', role: 'artist', avatar_url: placeholderImage(150, 150, 'SK') },
          { name: 'Diana Larrea', role: 'artist', avatar_url: placeholderImage(150, 150, 'DL') },
          { name: 'Ana Mosquera', role: 'artist', avatar_url: placeholderImage(150, 150, 'AM') },
          { name: 'Zonia Zena', role: 'artist', avatar_url: placeholderImage(150, 150, 'ZZ') }
        ],
        external_orgs: [
          { name: 'Baker—Hall', logo_url: placeholderImage(100, 100, 'BH') }
        ],
        additional_info: 'The exhibition is on view Jan. 10 - Feb. 22, 2026 at the Baker—Hall Gallery, 1294 NW 29th St., Miami, FL 33142',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni News: Leo Castañeda Selected for Whitney Biennial 2026',
        body: 'The Whitney Museum of American Art has announced the artists for the Whitney Biennial 2026, and we are beyond proud to share that an Oolite Arts alumni Leo Castañeda has been selected. Opening March 8, 2026, the Biennial will highlight 56 visionary artists, duos, and collectives who are shaping the future of American art. Now in its 82nd edition, it remains the country\'s longest running and most influential survey of contemporary art.',
        status: 'published',
        priority: 'high',
        tags: ['alumni', 'whitney-biennial', 'news', 'achievement'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        starts_at: mar8_2026.toISOString(),
        image_url: IMAGES.alumniWhitneyBiennial,
        image_layout: 'card',
        people: [
          { name: 'Leo Castañeda', role: 'alumni', avatar_url: placeholderImage(150, 150, 'LC') }
        ],
        external_orgs: [
          { name: 'Whitney Museum of American Art', logo_url: placeholderImage(100, 100, 'WMAA') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Cinematic News: SFFILM Grants Awarded',
        body: 'San Francisco International Film Festival has announced the recipients of several of its Artist Development grants, which provide significant support to narrative and documentary filmmakers, and we\'re proud to share that filmmakers connected to Oolite Arts are among those selected.\n\nOne of this year\'s Rainin Grant recipients is current Cinematic Resident Juan Luis Matos, along with collaborators and Oolite Arts alumni Monica Sorelle (Cinematic Residency) and Robert Colom (Ellies 2024). Their project, Three Islands, is being developed as part of Juan Luis\'s residency at Oolite Arts. In addition, Cinematic Residency alumnus Al\'Ikens Plancher, who previously participated in our 2019 Family Commissions, presented in partnership with the Miami Film Festival, was also awarded a Rainin Grant for his project Boat People. We also want to acknowledge Jason Fitzroy Jeffers, a longtime friend of Oolite Arts and one of the early initiators of our Cinematic Residency program, who was also awarded the SFFILM Documentary Film Fund for his project The First Plantation.\n\nThe SFFILM Rainin Grant is the largest funding program in the United States dedicated to independent narrative feature films. The grant supports projects that thoughtfully and meaningfully addresses themes of social justice, including the distribution of wealth, access to opportunity, and representation, whether through plot, character, theme, or setting.',
        status: 'published',
        priority: 'normal',
        tags: ['cinematic', 'grants', 'film-festival', 'alumni', 'news'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.cinematicNews,
        image_layout: 'card',
        people: [
          { name: 'Juan Luis Matos', role: 'cinematic-resident', avatar_url: placeholderImage(150, 150, 'JLM') },
          { name: 'Monica Sorelle', role: 'alumni', avatar_url: placeholderImage(150, 150, 'MS') },
          { name: 'Robert Colom', role: 'alumni', avatar_url: placeholderImage(150, 150, 'RC') },
          { name: 'Al\'Ikens Plancher', role: 'alumni', avatar_url: placeholderImage(150, 150, 'AP') },
          { name: 'Jason Fitzroy Jeffers', role: 'friend', avatar_url: placeholderImage(150, 150, 'JFJ') }
        ],
        external_orgs: [
          { name: 'San Francisco International Film Festival', logo_url: placeholderImage(100, 100, 'SFFILM') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Oolite Arts in the Media',
        body: 'Oolite Arts President & CEO John Abodeely was recently highlighted in Miami Today for his leadership and vision as the organization prepares for its future Little River Campus.\n\nThe article explores how Oolite Arts, after four decades of supporting artists, continues to evolve with a strong focus on community impact, artist sustainability, and long-term growth. Under Abodeely\'s leadership, the upcoming campus represents a major step forward in expanding access to creative resources.\n\nThis next chapter underscores Oolite Arts\' commitment to placing artists at the center of community development and ensuring Miami remains a thriving hub for creativity. Read the full article in Miami Today.',
        status: 'published',
        priority: 'normal',
        tags: ['media', 'ceo', 'leadership', 'campus', 'news'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.media,
        image_layout: 'card',
        primary_link: '#', // Will be updated with actual article link
        people: [
          { name: 'John Abodeely', role: 'CEO', avatar_url: placeholderImage(150, 150, 'JA') }
        ],
        external_orgs: [
          { name: 'Miami Today', logo_url: placeholderImage(100, 100, 'MT') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Winter Art Classes: Abstract Painting: Sonic Gesture',
        body: 'Zuñiga, one of Oolite Arts\' new studio residents, will lead this four-week course that will provide a focused exploration of key movements and concepts in oil and acrylic painting. This course will delve into color field painting and abstract expressionism, and will consider their historical context and formal qualities.\n\nThrough lectures, discussions, studio projects, and critiques, students will develop their painting skills and conceptual understanding within these areas.',
        status: 'published',
        priority: 'normal',
        tags: ['classes', 'education', 'workshop', 'abstract-painting'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: jan10_2026.toISOString(),
        ends_at: jan31_2026.toISOString(),
        location: 'Oolite Arts',
        image_url: IMAGES.winterClasses,
        image_layout: 'card',
        primary_link: '#', // Will be updated with registration link
        additional_info: 'Four-Week Course\nJan. 10-31, 2026\n10 a.m.-1 p.m.',
        people: [
          { name: 'José Delgado Zúñiga', role: 'instructor', avatar_url: placeholderImage(150, 150, 'JDZ') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Miami Art Week 2025: A Moment in Motion',
        body: 'Miami Art Week 2025 was a powerful close to Oolite Arts\' 40th anniversary year. As we begin the new year, we\'re revisiting the moments, energy and community that made it unforgettable.',
        status: 'published',
        priority: 'normal',
        tags: ['miami-art-week', '40th-anniversary', 'retrospective', '2025'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.miamiArtWeek,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'New Campus Update',
        body: 'Progress Continues on Our Future Campus\n\nWe\'ve reached another key milestone: the third set of revised construction documents is in, and our design team is working closely with consultants to finalize updates for permitting. As coordination wraps up, we\'re preparing to resubmit for permits and begin the contractor bidding process.\n\nThank you for helping us bring this vision to life! Each step brings us closer to opening our doors in Little River. We are planning a groundbreaking in 2026!\n\nDesigned by world-renowned architects Fabrizio Barozzi and Alberto Veiga, the campus will double Oolite Arts\' studio space and position us as a global center for creative excellence. For more information on the new campus and opportunities for philanthropic investment, please contact Megan Braasch, Chief Development Officer, at mbraasch@oolitearts.org.',
        status: 'published',
        priority: 'high',
        tags: ['campus', 'expansion', 'little-river', 'future', '2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.campusUpdate,
        image_layout: 'card',
        people: [
          { name: 'Fabrizio Barozzi', role: 'architect', avatar_url: placeholderImage(150, 150, 'FB') },
          { name: 'Alberto Veiga', role: 'architect', avatar_url: placeholderImage(150, 150, 'AV') },
          { name: 'Megan Braasch', role: 'Chief Development Officer', avatar_url: placeholderImage(150, 150, 'MB') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge Alumni Exhibition',
        body: 'Crossing the Bridge, curated by Claire Breukel and Lauryn Lawrence, investigates the concept of alumni within an arts institution and the impact of institutional context on an artist\'s career trajectory and legacy. The exhibition examines how each artist\'s time as an Oolite Arts alumnus shaped future professional and community encounters, while expanding the idea of alumni as a fluid condition rooted in belonging, shared experience, and evolving identity.\n\nThe exhibition places artistic practice at the center of the alumni concept, featuring works by Edouard Duval-Carrié, Kerry Phillips, Najja Moon, Susan Lee-Chun, and Yanira Collado. Opening night also marks a significant moment as we celebrate the 24-year trajectory of Facilities Manager Dan Weitendorf.\n\nOpening reception, Wednesday, Feb. 25, 6–9 p.m., on view through May 24. Curated by Claire Breukel and Lauryn Lawrence.\n\nCome for the exhibitions. Stay for the conversation. Leave inspired.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'alumni', 'curated', '2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb25_2026.toISOString(),
        ends_at: may24_2026.toISOString(),
        location: 'Oolite Arts, Miami Beach',
        image_url: IMAGES.crossingTheBridge,
        image_layout: 'card',
        rsvp_label: 'RSVP',
        rsvp_url: '#', // Will be updated with actual RSVP link
        people: [
          { name: 'Claire Breukel', role: 'curator', avatar_url: placeholderImage(150, 150, 'CB') },
          { name: 'Lauryn Lawrence', role: 'curator', avatar_url: placeholderImage(150, 150, 'LL') },
          { name: 'Edouard Duval-Carrié', role: 'artist', avatar_url: placeholderImage(150, 150, 'EDC') },
          { name: 'Kerry Phillips', role: 'artist', avatar_url: placeholderImage(150, 150, 'KP') },
          { name: 'Najja Moon', role: 'artist', avatar_url: placeholderImage(150, 150, 'NM') },
          { name: 'Susan Lee-Chun', role: 'artist', avatar_url: placeholderImage(150, 150, 'SLC') },
          { name: 'Yanira Collado', role: 'artist', avatar_url: placeholderImage(150, 150, 'YC') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Liene Bosquê: Before Miami Design Preservation League III',
        body: 'Windows @ Walgreens exhibition featuring Liene Bosquê.\n\nON VIEW FEB. 11–MAY 3, 2026\n67th Street and Collins Ave.',
        status: 'published',
        priority: 'normal',
        tags: ['exhibition', 'windows-walgreens', '2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb11_2026.toISOString(),
        ends_at: may3_2026.toISOString(),
        location: 'Windows @ Walgreens, 67th Street and Collins Ave.',
        image_url: IMAGES.lieneBosque,
        image_layout: 'card',
        people: [
          { name: 'Liene Bosquê', role: 'artist', avatar_url: placeholderImage(150, 150, 'LB') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Amanda Season Keeley: Language is liquid',
        body: 'Windows @ Walgreens exhibition featuring Amanda Season Keeley.\n\nON VIEW FEB. 11–MAY 3, 2026\n74th Street and Collins Ave.',
        status: 'published',
        priority: 'normal',
        tags: ['exhibition', 'windows-walgreens', '2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb11_2026.toISOString(),
        ends_at: may3_2026.toISOString(),
        location: 'Windows @ Walgreens, 74th Street and Collins Ave.',
        image_url: IMAGES.amandaKeeley,
        image_layout: 'card',
        people: [
          { name: 'Amanda Season Keeley', role: 'artist', avatar_url: placeholderImage(150, 150, 'ASK') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Oolite Arts Student Showcase',
        body: 'A vitrine exhibition highlighting exceptional work by Oolite Arts adult students, celebrating artistic growth, experimentation, and creative discovery.\n\nON VIEW FEB. 25–MARCH 22, 2026\n924 Lincoln Rd., Miami Beach',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'student-showcase', '2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: feb25_2026.toISOString(),
        ends_at: mar22_2026.toISOString(),
        location: '924 Lincoln Rd., Miami Beach',
        image_url: IMAGES.studentShowcase,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni, register to win 1K',
        body: 'Are you an Oolite Alumni? Fill out the form for a chance to win $1,000 for art supplies. Drawings take place three times a year during exhibition openings, and the next selection will be made on February 25, 2026 during the Crossing the Bridge exhibition opening.',
        status: 'published',
        priority: 'high',
        tags: ['alumni', 'giveaway', '2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        starts_at: feb25_2026.toISOString(),
        image_url: IMAGES.alumniNews,
        image_layout: 'card',
        primary_link: '#', // Will be updated with registration form link
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge: Opening Reception Recap',
        body: 'A recap of the Crossing the Bridge alumni exhibition opening reception. The exhibition, curated by Claire Breukel and Lauryn Lawrence, celebrates Oolite Arts alumni and the impact of institutional context on artists\' careers.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'alumni', 'recap', 'march-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.crossingBridgeRecap,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Coming Up: Weekly Curatorial Tours',
        body: 'Join us for weekly curatorial tours at Oolite Arts. Explore current exhibitions and connect with the work of our residents and alumni.',
        status: 'published',
        priority: 'normal',
        tags: ['tours', 'curatorial', 'events', 'march-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: IMAGES.weeklyCuratorialTours,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni Grant Winner: Honoring Dan Weitendorf',
        body: 'Celebrating the Alumni Grant winner and honoring Dan Weitendorf for his 24-year trajectory as Facilities Manager at Oolite Arts. The alumni grant supports artists connected to our community.',
        status: 'published',
        priority: 'high',
        tags: ['alumni', 'grant', 'dan-weitendorf', 'march-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.alumniGrantDanWeitendorf,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Museums and Cultural Organizations: Innovation and Adaptability',
        body: 'As museums and cultural organizations evolve to meet the demands of a changing world, this discussion explores how innovation and adaptability are reshaping the institutional landscape. Panelists consider how art spaces are engaging new audiences, leveraging technology, and redefining their civic roles to remain relevant and impactful.\n\nThis conversation features John Abodeely (CEO, Oolite Arts), Kate Fleming (Founder & Executive Director, Bridge Initiative), Amy Galpin (Executive Director & Chief Curator, Museum of Art and Design at Miami Dade College), moderated by Lorie Mertes (Executive Director, Locust Projects).',
        status: 'published',
        priority: 'normal',
        tags: ['panel', 'discussion', 'innovation', '2025'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        starts_at: dec31_2025.toISOString(),
        image_url: IMAGES.untitledArtPodcast,
        image_layout: 'card',
        people: [
          { name: 'John Abodeely', role: 'panelist', avatar_url: placeholderImage(150, 150, 'JA') },
          { name: 'Kate Fleming', role: 'panelist', avatar_url: placeholderImage(150, 150, 'KF') },
          { name: 'Amy Galpin', role: 'panelist', avatar_url: placeholderImage(150, 150, 'AG') },
          { name: 'Lorie Mertes', role: 'moderator', avatar_url: placeholderImage(150, 150, 'LM') }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'The Ellies 2026: Tickets Available',
        body: 'On Wednesday, April 22, 2026, Oolite Arts proudly presents The Ellies, Oolite Arts Awards: Celebrating the Foundation for What’s Next. Tickets are now available. Secure your seat at an Artist Host Committee table and join us for this special evening in support of artists living and working across South Florida. Artist Host Committee members will also be featured in the inaugural Ellies 2026 Oolite Arts Auction. Artists lead. Community gathers. The future gets built, together.',
        status: 'published',
        priority: 'high',
        tags: ['ellies', 'awards', 'tickets', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'gala_announcement',
        starts_at: apr22_2026_7pm.toISOString(),
        location: 'Oolite Arts',
        image_url: IMAGES.ellies2026April,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Weekly Curatorial Tours (April 2026)',
        body: 'Weekly Curatorial Tours led by co-curator Lauryn Lawrence. Upcoming dates: April 6, April 13, April 20, April 27.',
        status: 'published',
        priority: 'normal',
        tags: ['tours', 'curatorial', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        starts_at: apr6_2026.toISOString(),
        ends_at: apr27_2026.toISOString(),
        image_url: IMAGES.weeklyCuratorialToursApril,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Artist Activation: Assemblage Building Workshop',
        body: 'Artist Activations: Assemblage Building Workshop with Alumni Kerry Phillips. Thursday, April 9, 2026, 6–9 p.m.',
        status: 'published',
        priority: 'normal',
        tags: ['artist-activations', 'workshop', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: apr9_2026.toISOString(),
        image_url: IMAGES.assemblageWorkshop,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Crossing the Bridge Panel Discussion',
        body: 'Panel Discussion with Edouard Duval-Carrié and Yanira Collado. Moderated by Lauryn Lawrence. Wednesday, April 29, 2026, 6–8 p.m.',
        status: 'published',
        priority: 'normal',
        tags: ['panel', 'crossing-the-bridge', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        starts_at: apr29_2026.toISOString(),
        image_url: IMAGES.crossingBridgePanel,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Introducing Oolite Arts Conversations',
        body: 'Introducing Oolite Arts Conversations — a new public series bringing leading artists, curators, and cultural thinkers into dialogue around today’s most pressing ideas in contemporary art. Designed as a space for exchange rather than lecture, the series connects global perspectives with Miami’s evolving cultural landscape.',
        status: 'published',
        priority: 'normal',
        tags: ['conversations', 'public-series', 'april-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.ooliteConversations,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Skills: Intellectual Property in the Age of AI',
        body: 'Skills Programming Returns: Sustaining and Propelling Careers. Skills: Intellectual Property in the Age of AI. Tuesday, April 14, 2026, 6–8 p.m.',
        status: 'published',
        priority: 'normal',
        tags: ['skills', 'ip', 'ai', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: apr14_2026.toISOString(),
        image_url: IMAGES.skillsIpAi,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Skills: Speaking Art World',
        body: 'Skills: Speaking Art World — Engaging Curators, Gallerists, and other gatekeepers. Monday, April 27, 2026, 6–8 p.m.',
        status: 'published',
        priority: 'normal',
        tags: ['skills', 'professional-development', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: apr27_2026.toISOString(),
        image_url: IMAGES.skillsSpeakingArtWorld,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Skills: The Path to Public Art',
        body: 'Skills Programming Returns: Sustaining and Propelling Careers. Skills: The Path to Public Art. Thursday, May 21, 2026, 6–8 p.m.',
        status: 'published',
        priority: 'normal',
        tags: ['skills', 'public-art', 'may-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: may21_2026.toISOString(),
        image_url: IMAGES.skillsPathToPublicArt,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni News: Beatriz Monteavaro at Under the Bridge Art Space',
        body: 'Beatriz Monteavaro (Studio Resident 2000) presents Tonight, We Can Be As One Tonight, March 15–April 26 at Under the Bridge Art Space in North Miami.',
        status: 'published',
        priority: 'normal',
        tags: ['alumni', 'exhibition', 'april-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        starts_at: mar8_2026.toISOString(),
        ends_at: may3_2026.toISOString(),
        image_url: IMAGES.alumniNews,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni News: Lucia Morales at Frost Art Museum',
        body: 'Lucia Morales (2026 Studio Resident) is featured in The Academy, March 18–April 19 at the Patricia and Phillip Frost Art Museum at FIU in Miami.',
        status: 'published',
        priority: 'normal',
        tags: ['alumni', 'frost-museum', 'april-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        starts_at: mar8_2026.toISOString(),
        ends_at: may3_2026.toISOString(),
        image_url: IMAGES.alumniNews,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Alumni News: Sue Beyer at Flohaus Gallery',
        body: 'Sue Beyer (2025 Live.In.Art Resident) is featured in Intimate Structures, March 19–April 5 at Flohaus Gallery in New York.',
        status: 'published',
        priority: 'normal',
        tags: ['alumni', 'flohaus', 'april-2026'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        starts_at: mar8_2026.toISOString(),
        ends_at: may3_2026.toISOString(),
        image_url: IMAGES.alumniNews,
        image_layout: 'card',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Vibe Coding & Net Art: Code Art into HTML',
        body: 'In-person workshop: Vibe Coding & Net Art: Code Art into HTML. Saturday, April 25, 2026, 2–5 p.m. A beginner-friendly Digital Lab workshop exploring net art and building a simple website.',
        status: 'published',
        priority: 'high',
        tags: ['digital-lab', 'workshop', 'net-art', 'april-2026'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: apr25_2026.toISOString(),
        location: 'Oolite Arts, 924 Lincoln Rd., Studio 100, Miami, FL 33139',
        image_url: IMAGES.vibeCodingNetArt,
        image_layout: 'card',
        primary_link: 'https://oolitearts.org/event/vibe-coding-net-art-code-art-into-html-workshop/',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Dual Citizen',
        body: 'Image-only announcement.',
        status: 'published',
        priority: 'normal',
        tags: ['film', 'poster', 'image-only', 'april-2026'],
        visibility: 'public',
        type: 'cinematic',
        sub_type: 'general',
        starts_at: apr15_2026.toISOString(),
        image_url: IMAGES.dualCitizenPoster,
        image_layout: 'card',
        metadata: { image_only: true },
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'The Floor Remembers',
        body: 'Image-only announcement.',
        status: 'published',
        priority: 'normal',
        tags: ['film', 'poster', 'image-only', 'april-2026'],
        visibility: 'public',
        type: 'cinematic',
        sub_type: 'general',
        starts_at: apr15_2026.toISOString(),
        image_url: IMAGES.floorRemembersPoster,
        image_layout: 'card',
        metadata: { image_only: true },
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Old Man and the Parrot',
        body: 'Image-only announcement.',
        status: 'published',
        priority: 'normal',
        tags: ['film', 'poster', 'image-only', 'april-2026'],
        visibility: 'public',
        type: 'cinematic',
        sub_type: 'general',
        starts_at: apr15_2026.toISOString(),
        image_url: IMAGES.oldManParrotPoster,
        image_layout: 'card',
        metadata: { image_only: true },
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Tropical Park',
        body: 'Image-only announcement.',
        status: 'published',
        priority: 'normal',
        tags: ['film', 'poster', 'image-only', 'april-2026'],
        visibility: 'public',
        type: 'cinematic',
        sub_type: 'general',
        starts_at: apr15_2026.toISOString(),
        image_url: IMAGES.tropicalParkPoster,
        image_layout: 'card',
        metadata: { image_only: true },
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Colada',
        body: 'Image-only announcement.',
        status: 'published',
        priority: 'normal',
        tags: ['film', 'poster', 'image-only', 'april-2026'],
        visibility: 'public',
        type: 'cinematic',
        sub_type: 'general',
        starts_at: apr15_2026.toISOString(),
        image_url: IMAGES.coladaPoster,
        image_layout: 'card',
        metadata: { image_only: true },
        published_at: now.toISOString()
      }
    ];

    // Add required fields to all announcements
    const announcementsWithRequiredFields = announcements.map(announcement => ({
      ...announcement,
      organization_id: announcement.organization_id || organization.id,
      org_id: announcement.org_id || organization.id,
      created_by: announcement.created_by || 'system_oolite',
      updated_by: announcement.updated_by || 'system_oolite',
      is_active: true,
    }));

    const missingImage = announcementsWithRequiredFields.filter(
      (announcement) => !announcement.image_url || !String(announcement.image_url).trim()
    );
    if (missingImage.length > 0) {
      console.error('❌ Missing image_url for announcements:', missingImage.map((a) => a.title));
      throw new Error('Aborting: one or more announcements are missing image_url');
    }

    // First, let's check if any of these announcements already exist (by title)
    // We'll update existing ones and create new ones
    console.log('\n📋 Checking for existing announcements...');
    
    const existingTitles = announcements.map(a => a.title);
    const { data: existingAnnouncements } = await supabase
      .from('announcements')
      .select('id, title')
      .eq('org_id', organization.id)
      .in('title', existingTitles);

    const existingTitleMap = new Map();
    if (existingAnnouncements) {
      existingAnnouncements.forEach(ann => {
        existingTitleMap.set(ann.title, ann.id);
      });
    }

    console.log(`Found ${existingTitleMap.size} existing announcements to update`);

    // Separate into updates and inserts
    const toUpdate = [];
    const toInsert = [];

    announcementsWithRequiredFields.forEach(announcement => {
      const existingId = existingTitleMap.get(announcement.title);
      if (existingId) {
        toUpdate.push({ id: existingId, ...announcement });
      } else {
        toInsert.push(announcement);
      }
    });

    // Update existing announcements
    if (toUpdate.length > 0) {
      console.log(`\n🔄 Updating ${toUpdate.length} existing announcements...`);
      for (const announcement of toUpdate) {
        const { id, ...updateData } = announcement;
        const { error: updateError } = await supabase
          .from('announcements')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          console.error(`❌ Error updating "${announcement.title}":`, updateError);
        } else {
          console.log(`✅ Updated: ${announcement.title}`);
        }
      }
    }

    // Insert new announcements
    if (toInsert.length > 0) {
      console.log(`\n➕ Creating ${toInsert.length} new announcements...`);
      const { data: createdAnnouncements, error: insertError } = await supabase
        .from('announcements')
        .insert(toInsert)
        .select();

      if (insertError) {
        console.error('❌ Error creating announcements:', insertError);
      } else if (createdAnnouncements) {
        console.log(`✅ Created ${createdAnnouncements.length} new announcements:`);
        createdAnnouncements.forEach((announcement, index) => {
          console.log(`   ${index + 1}. ${announcement.title}`);
        });
      }
    }

    // Explicitly archive older variants we no longer want visible.
    const archiveTitles = [
      'The Ellies 2026',
      'Alumni News: Gabriel de Varona at Miami Film Festival',
    ];
    const { error: archiveError } = await supabase
      .from('announcements')
      .update({ is_active: false })
      .eq('org_id', organization.id)
      .in('title', archiveTitles);
    if (archiveError) {
      console.warn('⚠️ Could not archive legacy announcement variants:', archiveError.message);
    } else {
      console.log('✅ Archived legacy announcement variants:', archiveTitles.join(', '));
    }

    console.log('\n🎉 Oolite Arts announcements updated successfully!');
    console.log(`📊 Summary: ${toUpdate.length} updated, ${toInsert.length} created`);
    console.log('📺 You can view the announcements at: http://localhost:3000/o/oolite/announcements');
    console.log('\n✅ Image URLs updated with January and February 2026 Cloudinary assets.');

    const { data: duplicateTitles, error: duplicateError } = await supabase
      .from('announcements')
      .select('title')
      .eq('org_id', organization.id);

    if (duplicateError) {
      console.warn('⚠️ Could not run duplicate title audit:', duplicateError.message);
    } else {
      const titleCounts = new Map();
      (duplicateTitles || []).forEach((row) => {
        titleCounts.set(row.title, (titleCounts.get(row.title) || 0) + 1);
      });
      const duplicates = Array.from(titleCounts.entries()).filter(([, count]) => count > 1);
      if (duplicates.length > 0) {
        console.warn('⚠️ Duplicate titles detected for Oolite:');
        duplicates.forEach(([title, count]) => console.warn(`   - ${title} (${count})`));
      } else {
        console.log('✅ No duplicate titles detected for Oolite.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
updateOoliteAnnouncements();

