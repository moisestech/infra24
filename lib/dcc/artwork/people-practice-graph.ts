/**
 * A bipartite view of the actual public network.
 *
 * Human dots are the reported membership minimum (three publicly featured,
 * the rest anonymous count-only positions). Larger practice nodes show the
 * six real multi-select WhatsApp poll category totals.
 *
 * A public person-to-practice edge is taken ONLY from a curated public
 * Atlas editorial profile; it does not say the person answered the poll.
 * Each selection is drawn as one anonymous ballot-mark spoke to its category.
 * This encodes 72 recorded selections, NOT 72 unique people or identities.
 * A member may have selected several categories, and no individual voters
 * are known. Poll-mark IDs are per-category drawing slots, not voter IDs.
 * No aggregate votes are converted to identity-level edges.
 */
import { INTERESTS, PILOT_PREVIEWS, type InterestId, type AtlasProfile } from '@/lib/dcc/community/atlas'
import { DCC_DISCOVERY_POLL, type DiscoveryPollChoiceId } from './discovery-poll'
import { makeMembershipPresenceGraph } from './member-presence'

export const INTEREST_POLL_CATEGORIES: Record<InterestId, DiscoveryPollChoiceId> = {
  making: 'fabrication',
  'image-sound': 'film',
  interactive: 'xr',
  'code-ai': 'code',
  culture: 'art',
  exploring: 'exploring',
}

export type PracticeNode = {
  id: string
  label: string
  short: string
  choiceId: DiscoveryPollChoiceId
  count: number // aggregate selections, never number of linked public profiles
  kind: 'practice'
}
export type PollSelectionNode = {
  id: string
  choiceId: DiscoveryPollChoiceId
  kind: 'poll-selection'
}
export type PollSelectionEdge = {
  source: string
  target: string
  kind: 'aggregate-poll-selection'
  evidence: 'organizer-poll-screenshot'
}
export type PracticeEdge = {
  source: string
  target: string
  kind: 'listed-practice'
  evidence: 'public-Atlas-editorial-profile' | 'member-self-declared' | 'approved-Atlas-profile'
}

export function makePeoplePracticeGraph(options: {
  profiles?: AtlasProfile[]
  websitePresenceMarks?: number
} = {}) {
  // A provided list is the exact currently authorized public projection.
  // Omission is editorial PREVIEW only. Never keep named fixtures as a live
  // fallback when someone withdraws publication.
  const profiles = options.profiles ?? PILOT_PREVIEWS
  const slugs = new Set<string>()
  const publicProfiles = profiles.filter(profile => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug) || slugs.has(profile.slug)) return false
    slugs.add(profile.slug)
    return true
  })
  const approvedSlugs = new Set(publicProfiles.map(profile=>profile.slug))
  const membership = makeMembershipPresenceGraph()
  const reportedBackdrop = membership.marks.map((mark,index) => {
    if(mark.kind === 'anonymous-presence' || approvedSlugs.has(mark.id)) return mark
    // Preserve the founder-reported BACKDROP count with no identity claim.
    // A withdrawn public artist stops being a named person immediately.
    return {
      id:'anonymous-reported-' + String(index + 1).padStart(3,'0'),
      label:'Reported WhatsApp presence without approved public identity',
      kind:'anonymous-presence' as const,
    }
  })
  const featured = new Set(reportedBackdrop.filter(mark =>
    mark.kind === 'public-cofounder' || mark.kind === 'public-artist'
  ).map(mark=>mark.id))
  const websiteCount = Number.isSafeInteger(options.websitePresenceMarks) &&
    (options.websitePresenceMarks ?? 0) >= 5 &&
    (options.websitePresenceMarks ?? 0) <= 1024 &&
    (options.websitePresenceMarks ?? 0) % 5 === 0
      ? options.websitePresenceMarks! : 0
  const marks = [
    ...reportedBackdrop,
    ...publicProfiles.filter(p => !featured.has(p.slug)).map(p => ({
      id:p.slug,label:p.name,kind:'approved-profile' as const,
    })),
    ...Array.from({ length: websiteCount }, (_,i)=>({
      id:'website-cohort-mark-'+String(i+1).padStart(4,'0'),
      label:'Delayed anonymous website-member aggregate',
      kind:'anonymous-website-presence' as const,
    })),
  ]
  const visible = new Set(marks.filter(mark =>
    mark.kind === 'public-cofounder' || mark.kind === 'public-artist' || mark.kind === 'approved-profile'
  ).map(mark=>mark.id))
  const practices: PracticeNode[] = DCC_DISCOVERY_POLL.choices.map((choice) => ({
    id: 'practice-' + choice.id,
    label: choice.label,
    short: choice.short,
    choiceId: choice.id,
    count: choice.count,
    kind: 'practice',
  }))
  const edges: PracticeEdge[] = publicProfiles.filter((profile) => visible.has(profile.slug)).flatMap((profile) =>
    profile.interests
      .filter((id) => INTERESTS.some((category) => category.id === id))
      .map((id) => ({
        source: profile.slug,
        target: 'practice-' + INTEREST_POLL_CATEGORIES[id],
        kind: 'listed-practice' as const,
        evidence: profile.slug === 'moises-sanabria' ? 'member-self-declared' as const : 'approved-Atlas-profile' as const,
      }))
  )
  // One spoke per recorded category selection. These are not people nodes:
  // WhatsApp exposes aggregate totals but not a complete voter/answer mapping.
  const pollSelections: PollSelectionNode[] = practices.flatMap((practice) =>
    Array.from({ length: practice.count }, (_, i) => ({
      id: 'poll-selection-' + practice.choiceId + '-' + String(i + 1).padStart(2, '0'),
      choiceId: practice.choiceId,
      kind: 'poll-selection' as const,
    }))
  )
  const pollEdges: PollSelectionEdge[] = pollSelections.map((selection) => ({
    source: selection.id,
    target: 'practice-' + selection.choiceId,
    kind: 'aggregate-poll-selection',
    evidence: 'organizer-poll-screenshot',
  }))
  const connections = membership.connections.filter(edge =>
    approvedSlugs.has(edge.from) && approvedSlugs.has(edge.to))
  return { ...membership, marks, connections, practices, practiceEdges: edges, pollSelections, pollEdges }
}

export function isPracticeNode(id: string | null): id is string {
  return Boolean(id && DCC_DISCOVERY_POLL.choices.some((choice) => 'practice-' + choice.id === id))
}

export function getPracticeNode(choice: DiscoveryPollChoiceId) {
  return 'practice-' + choice
}
