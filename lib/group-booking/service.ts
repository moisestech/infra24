import { getSupabaseAdmin } from '@/lib/supabase'

export interface GroupBookingParticipant {
  id?: string
  userId: string
  participantName: string
  participantEmail: string
  participantPhone?: string
  status: 'registered' | 'confirmed' | 'cancelled' | 'waitlisted' | 'no_show'
  registeredAt?: Date
  confirmedAt?: Date
  cancelledAt?: Date
  notes?: string
  metadata?: Record<string, any>
}

export interface WaitlistEntry {
  id?: string
  userId: string
  participantName: string
  participantEmail: string
  participantPhone?: string
  position: number
  status: 'waiting' | 'notified' | 'expired' | 'converted' | 'cancelled'
  notifiedAt?: Date
  expiresAt: Date
  notes?: string
  metadata?: Record<string, any>
}

export interface GroupBookingInvitation {
  id?: string
  invitedByUserId: string
  invitedUserId?: string
  invitedEmail: string
  invitedName?: string
  invitationToken: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  sentAt: Date
  respondedAt?: Date
  expiresAt: Date
  message?: string
  metadata?: Record<string, any>
}

export interface GroupBookingDetails {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  capacity: number
  currentParticipants: number
  availableSpots: number
  isGroupBooking: boolean
  groupSize: number
  waitlistEnabled: boolean
  groupBookingType: 'public' | 'private' | 'invite_only'
  groupOrganizerId: string
  participants: GroupBookingParticipant[]
  waitlist: WaitlistEntry[]
  invitations: GroupBookingInvitation[]
}

