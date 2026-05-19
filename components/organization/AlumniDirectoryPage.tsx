'use client'

import { useMemo, useState } from 'react'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
  sohohouseConfig,
} from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import {
  alumniDisplayName,
  parseAlumniYearValue,
} from '@/lib/airtable/alumni-service'
import { orgSlugToEnvToken } from '@/lib/airtable/org-alumni-config'
import { AlumniArtistCard } from '@/components/organization/AlumniArtistCard'
import { AlumniCatalogueModeToggle } from '@/components/organization/AlumniCatalogueModeToggle'
import { AlumniDetailSheet } from '@/components/organization/AlumniDetailSheet'
import { AlumniCatalogueFilters } from '@/components/organization/AlumniCatalogueFilters'
import { AlumniDirectoryDevPanel } from '@/components/organization/AlumniDirectoryDevPanel'
import { useMemoryAgentDevMode } from '@/hooks/memory-agent/useMemoryAgentDevMode'
import { isVideoAlumniRow } from '@/lib/institutional-artist/card-model'
import {
  alumniResidencyYear,
  collectResidencyYearOptions,
  rowMatchesMiamiFilter,
  rowMatchesResidencyYear,
  rowMatchesWebsiteFilter,
  type MiamiFilter,
  type WebsiteFilter,
} from '@/lib/airtable/alumni-filters'
import {
  School,
  AlertCircle,
  Database,
  Layers,
} from 'lucide-react'

function getNavigationConfig(slug: string) {
  switch (slug) {
    case 'oolite':
      return ooliteConfig
    case 'bakehouse':
      return bakehouseConfig
    case 'madarts':
      return madartsConfig
    case 'sohohouse':
      return sohohouseConfig
    default:
      return ooliteConfig
  }
}

export type AlumniDirectoryPageProps = {
  slug: string
  orgName: string
  configured: boolean
  fetchError: boolean
  alumni: AlumniAirtableRow[]
}

type SortMode = 'name-asc' | 'name-desc' | 'year-desc' | 'year-asc' | 'cohort-asc'
type GroupByMode = 'none' | 'cohort' | 'year' | 'program'

function rowMatchesTopic(row: AlumniAirtableRow, topic: string): boolean {
  if (!topic || topic === '__all__') return true
  const t = topic.toLowerCase()
  return [...row.topics, ...row.themes].some((x) => x.toLowerCase() === t)
}

