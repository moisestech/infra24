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

// POST - Upload media file
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const organizationId = formData.get('organizationId') as string
    const altText = formData.get('altText') as string
    const caption = formData.get('caption') as string
    const isPublic = formData.get('isPublic') === 'true'

    if (!file || !organizationId) {
      return NextResponse.json({ 
        error: 'Missing required fields: file, organizationId' 
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File size exceeds 10MB limit' 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed' 
      }, { status: 400 })
    }

    // Determine file type category
    let fileType = 'other'
    if (file.type.startsWith('image/')) {
      fileType = 'image'
    } else if (file.type.startsWith('video/')) {
      fileType = 'video'
    } else if (file.type.startsWith('audio/')) {
      fileType = 'audio'
    } else if (file.type === 'application/pdf' || 
               file.type.includes('document') || 
               file.type.includes('spreadsheet')) {
      fileType = 'document'
    } else if (file.type.includes('zip') || file.type.includes('rar')) {
      fileType = 'archive'
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomString}.${fileExtension}`

    // For now, we'll store the file info in the database
    // In a real implementation, you'd upload to a storage service like AWS S3, Cloudinary, etc.
    const fileUrl = `/uploads/${filename}` // This would be the actual file URL

    // Get image dimensions if it's an image
    let width = null
    let height = null
    if (fileType === 'image') {
      // In a real implementation, you'd extract image dimensions
      // For now, we'll set placeholder values
      width = 800
      height = 600
    }

    // Get duration if it's a video/audio file
    let duration = null
    if (fileType === 'video' || fileType === 'audio') {
      // In a real implementation, you'd extract media duration
      // For now, we'll set a placeholder value
      duration = 0
    }

    // Store file metadata in database
    const { data: mediaFile, error: mediaError } = await supabase
      .from('media_files')
      .insert({
        filename,
        original_filename: file.name,
        file_path: fileUrl,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        file_type: fileType,
        width,
        height,
        duration,
        alt_text: altText,
        caption,
        organization_id: organizationId,
        uploaded_by: userId,
        is_public: isPublic
      })
      .select()
      .single()

    if (mediaError) {
      console.error('Error storing media file metadata:', mediaError)
      return NextResponse.json({ error: 'Failed to store media file' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: mediaFile.id,
        filename: mediaFile.filename,
        originalFilename: mediaFile.original_filename,
        fileUrl: mediaFile.file_url,
        fileSize: mediaFile.file_size,
        mimeType: mediaFile.mime_type,
        fileType: mediaFile.file_type,
        width: mediaFile.width,
        height: mediaFile.height,
        duration: mediaFile.duration,
        altText: mediaFile.alt_text,
        caption: mediaFile.caption,
        uploadedAt: mediaFile.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Upload media API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - List media files
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const fileType = searchParams.get('fileType')
    const isPublic = searchParams.get('isPublic')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Build query
    let query = supabase
      .from('media_files')
      .select('*')
      .eq('organization_id', orgId)

    // Apply filters
    if (fileType) {
      query = query.eq('file_type', fileType)
    }

    if (isPublic !== null && isPublic !== undefined) {
      query = query.eq('is_public', isPublic === 'true')
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

    const { data: mediaFiles, error: mediaError } = await query

    if (mediaError) {
      console.error('Error fetching media files:', mediaError)
      return NextResponse.json({ error: 'Failed to fetch media files' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: mediaFiles
    })

  } catch (error) {
    console.error('Get media files API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
