-- Add Christine Cortes September 2025 Announcements
-- This script adds the announcements from Christine's email dated September 11, 2025

-- ==============================================
-- 1. CHECK BAKEHOUSE ORGANIZATION ID
-- ==============================================

-- Get the Bakehouse organization ID
SELECT id, name, slug FROM organizations WHERE slug = 'bakehouse';

-- ==============================================
-- 2. ADD BAKEHOUSE ANNUAL SURVEY 2025 ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    expires_at,
    tags,
    media,
    additional_info
) VALUES (
    gen_random_uuid(),
    'Bakehouse Annual Anonymous Survey 2025 - REQUIRED',
    'The Bakehouse Annual Anonymous Survey 2025 is now open and REQUIRED for all studio residents and associate members. This survey is mandatory as part of your 2026-2028 Studio Agreement Renewals and Juried Reviews, which will begin on October 1st.

⏳ DEADLINE: September 22nd at 11:59pm EST ⏳

You have 10 days to complete your survey. Once completed, please email Christine a screenshot of the confirmation email so she can mark your completed participation.

Two in-person opportunities to complete the survey:
• Bagel Brunch - Survey Hang: Friday, September 12th at 11am
• Lasagna Lunch - Survey Hang: September 18th

This survey is critical for the future of Bakehouse and your continued residency. Please complete it promptly.',
    'administrative',
    'survey',
    'published',
    1,
    'internal',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-11T16:06:00+00:00'::timestamp,
    '2025-09-22T23:59:00+00:00'::timestamp,
    ARRAY['survey', 'required', 'administrative', 'studio_renewal', 'juried_review'],
    '[]'::jsonb,
    'Survey link will be provided via email. Contact Christine Cortes for access.'
);

-- ==============================================
-- 3. ADD BOOK CLUB ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    ends_at,
    location,
    tags,
    media,
    additional_info
) VALUES (
    gen_random_uuid(),
    'Book Club - Led by Krys Ortega and Rene Morales',
    'Join us for Book Club tonight! Led by our very own Krys Ortega and Rene Morales.

📚 6:00 PM - 8:00 PM
📍 ALG Media Room
🍻🍕 Refreshments + pizza will be provided

This is a great opportunity to connect with fellow artists and engage in meaningful discussions about literature and art. All are welcome!',
    'event',
    'community',
    'published',
    3,
    'internal',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-11T18:00:00+00:00'::timestamp,
    '2025-09-11T20:00:00+00:00'::timestamp,
    'ALG Media Room',
    ARRAY['book_club', 'community', 'krys_ortega', 'rene_morales', 'social'],
    '[]'::jsonb,
    'Refreshments and pizza provided. All artists welcome to attend.'
);

-- ==============================================
-- 4. ADD NOAH CRIBB EXHIBITION ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    ends_at,
    location,
    tags,
    media,
    additional_info,
    people,
    external_orgs
) VALUES (
    gen_random_uuid(),
    'Noah Cribb Solo Exhibition "Lacuna" at Fred Snitzer Gallery',
    'Congratulations to Noah Cribb (our summer open resident) on their upcoming solo exhibition "Lacuna" at Fred Snitzer Gallery!

🎨 Opening Reception: September 12, 2025, 7:00 PM - 9:00 PM
📅 Exhibition on View: September 12 - October 18, 2025
📍 Location: Fred Snitzer Gallery

This is a wonderful opportunity to support one of our own Bakehouse artists and see their work in a prestigious gallery setting. Please join us in celebrating Noah''s achievement!',
    'opportunity',
    'exhibition',
    'published',
    2,
    'both',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-12T19:00:00+00:00'::timestamp,
    '2025-10-18T23:59:00+00:00'::timestamp,
    'Fred Snitzer Gallery',
    ARRAY['noah_cribb', 'solo_exhibition', 'fred_snitzer', 'summer_resident', 'artist_spotlight'],
    '[]'::jsonb,
    'Opening reception: September 12, 2025, 7-9 pm. Exhibition runs September 12 - October 18, 2025.',
    ARRAY['Noah Cribb'],
    ARRAY[('Fred Snitzer Gallery', 'Gallery')]
);

-- ==============================================
-- 5. ADD MARILYN LODDI/HUSHFELL EXHIBITION ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    ends_at,
    location,
    tags,
    media,
    additional_info,
    people,
    external_orgs
) VALUES (
    gen_random_uuid(),
    'Marilyn Loddi / HUSHFELL "CONNECTOME" Performance at Edge Zones Gallery',
    'Marilyn Loddi / HUSHFELL (our summer open resident) will be exhibiting a performance piece titled "CONNECTOME" at Edge Zones Gallery.

🎭 Opening: September 13th, 2025, 6:00 PM - 9:00 PM
📍 Location: Edge Zones Gallery

This solo exhibition expands the language of performance into sculpture, film, photography, and installation. Hush Fell explores the body''s cycles, boundaries, and connections to society. Their work integrates organic materials, live action, and gift economy practices, inviting audiences into a sensory dialogue on resilience, mortality, and the shared human journey.

Don''t miss this powerful exploration of performance art and its intersection with other media!',
    'opportunity',
    'exhibition',
    'published',
    2,
    'both',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-13T18:00:00+00:00'::timestamp,
    '2025-09-13T21:00:00+00:00'::timestamp,
    'Edge Zones Gallery',
    ARRAY['marilyn_loddi', 'hushfell', 'performance', 'edge_zones', 'summer_resident', 'artist_spotlight', 'connectome'],
    '[]'::jsonb,
    'Performance piece expanding into sculpture, film, photography, and installation. Explores body cycles, boundaries, and societal connections.',
    ARRAY['Marilyn Loddi', 'HUSHFELL'],
    ARRAY[('Edge Zones Gallery', 'Gallery')]
);

