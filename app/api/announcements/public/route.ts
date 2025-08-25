import { NextRequest, NextResponse } from 'next/server';

// GET /api/announcements/public - Get public announcements for homepage
export async function GET(request: NextRequest) {
  try {
    // For now, return mock data until we have the database set up
    // This will be replaced with actual Supabase queries
    const mockAnnouncements = [
      {
        id: '1',
        title: 'Open Studios This Weekend',
        body: 'Join us for our monthly open studios event featuring works from resident artists.',
        org_id: '550e8400-e29b-41d4-a716-446655440001',
        organization: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Bakehouse Art Complex',
          slug: 'bakehouse',
          description: 'Miami\'s premier artist residency and creative community space',
          location: 'Miami, FL',
          website_url: 'https://bacfl.org'
        },
        published_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 5,
        tags: ['event', 'open-studios', 'artists'],
        media: []
      },
      {
        id: '2',
        title: 'New Exhibition Opening',
        body: 'Contemporary Perspectives: A group show featuring emerging Miami artists.',
        org_id: '550e8400-e29b-41d4-a716-446655440002',
        organization: {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Oolite Arts',
          slug: 'oolite',
          description: 'Supporting artists and engaging the community through contemporary art',
          location: 'Miami Beach, FL',
          website_url: 'https://oolitearts.org'
        },
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 4,
        tags: ['exhibition', 'contemporary', 'opening'],
        media: []
      },
      {
        id: '3',
        title: 'Artist Residency Applications Open',
        body: 'Applications are now open for our 2025 artist residency program.',
        org_id: '550e8400-e29b-41d4-a716-446655440003',
        organization: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Fountainhead',
          slug: 'fountainhead',
          description: 'Artist residency program fostering creative exchange',
          location: 'Miami, FL',
          website_url: 'https://fountainheadarts.org'
        },
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 3,
        tags: ['residency', 'applications', 'opportunity'],
        media: []
      }
    ];

    return NextResponse.json(mockAnnouncements);
  } catch (error) {
    console.error('Error fetching public announcements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
