import type { DccSuggestFormInput } from '@/lib/dcc/signup/suggest/schema'
import { DEFAULT_SEED_CANDIDATES_FIELD_MAP } from '@/lib/network-builder/seed-candidates-field-map'
import { GRAPH_LAYER_DEMO_OPTIONS, DEMO_READINESS_OPTIONS } from '@/lib/network-builder/demo-select-options'
import { normalizeUrl } from '@/lib/dcc/signup/map-to-airtable'

const F = DEFAULT_SEED_CANDIDATES_FIELD_MAP

function buildSourceLabel(source?: string): string {
  const base = 'Online suggestion'
  if (!source?.trim()) return base
  return `${base} (${source.trim()})`
}

export function mapSuggestToAirtableFields(input: DccSuggestFormInput): Record<string, unknown> {
  const notes = [
    input.whySuggest,
    input.suggesterName ? `Suggested by: ${input.suggesterName}` : null,
    input.suggesterEmail ? `Suggester email: ${input.suggesterEmail}` : null,
    buildSourceLabel(input.source),
  ]
    .filter(Boolean)
    .join('\n\n')

  const fields: Record<string, unknown> = {
    [F.candidateName]: input.suggestedName,
    [F.digitalOrientationSignal]: input.whySuggest,
    [F.whyDccFit]: input.whySuggest,
    [F.graphLayer]: GRAPH_LAYER_DEMO_OPTIONS.researchNode,
    [F.demoReadiness]: DEMO_READINESS_OPTIONS.needsReview,
    [F.reviewStatus]: 'To Review',
    [F.recommendedBucket]: 'Research More',
    [F.confidence]: 'Low',
  }

  if (input.suggestedRole?.trim()) fields[F.roleType] = input.suggestedRole.trim()
  if (input.practiceTags?.length) fields[F.suggestedPracticeTags] = input.practiceTags
  if (input.miamiConnectionType) fields[F.miamiConnectionType] = input.miamiConnectionType
  const sourceUrl = normalizeUrl(input.sourceUrl)
  if (sourceUrl) fields[F.sourceUrl] = sourceUrl
  const website = normalizeUrl(input.website)
  if (website) fields[F.website] = website
  if (input.instagram?.trim()) fields[F.instagram] = input.instagram.trim()
  const linkedin = normalizeUrl(input.linkedin)
  if (linkedin) fields[F.linkedin] = linkedin

  fields[F.suggestedOutreachAngle] = notes

  return fields
}
