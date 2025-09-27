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

// GET - Fetch event materials
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params

    // Fetch event materials
    const { data: materials, error: materialsError } = await supabase
      .from('event_materials')
      .select('*')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: true })

    if (materialsError) {
      console.error('Error fetching event materials:', materialsError)
      return NextResponse.json({ error: 'Failed to fetch event materials' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: materials
    })

  } catch (error) {
    console.error('Get event materials API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create event material
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await params
    const body = await request.json()
    const { 
      title, 
      description, 
      fileUrl, 
      fileType, 
      fileSize,
      mimeType,
      isPublic = true,
      sortOrder = 0
    } = body

    // Validate required fields
    if (!title || !fileUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, fileUrl' 
      }, { status: 400 })
    }

    // Create event material
    const { data: material, error: materialError } = await supabase
      .from('event_materials')
      .insert({
        event_id: eventId,
        title,
        description,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        mime_type: mimeType,
        is_public: isPublic,
        sort_order: sortOrder,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single()

    if (materialError) {
      console.error('Error creating event material:', materialError)
      return NextResponse.json({ error: 'Failed to create event material' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: material
    }, { status: 201 })

  } catch (error) {
    console.error('Create event material API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
