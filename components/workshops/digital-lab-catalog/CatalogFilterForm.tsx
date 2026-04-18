'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DIGITAL_LAB_AUDIENCE_OPTIONS,
  DIGITAL_LAB_DURATION_OPTIONS,
  DIGITAL_LAB_FILTER_GROUPS,
  DIGITAL_LAB_FORMAT_OPTIONS,
  DIGITAL_LAB_LEVEL_OPTIONS,
  DIGITAL_LAB_PACKET_STATUS_OPTIONS,
  DIGITAL_LAB_RESOURCES_OPTIONS,
  DIGITAL_LAB_STATUS_OPTIONS,
  DIGITAL_LAB_TRACK_OPTIONS,
  DIGITAL_LAB_WEBSITE_OPTIONS,
  type CatalogFilterGroupId,
} from '@/lib/workshops/digital-lab-catalog-constants'
import type { CatalogFiltersState } from '@/lib/workshops/digital-lab-catalog'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Clock,
  Files,
  Globe,
  Layers,
  Package,
  Signal,
  Users,
  Wrench,
} from 'lucide-react'

const GROUP_ICONS: Record<CatalogFilterGroupId, typeof Layers> = {
  track: Layers,
  level: Signal,
  format: BookOpen,
  duration: Clock,
  audience: Users,
  status: Wrench,
  packet_status: Package,
  website: Globe,
  resources: Files,
}

const OPTIONS: Record<
  CatalogFilterGroupId,
  readonly { id: string; label: string }[]
> = {
  track: DIGITAL_LAB_TRACK_OPTIONS,
  level: DIGITAL_LAB_LEVEL_OPTIONS,
  format: DIGITAL_LAB_FORMAT_OPTIONS,
  duration: DIGITAL_LAB_DURATION_OPTIONS,
  audience: DIGITAL_LAB_AUDIENCE_OPTIONS,
  status: DIGITAL_LAB_STATUS_OPTIONS,
  packet_status: DIGITAL_LAB_PACKET_STATUS_OPTIONS,
  website: DIGITAL_LAB_WEBSITE_OPTIONS,
  resources: DIGITAL_LAB_RESOURCES_OPTIONS,
}

type CatalogFilterFormProps = {
  filters: CatalogFiltersState
  onToggle: (group: CatalogFilterGroupId, optionId: string) => void
  /** Prefix for checkbox ids (e.g. drawer vs sidebar) */
  idPrefix: string
}

export function CatalogFilterForm({
  filters,
  onToggle,
  idPrefix,
}: CatalogFilterFormProps) {
  const defaultOpen = DIGITAL_LAB_FILTER_GROUPS.map((g) => g.id)

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
      {DIGITAL_LAB_FILTER_GROUPS.map(({ id: groupId, label }) => {
        const Icon = GROUP_ICONS[groupId]
        const opts = OPTIONS[groupId]
        return (
          <AccordionItem key={groupId} value={groupId}>
            <AccordionTrigger className="py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-primary">
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{label}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 border-t border-border/60 pt-2">
                {opts.map((opt) => {
                  const checked = filters[groupId].has(opt.id)
                  const cid = `${idPrefix}-${groupId}-${opt.id}`
                  return (
                    <label
                      key={opt.id}
                      htmlFor={cid}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm text-foreground transition-colors',
                        'hover:bg-muted/60'
                      )}
                    >
                      <input
                        id={cid}
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(groupId, opt.id)}
                        className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span>{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
