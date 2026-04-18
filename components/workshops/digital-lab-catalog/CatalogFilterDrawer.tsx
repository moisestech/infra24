'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { CatalogFiltersState } from '@/lib/workshops/digital-lab-catalog'
import type { CatalogFilterGroupId } from '@/lib/workshops/digital-lab-catalog-constants'
import { CatalogFilterForm } from '@/components/workshops/digital-lab-catalog/CatalogFilterForm'

type CatalogFilterDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  draftFilters: CatalogFiltersState
  onToggleDraft: (group: CatalogFilterGroupId, id: string) => void
  onClearDraft: () => void
  onApply: () => void
  clearLabel: string
  applyLabel: string
}

export function CatalogFilterDrawer({
  open,
  onOpenChange,
  title,
  description,
  draftFilters,
  onToggleDraft,
  onClearDraft,
  onApply,
  clearLabel,
  applyLabel,
}: CatalogFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          <CatalogFilterForm
            filters={draftFilters}
            onToggle={onToggleDraft}
            idPrefix="drawer"
          />
        </div>
        <SheetFooter className="mt-auto flex flex-row gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClearDraft}>
            {clearLabel}
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => {
              onApply()
              onOpenChange(false)
            }}
          >
            {applyLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
