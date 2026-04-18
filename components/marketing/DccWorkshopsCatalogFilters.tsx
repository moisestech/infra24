'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  dccCatalogFormatDisplay,
  dccCatalogTrackDisplay,
  dccWorkshopsCatalogUi,
} from '@/lib/marketing/dcc-workshops-catalog-ui'
import type { DccCatalogFilterState, DccCatalogDurationBucketId } from '@/lib/marketing/dcc-workshops-catalog-filters'
import { emptyDccCatalogFilterState } from '@/lib/marketing/dcc-workshops-catalog-filters'
import type { WorkshopTrackId } from '@/lib/workshops/track-labels'
import { WORKSHOP_TRACK_LABELS } from '@/lib/workshops/track-labels'
import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { BookOpen, Clock, DollarSign, Layers, Map, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRACK_IDS = Object.keys(WORKSHOP_TRACK_LABELS) as WorkshopTrackId[]

const FORMAT_IDS: WorkshopMarketingMetadata['format'][] = [
  'in_person',
  'online',
  'hybrid',
  'async_resources',
]

function toggleList<T extends string>(list: T[], id: T, on: boolean): T[] {
  const set = new Set(list)
  if (on) set.add(id)
  else set.delete(id)
  return [...set]
}

type Props = {
  value: DccCatalogFilterState
  onChange: (next: DccCatalogFilterState) => void
  tagOptions: { tag: string; count: number }[]
}

export function DccWorkshopsCatalogFilters({ value, onChange, tagOptions }: Props) {
  const ui = dccWorkshopsCatalogUi.accordion

  const hasAny =
    value.tracks.length > 0 ||
    value.formats.length > 0 ||
    value.tags.length > 0 ||
    value.levels.length > 0 ||
    value.prices.length > 0 ||
    value.durations.length > 0

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80">
      <Accordion type="multiple" className="w-full" defaultValue={['focus', 'price', 'format']}>
        <AccordionItem value="focus" className="border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-[var(--cdc-teal)]">
              <Map className="h-4 w-4 shrink-0" />
              {ui.focusAreasTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pl-0.5">
              {TRACK_IDS.map((id) => {
                const checked = value.tracks.includes(id)
                return (
                  <label
                    key={id}
                    className="flex cursor-pointer items-start gap-2 rounded-md py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                      checked={checked}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          tracks: toggleList(value.tracks, id, e.target.checked),
                        })
                      }
                    />
                    <span>{dccCatalogTrackDisplay[id] ?? WORKSHOP_TRACK_LABELS[id]}</span>
                  </label>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <DollarSign className="h-4 w-4 shrink-0" />
              {ui.priceTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {dccWorkshopsCatalogUi.priceOptions.map((opt) => {
                const checked = value.prices.includes(opt.id)
                return (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                      checked={checked}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          prices: toggleList(value.prices, opt.id, e.target.checked),
                        })
                      }
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="format" className="border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <BookOpen className="h-4 w-4 shrink-0" />
              {ui.formatTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {FORMAT_IDS.map((id) => {
                const checked = value.formats.includes(id)
                return (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2 rounded-md py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                      checked={checked}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          formats: toggleList(value.formats, id, e.target.checked),
                        })
                      }
                    />
                    {dccCatalogFormatDisplay[id]}
                  </label>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <Sparkles className="h-4 w-4 shrink-0" />
              {ui.skillsTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {tagOptions.length === 0 ? (
              <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{ui.noSkillsCopy}</p>
            ) : (
              <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                {tagOptions.map(({ tag, count }) => {
                  const checked = value.tags.includes(tag)
                  return (
                    <label
                      key={tag}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-md py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 shrink-0 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                          checked={checked}
                          onChange={(e) =>
                            onChange({
                              ...value,
                              tags: toggleList(value.tags, tag, e.target.checked),
                            })
                          }
                        />
                        <span className="truncate capitalize">{tag}</span>
                      </span>
                      <span className="shrink-0 text-xs text-neutral-400">{count}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="level" className="border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <Layers className="h-4 w-4 shrink-0" />
              {ui.levelTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {dccWorkshopsCatalogUi.levelOptions.map((opt) => {
                const checked = value.levels.includes(opt.id)
                return (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                      checked={checked}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          levels: toggleList(value.levels, opt.id, e.target.checked),
                        })
                      }
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration" className="border-b-0 border-neutral-200 dark:border-neutral-800">
          <AccordionTrigger className="py-3 text-left text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
              <Clock className="h-4 w-4 shrink-0" />
              {ui.durationTitle}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {dccWorkshopsCatalogUi.durationBuckets.map((opt) => {
                const checked = value.durations.includes(opt.id as DccCatalogDurationBucketId)
                return (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-[var(--cdc-teal)] focus:ring-[var(--cdc-teal)]"
                      checked={checked}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          durations: toggleList(
                            value.durations,
                            opt.id as DccCatalogDurationBucketId,
                            e.target.checked
                          ),
                        })
                      }
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <button
        type="button"
        disabled={!hasAny}
        onClick={() => onChange(emptyDccCatalogFilterState())}
        className={cn(
          'mt-4 w-full rounded-lg border px-3 py-2 text-sm font-medium transition',
          hasAny
            ? 'border-[var(--cdc-teal)] text-[var(--cdc-teal)] hover:bg-[var(--cdc-teal)]/10'
            : 'cursor-not-allowed border-neutral-200 text-neutral-400 dark:border-neutral-700'
        )}
      >
        {ui.clearFilters}
      </button>
    </div>
  )
}
