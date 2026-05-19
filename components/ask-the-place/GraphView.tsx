'use client'

import type { GraphLink, GraphNode } from '@/lib/ask-the-place/types'
import { cn } from '@/lib/utils'

type GraphViewProps = {
  nodes: GraphNode[]
  links: GraphLink[]
  highlightIds: Set<string>
}

const categoryColor: Record<string, string> = {
  place: 'from-amber-200/90 to-amber-400/80',
  events: 'from-teal-300/80 to-cyan-500/70',
  spaces: 'from-zinc-200/80 to-zinc-400/70',
  art: 'from-violet-300/80 to-violet-500/70',
  amenities: 'from-emerald-300/75 to-teal-600/65',
  partners: 'from-rose-200/80 to-rose-400/70',
  people: 'from-sky-200/80 to-sky-500/70',
  insights: 'from-fuchsia-200/75 to-fuchsia-500/70',
  outputs: 'from-amber-100/70 to-yellow-500/60',
}

export function GraphView({ nodes, links, highlightIds }: GraphViewProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#080d14]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {links.map((l) => {
          const s = nodes.find((n) => n.id === l.source)
          const t = nodes.find((n) => n.id === l.target)
          if (!s || !t) return null
          const dim = !highlightIds.has(s.id) && !highlightIds.has(t.id)
          return (
            <line
              key={l.id}
              x1={`${s.x}%`}
              y1={`${s.y}%`}
              x2={`${t.x}%`}
              y2={`${t.y}%`}
              stroke="currentColor"
              strokeWidth={dim ? 0.5 : 1.2}
              className={dim ? 'text-white/[0.06]' : 'text-teal-400/35'}
            />
          )
        })}
      </svg>
      {nodes.map((n) => {
        const hi = highlightIds.has(n.id)
        const grad = categoryColor[n.category] ?? 'from-zinc-400 to-zinc-600'
        return (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div
              className={cn(
                'flex min-w-[4.5rem] max-w-[7rem] flex-col items-center rounded-full border px-2 py-1.5 text-center shadow-lg transition-all duration-300',
                hi
                  ? 'scale-105 border-teal-300/50 bg-gradient-to-br shadow-teal-500/20 ' + grad
                  : 'scale-100 border-white/10 bg-gradient-to-br opacity-40 ' + grad
              )}
            >
              <span className="text-[9px] font-bold uppercase tracking-wide text-black/80">{n.category}</span>
              <span className="text-[10px] font-semibold leading-tight text-black/90">{n.label}</span>
            </div>
          </div>
        )
      })}
      <p className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-zinc-600">
        Mock graph · highlights follow scenario selection
      </p>
    </div>
  )
}
