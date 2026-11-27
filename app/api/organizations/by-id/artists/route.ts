import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Get artists for the organization
    const { data: artists, error } = await supabase
      .from('artist_profiles')
      .select(`
        id,
        name,
        bio,
        profile_image,
        skills,
        mediums,
        website_url,
        instagram_handle,
        email,
        phone
      `)
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json(
        { error: 'Failed to fetch artists' },
        { status: 500 }
      );
    }

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error in artists API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const orgId = new URL(request.url).searchParams.get('org_id')
    const access = await requireOrganizationStaff(orgId)
    if (!access.ok) return NextResponse.json({error:access.error},{status:access.status,headers:{'Cache-Control':'private, no-store'}})
    const body = await request.json();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Create new artist profile
    const { data: artist, error } = await supabase
      .from('artist_profiles')
      .insert({
        organization_id: access.orgId,
        name: body.name,
        bio: body.bio,
        website_url: body.website_url,
        instagram_handle: body.instagram_handle,
        profile_image: body.profile_image
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating artist:', error);
      return NextResponse.json(
        { error: 'Failed to create artist' },
        { status: 500 }
      );
    }

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error('Error in artists POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}