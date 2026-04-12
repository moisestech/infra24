'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { parseAlumniYearValue } from '@/lib/airtable/alumni-service'
import { orgSlugToEnvToken } from '@/lib/airtable/org-alumni-config'
import {
  School,
  Search,
  AlertCircle,
  Database,
  ExternalLink,
  Layers,
  Sparkles,
  Library,
  Clapperboard,
} from 'lucide-react'

function getNavigationConfig(slug: string) {
  switch (slug) {
    case 'oolite':
      return ooliteConfig
    case 'bakehouse':
      return bakehouseConfig
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

function isVideoRow(row: AlumniAirtableRow): boolean {
  if (row.videoArt === true) return true
  const m = row.medium?.toLowerCase() ?? ''
  return m.includes('video') || m.includes('film') || m.includes('moving image')
}

function rowMatchesTopic(row: AlumniAirtableRow, topic: string): boolean {
  if (!topic || topic === '__all__') return true
  return row.topics.some((t) => t.toLowerCase() === topic.toLowerCase())
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
  const [onlyDigital, setOnlyDigital] = useState(false)
  const [onlyCollection, setOnlyCollection] = useState(false)
  const [onlyVideo, setOnlyVideo] = useState(false)

  const navConfig = getNavigationConfig(slug)

  const { cohortOptions, yearOptions, topicOptions } = useMemo(() => {
    const cohorts = new Set<string>()
    const years = new Set<string>()
    const topics = new Set<string>()
    for (const row of alumni) {
      if (row.cohort?.trim()) cohorts.add(row.cohort.trim())
      if (row.year?.trim()) years.add(row.year.trim())
      for (const t of row.topics) {
        if (t.trim()) topics.add(t.trim())
      }
    }
    return {
      cohortOptions: [...cohorts].sort((a, b) => a.localeCompare(b)),
      yearOptions: [...years].sort((a, b) => {
        const na = parseAlumniYearValue(a) ?? 0
        const nb = parseAlumniYearValue(b) ?? 0
        return nb - na
      }),
      topicOptions: [...topics].sort((a, b) => a.localeCompare(b)),
    }
  }, [alumni])

  const { sections, totalShown } = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = alumni.filter((row) => {
      if (cohortFilter !== '__all__' && (row.cohort?.trim() ?? '') !== cohortFilter) {
        return false
      }
      if (yearFilter !== '__all__' && (row.year?.trim() ?? '') !== yearFilter) {
        return false
      }
      if (!rowMatchesTopic(row, topicFilter)) return false
      if (onlyDigital && row.digitalArtist !== true) return false
      if (onlyCollection && row.inCollection !== true) return false
      if (onlyVideo && !isVideoRow(row)) return false
      if (!q) return true
      const hay = [
        row.name,
        row.email,
        row.cohort,
        row.program,
        row.year,
        row.notes,
        row.medium,
        row.artifacts,
        ...row.topics,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...rows].sort((a, b) => {
      switch (sortMode) {
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'year-desc': {
          const ya = parseAlumniYearValue(a.year) ?? -Infinity
          const yb = parseAlumniYearValue(b.year) ?? -Infinity
          return yb - ya
        }
        case 'year-asc': {
          const ya = parseAlumniYearValue(a.year) ?? Infinity
          const yb = parseAlumniYearValue(b.year) ?? Infinity
          return ya - yb
        }
        case 'cohort-asc': {
          const ca = a.cohort ?? '\uffff'
          const cb = b.cohort ?? '\uffff'
          const c = ca.localeCompare(cb)
          if (c !== 0) return c
          return a.name.localeCompare(b.name)
        }
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    if (groupBy === 'none') {
      return { sections: [{ key: 'all', label: null as string | null, rows: sorted }], totalShown: sorted.length }
    }

    const keyFn = (row: AlumniAirtableRow) => {
      if (groupBy === 'cohort') return row.cohort?.trim() || '— No cohort —'
      if (groupBy === 'year') return row.year?.trim() || '— No year —'
      return row.program?.trim() || '— No program —'
    }

    const map = new Map<string, AlumniAirtableRow[]>()
    for (const row of sorted) {
      const k = keyFn(row)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(row)
    }
    const keys = [...map.keys()].sort((a, b) => a.localeCompare(b))
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
    topicFilter,
    onlyDigital,
    onlyCollection,
    onlyVideo,
  ])

  const toggleBtn = (active: boolean) =>
    active
      ? 'bg-primary text-primary-foreground border-primary'
      : 'border-border text-muted-foreground hover:bg-muted/60'

  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <UnifiedNavigation config={navConfig} userRole="user" />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <School className="h-8 w-8" aria-hidden />
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Alumni directory
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl text-sm sm:text-base">
              {orgName} alumni data comes from Airtable on each request (
              <code className="text-xs bg-gray-200/80 dark:bg-gray-800 px-1 rounded">
                fetchAlumniFromAirtable
              </code>
              ). Rich filters (digital practice, collection, video, topics) only light up when those
              columns exist—map them with{' '}
              <code className="text-xs bg-muted px-1 rounded">
                AIRTABLE_*_ALUMNI_FIELD_*
              </code>{' '}
              if your field names differ. JSON:{' '}
              <Link
                href={`/api/organizations/by-slug/${slug}/alumni/airtable`}
                className="text-primary underline-offset-2 hover:underline"
              >
                alumni/airtable API
              </Link>
              .
            </p>
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
              <CardContent className="py-12 text-center text-gray-600 dark:text-gray-400">
                No rows with a <strong>Name</strong> field were found in the alumni table.
              </CardContent>
            </Card>
          )}

          {configured && !fetchError && alumni.length > 0 && (
            <>
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search name, notes, medium, artifacts, topics…"
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search alumni"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={toggleBtn(onlyDigital)}
                    onClick={() => setOnlyDigital((v) => !v)}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Digital artists
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={toggleBtn(onlyCollection)}
                    onClick={() => setOnlyCollection((v) => !v)}
                  >
                    <Library className="h-3.5 w-3.5 mr-1.5" />
                    In collection
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={toggleBtn(onlyVideo)}
                    onClick={() => setOnlyVideo((v) => !v)}
                  >
                    <Clapperboard className="h-3.5 w-3.5 mr-1.5" />
                    Video / moving image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Toggles use checkboxes{' '}
                  <code className="bg-muted px-0.5 rounded">Digital artist</code>,{' '}
                  <code className="bg-muted px-0.5 rounded">In collection</code>,{' '}
                  <code className="bg-muted px-0.5 rounded">Video art</code> when present; video also
                  matches <strong>Medium</strong> containing &quot;video&quot;, &quot;film&quot;, or
                  &quot;moving image&quot;.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="alumni-sort">Sort</Label>
                    <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                      <SelectTrigger id="alumni-sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                        <SelectItem value="year-desc">Year (newest)</SelectItem>
                        <SelectItem value="year-asc">Year (oldest)</SelectItem>
                        <SelectItem value="cohort-asc">Cohort, then name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alumni-group">Group by</Label>
                    <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupByMode)}>
                      <SelectTrigger id="alumni-group">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No grouping</SelectItem>
                        <SelectItem value="cohort">Cohort</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="program">Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alumni-cohort">Cohort</Label>
                    <Select value={cohortFilter} onValueChange={setCohortFilter}>
                      <SelectTrigger id="alumni-cohort">
                        <SelectValue placeholder="All cohorts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All cohorts</SelectItem>
                        {cohortOptions.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alumni-year">Year</Label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger id="alumni-year">
                        <SelectValue placeholder="All years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All years</SelectItem>
                        {yearOptions.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {topicOptions.length > 0 && (
                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="alumni-topic">Topic / theme</Label>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                      <SelectTrigger id="alumni-topic">
                        <SelectValue placeholder="All topics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All topics</SelectItem>
                        {topicOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Showing <strong>{totalShown}</strong> of {alumni.length} alumni
              </p>

              <div className="space-y-10">
                {sections.map((section) => (
                  <section key={section.key} aria-labelledby={section.label ? `grp-${section.key}` : undefined}>
                    {section.label ? (
                      <h2
                        id={`grp-${section.key}`}
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-border"
                      >
                        {section.label}
                        <span className="text-muted-foreground font-normal text-sm ml-2">
                          ({section.rows.length})
                        </span>
                      </h2>
                    ) : null}
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {section.rows.map((row) => (
                        <li key={row.id}>
                          <Card className="h-full border-gray-200 dark:border-gray-800 flex flex-col">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg leading-snug">{row.name}</CardTitle>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {row.digitalArtist === true && (
                                  <Badge className="bg-violet-600 hover:bg-violet-600">Digital</Badge>
                                )}
                                {row.inCollection === true && (
                                  <Badge variant="secondary">Collection</Badge>
                                )}
                                {isVideoRow(row) && (
                                  <Badge variant="outline" className="border-amber-500/50 text-amber-800 dark:text-amber-200">
                                    Video
                                  </Badge>
                                )}
                                {row.cohort && <Badge variant="secondary">{row.cohort}</Badge>}
                                {row.program && <Badge variant="outline">{row.program}</Badge>}
                                {row.year && <Badge variant="outline">{row.year}</Badge>}
                                {row.medium && (
                                  <Badge variant="outline" className="font-normal">
                                    {row.medium}
                                  </Badge>
                                )}
                              </div>
                              {row.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                  {row.topics.map((t) => (
                                    <span
                                      key={t}
                                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2 flex-1 flex flex-col">
                              {row.website && (
                                <p>
                                  <a
                                    href={row.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                                  >
                                    Website
                                    <ExternalLink className="h-3 w-3" aria-hidden />
                                  </a>
                                </p>
                              )}
                              {row.email && (
                                <p>
                                  <span className="text-gray-500 dark:text-gray-500">Email: </span>
                                  <a
                                    href={`mailto:${row.email}`}
                                    className="text-primary hover:underline"
                                  >
                                    {row.email}
                                  </a>
                                </p>
                              )}
                              {row.phone && (
                                <p>
                                  <span className="text-gray-500 dark:text-gray-500">Phone: </span>
                                  {row.phone}
                                </p>
                              )}
                              {row.artifacts && (
                                <div className="pt-1 border-t border-border/60 mt-auto">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                                    Work at Oolite
                                  </p>
                                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                                    {row.artifacts}
                                  </p>
                                </div>
                              )}
                              {row.notes && !row.artifacts && (
                                <p className="text-gray-700 dark:text-gray-300 pt-1 line-clamp-4">
                                  {row.notes}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </TenantProvider>
  )
}
