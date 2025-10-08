import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// GET /api/surveys/templates - List survey templates
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');

    const supabaseAdmin = getSupabaseAdmin();
    const supabase = supabaseAdmin;

    // Build query
    let query = supabase
      .from('survey_templates')
      .select('*')
      .order('created_at', { ascending: false });

    // Show public templates (RLS should handle access control)
    query = query.eq('is_public', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (isPublic !== null) {
      query = query.eq('is_public', isPublic === 'true');
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Error in survey templates API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/surveys/templates - Create survey template
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      templateSchema,
      isPublic = false
    } = body;

    if (!name || !category || !templateSchema) {
      return NextResponse.json({ 
        error: 'Name, category, and template schema are required' 
      }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const supabase = supabaseAdmin;

    // Create template
    const { data: template, error } = await supabase
      .from('survey_templates')
      .insert({
        name,
        description,
        category,
        template_schema: templateSchema,
        is_public: isPublic,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error in create survey template API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
