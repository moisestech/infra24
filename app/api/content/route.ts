import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// GET - Fetch content items
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const contentType = searchParams.get('contentType')
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('content_items')
      .select(`
        *,
        content_versions (
          id,
          version,
          change_summary,
          created_at,
          created_by
        )
      `)
      .eq('organization_id', orgId)

    // Apply filters
    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (published !== null && published !== undefined) {
      query = query.eq('published', published === 'true')
    }

    if (featured !== null && featured !== undefined) {
      query = query.eq('featured', featured === 'true')
    }

    // Apply pagination
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || '10')) - 1)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    const { data: content, error: contentError } = await query

    if (contentError) {
      console.error('Error fetching content:', contentError)
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: content
    })

  } catch (error) {
    console.error('Get content API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create content item
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      organizationId,
      title, 
      slug,
      content, 
      excerpt,
      contentType = 'article',
      category,
      tags = [],
      published = false,
      featured = false,
      featuredUntil,
      seoTitle,
      seoDescription,
      seoKeywords = []
    } = body

    // Validate required fields
    if (!organizationId || !title || !slug || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: organizationId, title, slug, content' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingContent, error: existingError } = await supabase
      .from('content_items')
      .select('id')
      .eq('slug', slug)
      .eq('organization_id', organizationId)
      .single()

    if (existingContent) {
      return NextResponse.json({ 
        error: 'Content with this slug already exists' 
      }, { status: 409 })
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Create content item
    const { data: contentItem, error: contentError } = await supabase
      .from('content_items')
      .insert({
        organization_id: organizationId,
        title,
        slug,
        content,
        excerpt,
        content_type: contentType,
        category,
        tags,
        author_id: userId,
        published,
        featured,
        featured_until: featuredUntil,
        reading_time: readingTime,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        published_at: published ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (contentError) {
      console.error('Error creating content:', contentError)
      return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
    }

    // Create initial version
    const { error: versionError } = await supabase
      .from('content_versions')
      .insert({
        content_id: contentItem.id,
        version: 1,
        content,
        change_summary: 'Initial version',
        created_by: userId
      })

    if (versionError) {
      console.error('Error creating content version:', versionError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      data: contentItem
    }, { status: 201 })

  } catch (error) {
    console.error('Create content API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
