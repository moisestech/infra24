/**
 * The Network Makes Itself — conservative public person-node source.
 *
 * Founder reported more than 100 WhatsApp Commons members on Nov 21, 2026.
 * Exactly 101 *minimum-count presence marks* are rendered, rather than
 * claiming that 101 is the full or independently verified membership.
 *
 * Three public artists (Moises, Fabiola, and Angelo) occupy three of the
 * 101 minimum-count positions; the other 98 have no identifying mapping.
 *
 * The only public person-to-person edge is the documented DCC cofounding.
 * Aggregate poll totals remain distinct from public editorial practices.
 *
 * For a future real-person graph, use the explicit bilateral-publication
 * consent contract in people-graph.ts. Group membership alone is not an
 * interpersonal relationship or proof of a poll answer.
 */
import { PILOT_PREVIEWS } from '@/lib/dcc/community/atlas'

export const MEMBER_PRESENCE_SOURCE = {
  date: '2026-11-21',
  reportedLabel: '100+',
  minimumCount: 101,
  source: 'Founder-reported current DCC WhatsApp Commons size',
  status: 'Reported lower bound; current roster not independently reconciled',
  previousVerifiedAt: '2026-10-29',
  previousVerifiedCount: 73,
  caveat: 'Three featured artists within the reported lower bound; 98 anonymous marks. Person-to-person lines are limited to documented cofounding.',
} as const

export type MemberPresenceMark = {
  id: string
  label: string
  kind: 'public-cofounder' | 'public-artist' | 'anonymous-presence'
  publicRole?: 'DCC cofounder' | 'Featured artist'
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

export const PUBLIC_ARTISTS: readonly MemberPresenceMark[] = [
  ...PUBLIC_FOUNDERS,
  ...PILOT_PREVIEWS.filter((p) => !PUBLIC_FOUNDERS.some((founder) => founder.id === p.slug)).map((p) => ({
    id: p.slug, label: p.name, kind: 'public-artist' as const, publicRole: 'Featured artist' as const,
  })),
]

export function makeMembershipPresenceGraph(
  count = MEMBER_PRESENCE_SOURCE.minimumCount,
): MembershipPresenceGraph {
  const bounded = Number.isFinite(count) ? Math.max(0, Math.min(5000, Math.floor(count))) : 0
  const visible = PUBLIC_ARTISTS.slice(0, bounded)
  const anonymous: MemberPresenceMark[] = Array.from({ length: bounded - visible.length }, (_, i) => ({
    id: 'anonymous-' + String(i + 1).padStart(3, '0'),
    label: 'Anonymous member-presence mark',
    kind: 'anonymous-presence',
  }))
  return {
    marks: [...visible, ...anonymous],
    connections: visible.length >= 2 ? [{
      from: PUBLIC_FOUNDERS[0].id,
      to: PUBLIC_FOUNDERS[1].id,
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
