'use client'

import { Bell, ClipboardList, Clock, AlertCircle, Eye, EyeOff, Shield, ExternalLink, ArrowRight } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  priority: string
  visibility: string
  status: string
  start_date: string | null
  end_date: string | null
  location: string | null
  key_people: any[]
  metadata: any
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

interface Organization {
  slug: string
}

interface RecentAnnouncementsProps {
  announcements: Announcement[]
  organization: Organization
}

export function RecentAnnouncements({ announcements, organization }: RecentAnnouncementsProps) {
  if (announcements.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          <span className="hidden md:inline">Recent </span><span className="md:hidden">Recent</span><span className="hidden md:inline">Announcements</span>
        </h2>
        <a
          href={`/o/${organization.slug}/announcements`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
        >
          View all →
        </a>
      </div>
      <div className="space-y-3">
        {announcements.slice(0, 3).map((announcement) => {
          // Determine the event date - prioritize scheduled_at, then created_at
          const eventDate = announcement.scheduled_at || announcement.created_at
          const date = new Date(eventDate)
          
          // Convert to EST
          const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}))
          const formattedDate = {
            day: estDate.getDate(),
            month: estDate.toLocaleDateString('en-US', { month: 'short' }),
            year: estDate.getFullYear(),
            startTime: announcement.scheduled_at ? estDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'America/New_York'
            }) : null,
            endTime: announcement.expires_at ? new Date(announcement.expires_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'America/New_York'
            }) : null
          }

          // Check if this is a survey-related announcement
          const isSurvey = announcement.title.toLowerCase().includes('survey') || 
                          announcement.content.toLowerCase().includes('survey') ||
                          announcement.type === 'survey'

          // Check for deadline urgency
          const hasDeadline = announcement.end_date
          const deadlineDate = hasDeadline ? new Date(announcement.end_date) : null
          const now = new Date()
          const daysUntilDeadline = deadlineDate ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
          const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3 && daysUntilDeadline >= 0
          
          // Get visibility indicator
          const getVisibilityInfo = (visibility: string) => {
            switch (visibility) {
              case 'public':
                return { icon: Eye, text: 'Public', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
              case 'internal':
                return { icon: Shield, text: 'Internal', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
              case 'members_only':
                return { icon: EyeOff, text: 'Members Only', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
              default:
                return { icon: Bell, text: 'Unknown', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
            }
          }

          const visibilityInfo = getVisibilityInfo(announcement.visibility)

          return (
            <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {/* Prominent survey icon if it's a survey */}
                      {isSurvey ? (
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Survey</span>
                        </div>
                      ) : (
                        <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                      
                      {/* Visibility indicator */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${visibilityInfo.color}`}>
                        <visibilityInfo.icon className="h-3 w-3 mr-1" />
                        {visibilityInfo.text}
                      </span>
                      
                      {/* Priority badge */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : announcement.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {announcement.priority}
                      </span>

                      {/* Urgent deadline indicator */}
                      {isUrgent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Due in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {announcement.content}
                    </p>

                    {/* Survey CTA */}
                    {isSurvey && (
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/o/${organization.slug}/surveys`}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <ClipboardList className="h-3 w-3 mr-1" />
                          Take Survey
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                        <a
                          href={`/o/${organization.slug}/announcements/${announcement.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </a>
                      </div>
                    )}

                    {/* Regular announcement link */}
                    {!isSurvey && (
                      <a
                        href={`/o/${organization.slug}/announcements/${announcement.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Details
                      </a>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 text-right">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {formattedDate.month} {formattedDate.day}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formattedDate.year}
                    </div>
                    {formattedDate.startTime && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formattedDate.startTime}
                      </div>
                    )}
                    
                    {/* Deadline indicator */}
                    {hasDeadline && (
                      <div className="mt-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isUrgent 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntilDeadline !== null && daysUntilDeadline >= 0 
                            ? `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                            : 'Expired'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
