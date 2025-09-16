-- Create Christine Cortes Events Script (FIXED VERSION)
-- This script adds all the events and announcements from Christine Cortes' email
-- Date: September 4, 2024

-- ==============================================
-- STEP 1: CHECK FOR USERS IN BAKEHOUSE
-- ==============================================

-- First, let's check what users exist in the Bakehouse organization
SELECT 
    om.id as membership_id,
    om.clerk_user_id,
    om.role,
    om.org_id,
    o.name as org_name,
    o.slug as org_slug,
    om.joined_at
FROM org_memberships om
JOIN organizations o ON om.org_id = o.id
WHERE o.slug = 'bakehouse'
ORDER BY om.role, om.joined_at;

-- If the above query returns no results, you need to create a user first
-- If it returns results, copy one of the clerk_user_id values and replace 
-- 'YOUR_USER_ID_HERE' in the script below

-- ==============================================
-- STEP 2: CREATE ANNOUNCEMENTS
-- ==============================================

-- IMPORTANT: Using 'system' as author_clerk_id to match existing announcements
-- This is the standard pattern used in your system for system-generated content

-- 1. New World Symphony Orchestra - Recorded Performance
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'New World Symphony Orchestra - Recorded Performance',
    'A series called "Places We Love" led by The New World Symphony Orchestra has selected Bakehouse as the next location to record 3 musicians inside The Audrey Love Gallery. Artists are invited to silently sit in during the performance recording, and must agree to sign a film release waiver.',
    'published',
    2,
    ARRAY['performance', 'music', 'recording', 'new-world-symphony'],
    'internal',
    'event',
    'performance',
    'Audrey Love Gallery, Bakehouse Art Complex',
    '2024-09-08 12:30:00-04:00',
    '2024-09-08 14:30:00-04:00',
    'If you are interested in attending, please arrive by 12:30 to begin seating. Performance begins promptly at 1pm-2:30pm. Must sign film release waiver.',
    NOW(),
    NOW()
);

-- 2. OPEN STUDIOS
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'OPEN STUDIOS',
    'Join us for our monthly Open Studios event! Artists are invited to open their studios to the public and showcase their work.',
    'published',
    2,
    ARRAY['open-studios', 'event', 'public', 'studios'],
    'both',
    'event',
    'open_studios',
    'Bakehouse Art Complex',
    '2024-09-09 18:00:00-04:00',
    '2024-09-09 21:00:00-04:00',
    'If you are unable to attend and would like to have authorized a person to keep your studio open in your place, please message Krys ASAP.',
    NOW(),
    NOW()
);

-- 3. BAC BOOKCLUB
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'BAC BOOKCLUB',
    'For our first session, Rene Morales (our Curatorial Fellow) and Krys Ortega (our Curatorial+Public Programs Manager) will dive into the various inner worlds of the larger art arena and, more broadly, the current state of art & culture. Please know that this is a nonjudgmental space to talk about ideas you all likely engage with as artists in your day to day.',
    'published',
    2,
    ARRAY['bookclub', 'discussion', 'art-culture', 'education'],
    'internal',
    'event',
    'bookclub',
    'ALG Media Room, Bakehouse Art Complex',
    '2024-09-11 18:00:00-04:00',
    '2024-09-11 20:00:00-04:00',
    'Refreshments + pizza will be provided. Topics: (Podcast) There Is Not One Art World. There Are (At Least) Five. The Art Angle, which discusses an essay by artist & writer Andrea Fraser; (Intro chapter) Immediacy, or The Style of Too Late Capitalism by Anna Kornbluh. Optional/supplemental text: The Field of Contemporary Art: A Diagram by Andrea Fraser.',
    NOW(),
    NOW()
);

-- 4. Bakehouse Annual Survey 2025
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    expires_at,
    primary_link,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'Bakehouse Annual Survey 2025',
    'The Bakehouse Annual Survey 2025 is now open! This survey assesses our overall organizational efforts, and collects critical data that helps us understand our areas of strength and our room for improvement. These survey responses also help to report the needs of our artist community to our board members, donors, and grant funding reviews. This survey is anonymous!',
    'published',
    3,
    ARRAY['survey', 'annual', 'feedback', 'required'],
    'internal',
    'administrative',
    'survey',
    '2024-09-22 23:59:00-04:00',
    'https://survey-link-here', -- Replace with actual survey link
    'This survey is required as part of your Studio Agreement Renewals and Juried Reviews which will begin on October 1st. The deadline to complete this survey is September 22nd at 11:59pm EST. Once you have completed the survey, please send me an email with a screenshot of your screen that says "Survey Completed" so that I am able to mark your completed participation.',
    NOW(),
    NOW()
);

