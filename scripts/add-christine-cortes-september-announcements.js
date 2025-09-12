const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

async function addChristineCortesAnnouncements() {
  try {
    console.log('🚀 Starting to add Christine Cortes September 2025 announcements...');

    // Get Bakehouse organization ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'bakehouse')
      .single();

    if (orgError || !org) {
      throw new Error(`Failed to find Bakehouse organization: ${orgError?.message}`);
    }

    console.log(`✅ Found organization: ${org.name} (${org.slug})`);

    const announcements = [
      {
        title: 'Bakehouse Annual Anonymous Survey 2025 - REQUIRED',
        body: `The Bakehouse Annual Anonymous Survey 2025 is now open and REQUIRED for all studio residents and associate members. This survey is mandatory as part of your 2026-2028 Studio Agreement Renewals and Juried Reviews, which will begin on October 1st.

⏳ DEADLINE: September 22nd at 11:59pm EST ⏳

You have 10 days to complete your survey. Once completed, please email Christine a screenshot of the confirmation email so she can mark your completed participation.

Two in-person opportunities to complete the survey:
• Bagel Brunch - Survey Hang: Friday, September 12th at 11am
• Lasagna Lunch - Survey Hang: September 18th

This survey is critical for the future of Bakehouse and your continued residency. Please complete it promptly.`,
        type: 'administrative',
        sub_type: 'survey',
        status: 'published',
        priority: 1,
        visibility: 'internal',
        starts_at: '2025-09-11T16:06:00+00:00',
        expires_at: '2025-09-22T23:59:00+00:00',
        tags: ['survey', 'required', 'administrative', 'studio_renewal', 'juried_review'],
        additional_info: 'Survey link will be provided via email. Contact Christine Cortes for access.'
      },
      {
        title: 'Book Club - Led by Krys Ortega and Rene Morales',
        body: `Join us for Book Club tonight! Led by our very own Krys Ortega and Rene Morales.

📚 6:00 PM - 8:00 PM
📍 ALG Media Room
🍻🍕 Refreshments + pizza will be provided

This is a great opportunity to connect with fellow artists and engage in meaningful discussions about literature and art. All are welcome!`,
        type: 'event',
        sub_type: 'community',
        status: 'published',
        priority: 3,
        visibility: 'internal',
        starts_at: '2025-09-11T18:00:00+00:00',
        ends_at: '2025-09-11T20:00:00+00:00',
        location: 'ALG Media Room',
        tags: ['book_club', 'community', 'krys_ortega', 'rene_morales', 'social'],
        additional_info: 'Refreshments and pizza provided. All artists welcome to attend.'
      },
      {
        title: 'Noah Cribb Solo Exhibition "Lacuna" at Fred Snitzer Gallery',
        body: `Congratulations to Noah Cribb (our summer open resident) on their upcoming solo exhibition "Lacuna" at Fred Snitzer Gallery!

🎨 Opening Reception: September 12, 2025, 7:00 PM - 9:00 PM
📅 Exhibition on View: September 12 - October 18, 2025
📍 Location: Fred Snitzer Gallery

This is a wonderful opportunity to support one of our own Bakehouse artists and see their work in a prestigious gallery setting. Please join us in celebrating Noah's achievement!`,
        type: 'opportunity',
        sub_type: 'exhibition',
        status: 'published',
        priority: 2,
        visibility: 'both',
        starts_at: '2025-09-12T19:00:00+00:00',
        ends_at: '2025-10-18T23:59:00+00:00',
        location: 'Fred Snitzer Gallery',
        tags: ['noah_cribb', 'solo_exhibition', 'fred_snitzer', 'summer_resident', 'artist_spotlight'],
        additional_info: 'Opening reception: September 12, 2025, 7-9 pm. Exhibition runs September 12 - October 18, 2025.',
        people: ['Noah Cribb'],
        external_orgs: [{ name: 'Fred Snitzer Gallery', asset: 'Gallery' }]
      },
      {
        title: 'Marilyn Loddi / HUSHFELL "CONNECTOME" Performance at Edge Zones Gallery',
        body: `Marilyn Loddi / HUSHFELL (our summer open resident) will be exhibiting a performance piece titled "CONNECTOME" at Edge Zones Gallery.

🎭 Opening: September 13th, 2025, 6:00 PM - 9:00 PM
📍 Location: Edge Zones Gallery

This solo exhibition expands the language of performance into sculpture, film, photography, and installation. Hush Fell explores the body's cycles, boundaries, and connections to society. Their work integrates organic materials, live action, and gift economy practices, inviting audiences into a sensory dialogue on resilience, mortality, and the shared human journey.

Don't miss this powerful exploration of performance art and its intersection with other media!`,
        type: 'opportunity',
        sub_type: 'exhibition',
        status: 'published',
        priority: 2,
        visibility: 'both',
        starts_at: '2025-09-13T18:00:00+00:00',
        ends_at: '2025-09-13T21:00:00+00:00',
        location: 'Edge Zones Gallery',
        tags: ['marilyn_loddi', 'hushfell', 'performance', 'edge_zones', 'summer_resident', 'artist_spotlight', 'connectome'],
        additional_info: 'Performance piece expanding into sculpture, film, photography, and installation. Explores body cycles, boundaries, and societal connections.',
        people: ['Marilyn Loddi', 'HUSHFELL'],
        external_orgs: [{ name: 'Edge Zones Gallery', asset: 'Gallery' }]
      },
      {
        title: '"CATS!" The Exhibition! - Benefit for Humane Society',
        body: `Maria Theresa Barbist, Thomas Bils, and Christina Petterson invite you to "CATS!" The Exhibition! at Bridge Red Studios/Project Space, to Benefit the Humane Society of Greater Miami.

🐈 Opening Reception: September 28th, 2025, 4:00 PM - 6:00 PM
📅 Exhibition Dates: September 28th - November 9th, 2025
📍 Location: Bridge Red Studios/Project Space

This unique event is not only a tribute to these beloved companions but also aims to support a great cause, with 50% of the proceeds going directly to the Humane Society of Greater Miami, a no-kill shelter dedicated to rescuing and caring for animals.

The exhibition will showcase a diverse collection of artworks inspired by cats, featuring works by Bakehouse artists and community members.`,
        type: 'opportunity',
        sub_type: 'exhibition',
        status: 'published',
        priority: 2,
        visibility: 'both',
        starts_at: '2025-09-28T16:00:00+00:00',
        ends_at: '2025-11-09T23:59:00+00:00',
        location: 'Bridge Red Studios/Project Space',
        tags: ['cats', 'exhibition', 'humane_society', 'benefit', 'bridge_red', 'community', 'charity'],
        additional_info: '50% of proceeds go to Humane Society of Greater Miami. Showcasing diverse artworks inspired by cats.',
        people: ['Maria Theresa Barbist', 'Thomas Bils', 'Christina Petterson'],
        external_orgs: [
          { name: 'Bridge Red Studios/Project Space', asset: 'Gallery' },
          { name: 'Humane Society of Greater Miami', asset: 'Charity' }
        ],
        primary_link: 'https://bridgeredstudios.com'
      },
      {
        title: 'Congratulations Joel Gaitan - 2025 SAUER Art Prize Winner!',
        body: `Congratulations to Joel Gaitan on winning the 2025 SAUER Art Prize! The award was presented during this year's Armory Show, where Joel's work was presented by The Pit, Los Angeles (Booth F10).

🏆 This prestigious award recognizes Joel's outstanding contribution to contemporary art and his continued excellence as a Bakehouse artist.

We are incredibly proud of Joel's achievement and the recognition he has brought to our community. This award highlights the caliber of artists we have at Bakehouse and the impact they make in the broader art world.

Please join us in congratulating Joel on this well-deserved honor!`,
        type: 'administrative',
        sub_type: 'achievement',
        status: 'published',
        priority: 1,
        visibility: 'both',
        starts_at: '2025-09-11T16:06:00+00:00',
        tags: ['joel_gaitan', 'sauer_art_prize', 'armory_show', 'achievement', 'congratulations', 'the_pit', 'award'],
        additional_info: 'Award presented at Armory Show 2025. Work presented by The Pit, Los Angeles (Booth F10).',
        people: ['Joel Gaitan'],
        external_orgs: [
          { name: 'The Pit, Los Angeles', asset: 'Gallery' },
          { name: 'Armory Show', asset: 'Art Fair' },
          { name: 'SAUER Art Prize', asset: 'Award' }
        ]
      },
      {
        title: 'Submit Your Artist Highlights + Achievements',
        body: `Would you like to be included in the next internal updates? Use this link to let us know of your Artist Highlights + Achievements!

🎨 We want to celebrate your successes and share them with the Bakehouse community. Whether you've had an exhibition, received an award, been featured in a publication, or achieved any other milestone, we'd love to hear about it.

This helps us:
• Celebrate your achievements as a community
• Share opportunities and inspiration with fellow artists
• Build connections and support networks
• Showcase the incredible talent at Bakehouse

Please submit your highlights so we can include them in future community updates!`,
        type: 'administrative',
        sub_type: 'community',
        status: 'published',
        priority: 4,
        visibility: 'internal',
        starts_at: '2025-09-11T16:06:00+00:00',
        tags: ['artist_highlights', 'achievements', 'community', 'submission', 'celebration'],
        additional_info: 'Submit your artist highlights and achievements to be included in future community updates.'
      }
    ];

    console.log(`📝 Adding ${announcements.length} announcements...`);

    // Add each announcement
    for (let i = 0; i < announcements.length; i++) {
      const announcement = announcements[i];
      console.log(`\n${i + 1}. Adding: ${announcement.title}`);

      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          org_id: org.id,
          author_clerk_id: 'system',
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          media: [],
          style: {}
        })
        .select();

      if (error) {
        console.error(`❌ Error adding announcement "${announcement.title}":`, error);
        continue;
      }

      console.log(`✅ Successfully added: ${announcement.title}`);
    }

    console.log('\n🎉 All announcements added successfully!');

    // Verify announcements were added
    console.log('\n📊 Verifying announcements...');
    const { data: recentAnnouncements, error: verifyError } = await supabase
      .from('announcements')
      .select('id, title, type, sub_type, status, priority, visibility, created_at')
      .eq('org_id', org.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('❌ Error verifying announcements:', verifyError);
    } else {
      console.log(`✅ Found ${recentAnnouncements.length} recent announcements:`);
      recentAnnouncements.forEach(announcement => {
        console.log(`   - ${announcement.title} (${announcement.type}/${announcement.sub_type})`);
      });
    }

  } catch (error) {
    console.error('❌ Error adding Christine Cortes announcements:', error);
    process.exit(1);
  }
}

// Run the script
addChristineCortesAnnouncements();
