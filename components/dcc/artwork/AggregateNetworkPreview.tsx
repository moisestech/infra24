'use client'

import { useState } from 'react'
import AggregateNetworkField from './AggregateNetworkField'

/** Client boundary for embedding the aggregate field into server-rendered editorial pages. */
export default function AggregateNetworkPreview() {
  const [selected, setSelected] = useState('commons')
  return (
    <AggregateNetworkField
      lens="practices"
      selected={selected}
      onSelect={setSelected}
      local={null}
    />
  )
}
