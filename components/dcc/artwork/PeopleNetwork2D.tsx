'use client'

import { useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import { makePeoplePracticeGraph } from '@/lib/dcc/artwork/people-practice-graph'
import { MEMBER_PRESENCE_SOURCE } from '@/lib/dcc/artwork/member-presence'
import type { DiscoveryPollChoiceId } from '@/lib/dcc/artwork/discovery-poll'

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
}
type Point = { x: number; y: number }

const PEOPLE: Record<string, Point> = {
  'moises-sanabria': { x: 101, y: 202 },
  'fabiola-larios': { x: 259, y: 202 },
  'angelo-caruso': { x: 180, y: 274 },
}
const PRACTICES: Record<DiscoveryPollChoiceId, Point> = {
  art: { x: 61, y: 83 },
  fabrication: { x: 180, y: 83 },
  film: { x: 299, y: 83 },
  code: { x: 61, y: 340 },
  xr: { x: 180, y: 340 },
  exploring: { x: 299, y: 340 },
}

function anonymousPoint(index: number, count: number): Point {
  // Count-only positions. Geometry is not social proximity or poll attribution.
  const angle = index * Math.PI * (3 - Math.sqrt(5))
  const radius = Math.sqrt((index + 0.5) / Math.max(count, 1))
  return {
    x: 180 + Math.cos(angle) * (16 + radius * 150),
    y: 216 + Math.sin(angle) * (16 + radius * 62),
  }
}

function selectionPoint(choiceId: DiscoveryPollChoiceId, index: number, count: number): Point {
  // Small, evenly spaced fans radiate outward from each hexagonal practice.
  // Each endpoint is one *selection*, not a known unique voter/person.
  const center = PRACTICES[choiceId]
  const upper = center.y < 200
  const innerCount = Math.min(count, Math.ceil(count / 2))
  const isOuter = index >= innerCount
  const local = isOuter ? index - innerCount : index
  const layerCount = isOuter ? count - innerCount : innerCount
  const radius = isOuter ? 56 : 39
  const span = 144 * Math.PI / 180
  const progress = layerCount === 1 ? 0.5 : local / (layerCount - 1)
  // Top fan spans approximately 198°–342° (up); bottom 18°–162° (down).
  const angle = (upper ? Math.PI : 0) + (Math.PI - span) / 2 + span * progress
  return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius }
}

function hexagonPoints(radius: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = -Math.PI / 2 + i * Math.PI / 3
    return (Math.cos(angle) * radius).toFixed(2) + ',' + (Math.sin(angle) * radius).toFixed(2)
  }).join(' ')
}

function Selectable({
  position, title, selected, onClick, children,
}: {
  position: Point
  title: string
  selected: boolean
  onClick: () => void
  children: ReactNode
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
      transform={'translate(' + position.x + ' ' + position.y + ')'}
    >
      {children}
    </g>
  )
}

