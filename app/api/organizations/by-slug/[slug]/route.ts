import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log('🔍 API Route: /api/organizations/by-slug/[slug] - Starting request');
    
    const authResult = await auth();
    const { userId } = authResult;
    
    console.log('🔐 Auth result:', { userId, hasUserId: !!userId });

    const { slug } = await params;
    console.log('📍 Requested slug:', slug);

    const supabase = createClient();

    // Get the organization by slug
    console.log('🏢 Looking up organization with slug:', slug);
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug, description, logo_url, banner_image, favicon_url, website, email, phone, address, city, state, zip_code, country, settings, theme, theme_colors, horizontal_logo_url, artist_icon, is_active, created_at, updated_at')
      .eq('slug', slug)
      .single();

    console.log('🏢 Organization lookup result:', { organization, orgError });

    if (orgError || !organization) {
      console.log('❌ Organization not found:', orgError);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // For now, skip user permission checks since we made this route public for testing
    console.log('✅ Returning organization data (public access)');
    return NextResponse.json({
      organization
    });

  } catch (error) {
    console.error('Error in organization by slug API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
