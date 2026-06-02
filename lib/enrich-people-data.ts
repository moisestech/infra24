import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { normalizePersonNameForMatch } from '@/lib/display/person-name-match';
import { studioNumberFromArtistPayload } from '@/lib/display/artist-studio-number';
import { AnnouncementPerson } from '@/types/people';

type OrganizationRef = {
  id: string;
  name: string;
  slug?: string;
};

type ArtistProfileRow = {
  id: string;
  name: string;
  email: string | null;
  profile_image: string | null;
  avatar_url: string | null;
  studio_location: string | null;
  metadata: Record<string, unknown> | null;
  claimed_by_clerk_user_id: string | null;
  org_member_types: Array<{ label?: string }> | null;
};

type MembershipRow = {
  clerk_user_id: string;
  role: string;
  org_member_types: Array<{ label?: string }> | null;
};

export type PeopleEnrichmentContext = {
  organizationName: string;
  artistProfileMap: Map<string, ArtistProfileRow>;
  membershipMap: Map<string, MembershipRow>;
};

function resolveProfileHeadshot(profile: ArtistProfileRow): string | null {
  const meta = profile.metadata;
  if (meta && typeof meta === 'object') {
    const headshot = meta.headshot_url;
    if (typeof headshot === 'string' && headshot.trim()) return headshot.trim();
  }
  return (profile.avatar_url || profile.profile_image || '').trim() || null;
}

function resolveStudioRoleFromProfile(
  profile: ArtistProfileRow,
  fallbackRole?: string
): string | undefined {
  const studio = studioNumberFromArtistPayload({
    studio_location: profile.studio_location,
    metadata: profile.metadata,
  });
  if (studio) return `Studio ${studio}`;
  const role = fallbackRole?.trim();
  if (role && !/^resident$/i.test(role)) return role;
  return profile.org_member_types?.[0]?.label || role || undefined;
}

function mergeArtistProfileIntoPerson(
  person: Record<string, unknown>,
  enrichedPerson: AnnouncementPerson,
  profile: ArtistProfileRow,
  context: PeopleEnrichmentContext
): AnnouncementPerson {
  const memberId = profile.claimed_by_clerk_user_id;
  return {
    ...enrichedPerson,
    id: profile.id,
    name: profile.name || (person.name as string),
    email: profile.email || (person.email as string | undefined),
    avatar_url: resolveProfileHeadshot(profile) || (person.avatar_url as string | undefined),
    is_member: Boolean(memberId),
    member_id: memberId || enrichedPerson.member_id,
    role: resolveStudioRoleFromProfile(profile, person.role as string | undefined),
    organization: context.organizationName,
  };
}

function withParticipantDefaults(person: Record<string, unknown>): AnnouncementPerson {
  return {
    ...(person as AnnouncementPerson),
    is_member: false,
    relationship_type:
      (person.relationship_type as AnnouncementPerson['relationship_type']) || 'participant',
  };
}

/** Announcement name → canonical normalized profile name */
const PERSON_NAME_ALIASES: Record<string, string> = {
  'nadia wolff': 'nadia wolf',
};

function findArtistProfileByName(
  context: PeopleEnrichmentContext,
  name: string
): ArtistProfileRow | undefined {
  const key = normalizePersonNameForMatch(name);
  if (!key) return undefined;
  const resolved = PERSON_NAME_ALIASES[key] ?? key;
  return context.artistProfileMap.get(resolved);
}

function getAnnouncementPeople(announcement: {
  people?: unknown;
  key_people?: unknown;
}): unknown[] {
  if (Array.isArray(announcement.people) && announcement.people.length > 0) {
    return announcement.people;
  }
  if (Array.isArray(announcement.key_people) && announcement.key_people.length > 0) {
    return announcement.key_people;
  }
  return [];
}

export async function loadPeopleEnrichmentContext(
  organization: OrganizationRef
): Promise<PeopleEnrichmentContext | null> {
  const supabase = createClient();

  const [{ data: artistProfiles, error: artistError }, { data: memberships, error: membershipError }] =
    await Promise.all([
      supabase
        .from('artist_profiles')
        .select(`
          id,
          name,
          email,
          profile_image,
          avatar_url,
          studio_location,
          metadata,
          is_claimed,
          claimed_by_clerk_user_id,
          member_type_id,
          org_member_types(
            id,
            type_key,
            label,
            is_staff
          )
        `)
        .eq('organization_id', organization.id)
        .is('deleted_at', null),
      supabase
        .from('org_memberships')
        .select(`
          clerk_user_id,
          role,
          org_member_types(
            id,
            type_key,
            label,
            is_staff
          )
        `)
        .eq('org_id', organization.id),
    ]);

  if (artistError) {
    console.error('Error loading artist profiles for people enrichment:', artistError);
    return null;
  }

  if (membershipError) {
    console.error('Error loading memberships for people enrichment:', membershipError);
    return null;
  }

  const artistProfileMap = new Map<string, ArtistProfileRow>();
  artistProfiles?.forEach((profile) => {
    const row = profile as ArtistProfileRow;
    if (row.claimed_by_clerk_user_id) {
      artistProfileMap.set(row.claimed_by_clerk_user_id, row);
    }
    const normalized = normalizePersonNameForMatch(row.name);
    artistProfileMap.set(normalized, row);
    for (const [alias, target] of Object.entries(PERSON_NAME_ALIASES)) {
      if (target === normalized) {
        artistProfileMap.set(alias, row);
      }
    }
  });

  const membershipMap = new Map<string, MembershipRow>();
  memberships?.forEach((membership) => {
    membershipMap.set(membership.clerk_user_id, membership);
  });

  return {
    organizationName: organization.name,
    artistProfileMap,
    membershipMap,
  };
}

