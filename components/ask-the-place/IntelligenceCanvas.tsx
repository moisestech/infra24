'use client'

import { useState } from 'react'
import type { GraphLink, GraphNode, OutputBundle, ProspectConfig } from '@/lib/ask-the-place/types'
import { GraphView } from './GraphView'
import { MapView } from './MapView'
import { TimelineView } from './TimelineView'
import { cn } from '@/lib/utils'

type Tab = 'graph' | 'map' | 'timeline'

type IntelligenceCanvasProps = {
  config: ProspectConfig
  graphNodes: GraphNode[]
  graphLinks: GraphLink[]
  highlightIds: Set<string>
  bundle: OutputBundle | null
}

export function IntelligenceCanvas({
  config,
  graphNodes,
  graphLinks,
  highlightIds,
  bundle,
}: IntelligenceCanvasProps) {
  const [tab, setTab] = useState<Tab>('graph')
  const tabs: { id: Tab; label: string }[] = [
    { id: 'graph', label: 'Graph' },
    { id: 'map', label: 'Map' },
    { id: 'timeline', label: 'Timeline' },
  ]
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0B1118]">
      <div className="flex border-b border-white/10 px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'relative px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
              tab === t.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {t.label}
            {tab === t.id ? (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-teal-400 to-amber-200/90" />
            ) : null}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === 'graph' ? <GraphView nodes={graphNodes} links={graphLinks} highlightIds={highlightIds} /> : null}
        {tab === 'map' ? <MapView config={config} /> : null}
        {tab === 'timeline' ? <TimelineView bundle={bundle} /> : null}
      </div>
    </div>
  )
}
