'use client'

import { useState } from 'react'
import PeopleNetworkField from './PeopleNetworkField'
import { NetworkGraphBoundary } from './NetworkGraphBoundary'

/** Client boundary for embedding the human-connections artwork into server-rendered editorial pages. */
export default function AggregateNetworkPreview() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <NetworkGraphBoundary><PeopleNetworkField selected={selected} onSelect={setSelected} /></NetworkGraphBoundary>
  )
}
