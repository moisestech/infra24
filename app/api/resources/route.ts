import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { createSuccessResponse, createErrorResponse, HTTP_STATUS, ERROR_MESSAGES } from '@/lib/api-response'

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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      const { response, status } = createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      return NextResponse.json(response, { status })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organizationId')
    const type = searchParams.get('type')
    const isBookable = searchParams.get('isBookable')

    if (!orgId) {
      const { response, status } = createErrorResponse('Organization ID is required', HTTP_STATUS.BAD_REQUEST)
      return NextResponse.json(response, { status })
    }

    // Check if user is member of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      const { response, status } = createErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      return NextResponse.json(response, { status })
    }

    // Build query
    let query = supabase
      .from('resources')
      .select('*')
      .eq('organization_id', orgId)

    if (type) {
      query = query.eq('type', type)
    }

    if (isBookable !== null) {
      query = query.eq('is_bookable', isBookable === 'true')
    }

    const { data: resources, error: resourcesError } = await query.order('title', { ascending: true })

    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError)
      const { response, status } = createErrorResponse('Failed to fetch resources', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      return NextResponse.json(response, { status })
    }

    return NextResponse.json(createSuccessResponse(resources))

  } catch (error) {
    console.error('Resources API error:', error)
    const { response, status } = createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    return NextResponse.json(response, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      const { response, status } = createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      return NextResponse.json(response, { status })
    }

    const body = await request.json()
    const { 
      organizationId, 
      title, 
      description, 
      type, 
      capacity = 1, 
      isBookable = true,
      metadata = {}
    } = body

    // Validate required fields
    if (!organizationId || !title || !type) {
      const { response, status } = createErrorResponse(
        'Missing required fields: organizationId, title, type',
        HTTP_STATUS.BAD_REQUEST
      )
      return NextResponse.json(response, { status })
    }

    // Validate type
    const validTypes = ['space', 'equipment', 'person', 'other']
    if (!validTypes.includes(type)) {
      const { response, status } = createErrorResponse(
        `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      )
      return NextResponse.json(response, { status })
    }

    // Check if user is admin of organization
    const { data: membership, error: membershipError } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      const { response, status } = createErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      return NextResponse.json(response, { status })
    }

    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      const { response, status } = createErrorResponse('Admin access required', HTTP_STATUS.FORBIDDEN)
      return NextResponse.json(response, { status })
    }

    // Create resource
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        organization_id: organizationId,
        title,
        description,
        type,
        capacity,
        is_bookable: isBookable,
        metadata,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (resourceError) {
      console.error('Error creating resource:', resourceError)
      const { response, status } = createErrorResponse('Failed to create resource', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      return NextResponse.json(response, { status })
    }

    return NextResponse.json(createSuccessResponse(resource, 'Resource created successfully'), { status: HTTP_STATUS.CREATED })

  } catch (error) {
    console.error('Create resource API error:', error)
    const { response, status } = createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    return NextResponse.json(response, { status })
  }
}
