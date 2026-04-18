import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export type WorkshopRow = {
  id: string
  title: string
  description?: string | null
  content?: string | null
  category?: string | null
  level?: string | null
  duration_minutes?: number | null
  max_participants?: number | null
  price?: number | null
  instructor?: string | null
  outcomes?: string[] | null
  prerequisites?: string[] | null
  materials?: string[] | null
  image_url?: string | null
  featured?: boolean | null
  status?: string | null
  metadata?: Record<string, unknown> | null
  organization_id?: string
  /** Extended columns sometimes present on row */
  learn_difficulty?: string | null
  has_learn_content?: boolean | null
  learning_objectives?: string[] | null
  estimated_learn_time?: number | null
  course_available?: boolean | null
  workshop_outline?: Array<{
    section: string
    topics: string[]
    duration: string
  }> | null
  what_youll_learn?: string[] | null
  materials_needed?: string[] | null
  start_date?: string | null
  /** Present on API-normalized catalog rows (public org workshops). */
  total_bookings?: number | null
  confirmed_bookings?: number | null
  average_rating?: number | null
  total_feedback?: number | null
  updated_at?: string | null
  created_at?: string | null
  type?: string | null
}

export type WorkshopDetailModel = {
  row: WorkshopRow
  marketing: WorkshopMarketingMetadata
}
