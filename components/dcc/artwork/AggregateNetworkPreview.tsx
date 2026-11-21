'use client'

import { useState } from 'react'
import PeopleNetworkField from './PeopleNetworkField'

/** Client boundary for embedding the human-connections artwork into server-rendered editorial pages. */
export default function AggregateNetworkPreview() {
  const [selected, setSelected] = useState('member-mark-001')
  return (
    <PeopleNetworkField
      mode="presence"
      lens="practices"
      selected={selected}
      onSelect={setSelected}
      local={null}
    />
  )
}
