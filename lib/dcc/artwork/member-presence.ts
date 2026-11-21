/**
 * The Network Makes Itself — conservative public person-node source.
 *
 * Founder reported more than 100 WhatsApp Commons members on Nov 21, 2026.
 * Exactly 101 *minimum-count presence marks* are rendered, rather than
 * claiming that 101 is the full or independently verified membership.
 *
 * Only DCC's two publicly identified cofounders are labeled as people.
 * They occupy two of the 101 positions, NOT two added above the minimum.
 * The remaining 99 marks are NOT pseudonymized records and have no stable
 * relationship to any particular WhatsApp/Airtable user.
 *
 * The only public person-to-person edge is the documented DCC cofounding.
 * Poll totals are kept entirely separate from these nodes.
 *
 * For a future real-person graph, use the explicit bilateral-publication
 * consent contract in people-graph.ts. Group membership alone is not an
 * interpersonal relationship or proof of a poll answer.
 */
export const MEMBER_PRESENCE_SOURCE = {
  date: '2026-11-21',
  reportedLabel: '100+',
  minimumCount: 101,
  source: 'Founder-reported current DCC WhatsApp Commons size',
  status: 'Reported lower bound; current roster not independently reconciled',
  previousVerifiedAt: '2026-10-29',
  previousVerifiedCount: 73,
  caveat: 'One public mark per position in the minimum reported population; anonymous positions do not identify specific members. The only drawn relationship is DCC cofounding.',
} as const

export type MemberPresenceMark = {
  id: string
  label: string
  kind: 'public-cofounder' | 'anonymous-presence'
  publicRole?: 'DCC cofounder'
}
export type PublicRelationshipEdge = {
  from: string
  to: string
  kind: 'documented-cofounding'
}
export type MembershipPresenceGraph = {
  marks: MemberPresenceMark[]
  connections: PublicRelationshipEdge[]
}

export const PUBLIC_FOUNDERS: readonly MemberPresenceMark[] = [
  { id: 'moises-sanabria', label: 'Moises Sanabria', kind: 'public-cofounder', publicRole: 'DCC cofounder' },
  { id: 'fabiola-larios', label: 'Fabiola Larios', kind: 'public-cofounder', publicRole: 'DCC cofounder' },
]

export function makeMembershipPresenceGraph(
  count = MEMBER_PRESENCE_SOURCE.minimumCount,
): MembershipPresenceGraph {
  const bounded = Number.isFinite(count) ? Math.max(0, Math.min(5000, Math.floor(count))) : 0
  const founders = PUBLIC_FOUNDERS.slice(0, bounded)
  const anonymous: MemberPresenceMark[] = Array.from({ length: bounded - founders.length }, (_, i) => ({
    id: 'anonymous-' + String(i + 1).padStart(3, '0'),
    label: 'Anonymous member-presence mark',
    kind: 'anonymous-presence',
  }))
  return {
    marks: [...founders, ...anonymous],
    connections: founders.length === 2 ? [{
      from: founders[0].id,
      to: founders[1].id,
      kind: 'documented-cofounding',
    }] : [],
  }
}

/** Deterministic placement for the spatial / printable study, not a real social geometry. */
export function presenceSpherePosition(index: number, count: number, radius = 150) {
  const y = 1 - (index / Math.max(1, count - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const phi = index * Math.PI * (3 - Math.sqrt(5))
  return {
    x: Math.cos(phi) * r * radius,
    y: y * radius,
    z: Math.sin(phi) * r * radius,
  }
}
