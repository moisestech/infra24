/**
 * An intentionally fictional PEOPLE + CONNECTIONS graph for The Network Makes Itself.
 *
 * Design contract:
 * - Every node is one illustrated *person-position*, never a topic or a CRM record.
 * - Every edge joins two person-positions, never a category spoke.
 * - The topology and the individual attributes below are invented demonstration data.
 * - Broad group vocabulary is informed by reviewed DCC aggregates, but NO person,
 *   preference answer, introduction, Airtable ID, private edge or real adjacency
 *   is translated into this browser bundle.
 * - The chosen demonstration size differs from the real CRM population and is
 *   not a population estimate. No inference about actual member degree is valid.
 *
 * To publish REAL people and real ties: require independent, revocable artwork
 * visibility consent for each node, and explicit mutual/public relationship
 * approval for each edge. Internal "introduced" status alone is not enough.
 */

import { PATTERN_GROUPS, type PatternLens } from './network-patterns'

export type PersonPosition = {
  id: string
  practice: string
  activity: string
  label: string
  illustrated: true
}
export type PersonConnection = {
  source: string
  target: string
  kind: 'illustrative' | 'local'
}
export type PersonStudy = { people: PersonPosition[]; connections: PersonConnection[] }
export type LocalExperiment = { group: string; signal: 'show' | 'need' | 'offer' }

const PRACTICE_IDS = PATTERN_GROUPS.practices.map((group) => group.id)
const ACTIVITY_IDS = PATTERN_GROUPS.activity.map((group) => group.id)
const ACTIVITY_FROM_SIGNAL: Record<LocalExperiment['signal'], string> = {
  show: 'show',
  need: 'need',
  offer: 'exchange',
}

/**
 * Artistic 30-position study. NOT 30 real DCC participants; not a roster.
 * Six broad practices balance visual storytelling rather than copying the
 * frequency or intersection of any real respondent's private annotations.
 */
export const SAMPLE_PEOPLE: PersonPosition[] = Array.from({ length: 30 }, (_, i) => {
  const practice = PRACTICE_IDS[(i * 7 + Math.floor(i / 4)) % PRACTICE_IDS.length]
  const activity = ACTIVITY_IDS[(i * 3 + Math.floor(i / 5)) % ACTIVITY_IDS.length]
  return {
    id: 'position-' + String(i + 1).padStart(2, '0'),
    label: 'Position ' + String(i + 1).padStart(2, '0'),
    practice,
    activity,
    illustrated: true,
  }
})

/** Fixed, legible social shape: pairs, triangles, and a few long bridges.
 * The lines are hypothetical connections inside an invented demonstration,
 * NOT inferred affiliations or actual DCC introductions.
 */
const LINKS: [number, number][] = [
  [0,1],[1,2],[2,3],[0,3],[3,4],
  [5,6],[6,7],[7,8],[8,9],[5,9],[4,7],
  [10,11],[11,12],[12,13],[13,14],[10,14],[8,11],
  [15,16],[16,17],[17,18],[18,19],[15,19],[14,17],
  [20,21],[21,22],[22,23],[23,24],[20,24],[18,21],
  [25,26],[26,27],[27,28],[28,29],[25,29],[24,27],
  [2,16],[11,26],[9,22],
]

const ILLUSTRATIVE_CONNECTIONS: PersonConnection[] = LINKS.map(([a, b]) => ({
  source: SAMPLE_PEOPLE[a].id,
  target: SAMPLE_PEOPLE[b].id,
  kind: 'illustrative',
}))

export function makeIllustrativePeopleGraph(local: LocalExperiment | null = null): PersonStudy {
  if (!local) return { people: SAMPLE_PEOPLE, connections: ILLUSTRATIVE_CONNECTIONS }
  const practice = PRACTICE_IDS.includes(local.group) ? local.group : PRACTICE_IDS[0]
  const group = SAMPLE_PEOPLE.find((p) => p.practice === practice)
  return {
    people: [
      ...SAMPLE_PEOPLE,
      {
        id: 'visitor-local', practice,
        activity: ACTIVITY_FROM_SIGNAL[local.signal],
        label: 'Your local experiment',
        illustrated: true,
      },
    ],
    connections: [
      ...ILLUSTRATIVE_CONNECTIONS,
      { source: 'visitor-local', target: group?.id ?? SAMPLE_PEOPLE[0].id, kind: 'local' },
    ],
  }
}

export function colorForPerson(person: PersonPosition, lens: PatternLens): string {
  const group = PATTERN_GROUPS[lens].find(
    (g) => g.id === (lens === 'practices' ? person.practice : person.activity),
  )
  return group?.color || '#afc5b6'
}

/** Stable 2D projection of the same illustrative person-to-person topology
 * for a vector study. This is not a capture of 3D force-simulation positions.
 */
export function studyPosition(id: string): { x: number; y: number } {
  const match = /^position-(\d\d)$/.exec(id)
  if (!match) return { x: 500, y: 500 }
  const index = Number(match[1]) - 1
  const ringIndex = index % 15
  const radius = index < 15 ? 185 : 360
  const angle = (-Math.PI / 2) + (ringIndex * 2 * Math.PI / 15) + (index >= 15 ? Math.PI / 15 : 0)
  return { x: 500 + radius * Math.cos(angle), y: 500 + radius * Math.sin(angle) }
}

/**
 * Future explicitly consented public graph contract. Only consented nodes
 * and separately mutually approved edges can enter a public social graph.
 * An explicit version is part of publication consent and edge consent.
 */
export type ApprovedArtworkPerson = {
  artworkId: string
  publicArtworkConsent: boolean
  consentVersion: string | null
  withdrawn: boolean
}
export type ApprovedArtworkConnection = {
  from: string
  to: string
  fromPublicEdgeConsent: boolean
  toPublicEdgeConsent: boolean
  publishedAgreementVersion: string | null
  withdrawn: boolean
}
export function projectApprovedPersonGraph(
  people: ApprovedArtworkPerson[],
  connections: ApprovedArtworkConnection[],
) {
  const publicPeople = people.filter((person) =>
    person.publicArtworkConsent === true &&
    !!person.consentVersion &&
    person.withdrawn === false &&
    !!person.artworkId,
  )
  const eligible = new Set(publicPeople.map((person) => person.artworkId))
  const publicConnections = connections.filter((edge) =>
    eligible.has(edge.from) &&
    eligible.has(edge.to) &&
    edge.from !== edge.to &&
    edge.fromPublicEdgeConsent &&
    edge.toPublicEdgeConsent &&
    !!edge.publishedAgreementVersion &&
    edge.withdrawn === false,
  )
  return {
    people: publicPeople.map(({ artworkId }) => ({ id: artworkId })),
    connections: publicConnections.map(({ from, to }) => ({ source: from, target: to })),
  }
}
