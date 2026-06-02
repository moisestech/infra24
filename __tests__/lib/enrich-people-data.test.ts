import {
  enrichPeopleWithContext,
  type PeopleEnrichmentContext,
} from '@/lib/enrich-people-data';

function buildContext(overrides?: Partial<PeopleEnrichmentContext>): PeopleEnrichmentContext {
  const artistProfileMap = new Map<string, any>();
  artistProfileMap.set('user_123', {
    id: 'profile-1',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    profile_image: 'https://example.com/jordan.jpg',
    avatar_url: 'https://example.com/jordan.jpg',
    studio_location: '101',
    metadata: { studio: '101', headshot_url: 'https://example.com/jordan-head.jpg' },
    claimed_by_clerk_user_id: 'user_123',
    org_member_types: [{ label: 'Studio Resident' }],
  });
  artistProfileMap.set('jordan lee', artistProfileMap.get('user_123'));

  const membershipMap = new Map<string, any>();
  membershipMap.set('user_123', {
    clerk_user_id: 'user_123',
    role: 'member',
    org_member_types: [{ label: 'Studio Resident' }],
  });

  return {
    organizationName: 'Oolite Arts',
    artistProfileMap,
    membershipMap,
    ...overrides,
  };
}

describe('enrichPeopleWithContext', () => {
  it('returns empty array for empty input', () => {
    expect(enrichPeopleWithContext([], buildContext())).toEqual([]);
  });

  it('enriches by member_id', () => {
    const result = enrichPeopleWithContext(
      [{ name: 'Jordan', member_id: 'user_123', relationship_type: 'speaker' }],
      buildContext()
    );

    expect(result[0]).toMatchObject({
      id: 'profile-1',
      name: 'Jordan Lee',
      avatar_url: 'https://example.com/jordan-head.jpg',
      is_member: true,
      member_id: 'user_123',
      role: 'Studio 101',
      organization: 'Oolite Arts',
      relationship_type: 'speaker',
    });
  });

  it('enriches by normalized name when member_id is missing', () => {
    const result = enrichPeopleWithContext([{ name: 'Jordan Lee' }], buildContext());

    expect(result[0]).toMatchObject({
      id: 'profile-1',
      is_member: true,
      member_id: 'user_123',
      organization: 'Oolite Arts',
      relationship_type: 'participant',
    });
  });

  it('enriches unclaimed residents by name with studio number', () => {
    const unclaimed = {
      id: 'profile-2',
      name: 'Ana Mosquera',
      email: null,
      profile_image: 'https://example.com/ana.jpg',
      avatar_url: 'https://example.com/ana.jpg',
      studio_location: '202',
      metadata: { studio: '202', headshot_url: 'https://example.com/ana-head.jpg' },
      claimed_by_clerk_user_id: null,
      org_member_types: [{ label: 'Studio Resident' }],
    };
    const ctx = buildContext({
      artistProfileMap: new Map([['ana mosquera', unclaimed]]),
    });
    const result = enrichPeopleWithContext([{ name: 'Ana Mosquera', role: 'resident' }], ctx);
    expect(result[0]).toMatchObject({
      name: 'Ana Mosquera',
      role: 'Studio 202',
      avatar_url: 'https://example.com/ana-head.jpg',
      is_member: false,
    });
  });

  it('falls back to external participant when no match exists', () => {
    const result = enrichPeopleWithContext(
      [{ name: 'Guest Artist', role: 'Curator' }],
      buildContext()
    );

    expect(result[0]).toMatchObject({
      name: 'Guest Artist',
      role: 'Curator',
      is_member: false,
      relationship_type: 'participant',
    });
  });
});
