import type { CrmPeopleFieldMap } from '@/lib/airtable/oolite-crm-people-config'

export const DEFAULT_CRM_PEOPLE_FIELD_MAP: CrmPeopleFieldMap = {
  name: 'Full Name',
  titleRole: 'Title / Role',
  department: 'Department',
  institution: 'Institution',
  city: 'City',
  bio: 'Bio',
  website: 'Website',
  pronouns: 'Pronouns',
  primaryImageUrl: 'Image / Portrait URL',
  portfolioImageUrls: 'Portfolio Image URLs',
  practiceTags: 'Practice Tags',
  publicAiApproved: 'Public AI Approved',
  doNotUseInAi: 'Do Not Use In AI',
  programming: 'Programming',
  instagram: 'Instagram',
}

export function indexPeopleRowsByName(
  rows: Array<{ id: string; fields: Record<string, unknown> }>,
  nameField: string
): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    const raw = row.fields[nameField]
    const name = typeof raw === 'string' ? raw.trim() : undefined
    if (name) map.set(name.trim().toLowerCase(), row.id)
  }
  return map
}
