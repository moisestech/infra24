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
    console.log('🌐 Public announcements API - fetching for slug:', slug);

    // First, get the organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      console.log('🌐 Organization not found for slug:', slug, 'Error:', orgError);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    console.log('🌐 Found organization:', organization);

    // Get public announcements for this organization
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        type,
        priority,
        visibility,
        start_date,
        end_date,
        location,
        key_people,
        metadata,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
      `)
      .eq('organization_id', organization.id)
      .in('visibility', ['public'])
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🌐 Error fetching public announcements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      );
    }

    console.log('🌐 Successfully fetched public announcements:', announcements?.length || 0, 'announcements');

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

