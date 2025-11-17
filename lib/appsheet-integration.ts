/**
 * AppSheet Integration Service
 * 
 * Handles AppSheet integration for MASTER flow
 * - External request processing
 * - Data synchronization
 * - Webhook handling
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ExternalRequest {
  id: string
  organization_id: string
  source: 'appsheet' | 'google_forms' | 'api' | 'manual'
  external_id: string
  request_type: 'booking' | 'inquiry' | 'complaint' | 'suggestion'
  request_data: any
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to?: string
  processed_at?: Date
  processed_by?: string
  processing_notes?: string
  created_at: Date
  updated_at: Date
}

export interface AppSheetRequest {
  id: string
  type: string
  data: any
  timestamp: string
  user: string
}

export class AppSheetService {
  private apiKey: string
  private appId: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.APPSHEET_API_KEY || ''
    this.appId = process.env.APPSHEET_APP_ID || ''
    this.baseUrl = 'https://api.appsheet.com/api/v2'
  }

  /**
   * Process incoming AppSheet webhook
   */
  async processWebhook(
    organizationId: string,
    requestData: AppSheetRequest
  ): Promise<ExternalRequest> {
    try {
      console.log('🔍 AppSheet: Processing webhook for organization:', organizationId)
      console.log('🔍 AppSheet: Request data:', requestData)

      // Map AppSheet request to our external request format
      const externalRequest = await supabase
        .from('external_requests')
        .insert({
          organization_id: organizationId,
          source: 'appsheet',
          external_id: requestData.id,
          request_type: this.mapRequestType(requestData.type),
          request_data: requestData.data,
          status: 'pending',
          priority: this.determinePriority(requestData.data),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (externalRequest.error) {
        throw new Error(`Database error: ${externalRequest.error.message}`)
      }

      console.log('✅ AppSheet: External request created:', externalRequest.data.id)
      return externalRequest.data
    } catch (error) {
      console.error('❌ AppSheet: Error processing webhook:', error)
      throw error
    }
  }

  /**
   * Get external requests for organization
   */
  async getRequests(
    organizationId: string,
    status?: ExternalRequest['status'],
    requestType?: ExternalRequest['request_type']
  ): Promise<ExternalRequest[]> {
    try {
      let query = supabase
        .from('external_requests')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (requestType) {
        query = query.eq('request_type', requestType)
      }

      const { data: requests, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return requests || []
    } catch (error) {
      console.error('❌ AppSheet: Error getting requests:', error)
      throw error
    }
  }

  /**
   * Approve external request
   */
  async approveRequest(
    requestId: string,
    processedBy: string,
    processingNotes?: string
  ): Promise<ExternalRequest> {
    try {
      const { data: request, error } = await supabase
        .from('external_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: processedBy,
          processing_notes: processingNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ AppSheet: Request approved:', requestId)

      // If this is a booking request, create the booking
      if (request.request_type === 'booking') {
        await this.createBookingFromRequest(request)
      }

      return request
    } catch (error) {
      console.error('❌ AppSheet: Error approving request:', error)
      throw error
    }
  }

  /**
   * Reject external request
   */
  async rejectRequest(
    requestId: string,
    processedBy: string,
    processingNotes?: string
  ): Promise<ExternalRequest> {
    try {
      const { data: request, error } = await supabase
        .from('external_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: processedBy,
          processing_notes: processingNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ AppSheet: Request rejected:', requestId)
      return request
    } catch (error) {
      console.error('❌ AppSheet: Error rejecting request:', error)
      throw error
    }
  }

  /**
   * Create booking from approved request
   */
  private async createBookingFromRequest(request: ExternalRequest): Promise<void> {
    try {
      const requestData = request.request_data
      
      // Extract booking data from request
      const bookingData = {
        org_id: request.organization_id,
        resource_id: requestData.resource_id,
        title: requestData.title || 'AppSheet Booking',
        description: requestData.description || `Booking from AppSheet request ${request.external_id}`,
        start_time: requestData.start_time,
        end_time: requestData.end_time,
        capacity: requestData.capacity || 1,
        location: requestData.location,
        notes: `Created from AppSheet request: ${request.external_id}`,
        user_name: requestData.user_name || 'AppSheet User',
        user_email: requestData.user_email || 'appsheet@example.com',
        status: 'confirmed', // Auto-approve AppSheet bookings
        source: 'appsheet',
        metadata: {
          external_request_id: request.id,
          appsheet_request_id: request.external_id,
          created_via: 'appsheet_integration'
        }
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ AppSheet: Booking created from request:', booking.id)
    } catch (error) {
      console.error('❌ AppSheet: Error creating booking from request:', error)
      throw error
    }
  }

  /**
   * Map AppSheet request type to our request type
   */
  private mapRequestType(appsheetType: string): ExternalRequest['request_type'] {
    const typeMap: Record<string, ExternalRequest['request_type']> = {
      'booking': 'booking',
      'reservation': 'booking',
      'inquiry': 'inquiry',
      'question': 'inquiry',
      'complaint': 'complaint',
      'issue': 'complaint',
      'suggestion': 'suggestion',
      'feedback': 'suggestion'
    }

    return typeMap[appsheetType.toLowerCase()] || 'inquiry'
  }

  /**
   * Determine priority based on request data
   */
  private determinePriority(requestData: any): ExternalRequest['priority'] {
    // Check for urgency indicators
    if (requestData.urgent || requestData.priority === 'high') {
      return 'high'
    }

    if (requestData.emergency || requestData.priority === 'urgent') {
      return 'urgent'
    }

    if (requestData.priority === 'low') {
      return 'low'
    }

    // Default to normal priority
    return 'normal'
  }

  /**
   * Get request statistics
   */
  async getRequestStats(organizationId: string): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('external_requests')
        .select('status, request_type, priority')
        .eq('organization_id', organizationId)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      const stats = {
        total: requests?.length || 0,
        pending: requests?.filter(r => r.status === 'pending').length || 0,
        approved: requests?.filter(r => r.status === 'approved').length || 0,
        rejected: requests?.filter(r => r.status === 'rejected').length || 0,
        byType: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      }

      // Count by type and priority
      requests?.forEach(request => {
        stats.byType[request.request_type] = (stats.byType[request.request_type] || 0) + 1
        stats.byPriority[request.priority] = (stats.byPriority[request.priority] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('❌ AppSheet: Error getting request stats:', error)
      throw error
    }
  }
}

// Export singleton instance
export const appSheetService = new AppSheetService()
