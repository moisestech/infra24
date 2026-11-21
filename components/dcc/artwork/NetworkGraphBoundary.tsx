'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import Link from 'next/link'
import { DCC_DISCOVERY_POLL } from '@/lib/dcc/artwork/discovery-poll'
import { PILOT_PREVIEWS } from '@/lib/dcc/community/atlas'

type Props = { children: ReactNode }
type State = { failed: boolean }

/**
 * Keep a WebGL/component error scoped to the visualization. A rendering
 * exception must not erase the artwork's context, artist links, or poll.
 */
export class NetworkGraphBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Useful if someone opens their console; no private member data logged.
    console.error('[network-graph] Renderer unavailable', error, info.componentStack)
  }

  render() {
    if (this.state.failed) return <NetworkGraphFallback />
    return this.props.children
  }
}

export function NetworkGraphFallback() {
  return (
    <div role="status" className="flex h-full min-h-[350px] flex-col justify-center gap-5 overflow-y-auto bg-[var(--dn-graph-bg)] p-5 text-[color:var(--dn-on-graph)] sm:p-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider opacity-70">People + practices</p>
        <p className="mt-2 text-lg">The 3D view is unavailable on this device.</p>
        <p className="mt-1 max-w-xl text-sm opacity-70">You can still explore public artist profiles and the real community interest totals.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PILOT_PREVIEWS.map((profile) => (
          <Link key={profile.slug} href={'/network/community?profile=' + profile.slug}
            className="rounded-full border border-[color:var(--dn-line-strong)] px-3 py-2 text-xs hover:bg-[var(--dn-hover)]">
            {profile.name}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
        {DCC_DISCOVERY_POLL.choices.map((choice) => (
          <div key={choice.id} className="flex items-center justify-between gap-2 border-b border-[color:var(--dn-line)] pb-2">
            <span>{choice.short}</span><span className="font-mono tabular-nums">{choice.count}</span>
          </div>
        ))}
      </div>
      <p className="text-xs opacity-60">72 selections across a multi-select poll; individual voters are not identified.</p>
    </div>
  )
}
