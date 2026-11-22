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
import { INTERESTS, PILOT_PREVIEWS, type InterestId } from '@/lib/dcc/community/atlas'
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
  evidence: 'public-Atlas-editorial-profile' | 'member-self-declared'
}

export function makePeoplePracticeGraph(count?: number) {
  const membership = makeMembershipPresenceGraph(count)
  const visible = new Set(membership.marks.filter((mark) => mark.kind !== 'anonymous-presence').map((mark) => mark.id))
  const practices: PracticeNode[] = DCC_DISCOVERY_POLL.choices.map((choice) => ({
    id: 'practice-' + choice.id,
    label: choice.label,
    short: choice.short,
    choiceId: choice.id,
    count: choice.count,
    kind: 'practice',
  }))
  const edges: PracticeEdge[] = PILOT_PREVIEWS.filter((profile) => visible.has(profile.slug)).flatMap((profile) =>
    profile.interests
      .filter((id) => INTERESTS.some((category) => category.id === id))
      .map((id) => ({
        source: profile.slug,
        target: 'practice-' + INTEREST_POLL_CATEGORIES[id],
        kind: 'listed-practice' as const,
        evidence: profile.slug === 'moises-sanabria' ? 'member-self-declared' as const : 'public-Atlas-editorial-profile' as const,
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
  return { ...membership, practices, practiceEdges: edges, pollSelections, pollEdges }
}

export function isPracticeNode(id: string | null): id is string {
  return Boolean(id && DCC_DISCOVERY_POLL.choices.some((choice) => 'practice-' + choice.id === id))
}

export function getPracticeNode(choice: DiscoveryPollChoiceId) {
  return 'practice-' + choice
}
