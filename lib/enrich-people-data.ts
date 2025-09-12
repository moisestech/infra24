import { createClient } from '@supabase/supabase-js';
import { AnnouncementPerson } from '@/types/people';

// Create Supabase client only if environment variables are available
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

/**
 * Enriches people data in announcements with actual member information from the database
 * This connects announcement people to real Bakehouse members and their profile images
 */
export async function enrichPeopleData(
  people: any[], 
  organizationSlug: string = 'bakehouse'
): Promise<AnnouncementPerson[]> {
  if (!people || people.length === 0) {
    return [];
  }

  // Check if we have the Supabase client available
  if (!supabase) {
    console.warn('Supabase client not available, returning original people data');
    return people.map(person => ({
      ...person,
      is_member: false,
      relationship_type: person.relationship_type || 'participant'
    }));
  }

  try {
    // Get the organization
    const { data: organization } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', organizationSlug)
      .single();

    if (!organization) {
      console.warn(`Organization with slug '${organizationSlug}' not found`);
      return people.map(person => ({
        ...person,
        is_member: false,
        relationship_type: person.relationship_type || 'participant'
      }));
    }

    // Get all artist profiles for this organization with their images
    const { data: artistProfiles } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        email,
        profile_image,
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
      .is('deleted_at', null);

    // Get all org memberships for this organization
    const { data: memberships } = await supabase
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
      .eq('org_id', organization.id);

    // Create lookup maps for efficient matching
    const artistProfileMap = new Map();
    const membershipMap = new Map();

    artistProfiles?.forEach(profile => {
      if (profile.claimed_by_clerk_user_id) {
        artistProfileMap.set(profile.claimed_by_clerk_user_id, profile);
      }
      // Also index by name for fuzzy matching
      artistProfileMap.set(profile.name.toLowerCase(), profile);
    });

    memberships?.forEach(membership => {
      membershipMap.set(membership.clerk_user_id, membership);
    });

    // Enrich each person with member data
    const enrichedPeople: AnnouncementPerson[] = people.map(person => {
      let enrichedPerson: AnnouncementPerson = {
        ...person,
        is_member: false,
        relationship_type: person.relationship_type || 'participant'
      };

      // Try to match by member_id first (if it's a clerk_user_id)
      if (person.member_id && membershipMap.has(person.member_id)) {
        const membership = membershipMap.get(person.member_id);
        const artistProfile = artistProfileMap.get(person.member_id);
        
        if (artistProfile) {
          enrichedPerson = {
            ...enrichedPerson,
            id: artistProfile.id,
            name: artistProfile.name || person.name,
            email: artistProfile.email || person.email,
            avatar_url: artistProfile.profile_image || person.avatar_url,
            is_member: true,
            member_id: person.member_id,
            role: artistProfile.org_member_types?.[0]?.label || membership.role || person.role,
            organization: organization.name
          };
        }
      }
      // Try to match by name (fuzzy matching)
      else if (person.name) {
        const normalizedName = person.name.toLowerCase();
        const artistProfile = artistProfileMap.get(normalizedName);
        
        if (artistProfile && artistProfile.claimed_by_clerk_user_id) {
          const membership = membershipMap.get(artistProfile.claimed_by_clerk_user_id);
          
          enrichedPerson = {
            ...enrichedPerson,
            id: artistProfile.id,
            name: artistProfile.name,
            email: artistProfile.email || person.email,
            avatar_url: artistProfile.profile_image || person.avatar_url,
            is_member: true,
            member_id: artistProfile.claimed_by_clerk_user_id,
            role: artistProfile.org_member_types?.[0]?.label || membership?.role || person.role,
            organization: organization.name
          };
        }
      }

      return enrichedPerson;
    });

    return enrichedPeople;

  } catch (error) {
    console.error('Error enriching people data:', error);
    // Return original data if enrichment fails
    return people.map(person => ({
      ...person,
      is_member: false,
      relationship_type: person.relationship_type || 'participant'
    }));
  }
}

/**
 * Gets all available Bakehouse members for selection in announcements
 */
export async function getBakehouseMembers(): Promise<AnnouncementPerson[]> {
  // Check if we have the Supabase client available
  if (!supabase) {
    console.warn('Supabase client not available, returning empty array');
    return [];
  }

  try {
    const { data: organization } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', 'bakehouse')
      .single();

    if (!organization) {
      return [];
    }

    // Get all claimed artist profiles with their member type information
    const { data: artistProfiles } = await supabase
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

    if (!artistProfiles) {
      return [];
    }

    return artistProfiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar_url: profile.profile_image,
      is_member: true,
      member_id: profile.claimed_by_clerk_user_id,
      role: profile.org_member_types?.[0]?.label || 'Member',
      organization: organization.name,
      relationship_type: 'participant' as const
    }));

  } catch (error) {
    console.error('Error fetching Bakehouse members:', error);
    return [];
  }
}
