import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Resources API: Starting GET request')
    console.log('🔍 Resources API: orgId =', params.orgId)
    
    const { data: resources, error } = await supabaseClient
      .from('resources')
      .select('*')
      .eq('org_id', params.orgId)
      .eq('is_bookable', true)
      .order('title')

    console.log('🔍 Resources API: Query result:', { resources, error })

    if (error) {
      console.error('❌ Resources API: Error fetching resources:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch resources',
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Resources API: Successfully fetched', resources?.length || 0, 'resources')
    
    return NextResponse.json({
      resources: resources || [],
      count: resources?.length || 0
    })

  } catch (err) {
    console.error('❌ Resources API: Unexpected error:', err)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    console.log('🔍 Resources API: Starting POST request')
    console.log('🔍 Resources API: orgId =', params.orgId)
    
    const body = await request.json()
    console.log('🔍 Resources API: Request body:', body)

    const { data: resource, error } = await supabaseClient
      .from('resources')
      .insert({
        ...body,
        org_id: params.orgId
      })
      .select()
      .single()

    console.log('🔍 Resources API: Insert result:', { resource, error })

    if (error) {
      console.error('❌ Resources API: Error creating resource:', error)
      return NextResponse.json(
        { 
          error: 'Failed to create resource',
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Resources API: Successfully created resource:', resource?.id)
    
    return NextResponse.json({
      resource,
      message: 'Resource created successfully'
    }, { status: 201 })

  } catch (err) {
    console.error('❌ Resources API: Unexpected error:', err)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}