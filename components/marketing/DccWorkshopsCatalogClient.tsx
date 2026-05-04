'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { WorkshopCard } from '@/components/workshops/marketing/WorkshopCard'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { normalizeWorkshopForCatalog } from '@/lib/workshops/normalize-workshop-for-catalog'
import { isExcludedFromDccPublicCatalog } from '@/lib/workshops/workshop-filters'
import { getDccMarketingWorkshopsLandingContent } from '@/lib/marketing/dcc-workshops-landing-content'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'
import {
  DCC_CATALOG_PAGE_SIZE,
  buildTagCounts,
  emptyDccCatalogFilterState,
  matchesDccCatalogFilters,
  sortDccCatalogWorkshops,
  type DccCatalogFilterState,
  type DccCatalogSortMode,
} from '@/lib/marketing/dcc-workshops-catalog-filters'
import {
  dccWorkshopsCatalogUi,
  dccWorkshopsPromotedProgramSlides,
} from '@/lib/marketing/dcc-workshops-catalog-ui'
import { DccWorkshopsCatalogFilters } from '@/components/marketing/DccWorkshopsCatalogFilters'
import { DccWorkshopsPromotedCarousel } from '@/components/marketing/DccWorkshopsPromotedCarousel'
import { PartnersCardPaintRegister } from '@/components/marketing/PartnersCardPaintRegister'

function sortFeaturedFirst(a: WorkshopRow, b: WorkshopRow) {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
  return (a.title ?? '').localeCompare(b.title ?? '')
}

