'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DIGITAL_LAB_SORT_OPTIONS,
  type CatalogSortMode,
} from '@/lib/workshops/digital-lab-catalog-constants'

type CatalogToolbarProps = {
  heading: string
  subcopy: string
  sortLabel: string
  sortMode: CatalogSortMode
  onSortChange: (mode: CatalogSortMode) => void
}

export function CatalogToolbar({
  heading,
  subcopy,
  sortLabel,
  sortMode,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subcopy}</p>
      </div>
      <div className="flex items-center gap-2 sm:min-w-[220px]">
        <Label htmlFor="dl-sort" className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {sortLabel}
        </Label>
        <Select
          value={sortMode}
          onValueChange={(v) => onSortChange(v as CatalogSortMode)}
        >
          <SelectTrigger id="dl-sort" className="w-full sm:w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIGITAL_LAB_SORT_OPTIONS.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
