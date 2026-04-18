/**
 * Map API workshop JSON (public or full org list) into the shape used by
 * `/o/[slug]/workshops` and org home preview cards.
 */

export type OrgWorkshopCatalogOrg = {
  id: string
  name: string
  slug: string
}

export type OrgWorkshopCatalogItem = {
  id: string
  title: string
  description: string
  content?: string
  category: string
  type: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  duration_minutes: number
  max_participants: number
  price: number
  instructor: string
  prerequisites: string[]
  materials: string[]
  outcomes: string[]
  is_active: boolean
  is_shared: boolean
  featured: boolean
  image_url?: string
  organization_id: string
  organization_name: string
  organization_slug: string
  created_by_email: string
  total_bookings: number
  confirmed_bookings: number
  average_rating: number
  total_feedback: number
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown> | null
}

function asLevel(v: unknown): 'beginner' | 'intermediate' | 'advanced' {
  if (v === 'intermediate' || v === 'advanced' || v === 'beginner') return v
  return 'beginner'
}

function asStatus(v: unknown): 'draft' | 'published' | 'archived' {
  if (v === 'draft' || v === 'published' || v === 'archived') return v
  return 'published'
}

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : []
}

export function normalizeWorkshopForCatalog(
  raw: Record<string, unknown>,
  org: OrgWorkshopCatalogOrg
): OrgWorkshopCatalogItem {
  const now = new Date().toISOString()
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    description: typeof raw.description === 'string' ? raw.description : '',
    content: typeof raw.content === 'string' ? raw.content : undefined,
    category: String(raw.category ?? 'general'),
    type: String(raw.type ?? 'workshop'),
    level: asLevel(raw.level),
    status: asStatus(raw.status),
    duration_minutes: typeof raw.duration_minutes === 'number' ? raw.duration_minutes : 0,
    max_participants: typeof raw.max_participants === 'number' ? raw.max_participants : 0,
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0,
    instructor: String(raw.instructor ?? ''),
    prerequisites: strArr(raw.prerequisites),
    materials: strArr(raw.materials),
    outcomes: strArr(raw.outcomes),
    is_active: Boolean(raw.is_active ?? true),
    is_shared: Boolean(raw.is_shared ?? false),
    featured: Boolean(raw.featured),
    image_url: typeof raw.image_url === 'string' ? raw.image_url : undefined,
    organization_id: org.id,
    organization_name: org.name,
    organization_slug: org.slug,
    created_by_email: String(raw.created_by_email ?? ''),
    total_bookings: typeof raw.total_bookings === 'number' ? raw.total_bookings : 0,
    confirmed_bookings: typeof raw.confirmed_bookings === 'number' ? raw.confirmed_bookings : 0,
    average_rating: typeof raw.average_rating === 'number' ? raw.average_rating : 0,
    total_feedback: typeof raw.total_feedback === 'number' ? raw.total_feedback : 0,
    created_at: typeof raw.created_at === 'string' ? raw.created_at : now,
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : now,
    metadata:
      raw.metadata && typeof raw.metadata === 'object'
        ? (raw.metadata as Record<string, unknown>)
        : null,
  }
}