export function DccWorkshopsCatalogClient() {
  const slug = WORKSHOP_CATALOG_ORG_SLUG
  const [rows, setRows] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<DccCatalogFilterState>(() => emptyDccCatalogFilterState())
  const [sortMode, setSortMode] = useState<DccCatalogSortMode>('popular')
  const [page, setPage] = useState(1)

  const landingCopy = getDccMarketingWorkshopsLandingContent()
  const catalogUi = dccWorkshopsCatalogUi

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/organizations/by-slug/${encodeURIComponent(slug)}/workshops/public`)
        if (cancelled) return
        if (!res.ok) {
          const msg =
            res.status === 404
              ? `No organization found for slug “${slug}”. Set NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG to the Supabase organizations.slug that owns your published workshops.`
              : 'Could not load the workshop catalog. Please try again later.'
          setError(msg)
          setRows([])
          return
        }
        const pub = await res.json()
        const o = pub.organization as {
          id: string
          name: string
          slug: string
          banner_image?: string
          created_at: string
        } | null
        if (!o?.id) {
          setError('Catalog response was missing organization data.')
          setRows([])
          return
        }
        const rawList = (pub.workshops || []) as Record<string, unknown>[]
        const normalized = rawList.map((w) =>
          normalizeWorkshopForCatalog(w, { id: o.id, name: o.name, slug: o.slug })
        )
        setRows(normalized as unknown as WorkshopRow[])
      } catch {
        if (!cancelled) {
          setError('Could not load the workshop catalog. Please try again later.')
          setRows([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const publishedRows = useMemo(
    () => rows.filter((w) => w.status === 'published'),
    [rows]
  )

  const digitalLabList = useMemo(() => {
    return publishedRows.filter((w) => !isExcludedFromDccPublicCatalog(w)).sort(sortFeaturedFirst)
  }, [publishedRows])

  const tagOptions = useMemo(() => buildTagCounts(digitalLabList), [digitalLabList])

  const searchFiltered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return digitalLabList
    return digitalLabList.filter((w) => {
      const t = (w.title ?? '').toLowerCase()
      const d = (w.description ?? '').toLowerCase()
      return t.includes(q) || d.includes(q)
    })
  }, [digitalLabList, searchTerm])

  const accordionFiltered = useMemo(
    () => searchFiltered.filter((w) => matchesDccCatalogFilters(w, filters)),
    [searchFiltered, filters]
  )

  const sortedList = useMemo(
    () => sortDccCatalogWorkshops(accordionFiltered, sortMode),
    [accordionFiltered, sortMode]
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm, filters, sortMode])

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(accordionFiltered.length / DCC_CATALOG_PAGE_SIZE))
    setPage((p) => Math.min(p, tp))
  }, [accordionFiltered.length])

  const total = sortedList.length
  const totalPages = Math.max(1, Math.ceil(total / DCC_CATALOG_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * DCC_CATALOG_PAGE_SIZE
  const pageSlice = sortedList.slice(pageStart, pageStart + DCC_CATALOG_PAGE_SIZE)
  const from = total === 0 ? 0 : pageStart + 1
  const to = total === 0 ? 0 : pageStart + pageSlice.length

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto h-10 max-w-md animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Workshop catalog unavailable</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{error}</p>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500">
          <Link href="/contact" className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline">
            Contact DCC
          </Link>{' '}
          if this persists.
        </p>
      </div>
    )
  }

  const catalogEmpty = digitalLabList.length === 0
  const allPublishedFilteredOut = catalogEmpty && publishedRows.length > 0
  const searchActive = searchTerm.trim().length > 0
  const searchNoHits = searchActive && searchFiltered.length === 0 && !catalogEmpty
  const filterNoHits =
    !catalogEmpty &&
    !searchNoHits &&
    accordionFiltered.length === 0 &&
    (searchActive || Object.values(filters).some((v) => v.length > 0))

  const heroLead = landingCopy.heroLead.trim()
  const showAccent = landingCopy.heroTitleAccent.trim().length > 0

  return (
    <>
      <PartnersCardPaintRegister />
      <section
        className="dcc-workshops-hero-band relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[var(--cdc-border)] cdc-mesh-hero-bg scroll-mt-14"
        aria-labelledby="dcc-workshops-hero-heading"
      >
        <span
          className="partners-card-pixel-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.55] dark:opacity-[0.42]"
          style={
            {
              '--partners-hue': 158,
              '--partners-hue-accent': 205,
              '--partners-density': 12,
            } as CSSProperties
          }
          aria-hidden
        />
        <div className="relative z-[2] mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              {landingCopy.heroEyebrow}
            </p>
            <h1
              id="dcc-workshops-hero-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl lg:text-5xl"
            >
              <span className="block">{landingCopy.heroTitle}</span>
              {showAccent ? (
                <span className="mt-2 block text-[var(--cdc-teal)]">{landingCopy.heroTitleAccent}</span>
              ) : null}
            </h1>
            {heroLead ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
                {landingCopy.heroLead}
              </p>
            ) : null}
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
            <Link
              href={landingCopy.heroPrimaryCta.href}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:opacity-95 dark:border-teal-300/30 dark:bg-teal-400 dark:text-neutral-950 dark:shadow-teal-500/20 dark:hover:bg-teal-300"
            >
              {landingCopy.heroPrimaryCta.label}
            </Link>
            <Link
              href={landingCopy.heroSecondaryCta.href}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-neutral-300/90 bg-white/90 px-7 py-3 text-sm font-semibold text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-white dark:border-neutral-500 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              {landingCopy.heroSecondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="scroll-mt-24" id="catalog">
        {searchNoHits ? (
          <p className="mt-12 text-center text-sm text-neutral-500">No workshops match your search.</p>
        ) : catalogEmpty ? (
          <div className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {allPublishedFilteredOut ? (
              <>
                <p>
                  There are published workshops for this program org, but none are shown in the public DCC catalog
                  right now (in-studio / member-only listings are filtered out).
                </p>
                <p className="mt-3">
                  To surface a workshop here, set its category away from in-studio programs or add metadata such as{' '}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                    dcc_public_catalog: true
                  </code>{' '}
                  on the row if it is intentionally public on DCC.
                </p>
              </>
            ) : (
              <>
                <p>No published workshops are in this catalog yet.</p>
                <p className="mt-3">
                  If you expect listings here, confirm in the database that workshops are{' '}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">published</strong> for the
                  organization whose slug matches{' '}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">{slug}</code>{' '}
                  (set{' '}
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                    NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG
                  </code>{' '}
                  in production).
                </p>
              </>
            )}
            <p className="mt-4">
              <Link href="/contact" className="font-medium text-[var(--cdc-teal)] underline-offset-4 hover:underline">
                Contact DCC
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(260px,300px)_1fr] lg:items-start lg:gap-10">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <DccWorkshopsCatalogFilters value={filters} onChange={setFilters} tagOptions={tagOptions} />
            </aside>

            <div className="min-w-0 space-y-8">
              <div className="relative max-w-full sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder={catalogUi.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 shadow-sm focus:border-[var(--cdc-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--cdc-teal)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {catalogUi.programsSectionTitle}
                </h2>
                <div className="flex flex-col gap-1 sm:items-end">
                  <label htmlFor="dcc-catalog-sort" className="text-xs font-medium text-neutral-500">
                    {catalogUi.sortLabel}
                  </label>
                  <select
                    id="dcc-catalog-sort"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as DccCatalogSortMode)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[var(--cdc-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--cdc-teal)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  >
                    {catalogUi.sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {catalogUi.coursesHeading}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {catalogUi.coursesSubcopy}
                  </p>
                </div>
                <DccWorkshopsPromotedCarousel slides={dccWorkshopsPromotedProgramSlides} />
              </div>

              {filterNoHits ? (
                <p className="text-center text-sm text-neutral-500">
                  No workshops match these filters. Try clearing filters or broadening your search.
                </p>
              ) : (
                <>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {catalogUi.paginationSummary(from, to, total)}
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pageSlice.map((workshop) => (
                      <WorkshopCard
                        key={workshop.id}
                        workshop={workshop}
                        orgSlug={slug}
                        catalogSurface="dcc"
                      />
                    ))}
                  </div>

                  {totalPages > 1 ? (
                    <nav
                      className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row"
                      aria-label="Catalog pagination"
                    >
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-200"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-neutral-500">
                        Page {safePage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-200"
                      >
                        Next
                      </button>
                    </nav>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </section>
      </div>
    </>
  )
}
