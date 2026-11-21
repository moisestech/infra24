'use client'

import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import PeopleNetwork2D from './PeopleNetwork2D'

type Props = { children: ReactNode }
type State = { failed: boolean }

/** A WebGL error may replace the graph but must never crash the host page. */
export class NetworkGraphBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[network-graph] Renderer unavailable', error, info.componentStack)
  }

  render() {
    if (this.state.failed) return <NetworkGraphFallback />
    return this.props.children
  }
}

/** The emergency fallback is still a real, usable visualization. */
export function NetworkGraphFallback() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="h-full min-h-0 w-full bg-[var(--dn-graph-bg)]">
      <PeopleNetwork2D selected={selected} onSelect={setSelected} />
    </div>
  )
}
