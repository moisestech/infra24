import { createClient } from '@/lib/supabase'
import { sendWorkshopRegistrationEmail } from './workshop-emails'

interface WorkshopReminderData {
  workshopId: string
  organizationId: string
  reminderType: '24h' | '1h' | 'cancelled'
}

/**
 * Send workshop reminders to registered participants
 */
export async function sendWorkshopReminders(data: WorkshopReminderData) {
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
  
  try {
    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        description,
        max_participants,
        resources!default_resource_id (
          title
        ),
        organizations!organization_id (
          name,
          slug
        )
      `)
      .eq('id', data.workshopId)
      .single()

    if (workshopError || !workshop) {
      console.error('Error fetching workshop:', workshopError)
      return { success: false, error: 'Workshop not found' }
    }

    // Get registered participants
    const { data: registrations, error: registrationsError } = await supabase
      .from('workshop_registrations')
      .select(`
        id,
        clerk_user_id,
        status,
        registered_at
      `)
      .eq('workshop_id', data.workshopId)
      .eq('status', 'registered')

    if (registrationsError || !registrations) {
      console.error('Error fetching registrations:', registrationsError)
      return { success: false, error: 'Failed to fetch registrations' }
    }

    // Get current participant count
    const { data: currentRegistrations } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', data.workshopId)
      .eq('status', 'registered')

    const currentParticipants = currentRegistrations?.length || 0

    // Send reminders to each participant
    const results = []
    for (const registration of registrations) {
      try {
        // TODO: Get actual user email from Clerk or user management system
        const userEmail = 'participant@example.com' // Replace with actual user email lookup
        const userName = 'Workshop Participant' // Replace with actual user name lookup

        const emailData = {
          to: userEmail,
          workshopTitle: workshop.title,
          organizationName: workshop.organizations?.[0]?.name || 'Organization',
          participantName: userName,
          workshopDescription: workshop.description,
          workshopLocation: workshop.resources?.[0]?.title,
          maxParticipants: workshop.max_participants || 10,
          currentParticipants,
          language: 'en' as const,
          registrationId: registration.id,
          workshopId: data.workshopId,
          organizationSlug: workshop.organizations?.[0]?.slug || 'organization'
        }

        const emailResult = await sendWorkshopRegistrationEmail(emailData)
        
        results.push({
          registrationId: registration.id,
          success: emailResult.success,
          messageId: emailResult.messageId,
          error: emailResult.error
        })

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        results.push({
          registrationId: registration.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log(`Workshop reminders sent: ${successCount}/${totalCount} successful`)

    return {
      success: successCount > 0,
      results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    }

  } catch (error) {
    console.error('Error sending workshop reminders:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Schedule workshop reminders (to be called by a cron job or scheduled task)
 */
export async function scheduleWorkshopReminders() {
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
  
  try {
    // Find workshops happening in the next 24 hours
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    // This is a simplified query - you might need to adjust based on your workshop scheduling system
    const { data: upcomingWorkshops, error } = await supabase
      .from('workshops')
      .select('id, organization_id')
      .eq('is_active', true)
      .eq('is_public', true)
      // Add date filtering based on your workshop scheduling system
      // .gte('scheduled_date', tomorrow.toISOString())
      // .lt('scheduled_date', dayAfter.toISOString())

    if (error) {
      console.error('Error fetching upcoming workshops:', error)
      return { success: false, error: 'Failed to fetch upcoming workshops' }
    }

    if (!upcomingWorkshops || upcomingWorkshops.length === 0) {
      console.log('No workshops scheduled for reminders')
      return { success: true, message: 'No workshops to remind about' }
    }

    // Send reminders for each workshop
    const results = []
    for (const workshop of upcomingWorkshops) {
      const reminderResult = await sendWorkshopReminders({
        workshopId: workshop.id,
        organizationId: workshop.organization_id,
        reminderType: '24h'
      })
      
      results.push({
        workshopId: workshop.id,
        ...reminderResult
      })
    }

    return {
      success: true,
      results,
      summary: {
        workshopsProcessed: upcomingWorkshops.length,
        totalReminders: results.reduce((sum, r) => sum + (r.summary?.total || 0), 0),
        successfulReminders: results.reduce((sum, r) => sum + (r.summary?.successful || 0), 0)
      }
    }

  } catch (error) {
    console.error('Error scheduling workshop reminders:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
