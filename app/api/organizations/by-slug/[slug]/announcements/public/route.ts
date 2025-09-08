import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First, get the organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get public announcements for this organization
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        id,
        title,
        body,
        status,
        author_clerk_id,
        created_at,
        published_at,
        expires_at,
        priority,
        tags,
        org_id,
        scheduled_at,
        location,
        visibility,
        starts_at,
        ends_at,
        type,
        sub_type,
        primary_link,
        additional_info,
        image_url,
        people,
        external_orgs,
        style,
        timezone,
        is_all_day,
        is_time_tbd,
        rsvp_label,
        rsvp_url,
        event_state
      `)
      .eq('org_id', organization.id)
      .in('visibility', ['external', 'both'])
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching public announcements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      announcements: announcements || [],
      organization
    });

  } catch (error) {
    console.error('Error in public announcements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
