# API Development Guide

## 🎯 **API Strategy**

Build RESTful APIs that integrate seamlessly with the existing Supabase infrastructure while providing clean, type-safe interfaces for the frontend components.

## 🏗️ **API Architecture**

### **Route Structure**
```
/api/
├── bookings/                 # Booking management
├── workshops/               # Workshop management
├── resources/               # Resource management
├── registrations/           # Workshop registrations
└── integrations/            # External system integration
```

## 📅 **Phase 1: Booking APIs**

### **Bookings API Routes**

#### **GET /api/bookings**
```typescript
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const resourceId = searchParams.get('resourceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        id,
        title,
        description,
        starts_at,
        ends_at,
        status,
        capacity,
        current_participants,
        created_by,
        created_at,
        resources!resource_uuid_id (
          id,
          title,
          type,
          capacity
        )
      `)
      .eq('org_id', orgId)
      .order('starts_at', { ascending: true })

    // Apply filters
    if (resourceId) {
      query = query.eq('resource_uuid_id', resourceId)
    }

    if (startDate) {
      query = query.gte('starts_at', startDate)
    }

    if (endDate) {
      query = query.lte('ends_at', endDate)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Bookings API error:', error)
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
    const { orgId, resourceId, title, description, startsAt, endsAt, capacity } = body

    // Validate required fields
    if (!orgId || !resourceId || !title || !startsAt || !endsAt) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, resourceId, title, startsAt, endsAt' 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if resource exists and is bookable
    const { data: resource } = await supabase
      .from('resources')
      .select('id, title, capacity, is_bookable')
      .eq('id', resourceId)
      .eq('org_id', orgId)
      .single()

    if (!resource || !resource.is_bookable) {
      return NextResponse.json({ error: 'Resource not available for booking' }, { status: 400 })
    }

    // Check for overlapping bookings
    const { data: overlapping } = await supabase
      .from('bookings')
      .select('id')
      .eq('resource_uuid_id', resourceId)
      .eq('org_id', orgId)
      .in('status', ['pending', 'confirmed'])
      .or(`and(starts_at.lt.${endsAt},ends_at.gt.${startsAt})`)

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ 
        error: 'Time slot conflicts with existing booking' 
      }, { status: 409 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        org_id: orgId,
        resource_uuid_id: resourceId,
        title,
        description,
        starts_at: startsAt,
        ends_at: endsAt,
        capacity: capacity || 1,
        current_participants: 0,
        status: 'pending',
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Create booking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### **PATCH /api/bookings/[id]**
```typescript
// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id
    const body = await request.json()
    const { title, description, startsAt, endsAt, status, capacity } = body

    const supabase = createClient()

    // Get existing booking
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('org_id, created_by, resource_uuid_id')
      .eq('id', bookingId)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', existingBooking.org_id)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Only creator or admin can update
    const isAdmin = ['super_admin', 'org_admin', 'moderator'].includes(membership.role)
    const isCreator = existingBooking.created_by === userId

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check for overlapping bookings (if time changed)
    if (startsAt || endsAt) {
      const { data: overlapping } = await supabase
        .from('bookings')
        .select('id')
        .eq('resource_uuid_id', existingBooking.resource_uuid_id)
        .eq('org_id', existingBooking.org_id)
        .neq('id', bookingId)
        .in('status', ['pending', 'confirmed'])
        .or(`and(starts_at.lt.${endsAt || existingBooking.ends_at},ends_at.gt.${startsAt || existingBooking.starts_at})`)

      if (overlapping && overlapping.length > 0) {
        return NextResponse.json({ 
          error: 'Time slot conflicts with existing booking' 
        }, { status: 409 })
      }
    }

    // Update booking
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (startsAt !== undefined) updateData.starts_at = startsAt
    if (endsAt !== undefined) updateData.ends_at = endsAt
    if (status !== undefined) updateData.status = status
    if (capacity !== undefined) updateData.capacity = capacity

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Update booking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id
    const supabase = createClient()

    // Get existing booking
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('org_id, created_by')
      .eq('id', bookingId)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permissions
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', existingBooking.org_id)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Only creator or admin can delete
    const isAdmin = ['super_admin', 'org_admin', 'moderator'].includes(membership.role)
    const isCreator = existingBooking.created_by === userId

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Delete booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) {
      console.error('Error deleting booking:', error)
      return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Delete booking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🎓 **Phase 2: Workshop APIs**

### **Workshops API Routes**

#### **GET /api/workshops**
```typescript
// app/api/workshops/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const status = searchParams.get('status') || 'published'
    const instructorId = searchParams.get('instructorId')
    const search = searchParams.get('search')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('workshops')
      .select(`
        id,
        title,
        description,
        capacity,
        status,
        registration_open_at,
        registration_close_at,
        created_at,
        artist_profiles!instructor_profile_id (
          id,
          name,
          profile_image
        ),
        workshop_sessions (
          id,
          starts_at,
          ends_at,
          capacity,
          bookings!booking_id (
            resource_uuid_id,
            resources!resource_uuid_id (
              id,
              name,
              type
            )
          )
        )
      `)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (instructorId) {
      query = query.eq('instructor_profile_id', instructorId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: workshops, error } = await query

    if (error) {
      console.error('Error fetching workshops:', error)
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
    }

    return NextResponse.json({ workshops })
  } catch (error) {
    console.error('Workshops API error:', error)
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
    const { 
      orgId, 
      title, 
      description, 
      instructorProfileId, 
      defaultResourceId, 
      capacity,
      sessions 
    } = body

    // Validate required fields
    if (!orgId || !title) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, title' 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user is admin
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership || !['super_admin', 'org_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Create workshop
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .insert({
        org_id: orgId,
        title,
        description,
        instructor_profile_id: instructorProfileId,
        default_resource_id: defaultResourceId,
        capacity,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (workshopError) {
      console.error('Error creating workshop:', workshopError)
      return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 })
    }

    // Create sessions if provided
    if (sessions && sessions.length > 0) {
      for (const session of sessions) {
        // Create booking for session
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            org_id: orgId,
            resource_uuid_id: session.resourceId || defaultResourceId,
            title: `${title} - Session`,
            description: session.description,
            starts_at: session.startsAt,
            ends_at: session.endsAt,
            capacity: session.capacity || capacity,
            current_participants: 0,
            status: 'confirmed',
            created_by: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (bookingError) {
          console.error('Error creating session booking:', bookingError)
          continue
        }

        // Create workshop session
        const { error: sessionError } = await supabase
          .from('workshop_sessions')
          .insert({
            workshop_id: workshop.id,
            booking_id: booking.id,
            capacity: session.capacity || capacity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (sessionError) {
          console.error('Error creating workshop session:', sessionError)
        }
      }
    }

    return NextResponse.json({ workshop }, { status: 201 })
  } catch (error) {
    console.error('Create workshop API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 📝 **Phase 3: Registration APIs**

### **Registrations API Routes**

#### **POST /api/registrations**
```typescript
// app/api/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orgId, workshopId, sessionId } = body

    // Validate required fields
    if (!orgId || !workshopId || !sessionId) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, workshopId, sessionId' 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if workshop is published and registration is open
    const { data: workshop } = await supabase
      .from('workshops')
      .select('status, registration_open_at, registration_close_at')
      .eq('id', workshopId)
      .eq('org_id', orgId)
      .single()

    if (!workshop || workshop.status !== 'published') {
      return NextResponse.json({ error: 'Workshop not available for registration' }, { status: 400 })
    }

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
      .eq('session_id', sessionId)
      .eq('clerk_user_id', userId)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this session' }, { status: 409 })
    }

    // Check capacity
    const { data: session } = await supabase
      .from('workshop_sessions')
      .select(`
        capacity,
        bookings!booking_id (
          capacity
        )
      `)
      .eq('id', sessionId)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const sessionCapacity = session.capacity || session.bookings.capacity
    const { count: currentRegistrations } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('session_id', sessionId)
      .eq('status', 'registered')

    if (currentRegistrations && currentRegistrations >= sessionCapacity) {
      return NextResponse.json({ error: 'Session is full' }, { status: 409 })
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('workshop_registrations')
      .insert({
        org_id: orgId,
        workshop_id: workshopId,
        session_id: sessionId,
        clerk_user_id: userId,
        status: 'registered',
        registered_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating registration:', error)
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
    }

    // Add to integration outbox for CRM sync
    await supabase
      .from('integration_outbox')
      .insert({
        org_id: orgId,
        topic: 'registration.created',
        payload: {
          registration_id: registration.id,
          workshop_id: workshopId,
          session_id: sessionId,
          user_id: userId,
          registered_at: registration.registered_at
        }
      })

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error('Create registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🔧 **Phase 4: Resource APIs**

### **Resources API Routes**

#### **GET /api/resources**
```typescript
// app/api/resources/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const type = searchParams.get('type')
    const bookable = searchParams.get('bookable')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('resources')
      .select(`
        id,
        title,
        description,
        type,
        capacity,
        is_bookable,
        time_zone,
        location_note,
        metadata,
        created_at
      `)
      .eq('org_id', orgId)
      .order('title')

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }

    if (bookable === 'true') {
      query = query.eq('is_bookable', true)
    }

    const { data: resources, error } = await query

    if (error) {
      console.error('Error fetching resources:', error)
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Resources API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

#### **GET /api/resources/[id]/availability**
```typescript
// app/api/resources/[id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resourceId = params.id
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const duration = searchParams.get('duration') || '60'

    if (!startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Missing required parameters: startDate, endDate' 
      }, { status: 400 })
    }

    const supabase = createClient()

    // Get resource details
    const { data: resource } = await supabase
      .from('resources')
      .select('org_id, title, capacity, is_bookable')
      .eq('id', resourceId)
      .single()

    if (!resource || !resource.is_bookable) {
      return NextResponse.json({ error: 'Resource not available for booking' }, { status: 404 })
    }

    // Check if user has access to this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', resource.org_id)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get available slots using the helper function
    const { data: availableSlots, error } = await supabase
      .rpc('get_available_slots', {
        p_resource_id: resourceId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_duration_minutes: parseInt(duration)
      })

    if (error) {
      console.error('Error fetching available slots:', error)
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }

    return NextResponse.json({ 
      resource: {
        id: resourceId,
        title: resource.title,
        capacity: resource.capacity
      },
      availableSlots 
    })
  } catch (error) {
    console.error('Availability API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🔗 **Phase 5: Integration APIs**

### **Integration Outbox API**

#### **GET /api/integrations/outbox**
```typescript
// app/api/integrations/outbox/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const status = searchParams.get('status') || 'pending'

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user is admin
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single()

    if (!membership || !['super_admin', 'org_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Build query
    let query = supabase
      .from('integration_outbox')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (status === 'pending') {
      query = query.is('delivered_at', null)
    } else if (status === 'delivered') {
      query = query.not('delivered_at', 'is', null)
    }

    const { data: outboxItems, error } = await query

    if (error) {
      console.error('Error fetching outbox:', error)
      return NextResponse.json({ error: 'Failed to fetch outbox' }, { status: 500 })
    }

    return NextResponse.json({ outboxItems })
  } catch (error) {
    console.error('Outbox API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🧪 **API Testing Strategy**

### **Unit Tests**
```typescript
// __tests__/api/bookings.test.ts
import { GET, POST } from '@/app/api/bookings/route'
import { NextRequest } from 'next/server'

describe('/api/bookings', () => {
  it('should return bookings for authenticated user', async () => {
    const request = new NextRequest('http://localhost:3000/api/bookings?orgId=test-org')
    
    // Mock auth
    jest.mock('@clerk/nextjs/server', () => ({
      auth: () => ({ userId: 'test-user' })
    }))
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.bookings).toBeDefined()
  })
})
```

### **Integration Tests**
```typescript
// __tests__/api/booking-flow.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/bookings/route'

describe('Booking Flow', () => {
  it('should create and retrieve booking', async () => {
    // Create booking
    const { req: createReq, res: createRes } = createMocks({
      method: 'POST',
      body: {
        orgId: 'test-org',
        resourceId: 'test-resource',
        title: 'Test Booking',
        startsAt: '2024-01-01T10:00:00Z',
        endsAt: '2024-01-01T11:00:00Z'
      }
    })
    
    await POST(createReq)
    expect(createRes._getStatusCode()).toBe(201)
    
    // Retrieve bookings
    const { req: getReq, res: getRes } = createMocks({
      method: 'GET',
      query: { orgId: 'test-org' }
    })
    
    await GET(getReq)
    expect(getRes._getStatusCode()).toBe(200)
  })
})
```

## 🚀 **Next Steps**

1. **Implement booking APIs** (start with GET/POST /api/bookings)
2. **Add error handling and validation**
3. **Implement workshop APIs**
4. **Add registration APIs**
5. **Create integration outbox**
6. **Add comprehensive testing**

---

*This guide provides the foundation for building robust, secure APIs that power the booking system while maintaining consistency with your existing infrastructure.*