export default function PeopleNetwork2D({ selected, onSelect }: Props) {
  const graph = useMemo(makePeoplePracticeGraph, [])
  const anonymous = graph.marks.filter((mark) => mark.kind === 'anonymous-presence')
  const people = graph.marks.filter((mark) => mark.kind !== 'anonymous-presence')
  const selectedPractice = graph.practices.find((item) => item.id === selected)
  const selectedPerson = people.find((item) => item.id === selected)
  const knownPeople = selectedPractice
    ? graph.practiceEdges
        .filter((edge) => edge.target === selectedPractice.id)
        .map((edge) => people.find((person) => person.id === edge.source)?.label)
        .filter((value): value is string => Boolean(value))
    : []

  const categories = graph.practices.map((practice) => ({
    ...practice,
    position: PRACTICES[practice.choiceId],
  }))
  const selectionPositions = graph.pollSelections.map((mark) => {
    const index = Number(mark.id.split('-').pop() ?? '1') - 1
    const count = graph.practices.find((practice) => practice.choiceId === mark.choiceId)?.count ?? 0
    return { ...mark, position: selectionPoint(mark.choiceId, index, count) }
  })

  return (
    <div className="dn-2d-network flex h-full min-h-0 w-full flex-col items-center justify-center gap-1 px-2 py-2 sm:px-5"
      aria-label="Interactive network of people, practice areas and aggregate poll selection connections">
      <svg
        viewBox="0 0 360 438"
        preserveAspectRatio="xMidYMid meet"
        className="block min-h-0 w-full max-w-[520px] flex-1"
        role="group"
        aria-label={MEMBER_PRESENCE_SOURCE.reportedLabel + ' reported member presence marks, three public people, six practice areas, and 72 anonymous poll selection lines'}
      >
        <title>People, practices, and poll selections</title>
        <desc>People are neutral filled circles, practice areas are colored hexagons. Each colored spoke is one reported poll selection, not an identified individual voter. Counts may overlap because voters could choose several topics.</desc>

        {/* 98 anonymous marks reflect a reported group-size minimum, not unique voters. */}
        {anonymous.map((mark, index) => {
          const p = anonymousPoint(index, anonymous.length)
          return <circle key={mark.id} cx={p.x} cy={p.y} r="1.55" fill="var(--dn-graph-node)" opacity="0.45" />
        })}

        {/* One colored spoke for each of 72 aggregate selections. */}
        {selectionPositions.map((mark) => {
          const hub = PRACTICES[mark.choiceId]
          const active = selected === 'practice-' + mark.choiceId
          return <line key={mark.id} x1={hub.x} y1={hub.y} x2={mark.position.x} y2={mark.position.y}
            stroke={'var(--dn-poll-' + mark.choiceId + ')'}
            strokeWidth={active ? 1.8 : 1.1}
            strokeOpacity={selected && !active ? 0.14 : active ? 0.95 : 0.64}
          />
        })}
        {selectionPositions.map((mark) => (
          <circle key={mark.id} cx={mark.position.x} cy={mark.position.y}
            r={selected === 'practice-' + mark.choiceId ? 3.1 : 2.45}
            fill={'var(--dn-poll-' + mark.choiceId + ')'}
            opacity={selected && selected !== 'practice-' + mark.choiceId ? 0.2 : 0.95}
          />
        ))}

        {/* Editorial profile links are visually dashed, distinct from poll spokes. */}
        {graph.practiceEdges.map((edge) => {
          const a = PEOPLE[edge.source]
          const choiceId = edge.target.slice(9) as DiscoveryPollChoiceId
          const b = PRACTICES[choiceId]
          if (!a || !b) return null
          const highlighted = selected === edge.source || selected === edge.target
          return <line key={edge.source + edge.target} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="var(--dn-graph-link)"
            strokeDasharray="3 5"
            strokeWidth={highlighted ? 2 : 1}
            strokeOpacity={selected ? (highlighted ? 0.8 : 0.11) : 0.22}
          />
        })}
        {graph.connections.map((edge) => {
          const a = PEOPLE[edge.from]
          const b = PEOPLE[edge.to]
          if (!a || !b) return null
          return <line key={edge.from + edge.to} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="var(--dn-graph-link)" strokeWidth="1.6" strokeOpacity="0.65"
          />
        })}

        {/* Hexagons = topic hubs. Different color/shape from every person mark. */}
        {categories.map((practice) => {
          const active = selected === practice.id
          const color = 'var(--dn-poll-' + practice.choiceId + ')'
          return (
            <Selectable key={practice.id} position={practice.position}
              title={practice.short + ': ' + practice.count + ' anonymous poll-selection connections'}
              selected={active}
              onClick={() => onSelect(active ? null : practice.id)}>
              <polygon points={hexagonPoints(21)} fill="var(--dn-graph-bg)"
                stroke={color} strokeWidth={active ? 3.8 : 2.7} />
              <text y="5" textAnchor="middle" fill="var(--dn-on-graph)"
                fontFamily="ui-monospace, monospace" fontSize="14" fontWeight="600">
                {practice.count}
              </text>
              <text y={practice.position.y < 200 ? 35 : -29} textAnchor="middle"
                fill="var(--dn-on-graph)" fontFamily="system-ui, sans-serif"
                fontSize="11" fontWeight="600">{practice.short}</text>
              <circle r="27" fill="transparent" />
            </Selectable>
          )
        })}

        {/* Only three named profiles; none is assigned a vote. */}
        {people.map((person) => {
          const position = PEOPLE[person.id]
          if (!position) return null
          const active = selected === person.id
          return (
            <Selectable key={person.id} position={position}
              title={person.label + ', publicly listed artist'}
              selected={active}
              onClick={() => onSelect(active ? null : person.id)}>
              <circle r="11" fill={active ? 'var(--dn-graph-selected)' : 'var(--dn-graph-founder)'}
                stroke="var(--dn-graph-bg)" strokeWidth="2.3" />
              <circle r="22" fill="transparent" />
              <text y="29" textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="12" fontWeight="600" fill="var(--dn-on-graph)">
                {person.label.split(' ')[0]}
              </text>
            </Selectable>
          )
        })}
      </svg>
      <div className="w-full max-w-[520px] min-h-[38px] px-2 text-center text-xs leading-relaxed text-[color:var(--dn-graph-muted)]"
        aria-live="polite">
        {selectedPractice ? (
          <span>{selectedPractice.label}: {selectedPractice.count} poll-selection connections.
            {knownPeople.length ? ' Public artist practices: ' + knownPeople.join(', ') + '.' : ''}
            {' '}Voter identities unknown.</span>
        ) : selectedPerson ? (
          <span>{selectedPerson.label} · public artist profile.{' '}
            <Link href={'/network/community?profile=' + selectedPerson.id} className="underline underline-offset-2">
              View profile
            </Link></span>
        ) : (
          <span>Neutral dots: people · colored dots: poll selections · hexagons: practices (not 72 unique voters)</span>
        )}
      </div>
    </div>
  )
}
