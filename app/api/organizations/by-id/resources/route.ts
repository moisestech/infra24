import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params;

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Get resources for the organization
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error in resources API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params;
    const body = await request.json();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Create new resource
    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        org_id: orgId,
        ...body
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating resource:', error);
      return NextResponse.json(
        { error: 'Failed to create resource' },
        { status: 500 }
      );
    }

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error in resources POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}