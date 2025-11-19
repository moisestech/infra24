require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Cloudinary image URLs for announcements
const IMAGES = {
  ceoMessage: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017447/oolite-newsletter-john_ihqhre.jpg',
  exhibition: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-exhibition-gene_iaxmxy.jpg',
  miamiArtWeek: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-miami-art-week-no-vacancy_ejudrk.jpg', // Using No Vacancy as general Miami Art Week image
  vipBrunch: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-miami-vip-brunch_gvvcxa.jpg',
  nadaFair: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-nada-fair-lee-pivnik_ywih0b.jpg',
  untitledFair: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017441/oolite-untitled-bex_leokga.jpg',
  noVacancy: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-miami-art-week-no-vacancy_ejudrk.jpg',
  windowsWalgreens: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-miami-windows_e0fzdz.jpg',
  giveMiami: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-give-miami-day_vagw3w.png',
  futurePast: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-future-past-convo-livestream_ieybgk.jpg',
  penumbras: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017451/oolite-penumbras_eqz2ds.png',
  media: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017447/oolite-newsletter-john_ihqhre.jpg', // Using CEO image for media feature
  alumniGrant: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-alumni-grant_mnhami.jpg',
  alumniHighlights: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017441/oolite-alumni-highlights_allfnr.jpg',
  cinematicKnowMe: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017441/oolite-cinematic-know-me_lhro7u.jpg',
  cinematicWasteland: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017441/oolite-cinemaitc-wasteland_t1y1z3.jpg',
  edsonJean: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-edson-jean_qca9r3.jpg',
  educationGonzalo: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-education-gonzalo_wgsw8r.jpg',
  digitalLab: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017446/oolite-digital-lab_pmvgbc.png',
  figureDrawing: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763017440/oolite-fall-art-classes_xff9cg.jpg',
  exhibitionPoster: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763566614/matt-oolite-limited-edition-print-artweek-exhibition-2025_bhhvbi.jpg',
  noVacancyLee: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570105/lee-no-vacancy-nov19th-2025_fji677.jpg',
  noVacancyFabiola: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/fabiola-no-vacancy-nov19th-2025_xyykbq.jpg',
  noVacancyAmanda: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/amanda-no-vacancy-nov19th-2025_ivloz6.jpg',
  noVacancyEdison: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1763570104/edison-no-vacancy-nov19th-2025_hgb2rc.jpg',
};

// Helper function for avatar placeholders (keeping these as placeholders since we don't have individual photos)
function placeholderImage(width = 150, height = 150, text = '') {
  const encodedText = encodeURIComponent(text || 'Oolite Arts');
  return `https://placehold.co/${width}x${height}/47abc4/ffffff?text=${encodedText}`;
}

