'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CatalogFiltersState } from '@/lib/workshops/digital-lab-catalog'
import type { CatalogFilterGroupId } from '@/lib/workshops/digital-lab-catalog-constants'
import { CatalogFilterForm } from '@/components/workshops/digital-lab-catalog/CatalogFilterForm'

type CatalogFilterSidebarProps = {
  filters: CatalogFiltersState
  onToggle: (group: CatalogFilterGroupId, id: string) => void
}

export function CatalogFilterSidebar({
  filters,
  onToggle,
}: CatalogFilterSidebarProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CatalogFilterForm
          filters={filters}
          onToggle={onToggle}
          idPrefix="sidebar"
        />
      </CardContent>
    </Card>
  )
}
