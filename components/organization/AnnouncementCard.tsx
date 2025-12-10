'use client'

import { Eye, FileCheck, GraduationCap } from 'lucide-react'
import { BackgroundPattern } from '@/components/BackgroundPattern'
import { AnnouncementType, AnnouncementSubType } from '@/types/announcement'

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
  scheduled_at?: string
  expires_at?: string
  image_url?: string
}

interface AnnouncementCardProps {
  announcement: Announcement
  organizationSlug: string
  organizationName: string
  formattedDate: {
    day: number
    month: string
    year: number
    startTime?: string | null
    endTime?: string | null
  }
  debugMode?: boolean
}

export function AnnouncementCard({ 
  announcement, 
  organizationSlug, 
  organizationName,
  formattedDate,
  debugMode = false
}: AnnouncementCardProps) {
  // Check if this is a high priority survey announcement
  const isHighPrioritySurvey = announcement.title.toLowerCase().includes('survey') && 
    (announcement.priority === 'high' || announcement.title.toLowerCase().includes('urgent') || announcement.title.toLowerCase().includes('important'))

  // Check if this is a workshop announcement
  const isWorkshopAnnouncement = announcement.type === 'workshop' || 
    announcement.metadata?.announcement_type === 'workshop_promotion'

  // Determine announcement type and subtype for pattern selection
  const getAnnouncementType = (): AnnouncementType => {
    const title = announcement.title.toLowerCase()
    const type = announcement.type?.toLowerCase()
    
    if (title.includes('urgent') || announcement.priority === 'high') return 'urgent'
    if (title.includes('event') || type === 'event') return 'event'
    if (title.includes('facility') || type === 'facility') return 'facility'
    if (title.includes('opportunity') || type === 'opportunity') return 'opportunity'
    if (title.includes('administrative') || type === 'administrative') return 'administrative'
    
    // Organization-specific types
    if (organizationSlug === 'bakehouse') {
      if (title.includes('attention') && title.includes('artist')) return 'attention_artists'
      if (title.includes('attention') && title.includes('public')) return 'attention_public'
      if (title.includes('fun fact')) return 'fun_fact'
      if (title.includes('promotion')) return 'promotion'
      if (title.includes('gala')) return 'gala_announcement'
    }
    
    return 'opportunity' // Default fallback
  }

  const getAnnouncementSubType = (): AnnouncementSubType => {
    const title = announcement.title.toLowerCase()
    
    if (title.includes('workshop')) return 'workshop'
    if (title.includes('exhibition')) return 'exhibition'
    if (title.includes('meeting')) return 'meeting'
    if (title.includes('deadline')) return 'deadline'
    if (title.includes('survey')) return 'survey'
    
    return 'general'
  }

  return (
    <div 
      className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group ${
        isHighPrioritySurvey 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex">
        {/* Image Column - Show image if available, otherwise show pattern */}
        <div className="w-20 flex-shrink-0 relative overflow-hidden">
          {announcement.image_url ? (
            <img 
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BackgroundPattern
              type={getAnnouncementType()}
              subType={getAnnouncementSubType()}
              width={80}
              height={120}
              organizationSlug={organizationSlug}
            />
          )}
        </div>

        {/* Calendar Date Column */}
        <div className="w-16 flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formattedDate.day}
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {formattedDate.month}
            </div>
            {formattedDate.startTime && (
              <div className="text-xs text-blue-500 dark:text-blue-300 mt-1 font-medium">
                {formattedDate.startTime}
              </div>
            )}
            {formattedDate.endTime && (
              <div className="text-xs text-blue-500 dark:text-blue-300 font-medium">
                - {formattedDate.endTime}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <a 
                  href={`/o/${organizationSlug}/announcements/${announcement.id}`}
                  className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {announcement.title}
                </a>
                       {/* Survey Action Button - Inline */}
                       {announcement.title.toLowerCase().includes('survey') && (
                         <a
                           href="/o/oolite/surveys"
                           className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ml-2 flex-shrink-0"
                         >
                           <FileCheck className="w-4 h-4 mr-1" />
                           Take Survey
                         </a>
                       )}
                       
                       {/* Workshop Registration Button - Inline */}
                       {isWorkshopAnnouncement && (
                         <a
                           href="/o/oolite/workshop-catalog"
                           className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ml-2 flex-shrink-0"
                         >
                           <GraduationCap className="w-4 h-4 mr-1" />
                           Register
                         </a>
                       )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {announcement.content ? announcement.content.substring(0, 100) + '...' : announcement.title}
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span className={`px-2 py-1 rounded-full ${
                  announcement.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {announcement.status}
                </span>
                       {isHighPrioritySurvey && (
                         <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                           High Priority
                         </span>
                       )}
                       {isWorkshopAnnouncement && (
                         <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                           Workshop
                         </span>
                       )}
                {debugMode && (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {getAnnouncementType()}
                  </span>
                )}
                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <a 
              href={`/o/${organizationSlug}/announcements/${announcement.id}`}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
            >
              <Eye className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
