'use client'

import type { ReactNode } from 'react'
import { Search, Sparkles, Library, Clapperboard } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  buildFiltersSummary,
  buildRefineSummary,
  sortLabel,
} from '@/components/organization/alumni-catalogue-filter-summaries'
import {
  catalogueFilterChip,
  catalogueFilterGroupDot,
  catalogueSelectContent,
  catalogueSelectItem,
  catalogueSelectTrigger,
  type CatalogueFilterTone,
} from '@/components/organization/alumni-catalogue-filter-styles'
import type { MiamiFilter, WebsiteFilter } from '@/lib/airtable/alumni-filters'

type SortMode = 'name-asc' | 'name-desc' | 'year-desc' | 'year-asc' | 'cohort-asc'
type GroupByMode = 'none' | 'cohort' | 'year' | 'program'

export type AlumniCatalogueFiltersProps = {
  query: string
  onQueryChange: (q: string) => void
  sortMode: SortMode
  onSortModeChange: (m: SortMode) => void
  groupBy: GroupByMode
  onGroupByChange: (g: GroupByMode) => void
  yearFilter: string
  onYearFilterChange: (y: string) => void
  topicFilter: string
  onTopicFilterChange: (t: string) => void
  programFilter: string
  onProgramFilterChange: (p: string) => void
  mediumFilter: string
  onMediumFilterChange: (m: string) => void
  cohortFilter: string
  onCohortFilterChange: (c: string) => void
  pronounFilter: string
  onPronounFilterChange: (p: string) => void
  ethnicityFilter: string
  onEthnicityFilterChange: (e: string) => void
  nationalityFilter: string
  onNationalityFilterChange: (n: string) => void
  onlyDigital: boolean
  onOnlyDigitalChange: (v: boolean) => void
  onlyCollection: boolean
  onOnlyCollectionChange: (v: boolean) => void
  onlyVideo: boolean
  onOnlyVideoChange: (v: boolean) => void
  websiteFilter: WebsiteFilter
  onWebsiteFilterChange: (w: WebsiteFilter) => void
  miamiFilter: MiamiFilter
  onMiamiFilterChange: (m: MiamiFilter) => void
  yearOptions: string[]
  topicOptions: string[]
  programOptions: string[]
  mediumOptions: string[]
  cohortOptions: string[]
  pronounOptions: string[]
  ethnicityOptions: string[]
  nationalityOptions: string[]
}

const sortChips: { mode: SortMode; label: string }[] = [
  { mode: 'name-asc', label: 'Name A–Z' },
  { mode: 'name-desc', label: 'Name Z–A' },
  { mode: 'year-desc', label: 'Newest residency' },
  { mode: 'year-asc', label: 'Oldest residency' },
]

function FilterGroupLabel({
  tone,
  children,
}: {
  tone: CatalogueFilterTone
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={catalogueFilterGroupDot(tone)} aria-hidden />
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {children}
      </Label>
    </div>
  )
}

function SectionTrigger({
  title,
  summary,
}: {
  title: string
  summary: string
}) {
  return (
    <AccordionTrigger className="gap-2 py-3 text-sm font-semibold hover:no-underline">
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left sm:flex-row sm:items-center sm:gap-3">
        <span>{title}</span>
        <span className="truncate text-xs font-normal text-muted-foreground">{summary}</span>
      </span>
    </AccordionTrigger>
  )
}

