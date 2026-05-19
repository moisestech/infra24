'use client'

import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { institutionalArtistFromAlumni } from '@/lib/institutional-artist/card-model'
import { InstitutionalArtistCard } from '@/components/institutional-artist/InstitutionalArtistCard'

export type AlumniArtistCardProps = {
  row: AlumniAirtableRow
  onOpen: () => void
}

/** Catalogue grid tile — shared layout with Memory Agent results. */
export function AlumniArtistCard({ row, onOpen }: AlumniArtistCardProps) {
  return (
    <InstitutionalArtistCard
      data={institutionalArtistFromAlumni(row)}
      variant="catalogue"
      onActivate={onOpen}
    />
  )
}
