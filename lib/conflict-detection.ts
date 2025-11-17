/**
 * Conflict Detection Service
 * 
 * Handles booking conflict detection and resolution
 * - Double booking detection
 * - Resource availability checking
 * - Timezone conflict resolution
 * - Capacity validation
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ConflictLog {
  id: string
  organization_id: string
  resource_id: string
  conflict_type: 'double_booking' | 'timezone_mismatch' | 'resource_unavailable' | 'capacity_exceeded'
  conflict_data: any
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'ignored'
  resolution?: string
  resolved_at?: Date
  resolved_by?: string
  resolution_notes?: string
  created_at: Date
  updated_at: Date
}

export interface BookingConflict {
  type: 'double_booking' | 'timezone_mismatch' | 'resource_unavailable' | 'capacity_exceeded'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  conflictingBookings?: any[]
  suggestedResolutions?: string[]
}

export class ConflictDetectionService {
  /**
   * Check for booking conflicts
   */
  async checkBookingConflicts(
    organizationId: string,
    resourceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<BookingConflict[]> {
    try {
      console.log('🔍 ConflictDetection: Checking conflicts for resource', resourceId)
      console.log('🔍 ConflictDetection: Time range:', startTime.toISOString(), 'to', endTime.toISOString())

      const conflicts: BookingConflict[] = []

      // Check for double bookings
      const doubleBookingConflict = await this.checkDoubleBooking(
        organizationId,
        resourceId,
        startTime,
        endTime,
        excludeBookingId
      )
      if (doubleBookingConflict) {
        conflicts.push(doubleBookingConflict)
      }

      // Check resource availability
      const resourceConflict = await this.checkResourceAvailability(resourceId)
      if (resourceConflict) {
        conflicts.push(resourceConflict)
      }

      // Check capacity
      const capacityConflict = await this.checkCapacity(
        organizationId,
        resourceId,
        startTime,
        endTime,
        excludeBookingId
      )
      if (capacityConflict) {
        conflicts.push(capacityConflict)
      }

      console.log('🔍 ConflictDetection: Found', conflicts.length, 'conflicts')
      return conflicts
    } catch (error) {
      console.error('❌ ConflictDetection: Error checking conflicts:', error)
      throw error
    }
  }

  /**
   * Check for double bookings
   */
  private async checkDoubleBooking(
    organizationId: string,
    resourceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<BookingConflict | null> {
    try {
      // Query for overlapping bookings
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('org_id', organizationId)
        .eq('resource_id', resourceId)
        .in('status', ['pending', 'confirmed'])
        .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`)

      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId)
      }

      const { data: conflictingBookings, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      if (conflictingBookings && conflictingBookings.length > 0) {
        console.log('⚠️ ConflictDetection: Found', conflictingBookings.length, 'double booking conflicts')
        
        return {
          type: 'double_booking',
          severity: 'high',
          message: `Resource is already booked during this time period`,
          conflictingBookings: conflictingBookings,
          suggestedResolutions: [
            'Choose a different time slot',
            'Select a different resource',
            'Contact the existing booking holder to coordinate'
          ]
        }
      }

      return null
    } catch (error) {
      console.error('❌ ConflictDetection: Error checking double bookings:', error)
      throw error
    }
  }

  /**
   * Check resource availability
   */
  private async checkResourceAvailability(resourceId: string): Promise<BookingConflict | null> {
    try {
      const { data: resource, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      if (!resource) {
        return {
          type: 'resource_unavailable',
          severity: 'critical',
          message: 'Resource not found',
          suggestedResolutions: [
            'Select a different resource',
            'Contact support if this resource should be available'
          ]
        }
      }

      if (!resource.is_active) {
        return {
          type: 'resource_unavailable',
          severity: 'high',
          message: 'Resource is currently inactive',
          suggestedResolutions: [
            'Select a different resource',
            'Contact support to reactivate this resource'
          ]
        }
      }

      if (!resource.is_bookable) {
        return {
          type: 'resource_unavailable',
          severity: 'medium',
          message: 'Resource is not available for booking',
          suggestedResolutions: [
            'Select a different resource',
            'Contact support for special booking arrangements'
          ]
        }
      }

      return null
    } catch (error) {
      console.error('❌ ConflictDetection: Error checking resource availability:', error)
      throw error
    }
  }

  /**
   * Check capacity constraints
   */
  private async checkCapacity(
    organizationId: string,
    resourceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<BookingConflict | null> {
    try {
      // Get resource capacity
      const { data: resource, error: resourceError } = await supabase
        .from('resources')
        .select('capacity')
        .eq('id', resourceId)
        .single()

      if (resourceError) {
        throw new Error(`Database error: ${resourceError.message}`)
      }

      if (!resource || !resource.capacity) {
        return null // No capacity constraints
      }

      // Count current bookings during the time period
      let query = supabase
        .from('bookings')
        .select('current_participants')
        .eq('org_id', organizationId)
        .eq('resource_id', resourceId)
        .in('status', ['pending', 'confirmed'])
        .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`)

      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId)
      }

      const { data: bookings, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Calculate total participants
      const totalParticipants = bookings?.reduce((sum, booking) => 
        sum + (booking.current_participants || 0), 0) || 0

      if (totalParticipants >= resource.capacity) {
        console.log('⚠️ ConflictDetection: Capacity exceeded:', totalParticipants, '/', resource.capacity)
        
        return {
          type: 'capacity_exceeded',
          severity: 'medium',
          message: `Resource capacity exceeded (${totalParticipants}/${resource.capacity})`,
          suggestedResolutions: [
            'Choose a different time slot',
            'Select a different resource with higher capacity',
            'Reduce the number of participants'
          ]
        }
      }

      return null
    } catch (error) {
      console.error('❌ ConflictDetection: Error checking capacity:', error)
      throw error
    }
  }

  /**
   * Log conflict for tracking
   */
  async logConflict(
    organizationId: string,
    resourceId: string,
    conflictType: ConflictLog['conflict_type'],
    conflictData: any,
    severity: ConflictLog['severity'] = 'medium'
  ): Promise<ConflictLog> {
    try {
      const { data: conflictLog, error } = await supabase
        .from('conflict_logs')
        .insert({
          organization_id: organizationId,
          resource_id: resourceId,
          conflict_type: conflictType,
          conflict_data: conflictData,
          severity: severity,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('📝 ConflictDetection: Logged conflict:', conflictLog.id)
      return conflictLog
    } catch (error) {
      console.error('❌ ConflictDetection: Error logging conflict:', error)
      throw error
    }
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(
    conflictId: string,
    resolution: string,
    resolvedBy: string,
    resolutionNotes?: string
  ): Promise<ConflictLog> {
    try {
      const { data: conflictLog, error } = await supabase
        .from('conflict_logs')
        .update({
          status: 'resolved',
          resolution: resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', conflictId)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ ConflictDetection: Resolved conflict:', conflictId)
      return conflictLog
    } catch (error) {
      console.error('❌ ConflictDetection: Error resolving conflict:', error)
      throw error
    }
  }

  /**
   * Get conflicts for organization
   */
  async getConflicts(
    organizationId: string,
    status?: ConflictLog['status'],
    severity?: ConflictLog['severity']
  ): Promise<ConflictLog[]> {
    try {
      let query = supabase
        .from('conflict_logs')
        .select(`
          *,
          resources (
            id,
            title,
            type
          )
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (severity) {
        query = query.eq('severity', severity)
      }

      const { data: conflicts, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return conflicts || []
    } catch (error) {
      console.error('❌ ConflictDetection: Error getting conflicts:', error)
      throw error
    }
  }

  /**
   * Get conflict statistics
   */
  async getConflictStats(organizationId: string): Promise<{
    total: number
    open: number
    resolved: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  }> {
    try {
      const { data: conflicts, error } = await supabase
        .from('conflict_logs')
        .select('status, conflict_type, severity')
        .eq('organization_id', organizationId)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      const stats = {
        total: conflicts?.length || 0,
        open: conflicts?.filter(c => c.status === 'open').length || 0,
        resolved: conflicts?.filter(c => c.status === 'resolved').length || 0,
        byType: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>
      }

      // Count by type
      conflicts?.forEach(conflict => {
        stats.byType[conflict.conflict_type] = (stats.byType[conflict.conflict_type] || 0) + 1
        stats.bySeverity[conflict.severity] = (stats.bySeverity[conflict.severity] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('❌ ConflictDetection: Error getting conflict stats:', error)
      throw error
    }
  }
}

// Export singleton instance
export const conflictDetectionService = new ConflictDetectionService()
