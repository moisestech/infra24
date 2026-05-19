import type { MiamiFilter, WebsiteFilter } from '@/lib/airtable/alumni-filters'

type FilterState = {
  onlyDigital: boolean
  onlyCollection: boolean
  onlyVideo: boolean
  websiteFilter: WebsiteFilter
  miamiFilter: MiamiFilter
  yearFilter: string
  topicFilter: string
}

type RefineState = {
  programFilter: string
  mediumFilter: string
  pronounFilter: string
  ethnicityFilter: string
  nationalityFilter: string
  cohortFilter: string
  groupBy: string
}

export function buildFiltersSummary(s: FilterState): string {
  const parts: string[] = []
  if (s.onlyDigital) parts.push('Digital')
  if (s.onlyCollection) parts.push('Collection')
  if (s.onlyVideo) parts.push('Video')
  if (s.websiteFilter === 'yes') parts.push('Has website')
  if (s.websiteFilter === 'no') parts.push('No website')
  if (s.miamiFilter === 'miami') parts.push('Miami')
  if (s.miamiFilter === 'not_miami') parts.push('Not Miami')
  if (s.yearFilter !== '__all__') parts.push(s.yearFilter)
  if (s.topicFilter !== '__all__') parts.push(s.topicFilter)
  if (parts.length === 0) return 'All artists'
  return parts.length <= 3 ? parts.join(' · ') : `${parts.slice(0, 2).join(' · ')} +${parts.length - 2}`
}

export function buildRefineSummary(s: RefineState): string {
  const parts: string[] = []
  if (s.programFilter !== '__all__') parts.push(s.programFilter)
  if (s.mediumFilter !== '__all__') parts.push(s.mediumFilter)
  if (s.pronounFilter !== '__all__') parts.push(s.pronounFilter)
  if (s.ethnicityFilter !== '__all__') parts.push(s.ethnicityFilter)
  if (s.nationalityFilter !== '__all__') parts.push(s.nationalityFilter)
  if (s.cohortFilter !== '__all__') parts.push(s.cohortFilter)
  if (s.groupBy !== 'none') parts.push(`Group: ${s.groupBy}`)
  if (parts.length === 0) return 'Default view'
  return parts.length <= 2 ? parts.join(' · ') : `${parts[0]} · +${parts.length - 1}`
}

export function sortLabel(mode: string): string {
  switch (mode) {
    case 'name-desc':
      return 'Name Z–A'
    case 'year-desc':
      return 'Newest residency'
    case 'year-asc':
      return 'Oldest residency'
    case 'cohort-asc':
      return 'Cohort'
    default:
      return 'Name A–Z'
  }
}
