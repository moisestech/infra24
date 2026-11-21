/**
 * MEMBERSHIP-SCALE INSTALLATION — CURRENT SOURCE CONTRACT
 *
 * Current minimum is based ONLY on the DCC founder's report that the WhatsApp
 * Commons now has more than 100 members on 2026-11-21.
 * Mathematically, this supports at least 101, NOT an audited exact count.
 *
 * Previous structured evidence (separate from current user report):
 * - Airtable weekly pulse: 50 verified 2026-10-24.
 * - WhatsApp Member Roster Audit: 50 October screenshot rows.
 * - Airtable People Active/Joined: 45 CRM rows.
 * None is an up-to-date WhatsApp roster. The private chat isn't synchronized.
 *
 * The frontend intentionally contains:
 * - one anonymous graphical MARK per minimum reported seat,
 * - no member identity, stable member-derived ID, skills, contact, or response,
 * - zero mapped private relationships.
 *
 * No "anonymous" marker corresponds to any fixed real person's Airtable row.
 * Once the roster is reconciled, update this editorial aggregate. Publishable
 * individual connections require separately opted-in endpoints and bilateral
 * consent; see people-graph.ts.
 */
export const MEMBER_PRESENCE_SOURCE = {
  date: '2026-11-21',
  reportedLabel: '100+',
  minimumCount: 101,
  source: 'Founder-reported current WhatsApp Commons size',
  status: 'Reported minimum, awaiting roster reconciliation',
  previousVerifiedAt: '2026-10-24',
  previousVerifiedCount: 50,
  caveat: 'Each mark stands for one of at least 101 reported members. Its position has no identity mapping. Relationships are not published without permission.',
} as const

export type MemberPresenceMark = {
  id: string
  label: string
  kind: 'membership-mark'
}
export type PublicRelationshipEdge = {
  from: string
  to: string
  kind: 'mutually-approved-public-connection'
}
export type MembershipPresenceGraph = {
  marks: MemberPresenceMark[]
  connections: PublicRelationshipEdge[]
}

export function makeMembershipPresenceGraph(count: number = MEMBER_PRESENCE_SOURCE.minimumCount): MembershipPresenceGraph {
  const bounded = Number.isFinite(count) ? Math.max(0, Math.min(5000, Math.floor(count))) : 0
  return {
    marks: Array.from({ length: bounded }, (_, i) => {
      const number = String(i + 1).padStart(3, '0')
      return {
        id: 'member-mark-' + number,
        label: 'Member presence ' + number,
        kind: 'membership-mark' as const,
      }
    }),
    // Don't invent edges from the common WhatsApp membership.
    connections: [],
  }
}

/** Spherical, deterministic form that can be recast as a sculptural edition. */
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