export function AlumniDirectoryPage({
  slug,
  orgName,
  configured,
  fetchError,
  alumni,
}: AlumniDirectoryPageProps) {
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('name-asc')
  const [groupBy, setGroupBy] = useState<GroupByMode>('none')
  const [cohortFilter, setCohortFilter] = useState<string>('__all__')
  const [yearFilter, setYearFilter] = useState<string>('__all__')
  const [topicFilter, setTopicFilter] = useState<string>('__all__')
  const [programFilter, setProgramFilter] = useState<string>('__all__')
  const [mediumFilter, setMediumFilter] = useState<string>('__all__')
  const [onlyDigital, setOnlyDigital] = useState(false)
  const [onlyCollection, setOnlyCollection] = useState(false)
  const [onlyVideo, setOnlyVideo] = useState(false)
  const [websiteFilter, setWebsiteFilter] = useState<WebsiteFilter>('__all__')
  const [miamiFilter, setMiamiFilter] = useState<MiamiFilter>('__all__')
  const [pronounFilter, setPronounFilter] = useState<string>('__all__')
  const [ethnicityFilter, setEthnicityFilter] = useState<string>('__all__')
  const [nationalityFilter, setNationalityFilter] = useState<string>('__all__')
  const [selectedRow, setSelectedRow] = useState<AlumniAirtableRow | null>(null)

  const navConfig = getNavigationConfig(slug)
  const { isDevMode } = useMemoryAgentDevMode()

  const {
    cohortOptions,
    yearOptions,
    topicOptions,
    programOptions,
    mediumOptions,
    pronounOptions,
    ethnicityOptions,
    nationalityOptions,
  } = useMemo(() => {
    const cohorts = new Set<string>()
    const topics = new Set<string>()
    const programs = new Set<string>()
    const mediums = new Set<string>()
    const pronouns = new Set<string>()
    const ethnicities = new Set<string>()
    const nationalities = new Set<string>()
    for (const row of alumni) {
      if (row.cohort?.trim()) cohorts.add(row.cohort.trim())
      if (row.program?.trim()) programs.add(row.program.trim())
      if (row.medium?.trim()) mediums.add(row.medium.trim())
      if (row.pronoun?.trim()) pronouns.add(row.pronoun.trim())
      if (row.ethnicity?.trim()) ethnicities.add(row.ethnicity.trim())
      if (row.nationality?.trim()) nationalities.add(row.nationality.trim())
      for (const t of row.topics) {
        if (t.trim()) topics.add(t.trim())
      }
      for (const t of row.themes) {
        if (t.trim()) topics.add(t.trim())
      }
    }
    return {
      cohortOptions: Array.from(cohorts).sort((a, b) => a.localeCompare(b)),
      yearOptions: collectResidencyYearOptions(alumni),
      topicOptions: Array.from(topics).sort((a, b) => a.localeCompare(b)),
      programOptions: Array.from(programs).sort((a, b) => a.localeCompare(b)),
      mediumOptions: Array.from(mediums).sort((a, b) => a.localeCompare(b)),
      pronounOptions: Array.from(pronouns).sort((a, b) => a.localeCompare(b)),
      ethnicityOptions: Array.from(ethnicities).sort((a, b) => a.localeCompare(b)),
      nationalityOptions: Array.from(nationalities).sort((a, b) => a.localeCompare(b)),
    }
  }, [alumni])

  const { sections, totalShown } = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = alumni.filter((row) => {
      if (cohortFilter !== '__all__' && (row.cohort?.trim() ?? '') !== cohortFilter) {
        return false
      }
      if (!rowMatchesResidencyYear(row, yearFilter)) return false
      if (!rowMatchesWebsiteFilter(row, websiteFilter)) return false
      if (!rowMatchesMiamiFilter(row, miamiFilter)) return false
      if (programFilter !== '__all__' && (row.program?.trim() ?? '') !== programFilter) {
        return false
      }
      if (mediumFilter !== '__all__' && (row.medium?.trim() ?? '') !== mediumFilter) {
        return false
      }
      if (pronounFilter !== '__all__' && (row.pronoun?.trim() ?? '') !== pronounFilter) {
        return false
      }
      if (ethnicityFilter !== '__all__' && (row.ethnicity?.trim() ?? '') !== ethnicityFilter) {
        return false
      }
      if (
        nationalityFilter !== '__all__' &&
        (row.nationality?.trim() ?? '') !== nationalityFilter
      ) {
        return false
      }
      if (!rowMatchesTopic(row, topicFilter)) return false
      if (onlyDigital && row.digitalArtist !== true) return false
      if (onlyCollection && row.inCollection !== true) return false
      if (onlyVideo && !isVideoAlumniRow(row)) return false
      if (!q) return true
      const hay = [
        row.name,
        row.artistName,
        alumniDisplayName(row),
        row.email,
        row.cohort,
        row.program,
        row.year,
        row.residencyYear,
        row.pronoun,
        row.ethnicity,
        row.nationality,
        row.notes,
        row.medium,
        row.artifacts,
        row.publicBio,
        row.location,
        row.instagram,
        ...row.topics,
        ...row.themes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...rows].sort((a, b) => {
      const nameA = alumniDisplayName(a)
      const nameB = alumniDisplayName(b)
      switch (sortMode) {
        case 'name-desc':
          return nameB.localeCompare(nameA)
        case 'year-desc': {
          const ya = parseAlumniYearValue(alumniResidencyYear(a)) ?? -Infinity
          const yb = parseAlumniYearValue(alumniResidencyYear(b)) ?? -Infinity
          return yb - ya
        }
        case 'year-asc': {
          const ya = parseAlumniYearValue(alumniResidencyYear(a)) ?? Infinity
          const yb = parseAlumniYearValue(alumniResidencyYear(b)) ?? Infinity
          return ya - yb
        }
        case 'cohort-asc': {
          const ca = a.cohort ?? '\uffff'
          const cb = b.cohort ?? '\uffff'
          const c = ca.localeCompare(cb)
          if (c !== 0) return c
          return nameA.localeCompare(nameB)
        }
        case 'name-asc':
        default:
          return nameA.localeCompare(nameB)
      }
    })

    if (groupBy === 'none') {
      return { sections: [{ key: 'all', label: null as string | null, rows: sorted }], totalShown: sorted.length }
    }

    const keyFn = (row: AlumniAirtableRow) => {
      if (groupBy === 'cohort') return row.cohort?.trim() || '— No cohort —'
      if (groupBy === 'year')
        return alumniResidencyYear(row) || '— No residency year —'
      return row.program?.trim() || '— No program —'
    }

    const map = new Map<string, AlumniAirtableRow[]>()
    for (const row of sorted) {
      const k = keyFn(row)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(row)
    }
    const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b))
    return {
      sections: keys.map((k) => ({ key: k, label: k, rows: map.get(k)! })),
      totalShown: sorted.length,
    }
  }, [
    alumni,
    query,
    sortMode,
    groupBy,
    cohortFilter,
    yearFilter,
    websiteFilter,
    miamiFilter,
    programFilter,
    mediumFilter,
    pronounFilter,
    ethnicityFilter,
    nationalityFilter,
    topicFilter,
    onlyDigital,
    onlyCollection,
    onlyVideo,
  ])

  return (
    <TenantProvider>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={navConfig} userRole="user" />
        <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <School className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                {orgName} Alumni
              </h1>
            </div>
            <AlumniCatalogueModeToggle slug={slug} mode="browse" />
          </div>

          {!configured && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium block mb-1 text-foreground">
                  Alumni not configured
                </span>
                Set{' '}
                <code className="text-xs bg-muted px-1 rounded">
                  AIRTABLE_{orgSlugToEnvToken(slug) ?? 'ORG'}_ALUMNI_BASE_ID
                </code>{' '}
                and{' '}
                <code className="text-xs bg-muted px-1 rounded">...TABLE_ID</code>
                {slug === 'oolite' ? (
                  <>
                    {' '}
                    (or legacy <code className="text-xs bg-muted px-1 rounded">AIRTABLE_ALUMNI_*</code>
                    ){' '}
                  </>
                ) : null}
                plus a PAT. See{' '}
                <code className="text-xs bg-muted px-1 rounded">docs/AIRTABLE_MULTI_BASE.md</code>.
              </AlertDescription>
            </Alert>
          )}

          {configured && fetchError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium block mb-1">Could not load alumni</span>
                Airtable returned an error. Check the API token, base access, and server logs.
              </AlertDescription>
            </Alert>
          )}

          {configured && !fetchError && alumni.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No rows with a value in the mapped name field (default{' '}
                <strong>Name</strong>; override with{' '}
                <code className="rounded bg-muted px-1 text-xs">FIELD_NAME</code>) were found in the
                alumni table.
              </CardContent>
            </Card>
          )}

          {configured && !fetchError && alumni.length > 0 && (
            <>
              <AlumniCatalogueFilters
                query={query}
                onQueryChange={setQuery}
                sortMode={sortMode}
                onSortModeChange={setSortMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                yearFilter={yearFilter}
                onYearFilterChange={setYearFilter}
                topicFilter={topicFilter}
                onTopicFilterChange={setTopicFilter}
                programFilter={programFilter}
                onProgramFilterChange={setProgramFilter}
                mediumFilter={mediumFilter}
                onMediumFilterChange={setMediumFilter}
                cohortFilter={cohortFilter}
                onCohortFilterChange={setCohortFilter}
                pronounFilter={pronounFilter}
                onPronounFilterChange={setPronounFilter}
                ethnicityFilter={ethnicityFilter}
                onEthnicityFilterChange={setEthnicityFilter}
                nationalityFilter={nationalityFilter}
                onNationalityFilterChange={setNationalityFilter}
                onlyDigital={onlyDigital}
                onOnlyDigitalChange={setOnlyDigital}
                onlyCollection={onlyCollection}
                onOnlyCollectionChange={setOnlyCollection}
                onlyVideo={onlyVideo}
                onOnlyVideoChange={setOnlyVideo}
                websiteFilter={websiteFilter}
                onWebsiteFilterChange={setWebsiteFilter}
                miamiFilter={miamiFilter}
                onMiamiFilterChange={setMiamiFilter}
                yearOptions={yearOptions}
                topicOptions={topicOptions}
                programOptions={programOptions}
                mediumOptions={mediumOptions}
                cohortOptions={cohortOptions}
                pronounOptions={pronounOptions}
                ethnicityOptions={ethnicityOptions}
                nationalityOptions={nationalityOptions}
              />

              <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4 shrink-0" aria-hidden />
                Showing <strong className="text-foreground">{totalShown}</strong> of{' '}
                {alumni.length} alumni
              </p>

              <div className="space-y-10">
                {sections.map((section) => (
                  <section key={section.key} aria-labelledby={section.label ? `grp-${section.key}` : undefined}>
                    {section.label ? (
                      <h2
                        id={`grp-${section.key}`}
                        className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground"
                      >
                        {section.label}
                        <span className="text-muted-foreground font-normal text-sm ml-2">
                          ({section.rows.length})
                        </span>
                      </h2>
                    ) : null}
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {section.rows.map((row) => (
                        <li key={row.id}>
                          <AlumniArtistCard
                            row={row}
                            onOpen={() => setSelectedRow(row)}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {isDevMode ? (
                <div className="mt-10">
                  <AlumniDirectoryDevPanel
                    slug={slug}
                    configured={configured}
                    totalRows={alumni.length}
                  />
                </div>
              ) : null}
            </>
          )}
        </main>

        <AlumniDetailSheet
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          orgName={orgName}
        />
      </div>
    </TenantProvider>
  )
}