-- 5. Museum Access Cards Ready
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'Your Museum Access Cards are ready for pick up!',
    'Thank you Jenna Efrein for the idea, Cathy for making this possible! Card design by yours truly! Happy 40th birthday, Bakehouse! The following museums have offered waived admission access to you, Just present your Bakehouse ID Card at check in',
    'published',
    2,
    ARRAY['museum-access', 'benefits', 'pickup', '40th-birthday'],
    'internal',
    'administrative',
    'benefits',
    'Museums with waived admission: Vizcaya Museum (Artist with Bakehouse ID +1), Rubell Museum Collection, PAMM, NSU Art Museum - Ft. Lauderdale, Bass (Artists need to also register online and can get in free with their Bakehouse ID), Wolfsonian (is free to FL residents), ICA is always free (rsvp your free tickets here)',
    NOW(),
    NOW()
);

-- 6. Jennifer Printz Exhibition
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    primary_link,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'Jennifer Printz "Infinite and Transient" Exhibition',
    'Jennifer Printz "Infinite and Transient" exhibition is now on view at Dimensions Variable. Jennifer uses textiles to reflect on the invisible architecture of life and the ever-changing universe. This series materializes air, expanding and contracting it in space, defying gravity. Photographs were printed on cotton and silk and manipulated into three-dimensional forms.',
    'published',
    1,
    ARRAY['exhibition', 'jennifer-printz', 'textiles', 'dimensions-variable'],
    'both',
    'opportunity',
    'exhibition',
    'Dimensions Variable',
    '2024-08-24 00:00:00-04:00',
    '2024-10-10 23:59:00-04:00',
    'https://dimensionsvariable.net', -- Replace with actual link
    'August 24th - October 10th, 2024',
    NOW(),
    NOW()
);

-- 7. Lujan Candria Exhibition
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    primary_link,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    'Lujan Candria - (RE)CHARGE to (RE)NEW Exhibition',
    'Lujan Candria invites you to (RE)CHARGE to (RE)NEW, a group exhibition at Doral Contemporary Art Museum.',
    'published',
    1,
    ARRAY['exhibition', 'lujan-candria', 'doral-museum', 'group-exhibition'],
    'both',
    'opportunity',
    'exhibition',
    'Doral Contemporary Art Museum',
    '2024-08-30 00:00:00-04:00',
    '2024-10-05 23:59:00-04:00',
    'https://doralmuseum.org', -- Replace with actual link
    'Preview: Saturday, August 30th at 4pm. Opening Reception: Saturday September 6th, 4:30pm-7:30pm. On view until October 5th',
    NOW(),
    NOW()
);

-- 8. CATS! The Exhibition
INSERT INTO announcements (
    id,
    org_id,
    author_clerk_id,
    title,
    body,
    status,
    priority,
    tags,
    visibility,
    type,
    sub_type,
    location,
    starts_at,
    ends_at,
    primary_link,
    additional_info,
    created_at,
    published_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM organizations WHERE slug = 'bakehouse'),
    'system', -- Using 'system' as author_clerk_id (matches existing announcements)
    '"CATS!" The Exhibition!',
    'Maria Theresa Barbist, Thomas Bils, and Christina Petterson invite you to "CATS!" The Exhibition! at Bridge Red Studios/Project Space, to Benefit the Humane Society of Greater Miami. This unique event is not only a tribute to these beloved companions but also aims to support a great cause, with 50% of the proceeds going directly to the Humane Society of Greater Miami, a no-kill shelter dedicated to rescuing and caring for animals.',
    'published',
    1,
    ARRAY['exhibition', 'cats', 'humane-society', 'benefit', 'bridge-red-studios'],
    'both',
    'opportunity',
    'exhibition',
    'Bridge Red Studios/Project Space',
    '2024-09-28 00:00:00-04:00',
    '2024-11-09 23:59:00-05:00',
    'https://bridgeredstudios.com', -- Replace with actual link
    'Opening reception: September 28th from 4-6 pm. The exhibition will run from September 28th to November 9th, 2024 at our project space, showcasing a diverse collection of artworks inspired by cats.',
    NOW(),
    NOW()
);

-- ==============================================
-- STEP 3: VERIFICATION
-- ==============================================

-- Check that all announcements were created successfully
SELECT 
    a.id,
    a.title,
    a.type,
    a.sub_type,
    a.status,
    a.created_at,
    o.name as org_name
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY a.created_at DESC;

-- Count total announcements for Bakehouse
SELECT 
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN type = 'event' THEN 1 END) as events,
    COUNT(CASE WHEN type = 'opportunity' THEN 1 END) as opportunities,
    COUNT(CASE WHEN type = 'administrative' THEN 1 END) as administrative
FROM announcements a
JOIN organizations o ON a.org_id = o.id
WHERE o.slug = 'bakehouse'
  AND a.deleted_at IS NULL;
