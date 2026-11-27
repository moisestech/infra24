'use client'

import { INTERESTS, type InterestId } from '@/lib/dcc/community/atlas'

const coords = [
  [70,54],[180,35],[290,54],[70,194],[180,213],[290,194],
] as const

/**
 * A PERSONAL PREVIEW, not a network graph publication. The owner can see the
 * visual meaning of their chosen practice hubs before making anything public.
 */
export function YourConstellationPreview({
  displayName, interests,
}: { displayName:string; interests:InterestId[] }) {
  const chosen=INTERESTS.filter(i=>interests.includes(i.id))
  return <figure className="overflow-hidden rounded-2xl border border-[var(--dn-line)] bg-[var(--dn-graph-bg)] p-4">
    <figcaption className="mb-3 text-sm font-semibold text-[var(--dn-on-graph)]">
      Your private sculpture preview
    </figcaption>
    <svg viewBox="0 0 360 250" className="w-full" role="img"
      aria-label={'Private preview for '+(displayName.trim()||'your profile')+
        ' connected to '+(chosen.length?chosen.map(i=>i.short).join(', '):'no selected practices yet')}>
      <title>Selected practice constellation — private preview</title>
      <desc>This illustration does not create a public person node. Chosen practice
        links appear in the real artwork only after a verified membership, your
        independent public listing request and review.</desc>
      {INTERESTS.map((interest,i)=>{
        const [x,y]=coords[i]
        const active=interests.includes(interest.id)
        return <g key={interest.id}>
          {active && <line x1="180" y1="125" x2={x} y2={y}
            stroke={interest.color} strokeWidth="2" strokeDasharray="4 6" opacity=".9" />}
          <circle cx={x} cy={y} r={active?14:9}
            fill={active?interest.color:'#485753'} stroke="#b1c4b5" strokeWidth=".5"
            opacity={active?1:.45}/>
          <text x={x} y={y<125?y-23:y+28} fill="#d7e4db" fontSize="10"
            textAnchor="middle" opacity={active?1:.55}>{interest.short}</text>
        </g>
      })}
      <circle cx="180" cy="125" r="20" fill="#e8e9ce" stroke="#2a483b" strokeWidth="2"/>
      <text x="180" y="129" textAnchor="middle" fill="#173528" fontSize="11" fontWeight="600">
        YOU
      </text>
    </svg>
    <p className="text-xs leading-relaxed text-[var(--dn-graph-muted)]">
      Your selections change this illustration now. They do not add a named
      node or link to the public sculpture until you explicitly request publication and
      the profile is approved.
    </p>
  </figure>
}
