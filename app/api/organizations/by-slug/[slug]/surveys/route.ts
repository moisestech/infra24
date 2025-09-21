import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    console.log('🔍 API Route: /api/organizations/by-slug/[slug]/surveys - Starting request')
    
    const { slug } = await params
    console.log('📍 Requested slug:', slug)

    // Get the organization by slug
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', slug)
      .single()

    if (orgError || !organization) {
      console.log('❌ Organization not found:', orgError)
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    console.log('🏢 Found organization:', organization.name)

    // Get surveys for this organization
    const { data: surveys, error: surveysError } = await supabaseAdmin
      .from('submission_forms')
      .select(`
        id,
        title,
        description,
        category,
        type,
        form_schema,
        submission_settings,
        is_public,
        requires_authentication,
        created_at
      `)
      .eq('organization_id', organization.id)
      .eq('type', 'survey')
      .eq('is_active', true)
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
