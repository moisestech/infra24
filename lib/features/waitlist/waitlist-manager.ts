/**
 * Waitlist Manager
 * Handles waitlist functionality for fully booked resources
 */

import { getSupabaseAdmin } from '@/lib/supabase'

export interface WaitlistEntry {
  id: string
  org_id: string
  resource_id: string
  user_email: string
  user_name: string
  requested_start_time: string
  requested_end_time: string
  priority: number
  status: 'pending' | 'notified' | 'booked' | 'expired' | 'cancelled'
  created_at: string
  expires_at: string
  metadata?: {
    phone?: string
    notes?: string
    preferred_times?: string[]
    urgency?: 'low' | 'medium' | 'high'
  }
}

export interface WaitlistNotification {
  entry_id: string
  user_email: string
  user_name: string
  resource_title: string
  available_slots: Array<{
    start_time: string
    end_time: string
    host: string
  }>
  expires_at: string
}

/**
 * Add user to waitlist for a resource
 */
export async function addToWaitlist(data: {
  org_id: string
  resource_id: string
  user_email: string
  user_name: string
  requested_start_time: string
  requested_end_time: string
  priority?: number
  metadata?: WaitlistEntry['metadata']
}): Promise<{ success: boolean; entry_id?: string; error?: string }> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Check if user is already on waitlist for this resource
    const { data: existingEntry } = await supabaseAdmin
      .from('waitlist_entries')
      .select('id')
      .eq('org_id', data.org_id)
      .eq('resource_id', data.resource_id)
      .eq('user_email', data.user_email)
      .eq('status', 'pending')
      .single()

    if (existingEntry) {
      return {
        success: false,
        error: 'You are already on the waitlist for this resource'
      }
    }

    // Calculate priority (lower number = higher priority)
    const priority = data.priority || await calculatePriority(data.org_id, data.resource_id)

    // Set expiration (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const { data: entry, error } = await supabaseAdmin
      .from('waitlist_entries')
      .insert({
        org_id: data.org_id,
        resource_id: data.resource_id,
        user_email: data.user_email,
        user_name: data.user_name,
        requested_start_time: data.requested_start_time,
        requested_end_time: data.requested_end_time,
        priority: priority,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        metadata: data.metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to waitlist:', error)
      return {
        success: false,
        error: 'Failed to add to waitlist'
      }
    }

    return {
      success: true,
      entry_id: entry.id
    }

  } catch (error: any) {
    console.error('Error in addToWaitlist:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Remove user from waitlist
 */
export async function removeFromWaitlist(entryId: string, reason: 'cancelled' | 'expired' = 'cancelled'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin
      .from('waitlist_entries')
      .update({
        status: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)

    if (error) {
      console.error('Error removing from waitlist:', error)
      return {
        success: false,
        error: 'Failed to remove from waitlist'
      }
    }

    return { success: true }

  } catch (error: any) {
    console.error('Error in removeFromWaitlist:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Get waitlist for a resource
 */
export async function getWaitlist(resourceId: string, orgId: string): Promise<WaitlistEntry[]> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: entries, error } = await supabaseAdmin
      .from('waitlist_entries')
      .select('*')
      .eq('org_id', orgId)
      .eq('resource_id', resourceId)
      .eq('status', 'pending')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching waitlist:', error)
      return []
    }

    return entries || []

  } catch (error: any) {
    console.error('Error in getWaitlist:', error)
    return []
  }
}

/**
 * Process waitlist when slots become available
 */
export async function processWaitlist(resourceId: string, orgId: string, availableSlots: Array<{
  start_time: string
  end_time: string
  host: string
}>): Promise<WaitlistNotification[]> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Get waitlist entries in priority order
    const waitlist = await getWaitlist(resourceId, orgId)
    const notifications: WaitlistNotification[] = []

    // Get resource details
    const { data: resource } = await supabaseAdmin
      .from('resources')
      .select('title')
      .eq('id', resourceId)
      .single()

    if (!resource) {
      return notifications
    }

    // Notify users about available slots
    for (const entry of waitlist.slice(0, 5)) { // Notify top 5 users
      // Check if any available slot matches user's requested time
      const matchingSlots = availableSlots.filter(slot => {
        const slotStart = new Date(slot.start_time)
        const slotEnd = new Date(slot.end_time)
        const requestedStart = new Date(entry.requested_start_time)
        const requestedEnd = new Date(entry.requested_end_time)

        // Check if slot overlaps with requested time (with 1-hour tolerance)
        const tolerance = 60 * 60 * 1000 // 1 hour in milliseconds
        return (
          (slotStart.getTime() <= requestedStart.getTime() + tolerance) &&
          (slotEnd.getTime() >= requestedEnd.getTime() - tolerance)
        )
      })

      if (matchingSlots.length > 0) {
        // Update entry status to notified
        await supabaseAdmin
          .from('waitlist_entries')
          .update({
            status: 'notified',
            updated_at: new Date().toISOString()
          })
          .eq('id', entry.id)

        // Set notification expiration (2 hours)
        const notificationExpires = new Date()
        notificationExpires.setHours(notificationExpires.getHours() + 2)

        notifications.push({
          entry_id: entry.id,
          user_email: entry.user_email,
          user_name: entry.user_name,
          resource_title: resource.title,
          available_slots: matchingSlots,
          expires_at: notificationExpires.toISOString()
        })
      }
    }

    return notifications

  } catch (error: any) {
    console.error('Error in processWaitlist:', error)
    return []
  }
}