-- ==============================================
-- 6. ADD CATS EXHIBITION ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    ends_at,
    location,
    tags,
    media,
    additional_info,
    people,
    external_orgs,
    primary_link
) VALUES (
    gen_random_uuid(),
    '"CATS!" The Exhibition! - Benefit for Humane Society',
    'Maria Theresa Barbist, Thomas Bils, and Christina Petterson invite you to "CATS!" The Exhibition! at Bridge Red Studios/Project Space, to Benefit the Humane Society of Greater Miami.

🐈 Opening Reception: September 28th, 2025, 4:00 PM - 6:00 PM
📅 Exhibition Dates: September 28th - November 9th, 2025
📍 Location: Bridge Red Studios/Project Space

This unique event is not only a tribute to these beloved companions but also aims to support a great cause, with 50% of the proceeds going directly to the Humane Society of Greater Miami, a no-kill shelter dedicated to rescuing and caring for animals.

The exhibition will showcase a diverse collection of artworks inspired by cats, featuring works by Bakehouse artists and community members.',
    'opportunity',
    'exhibition',
    'published',
    2,
    'both',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-28T16:00:00+00:00'::timestamp,
    '2025-11-09T23:59:00+00:00'::timestamp,
    'Bridge Red Studios/Project Space',
    ARRAY['cats', 'exhibition', 'humane_society', 'benefit', 'bridge_red', 'community', 'charity'],
    '[]'::jsonb,
    '50% of proceeds go to Humane Society of Greater Miami. Showcasing diverse artworks inspired by cats.',
    ARRAY['Maria Theresa Barbist', 'Thomas Bils', 'Christina Petterson'],
    ARRAY[('Bridge Red Studios/Project Space', 'Gallery'), ('Humane Society of Greater Miami', 'Charity')],
    'https://bridgeredstudios.com'
);

-- ==============================================
-- 7. ADD JOEL GAITAN SAUER ART PRIZE ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    tags,
    media,
    additional_info,
    people,
    external_orgs
) VALUES (
    gen_random_uuid(),
    'Congratulations Joel Gaitan - 2025 SAUER Art Prize Winner!',
    'Congratulations to Joel Gaitan on winning the 2025 SAUER Art Prize! The award was presented during this year''s Armory Show, where Joel''s work was presented by The Pit, Los Angeles (Booth F10).

🏆 This prestigious award recognizes Joel''s outstanding contribution to contemporary art and his continued excellence as a Bakehouse artist.

We are incredibly proud of Joel''s achievement and the recognition he has brought to our community. This award highlights the caliber of artists we have at Bakehouse and the impact they make in the broader art world.

Please join us in congratulating Joel on this well-deserved honor!',
    'administrative',
    'achievement',
    'published',
    1,
    'both',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-11T16:06:00+00:00'::timestamp,
    ARRAY['joel_gaitan', 'sauer_art_prize', 'armory_show', 'achievement', 'congratulations', 'the_pit', 'award'],
    '[]'::jsonb,
    'Award presented at Armory Show 2025. Work presented by The Pit, Los Angeles (Booth F10).',
    ARRAY['Joel Gaitan'],
    ARRAY[('The Pit, Los Angeles', 'Gallery'), ('Armory Show', 'Art Fair'), ('SAUER Art Prize', 'Award')]
);

-- ==============================================
-- 8. ADD ARTIST HIGHLIGHTS SUBMISSION ANNOUNCEMENT
-- ==============================================

INSERT INTO announcements (
    id,
    title,
    body,
    type,
    sub_type,
    status,
    priority,
    visibility,
    org_id,
    author_clerk_id,
    created_at,
    published_at,
    starts_at,
    tags,
    media,
    additional_info
) VALUES (
    gen_random_uuid(),
    'Submit Your Artist Highlights + Achievements',
    'Would you like to be included in the next internal updates? Use this link to let us know of your Artist Highlights + Achievements!

🎨 We want to celebrate your successes and share them with the Bakehouse community. Whether you''ve had an exhibition, received an award, been featured in a publication, or achieved any other milestone, we''d love to hear about it.

This helps us:
• Celebrate your achievements as a community
• Share opportunities and inspiration with fellow artists
• Build connections and support networks
• Showcase the incredible talent at Bakehouse

Please submit your highlights so we can include them in future community updates!',
    'administrative',
    'community',
    'published',
    4,
    'internal',
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system',
    NOW(),
    NOW(),
    '2025-09-11T16:06:00+00:00'::timestamp,
    ARRAY['artist_highlights', 'achievements', 'community', 'submission', 'celebration'],
    '[]'::jsonb,
    'Submit your artist highlights and achievements to be included in future community updates.'
);

-- ==============================================
-- 9. VERIFY ANNOUNCEMENTS WERE ADDED
-- ==============================================

-- Check that all announcements were added successfully
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.priority,
    a.visibility,
    a.created_at,
    a.starts_at,
    a.tags
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.created_at >= NOW() - INTERVAL '1 hour'
  AND a.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- ==============================================
-- 10. COUNT ANNOUNCEMENTS BY TYPE
-- ==============================================

-- See the distribution of announcement types
SELECT 
    a.type,
    a.sub_type,
    COUNT(*) as count,
    STRING_AGG(a.title, '; ') as sample_titles
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.created_at >= NOW() - INTERVAL '1 hour'
  AND a.deleted_at IS NULL
GROUP BY a.type, a.sub_type
ORDER BY count DESC;
