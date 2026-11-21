'use client'

import { useState } from 'react'
import PeopleNetworkField from './PeopleNetworkField'

/** Client boundary for embedding the human-connections artwork into server-rendered editorial pages. */
export default function AggregateNetworkPreview() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <PeopleNetworkField selected={selected} onSelect={setSelected} />
  )
}
