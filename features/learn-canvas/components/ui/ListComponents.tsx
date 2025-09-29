'use client'

// Re-export all list components for easy importing
export { 
  InteractiveList, 
  FeatureList, 
  TimelineList, 
  ChecklistList, 
  AccordionList 
} from './InteractiveList'

export { 
  ComparisonList, 
  PlatformComparison 
} from './ComparisonList'

export { 
  ProcessList 
} from './ProcessList'

// Utility functions for creating list items
export const createListItem = (
  title: string, 
  description?: string, 
  status?: 'success' | 'error' | 'warning' | 'info' | 'neutral',
  metadata?: Record<string, any>,
  customIcon?: string,
  details?: string[]
) => ({
  id: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  description,
  status,
  metadata,
  customIcon,
  details
})

export const createProcessStep = (
  title: string,
  description: string,
  details?: string[],
  estimatedTime?: string,
  tips?: string[]
) => ({
  id: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  description,
  details,
  estimatedTime,
  tips
})

export const createComparisonItem = (
  name: string,
  features: Record<string, boolean | string | number>,
  description?: string,
  metadata?: Record<string, any>
) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  description,
  features,
  metadata
})
