'use client'

import { AlumniProfileView } from '@/components/organization/AlumniProfileView'
import type { EnrichedAlumniRow } from '@/lib/organization/artist-alumni-bridge'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'

export type AlumniDetailSheetProps = {
  row: EnrichedAlumniRow | null
  onClose: () => void
  orgName: string
  orgSlug: string
}

export function AlumniDetailSheet({
  row,
  onClose,
  orgName,
  orgSlug,
}: AlumniDetailSheetProps) {
  return (
    <Sheet
      open={row !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      {row ? (
        <SheetContent
          key={row.id}
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          <AlumniProfileView
            row={row}
            orgName={orgName}
            orgSlug={orgSlug}
            variant="sheet"
          />
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
