import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OrganizationTheme, THEME_TEMPLATES } from '@/lib/themes';

// This is a public API route - no authentication required
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/organizations/by-slug/[slug]/theme - Get organization theme by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get organization theme from database
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('id, slug, name, theme')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching organization:', error);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // If no theme is set, use template theme for this organization
    let theme = organization.theme;
    if (!theme || Object.keys(theme).length === 0) {
      const templateTheme = THEME_TEMPLATES[slug] || THEME_TEMPLATES['default'];
      theme = {
        ...templateTheme,
        id: organization.id,
        name: organization.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error fetching organization theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
