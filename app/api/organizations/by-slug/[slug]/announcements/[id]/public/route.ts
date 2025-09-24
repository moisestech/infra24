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
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params;

    // First, get the organization by slug
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get the specific public announcement
    const { data: announcement, error } = await supabase
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
      .eq('id', id)
      .eq('organization_id', organization.id)
      .in('visibility', ['public'])
      .eq('is_active', true)
      .single();

    if (error || !announcement) {
      return NextResponse.json({ error: 'Announcement not found or not publicly accessible' }, { status: 404 });
    }

    return NextResponse.json({
      announcement,
      organization
    });

  } catch (error) {
    console.error('Error in public announcement API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
