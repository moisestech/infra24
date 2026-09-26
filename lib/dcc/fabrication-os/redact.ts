import type {
  ClientJobView,
  ClientQuoteLineView,
  CompetencyLevel,
  CompetencyStatus,
  FabricationJob,
  FabricatorProfile,
  PersonRef,
  PortfolioItem,
  PublicFabricatorProfile,
  QuoteLine,
} from '@/lib/dcc/fabrication-os/domain'
import { clientJobPhase } from '@/lib/dcc/fabrication-os/states'

function quoteLineView(line: QuoteLine): ClientQuoteLineView {
  return {
    label: line.label,
    description: line.description,
    category: line.category,
    quantity: line.quantity,
    unitAmount: line.unitAmount,
    amount: line.amount,
  }
}

/** Client project DTO. Omits staff notes, costs, and payouts. */
export function toClientJobView(
  job: FabricationJob,
  quoteLines: readonly QuoteLine[]
): ClientJobView {
  return {
    jobCode: job.jobCode,
    projectTitle: job.projectTitle,
    phase: clientJobPhase(job.operatingStage, job.heldStage),
    scope: job.scope,
    clientNotes: job.clientNotes,
    materialSummary: job.materialSummary,
    processSummary: job.processSummary,
    quantity: job.quantity,
    requestedDeadline: job.requestedDeadline,
    paymentState: job.paymentState,
    quoteLines: quoteLines
      .filter((line) => line.jobId === job.id)
      .slice()
      .sort((a, b) => a.sort - b.sort)
      .map(quoteLineView),
  }
}

const PUBLIC_COMPETENCY_LEVELS = new Set<CompetencyLevel>([
  'Verified',
  'Active Fabricator',
])

export type PublicCompetencyInput = {
  name: string
  level: CompetencyLevel
  status: CompetencyStatus
}

/**
 * Public fabricator DTO.
 * Returns null unless the profile is Approved and CRM consent allows publication.
 */
export function toPublicFabricatorProfile(input: {
  profile: FabricatorProfile
  person: PersonRef
  competencies?: readonly PublicCompetencyInput[]
}): PublicFabricatorProfile | null {
  if (input.profile.profileStatus !== 'Approved') return null
  if (input.person.publicProfileConsent === 'Do Not Publish') return null
  if (input.profile.personId !== input.person.id) return null

  const verifiedCompetencies = (input.competencies ?? [])
    .filter(
      (row) =>
        row.status === 'Active' && PUBLIC_COMPETENCY_LEVELS.has(row.level)
    )
    .map((row) => row.name)

  return {
    publicName: input.profile.publicName,
    slug: input.profile.slug,
    portraitUrl: input.profile.portraitUrl,
    shortBio: input.profile.shortBio,
    areaLabel: input.profile.neighborhood,
    processes: input.profile.processes,
    software: input.profile.software,
    verifiedCompetencies,
    availability:
      input.profile.availability === 'Hidden'
        ? undefined
        : input.profile.availability,
  }
}

/** Public portfolio DTO. Client work stays private until permission and approval. */
export function toPublicPortfolioItem(
  item: PortfolioItem,
  jobAllowsPortfolio: boolean
): { title: string; imageUrls: readonly string[]; description?: string } | null {
  if (item.visibility !== 'Public') return null
  if (item.jobId && !jobAllowsPortfolio) return null
  if (item.jobId && !item.clientApproved) return null
  return {
    title: item.title,
    imageUrls: item.imageUrls,
    description: item.description,
  }
}
