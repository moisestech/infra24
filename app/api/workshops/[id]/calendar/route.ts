import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { generateWorkshopICS, generateWorkshopRegistrationICS, createWorkshopEventData, generateICSFilename } from '@/lib/calendar/ics-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'workshop' // 'workshop', 'registration', 'cancellation'
    const registrationId = searchParams.get('registrationId')

    if (!workshopId) {
      return NextResponse.json({ error: 'Workshop ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        description,
        max_participants,
        duration_minutes,
        instructor,
        resources!default_resource_id (
          title
        ),
        artist_profiles!instructor_profile_id (
          name
        ),
        organizations!organization_id (
          id,
          name,
          slug
        )
      `)
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      console.error('Error fetching workshop:', workshopError)
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Get registration details if provided
    let registration = null
    if (registrationId) {
      const { data: regData } = await supabase
        .from('workshop_registrations')
        .select('id, status, registered_at')
        .eq('id', registrationId)
        .eq('workshop_id', workshopId)
        .single()
      
      registration = regData
    }

    // Create workshop event data
    const eventData = createWorkshopEventData(
      workshop,
      workshop.organizations,
      registration
    )

    // Generate ICS content based on type
    let icsContent: string
    let filename: string

    switch (type) {
      case 'registration':
        icsContent = generateWorkshopRegistrationICS(eventData)
        filename = generateICSFilename(workshop.title, eventData.startDate, 'registration')
        break
      case 'cancellation':
        icsContent = generateWorkshopRegistrationICS(eventData) // Use same format for now
        filename = generateICSFilename(workshop.title, eventData.startDate, 'cancellation')
        break
      default:
        icsContent = generateWorkshopICS(eventData)
        filename = generateICSFilename(workshop.title, eventData.startDate, 'workshop')
    }

    // Return ICS file as download
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Workshop calendar API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workshopId } = params
    const body = await request.json()
    const { registrationId, type = 'registration' } = body

    if (!workshopId) {
      return NextResponse.json({ error: 'Workshop ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        description,
        max_participants,
        duration_minutes,
        instructor,
        resources!default_resource_id (
          title
        ),
        artist_profiles!instructor_profile_id (
          name
        ),
        organizations!organization_id (
          id,
          name,
          slug
        )
      `)
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      console.error('Error fetching workshop:', workshopError)
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    // Get registration details if provided
    let registration = null
    if (registrationId) {
      const { data: regData } = await supabase
        .from('workshop_registrations')
        .select('id, status, registered_at')
        .eq('id', registrationId)
        .eq('workshop_id', workshopId)
        .single()
      
      registration = regData
    }

    // Create workshop event data
    const eventData = createWorkshopEventData(
      workshop,
      workshop.organizations,
      registration
    )

    // Generate ICS content
    const icsContent = generateWorkshopRegistrationICS(eventData)
    const filename = generateICSFilename(workshop.title, eventData.startDate, 'registration')

    // Return ICS content as JSON for frontend handling
    return NextResponse.json({
      success: true,
      icsContent,
      filename,
      eventData: {
        title: eventData.title,
        startDate: eventData.startDate.toISOString(),
        endDate: eventData.endDate.toISOString(),
        location: eventData.location,
        description: eventData.description
      }
    })

  } catch (error) {
    console.error('Workshop calendar API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
