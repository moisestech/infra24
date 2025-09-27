import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { OrganizationTheme, THEME_TEMPLATES } from '@/lib/themes';

// GET /api/organizations/[orgId]/theme - Get organization theme
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
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
    
    // Get organization theme from database
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('id, slug, name, theme')
      .eq('id', (await params).orgId)
      .single();

    if (error) {
      console.error('Error fetching organization:', error);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // If no theme is set, use default theme
    let theme = organization.theme;
    if (!theme || Object.keys(theme).length === 0) {
      const defaultTheme = THEME_TEMPLATES['default'];
      theme = {
        ...defaultTheme,
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

// PUT /api/organizations/[orgId]/theme - Update organization theme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
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
    const body = await request.json();
    
    // Validate theme data
    if (!body.theme) {
      return NextResponse.json({ error: 'Theme data is required' }, { status: 400 });
    }

    const theme: OrganizationTheme = {
      ...body.theme,
      id: (await params).orgId,
      updatedAt: new Date().toISOString(),
    };

    // Update organization theme in database
    const { data, error } = await supabase
      .from('organizations')
      .update({ 
        theme: theme,
        updated_at: new Date().toISOString()
      })
      .eq('id', (await params).orgId)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization theme:', error);
      return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
    }

    return NextResponse.json({ theme, organization: data });
  } catch (error) {
    console.error('Error updating organization theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/organizations/[orgId]/theme/reset - Reset to default theme
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
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
    
    // Get organization info
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug, name')
      .eq('id', (await params).orgId)
      .single();

    if (orgError) {
      console.error('Error fetching organization:', orgError);
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get default theme for this organization
    const defaultTheme = THEME_TEMPLATES[organization.slug] || THEME_TEMPLATES['default'];
    const theme: OrganizationTheme = {
      ...defaultTheme,
      id: organization.id,
      name: organization.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as OrganizationTheme;

    // Update organization theme in database
    const { data, error } = await supabase
      .from('organizations')
      .update({ 
        theme: theme,
        updated_at: new Date().toISOString()
      })
      .eq('id', (await params).orgId)
      .select()
      .single();

    if (error) {
      console.error('Error resetting organization theme:', error);
      return NextResponse.json({ error: 'Failed to reset theme' }, { status: 500 });
    }

    return NextResponse.json({ theme, organization: data });
  } catch (error) {
    console.error('Error resetting organization theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