/**
 * Book from waitlist notification
 */
export async function bookFromWaitlist(entryId: string, selectedSlot: {
  start_time: string
  end_time: string
  host: string
}): Promise<{ success: boolean; booking_id?: string; error?: string }> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Get waitlist entry
    const { data: entry, error: entryError } = await supabaseAdmin
      .from('waitlist_entries')
      .select('*')
      .eq('id', entryId)
      .single()

    if (entryError || !entry) {
      return {
        success: false,
        error: 'Waitlist entry not found'
      }
    }

    if (entry.status !== 'notified') {
      return {
        success: false,
        error: 'Entry is not in notified status'
      }
    }

    // Check if notification has expired
    if (new Date() > new Date(entry.expires_at)) {
      await removeFromWaitlist(entryId, 'expired')
      return {
        success: false,
        error: 'Waitlist notification has expired'
      }
    }

    // Create booking using existing booking API logic
    const bookingData = {
      org_id: entry.org_id,
      resource_id: entry.resource_id,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      artist_name: entry.user_name,
      artist_email: entry.user_email,
      goal_text: `Booked from waitlist - ${entry.metadata?.notes || 'No additional notes'}`
    }

    // Call booking creation API
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create booking'
      }
    }

    // Update waitlist entry status
    await supabaseAdmin
      .from('waitlist_entries')
      .update({
        status: 'booked',
        booking_id: result.booking_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)

    return {
      success: true,
      booking_id: result.booking_id
    }

  } catch (error: any) {
    console.error('Error in bookFromWaitlist:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Calculate priority for waitlist entry
 */
async function calculatePriority(orgId: string, resourceId: string): Promise<number> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Get current highest priority
    const { data: lastEntry } = await supabaseAdmin
      .from('waitlist_entries')
      .select('priority')
      .eq('org_id', orgId)
      .eq('resource_id', resourceId)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .limit(1)
      .single()

    return (lastEntry?.priority || 0) + 1

  } catch (error) {
    return 1 // Default priority
  }
}

/**
 * Clean up expired waitlist entries
 */
export async function cleanupExpiredWaitlist(): Promise<{ cleaned: number; error?: string }> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: expiredEntries, error } = await supabaseAdmin
      .from('waitlist_entries')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (error) {
      console.error('Error cleaning up expired waitlist:', error)
      return {
        cleaned: 0,
        error: 'Failed to cleanup expired entries'
      }
    }

    return {
      cleaned: expiredEntries?.length || 0
    }

  } catch (error: any) {
    console.error('Error in cleanupExpiredWaitlist:', error)
    return {
      cleaned: 0,
      error: error.message || 'Unknown error occurred'
    }
  }
}





