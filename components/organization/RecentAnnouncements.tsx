'use client'

import { AnnouncementCard } from './AnnouncementCard'

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

interface Organization {
  slug: string
  name: string
}

interface RecentAnnouncementsProps {
  announcements: Announcement[]
  organization: Organization
  debugMode?: boolean
}

export function RecentAnnouncements({ announcements, organization, debugMode = false }: RecentAnnouncementsProps) {
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

          return (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              organizationSlug={organization.slug}
              organizationName={organization.name}
              formattedDate={formattedDate}
              debugMode={debugMode}
            />
          )
        })}
      </div>
    </div>
  )
}