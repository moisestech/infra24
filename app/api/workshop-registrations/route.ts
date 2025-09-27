import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'
import { sendWorkshopRegistrationEmail } from '@/lib/email/workshop-emails'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const workshopId = searchParams.get('workshopId')
    const sessionId = searchParams.get('sessionId')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

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

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('workshop_registrations')
      .select(`
        id,
        workshop_id,
        session_id,
        status,
        registered_at,
        cancelled_at,
        checkin_at,
        workshops!workshop_id (
          id,
          title,
          capacity,
          status
        ),
        workshop_sessions!session_id (
          id,
          capacity,
          bookings!booking_id (
            id,
            title,
            starts_at,
            ends_at,
            status
          )
        )
      `)
      .eq('organization_id', orgId)
      .order('registered_at', { ascending: false })

    // Apply filters
    if (workshopId) {
      query = query.eq('workshop_id', workshopId)
    }

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    // If not admin, only show user's own registrations
    if (!['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      query = query.eq('clerk_user_id', userId)
    }

    const { data: registrations, error } = await query

    if (error) {
      console.error('Error fetching workshop registrations:', error)
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Workshop registrations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orgId, workshopId, sessionId } = body

    // Validate required fields
    if (!orgId || !workshopId) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, workshopId' 
      }, { status: 400 })
    }

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

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if workshop exists and is published
    const { data: workshop } = await supabase
      .from('workshops')
      .select('id, title, capacity, status, registration_open_at, registration_close_at')
      .eq('id', workshopId)
      .eq('organization_id', orgId)
      .single()

    if (!workshop || workshop.status !== 'published') {
      return NextResponse.json({ error: 'Workshop not available for registration' }, { status: 400 })
    }

    // Check registration dates
    const now = new Date()
    if (workshop.registration_open_at && new Date(workshop.registration_open_at) > now) {
      return NextResponse.json({ error: 'Registration not yet open' }, { status: 400 })
    }

    if (workshop.registration_close_at && new Date(workshop.registration_close_at) < now) {
      return NextResponse.json({ error: 'Registration closed' }, { status: 400 })
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('clerk_user_id', userId)
      .eq('status', 'registered')
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this workshop' }, { status: 409 })
    }

    // Check capacity if session is specified
    if (sessionId) {
      const { data: session } = await supabase
        .from('workshop_sessions')
        .select('id, capacity')
        .eq('id', sessionId)
        .single()

      if (session) {
        const { data: registrations } = await supabase
          .from('workshop_registrations')
          .select('id')
          .eq('session_id', sessionId)
          .eq('status', 'registered')

        if (registrations && registrations.length >= session.capacity) {
          return NextResponse.json({ error: 'Session is full' }, { status: 409 })
        }
      }
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('workshop_registrations')
      .insert({
        organization_id: orgId,
        workshop_id: workshopId,
        session_id: sessionId || null,
        clerk_user_id: userId,
        status: 'registered',
        registered_at: new Date().toISOString(),
        metadata: {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop registration:', error)
      return NextResponse.json({ error: 'Failed to register for workshop' }, { status: 500 })
    }

    // Send confirmation email
    try {
      // Get user email from Clerk (you might need to fetch this from your user management system)
      const userEmail = 'user@example.com' // TODO: Get actual user email
      const userName = 'Workshop Participant' // TODO: Get actual user name
      
      // Get organization details
      const { data: organization } = await supabase
        .from('organizations')
        .select('name, slug')
        .eq('id', orgId)
        .single()

      // Get workshop details for email
      const { data: workshopDetails } = await supabase
        .from('workshops')
        .select(`
          title,
          description,
          max_participants,
          resources!default_resource_id (
            title
          )
        `)
        .eq('id', workshopId)
        .single()

      // Count current registrations
      const { data: currentRegistrations } = await supabase
        .from('workshop_registrations')
        .select('id')
        .eq('workshop_id', workshopId)
        .eq('status', 'registered')

      const emailData = {
        to: userEmail,
        workshopTitle: workshopDetails?.title || 'Workshop',
        organizationName: organization?.name || 'Organization',
        participantName: userName,
        workshopDescription: workshopDetails?.description,
        workshopLocation: workshopDetails?.resources?.[0]?.title,
        maxParticipants: workshopDetails?.max_participants || 10,
        currentParticipants: (currentRegistrations?.length || 0) + 1,
        language: 'en' as const,
        registrationId: registration.id,
        workshopId: workshopId,
        organizationSlug: organization?.slug || 'organization'
      }

      const emailResult = await sendWorkshopRegistrationEmail(emailData)
      
      if (emailResult.success) {
        console.log('Workshop registration email sent successfully')
      } else {
        console.error('Failed to send workshop registration email:', emailResult.error)
        // Don't fail the registration if email fails
      }
    } catch (emailError) {
      console.error('Error sending workshop registration email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error('Create workshop registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