async function createOoliteAnnouncements() {
  try {
    console.log('🎯 Creating Oolite Arts announcements from newsletter...');

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

    // Parse dates from newsletter
    const now = new Date();
    const nov19_2025 = new Date('2025-11-19T18:00:00');
    const jan18_2026 = new Date('2026-01-18T23:59:59');
    const dec6_2025 = new Date('2025-12-06T10:30:00');
    const nov13_2025 = new Date('2025-11-13T00:00:00');
    const dec20_2025 = new Date('2025-12-20T23:59:59');
    const jan9_2026 = new Date('2026-01-09T23:59:59');
    const nov15_2025 = new Date('2025-11-15T00:00:00');
    const nov16_2025 = new Date('2025-11-16T07:30:00');
    const nov21_2025 = new Date('2025-11-21T16:00:00');
    const nov9_2025 = new Date('2025-11-09T14:00:00');

    // Create announcements from newsletter content
    const announcements = [
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite', // System user
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'A Message from CEO John Abodeely',
        body: 'As we approach the end of our 40th anniversary year, CEO John Abodeely shares what\'s next at Oolite Arts!',
        status: 'published',
        priority: 'high',
        tags: ['ceo', 'anniversary', 'leadership', 'news'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.ceoMessage,
        image_layout: 'card', // News type - card layout
        primary_link: '#', // Placeholder - would link to audio/podcast
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
        updated_by: 'system_oolite',        title: 'Exhibition Reception + Open Studio: "One Is Two and Two Are Many More"',
        body: 'Marking Oolite Arts\' 40th anniversary, "One Is Two and Two Are Many More" examines the institution\'s role within Miami\'s evolving cultural landscape. The exhibition traces the networks and artist-led initiatives that have intersected with Oolite over four decades, including the Alliance Film/Video Co-Op, Ground Level Gallery, Imperfect Utopia, the Listening Gallery, and CAVA.\n\nFeaturing works by Carlos Betancourt, william cordova, Dara Friedman, Regina José Galindo, Luis Gispert, GeoVanna Gonzalez, Jillian Mayer, Robert Melee, and Tag Purvis, and activations such as a film series curated by Barron Sherer, the presentation underscores how artmaking and collaboration have shaped the city\'s creative fabric.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'reception', 'open-studio', '40th-anniversary'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov19_2025.toISOString(),
        ends_at: jan18_2026.toISOString(),
        location: 'Galleries at 924 and 928 Lincoln Rd., Miami Beach, FL',
        image_url: IMAGES.exhibition,
        image_layout: 'card', // Exhibition - card layout for better visibility
        primary_link: 'https://secure.qgiv.com/for/exhibitionslectures/event/exhibitionopeningoneistwoandtwoaremanymorecuratedbygeanmoreno/?mc_cid=0a2e1fb02f&mc_eid=521d66358f',
        rsvp_label: 'RSVP HERE',
        rsvp_url: '#',
        people: [
          {
            name: 'Gean Moreno',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'GM')
          },
          {
            name: 'Carlos Betancourt',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'CB')
          },
          {
            name: 'william cordova',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'WC')
          },
          {
            name: 'GeoVanna Gonzalez',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'GG')
          }
        ],
        additional_info: 'Reception: Wednesday, Nov. 19, 2025, 6-9 p.m. at 924 Lincoln Rd., Miami Beach, FL\nOn View: Nov. 19, 2025 - Jan. 18, 2026',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'Oolite Exhibition Poster : Two Are Many More Curated by Gean Moreno',
        body: 'A hand-silkscreened 36 x 24-inch poster produced in the Oolite Print Lab, celebrating the exhibition curated by Gean Moreno.',
        status: 'published',
        priority: 'normal',
        tags: ['exhibition', 'poster', 'print-lab', 'merchandise', '40th-anniversary'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: IMAGES.exhibitionPoster,
        image_layout: 'card',
        primary_link: '#', // Placeholder for Bloomerang form link
        people: [
          {
            name: 'Gean Moreno',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'GM')
          }
        ],
        additional_info: 'Edition of 30. $50.00.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Miami Art Week Highlights',
        body: 'As Miami Art Week approaches, Oolite Arts invites you to experience an amazing lineup of exhibitions and activations that celebrate the city\'s creative spirit. From the thought-provoking group show "One Is Two and Two Are Many More" to the public art series Windows @ Walgreens, and events showcasing the creativity of current and past residents whose works will be on view at various locations. This season offers an inspiring glimpse into our ever-evolving cultural landscape.',
        status: 'published',
        priority: 'high',
        tags: ['miami-art-week', 'highlights', 'events'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'Various locations, Miami Beach',
        image_url: IMAGES.miamiArtWeek,
        image_layout: 'card', // Event highlights - card layout
        primary_link: '#',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Miami Art Week VIP Brunch',
        body: 'Celebrate Oolite Arts\' 2025 Resident Artists and this landmark exhibition. Free and open to the public.',
        status: 'published',
        priority: 'high',
        tags: ['miami-art-week', 'brunch', 'residents'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        starts_at: dec6_2025.toISOString(),
        ends_at: new Date(dec6_2025.getTime() + 90 * 60 * 1000).toISOString(), // 90 minutes
        location: 'Oolite Arts, 924 Lincoln Rd., Miami Beach, FL',
        image_url: IMAGES.vipBrunch,
        image_layout: 'card', // Event - card layout
        primary_link: '#',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'NADA Art Fair: Lee Pivnik',
        body: 'Imagined queer dissidents adapting in a post-hurricane Miami.',
        status: 'published',
        priority: 'normal',
        tags: ['nada', 'art-fair', 'lee-pivnik'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'NADA Art Fair, Miami Beach',
        image_url: IMAGES.nadaFair,
        image_layout: 'card', // Exhibition - card layout
        primary_link: '#',
        people: [
          {
            name: 'Lee Pivnik',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'LP')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Untitled Art Fair: Bex McCharen - "Queer Atlantics"',
        body: 'An immersive visual archive of queer and trans communities finding refuge in Florida\'s waters. In partnership with Dot Fiftyone Gallery.',
        status: 'published',
        priority: 'normal',
        tags: ['untitled', 'art-fair', 'bex-mccharen'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'Untitled Art Fair, Miami Beach',
        image_url: IMAGES.untitledFair,
        image_layout: 'card', // Exhibition - card layout
        primary_link: '#',
        people: [
          {
            name: 'Bex McCharen',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'BM')
          }
        ],
        external_orgs: [
          {
            name: 'Dot Fiftyone Gallery',
            logo_url: placeholderImage(100, 100, 'D51')
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
        title: 'No Vacancy: Florida Florarium by Edison Peñafiel',
        body: 'As part of the City of Miami Beach\'s 2025 edition of No Vacancy, Miami Beach, Oolite Arts resident Edison Peñafiel presents "Florida Florarium" at The Catalina Hotel & Beach Club. This immersive installation transforms the hotel into a temporary art destination, highlighting bold, original work by local talent. The No Vacancy program is a juried art competition presented in partnership with the Miami Beach Visitor and Convention Authority (MBVCA).',
        status: 'published',
        priority: 'high',
        tags: ['no-vacancy', 'miami-art-week', 'hotels', 'public-art', 'edison-penafiel'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'The Catalina Hotel & Beach Club, 1732 Collins Avenue, Miami Beach, FL',
        image_url: IMAGES.noVacancyEdison,
        image_layout: 'card',
        primary_link: '#',
        people: [
          {
            name: 'Edison Peñafiel',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'EP')
          }
        ],
        additional_info: 'Part of No Vacancy, Miami Beach 2025. Each selected artist receives a $10,000 stipend to bring their creative vision to life.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'No Vacancy: Tierra Húmeda by Amanda Linares',
        body: 'As part of the City of Miami Beach\'s 2025 edition of No Vacancy, Miami Beach, Oolite Arts resident Amanda Linares presents "Tierra Húmeda" at The Miami Beach EDITION. This immersive installation transforms the hotel into a temporary art destination, highlighting bold, original work by local talent. The No Vacancy program is a juried art competition presented in partnership with the Miami Beach Visitor and Convention Authority (MBVCA).',
        status: 'published',
        priority: 'high',
        tags: ['no-vacancy', 'miami-art-week', 'hotels', 'public-art', 'amanda-linares'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'The Miami Beach EDITION, 2901 Collins Ave, Miami Beach, FL',
        image_url: IMAGES.noVacancyAmanda,
        image_layout: 'card',
        primary_link: '#',
        people: [
          {
            name: 'Amanda Linares',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'AL')
          }
        ],
        additional_info: 'Part of No Vacancy, Miami Beach 2025. Each selected artist receives a $10,000 stipend to bring their creative vision to life.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'No Vacancy: Heartware by Fabiola Larios',
        body: 'As part of the City of Miami Beach\'s 2025 edition of No Vacancy, Miami Beach, Oolite Arts resident Fabiola Larios presents "Heartware" at Riviera Suites Miami Beach. This immersive installation transforms the hotel into a temporary art destination, highlighting bold, original work by local talent. The No Vacancy program is a juried art competition presented in partnership with the Miami Beach Visitor and Convention Authority (MBVCA).',
        status: 'published',
        priority: 'high',
        tags: ['no-vacancy', 'miami-art-week', 'hotels', 'public-art', 'fabiola-larios'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'Riviera Suites Miami Beach, 318 20th Street, Miami Beach, FL',
        image_url: IMAGES.noVacancyFabiola,
        image_layout: 'card',
        primary_link: '#',
        people: [
          {
            name: 'Fabiola Larios',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'FL')
          }
        ],
        additional_info: 'Part of No Vacancy, Miami Beach 2025. Each selected artist receives a $10,000 stipend to bring their creative vision to life.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',
        title: 'No Vacancy: Wellspring by Lee Pivnik',
        body: 'As part of the City of Miami Beach\'s 2025 edition of No Vacancy, Miami Beach, Oolite Arts resident Lee Pivnik presents "Wellspring" at The Shelborne by Proper. This immersive installation transforms the hotel into a temporary art destination, highlighting bold, original work by local talent. The No Vacancy program is a juried art competition presented in partnership with the Miami Beach Visitor and Convention Authority (MBVCA).',
        status: 'published',
        priority: 'high',
        tags: ['no-vacancy', 'miami-art-week', 'hotels', 'public-art', 'lee-pivnik'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: dec20_2025.toISOString(),
        location: 'The Shelborne by Proper, 1801 Collins Avenue, Miami Beach, FL',
        image_url: IMAGES.noVacancyLee,
        image_layout: 'card',
        primary_link: '#',
        people: [
          {
            name: 'Lee Pivnik',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'LP')
          }
        ],
        additional_info: 'Part of No Vacancy, Miami Beach 2025. Each selected artist receives a $10,000 stipend to bring their creative vision to life.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Windows @ Walgreens: Live.In.Art Residents',
        body: 'Eight visionary Live.In.Art residents, Sue Beyer, Jevon Brown, Elaine Defibaugh, Luna Palazzolo-Daboul, Edison Peñafiel, Jacoub Reyes, Oscar Rieveling, and Zonia Zena, have turned the iconic Windows @ Walgreens along Collins Avenue at 67th and 74th Streets into dazzling streetside galleries of bold, thought-provoking installations.\n\nFor more than 25 years, these windows have served as a living canvas for artistic innovation, and this year\'s transformation continues that legacy with fresh energy and imagination. Catch these captivating displays through Jan. 9, 2026. This is a must-see stop during Miami Art Week and it is a vibrant celebration of creativity in the heart of Miami Beach.',
        status: 'published',
        priority: 'high',
        tags: ['windows-walgreens', 'public-art', 'live-in-art', 'miami-art-week'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: nov13_2025.toISOString(),
        ends_at: jan9_2026.toISOString(),
        location: 'Collins Avenue at 67th and 74th Streets, Miami Beach',
        image_url: IMAGES.windowsWalgreens,
        image_layout: 'card', // Event - card layout
        primary_link: '#',
        people: [
          {
            name: 'Sue Beyer',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'SB')
          },
          {
            name: 'Jevon Brown',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'JB')
          },
          {
            name: 'Edison Peñafiel',
            role: 'artist',
            avatar_url: placeholderImage(150, 150, 'EP')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Give Miami 2025',
        body: 'When Ellie Schneiderman founded Oolite Arts over 40 years ago, she transformed a few empty storefronts on Lincoln Road into a haven for artists, sparking a movement. Your donations on Give Miami Day carry that vision forward. Thanks to your support:\n\n• Artists have studios and residencies to grow their practice.\n• Filmmakers bring Miami\'s stories to life.\n• Exhibitions and public art reach tens of thousands each year.\n• Emerging talents find mentorship, opportunity, and purpose.\n\nYour gifts don\'t just sustain programs, they sustain people. They build careers, create connections, and ensure that artists continue to shape the cultural landscape of our city. This Give Miami Day, we invite you to stand with us again, to honor 40 years of Ellie\'s legacy, and to keep empowering artists to thrive in Miami.',
        status: 'published',
        priority: 'high',
        tags: ['give-miami', 'fundraising', 'donation', '40th-anniversary'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        starts_at: nov15_2025.toISOString(),
        ends_at: new Date('2025-11-16T23:59:59').toISOString(),
        location: 'Online and Maurice A. Ferré Park',
        image_url: IMAGES.giveMiami,
        image_layout: 'card', // Opportunity - card layout for better visibility
        primary_link: 'https://givemiamiday.org/organization/oolitearts',
        additional_info: 'Early giving begins November 15. Give Miami Day 5K on November 16 at Maurice A. Ferré Park, 1075 Biscayne Blvd., 7:30 a.m.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Future Present Past: Conversation on Grassroots as Catalyst for Change',
        body: 'The Artist + Curator Talk for the Penumbras Exhibition on Oct. 15, 2025 led by co-curator Marie Vickles focused on the grassroots of organizing, the history of ArtCenter/South Florida·Oolite Arts, and how artists are using art as a tool for community engagement and social change. Guests filled the second floor library as speakers Kristen Thiele (Oolite Alumni 2000-2004), Lazaro Amaral (Oolite Alumni 1994-2001), and Tayina Deravile (independent curator and Girls Club Gallery Manager) shared their experiences.',
        status: 'published',
        priority: 'normal',
        tags: ['conversation', 'penumbras', 'grassroots', 'history'],
        visibility: 'public',
        type: 'event',
        sub_type: 'meeting',
        image_url: IMAGES.futurePast,
        image_layout: 'card', // Event conversation - card layout
        primary_link: '#', // Placeholder for audio link
        people: [
          {
            name: 'Marie Vickles',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'MV')
          },
          {
            name: 'Kristen Thiele',
            role: 'alumni',
            avatar_url: placeholderImage(150, 150, 'KT')
          },
          {
            name: 'Lazaro Amaral',
            role: 'alumni',
            avatar_url: placeholderImage(150, 150, 'LA')
          },
          {
            name: 'Tayina Deravile',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'TD')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Oolite Arts in the Media: CEO John Abodeely on Arts Leadership',
        body: 'Oolite Arts President and CEO John Abodeely is nationally recognized for his innovative approach to arts leadership, combining business savvy and creative insight to develop community programs and public policies fueled by the powerful belief that artists are catalysts for stronger, more resilient communities. Over the past 20 years, Abodeely has served as Acting Executive Director of President Obama\'s Council on the Arts and the Humanities, the CEO of the Houston Arts Alliance, and played key roles at the Kennedy Center and Americans for the Arts. A 2001 graduate of Amherst College in Massachusetts, he returned to his alma mater where he shared words of advice during a podcast on how students can best position themselves for careers in the arts.',
        status: 'published',
        priority: 'normal',
        tags: ['media', 'ceo', 'leadership', 'podcast'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.media,
        image_layout: 'card', // News - card layout
        primary_link: '#', // Placeholder for podcast link
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
        updated_by: 'system_oolite',        title: 'Alumni Grant Is Back!',
        body: 'If you are Oolite Arts Alumni make sure you are on our list on the Alumni page on the website, and you also are eligible to apply for a grant of $1,000 in art materials!',
        status: 'published',
        priority: 'high',
        tags: ['alumni', 'grant', 'opportunity', 'funding'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: IMAGES.alumniGrant,
        image_layout: 'card', // Opportunity - card layout
        primary_link: '#', // Placeholder for application link
        additional_info: 'Share your updates and let us know what you\'re working on.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Ana y la Distancia: New York Latino Film Festival',
        body: 'Our Cinematic Manager and alumni, Hansel Porras Garcia, recently brought his latest short film, "Ana y la Distancia," to the New York Latino Film Festival. The film explores themes of connection and distance through a deeply personal lens and reflects Hansel\'s vision and leadership within Oolite Arts\' Cinematic Program.',
        status: 'published',
        priority: 'normal',
        tags: ['alumni', 'cinematic', 'film-festival', 'hansel-porras-garcia'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.alumniHighlights,
        image_layout: 'card', // News - card layout
        primary_link: '#',
        people: [
          {
            name: 'Hansel Porras Garcia',
            role: 'cinematic-manager',
            avatar_url: placeholderImage(150, 150, 'HPG')
          }
        ],
        additional_info: '"Ana y la Distancia" will be featured at the 7th Edition of the IberoAmerican Film Festival on Friday, Nov. 21, 2025 at 4 p.m. at the Koubek Center, 2705 SW 3rd. St., Miami.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'New Orleans Film Festival: Alumni Feature Films',
        body: 'In late October, two Oolite alumni feature films were showcased at the New Orleans Film Festival, "Know Me: The Untold Miami Bath Salts Phenomenon," directed by Edson Jean, and the world premiere of "Tropical Park," directed by Hansel Porras Garcia. Both films spotlight stories at the heart of Miami\'s ecosystem, offering community-centered perspectives on our city.',
        status: 'published',
        priority: 'normal',
        tags: ['alumni', 'cinematic', 'film-festival', 'new-orleans', 'edson-jean', 'hansel-porras-garcia'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.cinematicKnowMe,
        image_layout: 'card', // News - card layout
        primary_link: '#',
        people: [
          {
            name: 'Edson Jean',
            role: 'alumni',
            avatar_url: placeholderImage(150, 150, 'EJ')
          },
          {
            name: 'Hansel Porras Garcia',
            role: 'cinematic-manager',
            avatar_url: placeholderImage(150, 150, 'HPG')
          }
        ],
        additional_info: '"Tropical Park" will continue its journey to Film Fest Knox in Tennessee, with a screening on Sunday, Nov. 9, 2025 at 2 p.m. at the Regal Riviera Theater, 510 South Gay St., Knoxville.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Wastelands: Production Complete, Moving to Post-Production',
        body: '"Wastelands," directed by 2025 Cinematic Resident Michael Ruiz-Unger, has just wrapped production and is now moving into post-production. The film follows a down-and-out punk navigating the worst 24 hours of his life after losing the prized guitar he planned to sell in order to leave town for good. Bringing this story to life was a true collaborative effort, with a talented team of local filmmakers supporting Michael every step of the way. We can\'t wait to see how the film evolves in its next stages!',
        status: 'published',
        priority: 'normal',
        tags: ['cinematic', 'resident', 'production', 'michael-ruiz-unger'],
        visibility: 'public',
        type: 'news',
        sub_type: 'general',
        image_url: IMAGES.cinematicWasteland,
        image_layout: 'card', // News - card layout for better visibility
        primary_link: '#',
        people: [
          {
            name: 'Michael Ruiz-Unger',
            role: 'resident',
            avatar_url: placeholderImage(150, 150, 'MRU')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Penumbras: A Narrative of ArtCenter/South Florida • Oolite Arts (1984–2014)',
        body: '"Penumbras: a narrative of ArtCenter/South Florida • Oolite Arts (1984–2014)" exhibition co-curated by Marie Vickles and william cordova at Oolite Arts closed on Oct. 19, 2025. It was a landmark exhibition to celebrate Oolite Arts\' 40th anniversary highlighting the organization\'s early decades and its alumni artists.',
        status: 'published',
        priority: 'high',
        tags: ['exhibition', 'penumbras', '40th-anniversary', 'history', 'alumni'],
        visibility: 'public',
        type: 'event',
        sub_type: 'exhibition',
        starts_at: new Date('2025-09-01T00:00:00').toISOString(),
        ends_at: new Date('2025-10-19T23:59:59').toISOString(),
        location: 'Oolite Arts, 924 Lincoln Rd., Miami Beach, FL',
        image_url: IMAGES.penumbras,
        image_layout: 'card', // Exhibition - card layout for better visibility
        primary_link: '#',
        people: [
          {
            name: 'Marie Vickles',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'MV')
          },
          {
            name: 'william cordova',
            role: 'curator',
            avatar_url: placeholderImage(150, 150, 'WC')
          }
        ],
        additional_info: 'This landmark exhibition celebrated Oolite Arts\' 40th anniversary, highlighting the organization\'s early decades and its alumni artists.',
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Youth Artist Residency Program: Welcome Gonzalo Hernández',
        body: 'Oolite Arts is thrilled to welcome Gonzalo Hernández as the mentor for our new Youth Artist Residency Program created for aspiring artists ages 16 to 18 who dream of pursuing a professional career in the arts.\n\nDesigned to bridge the gap between high school and a professional art career, the residency offers young artists hands-on training, mentorships, and real-world experience rarely found in traditional classrooms.\n\nHernández is an artist and educator from Lima, Peru, now based in Miami, who brings global experience and deep artistic insight to guide our next generation of creators. His work has been exhibited internationally, including at SCAD Museum of Art, MOCA GA, Charlotte Street Foundation, ICPNA, Kates Ferri Projects, and more. He\'s been featured in Hyperallergic, ArtNews, and Cultured Magazine.',
        status: 'published',
        priority: 'high',
        tags: ['education', 'youth-residency', 'mentorship', 'program'],
        visibility: 'public',
        type: 'event',
        sub_type: 'general',
        image_url: IMAGES.educationGonzalo,
        image_layout: 'card', // Opportunity - card layout
        primary_link: '#',
        people: [
          {
            name: 'Gonzalo Hernández',
            role: 'mentor',
            avatar_url: placeholderImage(150, 150, 'GH')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Digital Lab @ 924',
        body: 'Oolite Arts, with generous support from the Knight Foundation, is thrilled to unveil the Digital Lab @ 924 that\'s a bold new hub where art, technology, and imagination collide. This isn\'t just a lab it\'s Miami\'s creative launchpad for the digital age.',
        status: 'published',
        priority: 'high',
        tags: ['digital-lab', 'technology', 'facility', 'knight-foundation'],
        visibility: 'public',
        type: 'general',
        sub_type: 'general',
        starts_at: new Date('2025-11-19T10:00:00').toISOString(),
        location: '924 Lincoln Rd., Studio 105, Miami Beach, FL 33139',
        image_url: IMAGES.digitalLab,
        image_layout: 'card', // Facility - card layout
        primary_link: '#',
        additional_info: 'Visit the Digital Lab Tuesdays and Thursdays from 10 a.m. to 5 p.m., where instructors Fabiola Larios and Moises Sanabria will offer classes to Oolite Arts residents in English and Spanish. Evening and weekends hours also are available. The space will be accessible Nov. 19, 2025.',
        people: [
          {
            name: 'Fabiola Larios',
            role: 'instructor',
            avatar_url: placeholderImage(150, 150, 'FL')
          },
          {
            name: 'Moises Sanabria',
            role: 'instructor',
            avatar_url: placeholderImage(150, 150, 'MS')
          }
        ],
        external_orgs: [
          {
            name: 'Knight Foundation',
            logo_url: placeholderImage(100, 100, 'KF')
          }
        ],
        published_at: now.toISOString()
      },
      {
        organization_id: organization.id,
        org_id: organization.id,
        author_clerk_id: 'system_oolite',
        created_by: 'system_oolite',
        updated_by: 'system_oolite',        title: 'Fall Art Classes: Figure Drawing Studio',
        body: 'By popular demand, Oolite Arts is pleased to announce the addition of a second Figure Drawing Studio session on Thursdays at 6 p.m. This uninstructed studio session offers artists the opportunity to explore or refine their figure drawing skills while working from a live nude model in a range of poses. All materials are welcome; pencils and paper will be provided. The session is open to teens with written parental permission.',
        status: 'published',
        priority: 'normal',
        tags: ['classes', 'figure-drawing', 'education', 'workshop'],
        visibility: 'public',
        type: 'event',
        sub_type: 'workshop',
        starts_at: now.toISOString(),
        ends_at: new Date('2025-12-31T23:59:59').toISOString(),
        location: 'Oolite Arts, 924 Lincoln Rd., Miami Beach, FL',
        image_url: IMAGES.figureDrawing,
        image_layout: 'card', // Event/Workshop - card layout
        primary_link: '#', // Placeholder for registration
        additional_info: 'Mondays, 7-9 p.m. and Thursdays, 6-8 p.m. (Except Holidays)',
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
      is_active: true, // Ensure all announcements are active so they display
    }));

    // Insert announcements
    const { data: createdAnnouncements, error: insertError } = await supabase
      .from('announcements')
      .insert(announcementsWithRequiredFields)
      .select();

    if (insertError) {
      console.error('❌ Error creating announcements:', insertError);
      return;
    }

    console.log('\n✅ Created', createdAnnouncements.length, 'announcements for Oolite Arts:');
    createdAnnouncements.forEach((announcement, index) => {
      console.log(`   ${index + 1}. ${announcement.title} (${announcement.type})`);
    });

    console.log('\n🎉 Oolite Arts announcements created successfully!');
    console.log('📺 You can now view the SmartSign at: http://localhost:3000/o/oolite/announcements/display');
    console.log('📋 All announcements are published and ready to display.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createOoliteAnnouncements();