export function enrichPeopleWithContext(
  people: unknown[],
  context: PeopleEnrichmentContext
): AnnouncementPerson[] {
  if (!people || people.length === 0) {
    return [];
  }

  return people.map((rawPerson) => {
    const person = rawPerson as Record<string, unknown>;
    let enrichedPerson = withParticipantDefaults(person);

    if (person.member_id && context.membershipMap.has(String(person.member_id))) {
      const memberId = String(person.member_id);
      const artistProfile = context.artistProfileMap.get(memberId);

      if (artistProfile) {
        enrichedPerson = mergeArtistProfileIntoPerson(
          person,
          enrichedPerson,
          artistProfile,
          context
        );
      }
    } else if (person.name) {
      const artistProfile = findArtistProfileByName(context, String(person.name));

      if (artistProfile) {
        enrichedPerson = mergeArtistProfileIntoPerson(
          person,
          enrichedPerson,
          artistProfile,
          context
        );
      }
    }

    return enrichedPerson;
  });
}

/**
 * Enriches people arrays on announcements using one org-scoped lookup per request.
 */
export async function enrichAnnouncementsPeople<T extends { people?: unknown; key_people?: unknown }>(
  announcements: T[],
  organization: OrganizationRef
): Promise<T[]> {
  if (!announcements.length) {
    return announcements;
  }

  const hasPeople = announcements.some((announcement) => getAnnouncementPeople(announcement).length > 0);
  if (!hasPeople) {
    return announcements;
  }

  const context = await loadPeopleEnrichmentContext(organization);
  if (!context) {
    return announcements.map((announcement) => {
      const rawPeople = getAnnouncementPeople(announcement);
      if (rawPeople.length === 0) {
        return announcement;
      }

      const enrichedPeople = rawPeople.map((person) =>
        withParticipantDefaults(person as Record<string, unknown>)
      );

      return {
        ...announcement,
        people: enrichedPeople,
      };
    });
  }

  return announcements.map((announcement) => {
    const rawPeople = getAnnouncementPeople(announcement);
    if (rawPeople.length === 0) {
      return announcement;
    }

    return {
      ...announcement,
      people: enrichPeopleWithContext(rawPeople, context),
    };
  });
}

/**
 * Enriches a single people list for one organization slug.
 */
export async function enrichPeopleData(
  people: unknown[],
  organizationSlug: string = 'bakehouse'
): Promise<AnnouncementPerson[]> {
  if (!people || people.length === 0) {
    return [];
  }

  const supabase = createClient();
  const { data: organization, error } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', organizationSlug)
    .single();

  if (error || !organization) {
    console.error(`Unable to load organization '${organizationSlug}' for people enrichment:`, error);
    return people.map((person) => withParticipantDefaults(person as Record<string, unknown>));
  }

  const context = await loadPeopleEnrichmentContext(organization);
  if (!context) {
    return people.map((person) => withParticipantDefaults(person as Record<string, unknown>));
  }

  return enrichPeopleWithContext(people, context);
}

/**
 * Gets all available Bakehouse members for selection in announcements.
 */
export async function getBakehouseMembers(): Promise<AnnouncementPerson[]> {
  const supabase = createClient();

  try {
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'bakehouse')
      .single();

    if (error || !organization) {
      return [];
    }

    const { data: artistProfiles, error: artistError } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        email,
        profile_image,
        claimed_by_clerk_user_id,
        member_type_id,
        org_member_types(
          id,
          type_key,
          label,
          is_staff
        )
      `)
      .eq('organization_id', organization.id)
      .eq('is_claimed', true)
      .is('deleted_at', null)
      .order('name');

    if (artistError || !artistProfiles) {
      console.error('Error fetching Bakehouse members:', artistError);
      return [];
    }

    return artistProfiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar_url: profile.profile_image,
      is_member: true,
      member_id: profile.claimed_by_clerk_user_id,
      role: profile.org_member_types?.[0]?.label || 'Member',
      organization: organization.name,
      relationship_type: 'participant' as const,
    }));
  } catch (error) {
    console.error('Error fetching Bakehouse members:', error);
    return [];
  }
}
