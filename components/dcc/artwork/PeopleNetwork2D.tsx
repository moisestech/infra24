'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import { MEMBER_PRESENCE_SOURCE } from '@/lib/dcc/artwork/member-presence'

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
}

type Point = { x: number; y: number }

const PEOPLE: Record<string, Point> = {
  'moises-sanabria': { x: 105, y: 194 },
  'fabiola-larios': { x: 255, y: 194 },
  'angelo-caruso': { x: 180, y: 265 },
}
const PRACTICES: Record<string, Point> = {
  'practice-art': { x: 62, y: 72 },
  'practice-fabrication': { x: 180, y: 72 },
  'practice-film': { x: 298, y: 72 },
  'practice-code': { x: 62, y: 355 },
  'practice-xr': { x: 180, y: 355 },
  'practice-exploring': { x: 298, y: 355 },
}

/**
 * All 98 unlabelled positions are count-only marks, NOT disguised profile
 * locations. Their deterministic coordinates are decorative distribution
 * within a real founder-reported membership minimum, not social distance.
 */
function anonymousPoint(index: number, total: number): Point {
  const angle = index * Math.PI * (3 - Math.sqrt(5))
  const radius = Math.sqrt((index + 0.5) / Math.max(total, 1))
  return {
    x: 180 + Math.cos(angle) * (20 + radius * 144),
    y: 218 + Math.sin(angle) * (20 + radius * 112),
  }
}

function NodeButton({
  x, y, title, selected, onClick, children,
}: {
  x: number
  y: number
  title: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={title}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="cursor-pointer outline-none focus-visible:opacity-75"
      transform={'translate(' + x + ' ' + y + ')'}
    >
      {children}
    </g>
  )
}

/**
 * Real, accessible, lightweight network for iOS and non-WebGL browsers.
 * Same graph data as Three.js; only the rendering changes.
 * - 101 reported person positions (3 named, 98 unnamed)
 * - 6 practice categories with 72 aggregate poll selections
 * - 8 editorial person/practice connections, 1 documented cofounding edge
 */
export default function PeopleNetwork2D({ selected, onSelect }: Props) {
  const graph = useMemo(makePeoplePracticeGraph, [])
  const anonymous = graph.marks.filter((mark) => mark.kind === 'anonymous-presence')
  const people = graph.marks.filter((mark) => mark.kind !== 'anonymous-presence')
  const edges = [
    ...graph.connections.map((edge) => ({ source: edge.from, target: edge.to, kind: 'cofounding' as const })),
    ...graph.practiceEdges.map((edge) => ({ source: edge.source, target: edge.target, kind: 'practice' as const })),
  ]
  const selectedPractice = graph.practices.find((item) => item.id === selected)
  const selectedPerson = people.find((item) => item.id === selected)
  const relatedPeople = selectedPractice
    ? graph.practiceEdges.filter((edge) => edge.target === selectedPractice.id)
        .map((edge) => people.find((person) => person.id === edge.source)?.label)
        .filter((name): name is string => Boolean(name))
    : []

  return (
    <div className="dn-2d-network flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 px-2 py-3 sm:px-5" aria-label="Interactive network of people and practices">
      <svg
        viewBox="0 0 360 425"
        preserveAspectRatio="xMidYMid meet"
        className="block min-h-0 w-full max-w-[520px] flex-1"
        role="group"
        aria-label={MEMBER_PRESENCE_SOURCE.reportedLabel + ' reported member presence marks, three public people, six practice areas and verified public links'}
      >
        <title>People, practices, connections</title>
        <desc>Small dots represent people; six labeled circles are practice areas. Connected lines come from public artist profiles or documented cofounding. Poll totals do not identify voters.</desc>

        {/* Mark the reported membership minimum without suggesting fake ties. */}
        {anonymous.map((mark, index) => {
          const p = anonymousPoint(index, anonymous.length)
          return <circle key={mark.id} cx={p.x} cy={p.y} r="1.8" fill="var(--dn-graph-node)" opacity="0.56" />
        })}

        {/* Draw only known public edges; there is no fabricated member graph. */}
        {edges.map((edge) => {
          const a = PEOPLE[edge.source] ?? PRACTICES[edge.source]
          const b = PEOPLE[edge.target] ?? PRACTICES[edge.target]
          if (!a || !b) return null
          const active = selected === edge.source || selected === edge.target
          return (
            <line key={edge.source + ':' + edge.target}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={active ? 'var(--dn-graph-selected)' : 'var(--dn-graph-link)'}
              strokeWidth={active ? 2.2 : edge.kind === 'cofounding' ? 1.8 : 1.1}
              strokeOpacity={selected ? (active ? 0.95 : 0.13) : 0.45}
            />
          )
        })}

        {/* The six larger nodes reflect real aggregate poll totals, not voters. */}
        {graph.practices.map((practice) => {
          const p = PRACTICES[practice.id]
          const isActive = selected === practice.id
          const color = 'var(--dn-poll-' + practice.choiceId + ')'
          return (
            <NodeButton key={practice.id} x={p.x} y={p.y}
              title={practice.short + ': ' + practice.count + ' poll selections'}
              selected={isActive}
              onClick={() => onSelect(isActive ? null : practice.id)}
            >
              <circle r="21" fill="var(--dn-graph-bg)"
                stroke={isActive ? 'var(--dn-graph-selected)' : color}
                strokeWidth={isActive ? 3.4 : 2.6} />
              <text y="5" textAnchor="middle" fill="var(--dn-on-graph)"
                fontFamily="ui-monospace, monospace" fontSize="14" fontWeight="600">{practice.count}</text>
              <text y={p.y < 200 ? 39 : 37} textAnchor="middle" fill="var(--dn-on-graph)"
                fontFamily="system-ui, sans-serif" fontSize="11.5" fontWeight="500">
                {practice.short}
              </text>
              <circle r="27" fill="transparent" />
            </NodeButton>
          )
        })}

        {/* Only publicly featured people are named. */}
        {people.map((person) => {
          const p = PEOPLE[person.id]
          if (!p) return null
          const active = selected === person.id
          return (
            <NodeButton key={person.id} x={p.x} y={p.y} title={person.label + ', public artist profile'}
              selected={active} onClick={() => onSelect(active ? null : person.id)}>
              <circle r="15" fill={active ? 'var(--dn-graph-selected)' : 'var(--dn-graph-founder)'}
                stroke="var(--dn-graph-bg)" strokeWidth="2.5" />
              <circle r="22" fill="transparent" />
              <text y="34" textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="13" fontWeight="600" fill="var(--dn-on-graph)">
                {person.label.split(' ')[0]}
              </text>
            </NodeButton>
          )
        })}
      </svg>
      <div className="w-full max-w-[520px] min-h-[42px] rounded-lg px-2 text-center text-xs leading-relaxed text-[color:var(--dn-graph-muted)]" aria-live="polite">
        {selectedPractice ? (
          <span>{selectedPractice.label} · {selectedPractice.count} poll selections.
            {relatedPeople.length > 0 ? ' Public profiles: ' + relatedPeople.join(', ') + '.' : ' No public profiles linked yet.'}
          </span>
        ) : selectedPerson ? (
          <span>
            {selectedPerson.label} · public artist profile.{' '}
            <Link href={'/network/community?profile=' + selectedPerson.id}
              className="underline underline-offset-2">View profile</Link>
          </span>
        ) : (
          <span>101 minimum-count people · 3 public artist profiles · 6 practice areas</span>
        )}
      </div>
    </div>
  )
}
