-- Local / CI seed after migrations: Oolite org (by slug), control smoke user, artist, today's session.

DO $$
DECLARE
  org_uuid UUID;
  wid UUID;
  day_start timestamptz;
  day_end timestamptz;
BEGIN
  SELECT id INTO org_uuid FROM organizations WHERE slug = 'oolite' LIMIT 1;

  IF org_uuid IS NULL THEN
    INSERT INTO organizations (id, name, slug, timezone, is_active)
    VALUES (
        '73339522-c672-40ac-a464-e027e9c99d13',
        'Oolite Arts',
        'oolite',
        'America/New_York',
        true
      );
    org_uuid := '73339522-c672-40ac-a464-e027e9c99d13';
  ELSE
    UPDATE organizations
    SET
      timezone = COALESCE(timezone, 'America/New_York'),
      name = 'Oolite Arts'
    WHERE id = org_uuid;
  END IF;

  INSERT INTO org_memberships (org_id, user_id, clerk_user_id, role, is_active)
  VALUES (org_uuid, 'user_smoke_display', 'user_smoke_display', 'admin', true)
  ON CONFLICT (org_id, clerk_user_id) DO NOTHING;

  INSERT INTO control_identities (telegram_user_id, clerk_user_id, organization_id)
  VALUES ('999999001', 'user_smoke_display', org_uuid)
  ON CONFLICT (telegram_user_id, organization_id) DO NOTHING;

  INSERT INTO artist_profiles (
      organization_id,
      user_id,
      name,
      bio,
      is_public,
      studio_type,
      studio_location,
      metadata
    )
  VALUES (
      org_uuid,
      'artist_seed_display',
      'Seed Artist (display smoke)',
      'Bio for artist spotlight smoke tests.',
      true,
      'Studio Resident',
      'Lab',
      jsonb_build_object(
        'residency_type', 'Studio Resident',
        'year', '2026',
        'studio', 'Lab',
        'website', 'https://oolitearts.org',
        'instagram', '@oolitearts',
        'source', 'seed'
      )
    )
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  INSERT INTO artist_profiles (
      organization_id,
      user_id,
      name,
      bio,
      is_public,
      studio_type,
      studio_location,
      metadata
    )
  VALUES (
      org_uuid,
      'artist_seed_member_2',
      'Jordan Lee',
      'Mixed-media practice exploring memory and place.',
      true,
      'Studio Resident',
      '202',
      jsonb_build_object(
        'residency_type', 'Studio Resident',
        'year', '2026',
        'studio', '202',
        'website', 'https://oolitearts.org',
        'instagram', '@oolitearts',
        'source', 'seed'
      )
    )
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  INSERT INTO artist_profiles (
      organization_id,
      user_id,
      name,
      bio,
      is_public,
      studio_type,
      studio_location,
      metadata
    )
  VALUES (
      org_uuid,
      'artist_seed_staff_1',
      'Alex Rivera',
      'Education and community programs at Oolite Arts.',
      true,
      'Staff',
      'Front desk',
      jsonb_build_object(
        'residency_type', 'Staff',
        'year', '2026',
        'studio', 'Front desk',
        'website', 'https://oolitearts.org',
        'source', 'seed'
      )
    )
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  day_start := date_trunc('day', now() AT TIME ZONE 'America/New_York') AT TIME ZONE 'America/New_York';
  day_end := (date_trunc('day', now() AT TIME ZONE 'America/New_York') + interval '1 day') AT TIME ZONE 'America/New_York';

  SELECT id INTO wid
  FROM workshops
  WHERE organization_id = org_uuid AND title = 'Seed Workshop (digest)'
  LIMIT 1;

  IF wid IS NULL THEN
    INSERT INTO workshops (
        organization_id,
        title,
        description,
        is_active,
        is_public,
        created_by
      )
      VALUES (
        org_uuid,
        'Seed Workshop (digest)',
        'Used to verify workshop_digest playlist items locally.',
        true,
        true,
        'user_smoke_display'
      )
      RETURNING id INTO wid;
  END IF;

  IF NOT EXISTS (
      SELECT 1
      FROM workshop_sessions ws
      WHERE ws.workshop_id = wid
        AND ws.session_date >= day_start
        AND ws.session_date < day_end
    ) THEN
    INSERT INTO workshop_sessions (workshop_id, session_date, session_end_date, is_active, location)
    VALUES (
      wid,
      (date_trunc('day', now() AT TIME ZONE 'America/New_York') + interval '14 hours') AT TIME ZONE 'America/New_York',
      (date_trunc('day', now() AT TIME ZONE 'America/New_York') + interval '16 hours') AT TIME ZONE 'America/New_York',
      true,
      'Digital Lab'
    );
  END IF;
END $$;
