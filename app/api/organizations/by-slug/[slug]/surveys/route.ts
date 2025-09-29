import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log('🔍 API Route: /api/organizations/by-slug/[slug]/surveys - Starting request')
    
    const { slug } = await params
    console.log('📍 Requested slug:', slug)

    // Get the organization by slug
    const supabase = createClient()

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single()

    if (orgError || !organization) {
      console.log('❌ Organization not found:', orgError)
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    console.log('🏢 Found organization:', organization.name)

    // Get surveys for this organization with template data
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select(`
        id,
        title,
        description,
        status,
        is_anonymous,
        opens_at,
        closes_at,
        survey_schema,
        settings,
        template_id,
        survey_templates (
          id,
          name,
          template_schema
        ),
        created_at,
        updated_at
      `)
      .eq('organization_id', organization.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (surveysError) {
      console.error('❌ Error fetching surveys:', surveysError)
      return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
    }

    console.log('📋 Found surveys:', surveys?.length || 0)

    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      },
      surveys: surveys || []
    })

  } catch (error) {
    console.error('Error in surveys API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