export class GroupBookingService {
  /**
   * Create a new group booking
   */
  static async createGroupBooking(params: {
    organizationId: string
    userId: string
    resourceId: string
    resourceType: string
    title: string
    description?: string
    startTime: Date
    endTime: Date
    capacity: number
    groupBookingType?: 'public' | 'private' | 'invite_only'
    waitlistEnabled?: boolean
    price?: number
    location?: string
  }): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          organization_id: params.organizationId,
          user_id: params.userId,
          resource_type: params.resourceType,
          resource_id: params.resourceId,
          title: params.title,
          description: params.description,
          start_time: params.startTime.toISOString(),
          end_time: params.endTime.toISOString(),
          capacity: params.capacity,
          current_participants: 0,
          available_spots: params.capacity,
          price: params.price || 0,
          location: params.location,
          is_group_booking: true,
          group_size: params.capacity,
          waitlist_enabled: params.waitlistEnabled || false,
          group_booking_type: params.groupBookingType || 'public',
          group_organizer_id: params.userId,
          status: 'pending',
          created_by: params.userId,
          updated_by: params.userId,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        bookingId: booking.id
      }
    } catch (error) {
      console.error('Error creating group booking:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get group booking details with participants and waitlist
   */
  static async getGroupBookingDetails(bookingId: string): Promise<{ success: boolean; booking?: GroupBookingDetails; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('is_group_booking', true)
        .single()

      if (bookingError || !booking) {
        return { success: false, error: 'Group booking not found' }
      }

      // Get participants
      const { data: participants, error: participantsError } = await supabase
        .from('group_booking_participants')
        .select('*')
        .eq('booking_id', bookingId)
        .order('registered_at', { ascending: true })

      if (participantsError) {
        console.error('Error fetching participants:', participantsError)
      }

      // Get waitlist
      const { data: waitlist, error: waitlistError } = await supabase
        .from('booking_waitlist')
        .select('*')
        .eq('booking_id', bookingId)
        .order('position', { ascending: true })

      if (waitlistError) {
        console.error('Error fetching waitlist:', waitlistError)
      }

      // Get invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('group_booking_invitations')
        .select('*')
        .eq('booking_id', bookingId)
        .order('sent_at', { ascending: true })

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError)
      }

      const groupBookingDetails: GroupBookingDetails = {
        id: booking.id,
        title: booking.title,
        description: booking.description,
        startTime: new Date(booking.start_time),
        endTime: new Date(booking.end_time),
        capacity: booking.capacity,
        currentParticipants: booking.current_participants,
        availableSpots: booking.available_spots,
        isGroupBooking: booking.is_group_booking,
        groupSize: booking.group_size,
        waitlistEnabled: booking.waitlist_enabled,
        groupBookingType: booking.group_booking_type,
        groupOrganizerId: booking.group_organizer_id,
        participants: (participants || []).map(p => ({
          id: p.id,
          userId: p.user_id,
          participantName: p.participant_name,
          participantEmail: p.participant_email,
          participantPhone: p.participant_phone,
          status: p.status,
          registeredAt: p.registered_at ? new Date(p.registered_at) : undefined,
          confirmedAt: p.confirmed_at ? new Date(p.confirmed_at) : undefined,
          cancelledAt: p.cancelled_at ? new Date(p.cancelled_at) : undefined,
          notes: p.notes,
          metadata: p.metadata
        })),
        waitlist: (waitlist || []).map(w => ({
          id: w.id,
          userId: w.user_id,
          participantName: w.participant_name,
          participantEmail: w.participant_email,
          participantPhone: w.participant_phone,
          position: w.position,
          status: w.status,
          notifiedAt: w.notified_at ? new Date(w.notified_at) : undefined,
          expiresAt: new Date(w.expires_at),
          notes: w.notes,
          metadata: w.metadata
        })),
        invitations: (invitations || []).map(i => ({
          id: i.id,
          invitedByUserId: i.invited_by_user_id,
          invitedUserId: i.invited_user_id,
          invitedEmail: i.invited_email,
          invitedName: i.invited_name,
          invitationToken: i.invitation_token,
          status: i.status,
          sentAt: new Date(i.sent_at),
          respondedAt: i.responded_at ? new Date(i.responded_at) : undefined,
          expiresAt: new Date(i.expires_at),
          message: i.message,
          metadata: i.metadata
        }))
      }

      return {
        success: true,
        booking: groupBookingDetails
      }
    } catch (error) {
      console.error('Error getting group booking details:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Add participant to group booking
   */
  static async addParticipant(
    bookingId: string,
    userId: string,
    participantName: string,
    participantEmail: string,
    participantPhone?: string,
    notes?: string
  ): Promise<{ success: boolean; status?: string; position?: number; availableSpots?: number; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data, error } = await supabase.rpc('add_group_booking_participant', {
        p_booking_id: bookingId,
        p_user_id: userId,
        p_participant_name: participantName,
        p_participant_email: participantEmail,
        p_participant_phone: participantPhone,
        p_notes: notes
      })

      if (error) {
        throw error
      }

      return {
        success: data.success,
        status: data.status,
        position: data.position,
        availableSpots: data.available_spots,
        error: data.error
      }
    } catch (error) {
      console.error('Error adding participant:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Remove participant from group booking
   */
  static async removeParticipant(
    bookingId: string,
    userId: string
  ): Promise<{ success: boolean; availableSpots?: number; waitlistPosition?: number; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data, error } = await supabase.rpc('remove_group_booking_participant', {
        p_booking_id: bookingId,
        p_user_id: userId
      })

      if (error) {
        throw error
      }

      return {
        success: data.success,
        availableSpots: data.available_spots,
        waitlistPosition: data.waitlist_position,
        error: data.error
      }
    } catch (error) {
      console.error('Error removing participant:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Promote waitlist participant to confirmed
   */
  static async promoteWaitlistParticipant(
    bookingId: string,
    waitlistId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data, error } = await supabase.rpc('promote_waitlist_participant', {
        p_booking_id: bookingId,
        p_waitlist_id: waitlistId
      })

      if (error) {
        throw error
      }

      return {
        success: data.success,
        error: data.error
      }
    } catch (error) {
      console.error('Error promoting waitlist participant:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Send invitation for invite-only group booking
   */
  static async sendInvitation(
    bookingId: string,
    invitedByUserId: string,
    invitedEmail: string,
    invitedName?: string,
    invitedUserId?: string,
    message?: string
  ): Promise<{ success: boolean; invitationId?: string; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data: invitation, error } = await supabase
        .from('group_booking_invitations')
        .insert({
          booking_id: bookingId,
          invited_by_user_id: invitedByUserId,
          invited_user_id: invitedUserId,
          invited_email: invitedEmail,
          invited_name: invitedName,
          message: message,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        invitationId: invitation.id
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Respond to group booking invitation
   */
  static async respondToInvitation(
    invitationToken: string,
    response: 'accepted' | 'declined',
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('group_booking_invitations')
        .select('*')
        .eq('invitation_token', invitationToken)
        .eq('status', 'pending')
        .single()

      if (invitationError || !invitation) {
        return { success: false, error: 'Invitation not found or expired' }
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        return { success: false, error: 'Invitation has expired' }
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from('group_booking_invitations')
        .update({
          status: response,
          responded_at: new Date().toISOString(),
          invited_user_id: userId || invitation.invited_user_id
        })
        .eq('id', invitation.id)

      if (updateError) {
        throw updateError
      }

      // If accepted, add to group booking
      if (response === 'accepted') {
        const addResult = await this.addParticipant(
          invitation.booking_id,
          userId || invitation.invited_user_id || 'anonymous',
          invitation.invited_name || invitation.invited_email,
          invitation.invited_email
        )

        if (!addResult.success) {
          return { success: false, error: addResult.error }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error responding to invitation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get available group bookings for an organization
   */
  static async getAvailableGroupBookings(
    organizationId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ success: boolean; bookings?: any[]; error?: string }> {
    try {
      const supabase = getSupabaseAdmin()

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          resources (
            id,
            name,
            type,
            description
          )
        `)
        .eq('organization_id', organizationId)
        .eq('is_group_booking', true)
        .eq('status', 'confirmed')
        .gt('available_spots', 0)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      return {
        success: true,
        bookings: bookings || []
      }
    } catch (error) {
      console.error('Error getting available group bookings:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
