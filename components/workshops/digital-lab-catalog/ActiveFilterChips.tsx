'use client'

import { Button } from '@/components/ui/button'
import type { CatalogFiltersState } from '@/lib/workshops/digital-lab-catalog'
import {
  filterOptionLabel,
  type CatalogFilterGroupId,
} from '@/lib/workshops/digital-lab-catalog-constants'
import { X } from 'lucide-react'

function flattenSelections(filters: CatalogFiltersState): {
  group: CatalogFilterGroupId
  id: string
}[] {
  const out: { group: CatalogFilterGroupId; id: string }[] = []
  const keys = Object.keys(filters) as CatalogFilterGroupId[]
  for (const group of keys) {
    for (const id of Array.from(filters[group])) {
      out.push({ group, id })
    }
  }
  return out
}

type ActiveFilterChipsProps = {
  filters: CatalogFiltersState
  onRemove: (group: CatalogFilterGroupId, id: string) => void
  onClearAll: () => void
  clearAllLabel: string
}

export function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
  clearAllLabel,
}: ActiveFilterChipsProps) {
  const chips = flattenSelections(filters)
  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map(({ group, id }) => (
        <button
          key={`${group}-${id}`}
          type="button"
          onClick={() => onRemove(group, id)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          {filterOptionLabel(group, id)}
          <X className="h-3 w-3" aria-hidden />
        </button>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
        {clearAllLabel}
      </Button>
    </div>
  )
}