export function AlumniCatalogueFilters(props: AlumniCatalogueFiltersProps) {
  const filterSummary = buildFiltersSummary({
    onlyDigital: props.onlyDigital,
    onlyCollection: props.onlyCollection,
    onlyVideo: props.onlyVideo,
    websiteFilter: props.websiteFilter,
    miamiFilter: props.miamiFilter,
    yearFilter: props.yearFilter,
    topicFilter: props.topicFilter,
  })

  const refineSummary = buildRefineSummary({
    programFilter: props.programFilter,
    mediumFilter: props.mediumFilter,
    pronounFilter: props.pronounFilter,
    ethnicityFilter: props.ethnicityFilter,
    nationalityFilter: props.nationalityFilter,
    cohortFilter: props.cohortFilter,
    groupBy: props.groupBy,
  })

  return (
    <div className="catalogue-filters mb-6 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search artists…"
          className="catalogue-search-input pl-10"
          value={props.query}
          onChange={(e) => props.onQueryChange(e.target.value)}
          aria-label="Search artists"
        />
      </div>

      <Accordion type="multiple" className="rounded-lg border border-border bg-card/40 px-3">
        <AccordionItem value="filters" className="border-border">
          <SectionTrigger title="Filters" summary={filterSummary} />
          <AccordionContent className="space-y-4">
            <FilterGroupLabel tone="practice-violet">Practice type</FilterGroupLabel>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.onlyDigital, 'practice-violet')}
                onClick={() => props.onOnlyDigitalChange(!props.onlyDigital)}
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Digital
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.onlyCollection, 'practice-emerald')}
                onClick={() => props.onOnlyCollectionChange(!props.onlyCollection)}
              >
                <Library className="mr-1.5 h-3.5 w-3.5" />
                Collection
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.onlyVideo, 'practice-amber')}
                onClick={() => props.onOnlyVideoChange(!props.onlyVideo)}
              >
                <Clapperboard className="mr-1.5 h-3.5 w-3.5" />
                Video
              </Button>
            </div>

            <FilterGroupLabel tone="website">Website</FilterGroupLabel>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.websiteFilter === '__all__', 'website')}
                onClick={() => props.onWebsiteFilterChange('__all__')}
              >
                Any website
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.websiteFilter === 'yes', 'website')}
                onClick={() => props.onWebsiteFilterChange('yes')}
              >
                Has website
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.websiteFilter === 'no', 'website')}
                onClick={() => props.onWebsiteFilterChange('no')}
              >
                No website
              </Button>
            </div>

            <FilterGroupLabel tone="location">Location</FilterGroupLabel>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.miamiFilter === '__all__', 'location')}
                onClick={() => props.onMiamiFilterChange('__all__')}
              >
                Any location
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.miamiFilter === 'miami', 'location')}
                onClick={() => props.onMiamiFilterChange('miami')}
              >
                Miami
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={catalogueFilterChip(props.miamiFilter === 'not_miami', 'location')}
                onClick={() => props.onMiamiFilterChange('not_miami')}
              >
                Not Miami
              </Button>
            </div>

            <div className="space-y-2">
              <FilterGroupLabel tone="year">Residency year</FilterGroupLabel>
              {props.yearOptions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No years found in residency, cohort, or program fields. If you expect year
                  filters, check your Airtable column mapping.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={catalogueFilterChip(props.yearFilter === '__all__', 'year')}
                    onClick={() => props.onYearFilterChange('__all__')}
                  >
                    All
                  </Button>
                  {props.yearOptions.map((y) => (
                    <Button
                      key={y}
                      type="button"
                      size="sm"
                      variant="outline"
                      className={catalogueFilterChip(props.yearFilter === y, 'year')}
                      onClick={() => props.onYearFilterChange(y)}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {props.topicOptions.length > 0 ? (
              <div className="space-y-2">
                <FilterGroupLabel tone="topic">Topic</FilterGroupLabel>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={catalogueFilterChip(props.topicFilter === '__all__', 'topic')}
                    onClick={() => props.onTopicFilterChange('__all__')}
                  >
                    All
                  </Button>
                  {props.topicOptions.slice(0, 24).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      size="sm"
                      variant="outline"
                      className={catalogueFilterChip(props.topicFilter === t, 'topic')}
                      onClick={() => props.onTopicFilterChange(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="refine" className="border-border">
          <SectionTrigger title="Medium & details" summary={refineSummary} />
          <AccordionContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {props.programOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-program">Program</Label>
                  <Select value={props.programFilter} onValueChange={props.onProgramFilterChange}>
                    <SelectTrigger id="alumni-program" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All programs" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All programs
                      </SelectItem>
                      {props.programOptions.map((pr) => (
                        <SelectItem key={pr} value={pr} className={catalogueSelectItem}>
                          {pr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {props.mediumOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-medium">Medium</Label>
                  <Select value={props.mediumFilter} onValueChange={props.onMediumFilterChange}>
                    <SelectTrigger id="alumni-medium" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All media" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All media
                      </SelectItem>
                      {props.mediumOptions.map((m) => (
                        <SelectItem key={m} value={m} className={catalogueSelectItem}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {props.pronounOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-pronoun">Pronoun</Label>
                  <Select value={props.pronounFilter} onValueChange={props.onPronounFilterChange}>
                    <SelectTrigger id="alumni-pronoun" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All
                      </SelectItem>
                      {props.pronounOptions.map((p) => (
                        <SelectItem key={p} value={p} className={catalogueSelectItem}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {props.ethnicityOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-ethnicity">Ethnicity</Label>
                  <Select value={props.ethnicityFilter} onValueChange={props.onEthnicityFilterChange}>
                    <SelectTrigger id="alumni-ethnicity" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All
                      </SelectItem>
                      {props.ethnicityOptions.map((e) => (
                        <SelectItem key={e} value={e} className={catalogueSelectItem}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {props.nationalityOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-nationality">Nationality</Label>
                  <Select
                    value={props.nationalityFilter}
                    onValueChange={props.onNationalityFilterChange}
                  >
                    <SelectTrigger id="alumni-nationality" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All
                      </SelectItem>
                      {props.nationalityOptions.map((n) => (
                        <SelectItem key={n} value={n} className={catalogueSelectItem}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {props.cohortOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="alumni-cohort">Cohort</Label>
                  <Select value={props.cohortFilter} onValueChange={props.onCohortFilterChange}>
                    <SelectTrigger id="alumni-cohort" className={catalogueSelectTrigger}>
                      <SelectValue placeholder="All cohorts" />
                    </SelectTrigger>
                    <SelectContent className={catalogueSelectContent}>
                      <SelectItem value="__all__" className={catalogueSelectItem}>
                        All cohorts
                      </SelectItem>
                      {props.cohortOptions.map((c) => (
                        <SelectItem key={c} value={c} className={catalogueSelectItem}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="alumni-group">Group by</Label>
                <Select
                  value={props.groupBy}
                  onValueChange={(v) => props.onGroupByChange(v as GroupByMode)}
                >
                  <SelectTrigger id="alumni-group" className={catalogueSelectTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={catalogueSelectContent}>
                    <SelectItem value="none" className={catalogueSelectItem}>
                      None
                    </SelectItem>
                    <SelectItem value="year" className={catalogueSelectItem}>
                      Residency year
                    </SelectItem>
                    <SelectItem value="program" className={catalogueSelectItem}>
                      Program
                    </SelectItem>
                    <SelectItem value="cohort" className={catalogueSelectItem}>
                      Cohort
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort" className="border-0">
          <SectionTrigger title="Sort" summary={sortLabel(props.sortMode)} />
          <AccordionContent className="space-y-3">
            <FilterGroupLabel tone="sort">Order</FilterGroupLabel>
            <div className="flex flex-wrap gap-2">
              {sortChips.map(({ mode, label }) => (
                <Button
                  key={mode}
                  type="button"
                  size="sm"
                  variant="outline"
                  className={catalogueFilterChip(props.sortMode === mode, 'sort')}
                  onClick={() => props.onSortModeChange(mode)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
