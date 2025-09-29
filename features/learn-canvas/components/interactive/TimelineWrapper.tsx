'use client'

import { Timeline } from './Timeline'
import { FilmstripTimeline, TimelineEvent as FilmstripEvent } from './FilmstripTimeline'

interface TimelineEvent {
  year: string
  title: string
  description: string
  category?: 'milestone' | 'breakthrough' | 'release' | 'research'
}

interface TimelineWrapperProps {
  events: TimelineEvent[]
  title?: string
  className?: string
  variant?: 'vertical' | 'horizontal' | 'auto'
}

export function TimelineWrapper({ 
  events, 
  title, 
  className, 
  variant = 'auto' 
}: TimelineWrapperProps) {
  // Convert events to FilmstripTimeline format
  const filmstripEvents: FilmstripEvent[] = events.map(event => ({
    id: `${event.year}-${event.title.toLowerCase().replace(/\s+/g, '-')}`,
    date: `${event.year}-01-01`, // Default to January 1st of the year
    title: event.title,
    summary: event.description,
    category: event.category as any,
    tags: event.category ? [event.category] : undefined
  }))

  // Auto-detect best variant based on data
  const shouldUseHorizontal = variant === 'horizontal' || 
    (variant === 'auto' && events.length > 8)

  if (shouldUseHorizontal) {
    return (
      <div className={className}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        )}
        <FilmstripTimeline 
          events={filmstripEvents} 
          height={220}
          neon="#00ff00"
        />
      </div>
    )
  }

  // Use original vertical timeline for smaller datasets
  return (
    <Timeline 
      events={events} 
      title={title} 
      className={className} 
    />
  )
}
