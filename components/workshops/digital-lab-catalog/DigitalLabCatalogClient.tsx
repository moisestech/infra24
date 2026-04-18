'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig, madartsConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { PageFooter } from '@/components/common/PageFooter'
import { Button } from '@/components/ui/button'
import { digitalLabCatalogCopy } from '@/lib/orgs/oolite/digital-lab-catalog-copy'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import {
  cloneCatalogFilters,
  distinctTrackCount,
  emptyCatalogFilters,
  filterCatalogWorkshops,
  normalizeCatalogWorkshops,
  removeFilterSelection,
  sortCatalogWorkshops,
  toggleFilterSelection,
  type CatalogWorkshopView,
} from '@/lib/workshops/digital-lab-catalog'
import type { CatalogFilterGroupId } from '@/lib/workshops/digital-lab-catalog-constants'
import type { CatalogSortMode } from '@/lib/workshops/digital-lab-catalog-constants'
import { CatalogHero } from '@/components/workshops/digital-lab-catalog/CatalogHero'
import { FeaturedWorkshopCard } from '@/components/workshops/digital-lab-catalog/FeaturedWorkshopCard'
import { CatalogToolbar } from '@/components/workshops/digital-lab-catalog/CatalogToolbar'
import { CatalogFilterSidebar } from '@/components/workshops/digital-lab-catalog/CatalogFilterSidebar'
import { CatalogFilterDrawer } from '@/components/workshops/digital-lab-catalog/CatalogFilterDrawer'
import { ActiveFilterChips } from '@/components/workshops/digital-lab-catalog/ActiveFilterChips'
import { CatalogWorkshopCard } from '@/components/workshops/digital-lab-catalog/CatalogWorkshopCard'
import { CatalogEmptyState } from '@/components/workshops/digital-lab-catalog/CatalogEmptyState'
import { SlidersHorizontal } from 'lucide-react'

function navForSlug(slug: string) {
  switch (slug) {
    case 'oolite':
      return ooliteConfig
    case 'bakehouse':
      return bakehouseConfig
    case 'madarts':
      return madartsConfig
    default:
      return ooliteConfig
  }
}

type DigitalLabCatalogClientProps = {
  slug: string
}

export function DigitalLabCatalogClient({ slug }: DigitalLabCatalogClientProps) {
  const [loading, setLoading] = useState(true)
  const [allViews, setAllViews] = useState<CatalogWorkshopView[]>([])
  const [appliedFilters, setAppliedFilters] = useState(() => emptyCatalogFilters())
  const [draftFilters, setDraftFilters] = useState(() => emptyCatalogFilters())
  const [sortMode, setSortMode] = useState<CatalogSortMode>('featured')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const orgRes = await fetch(`/api/organizations/by-slug/${slug}`)
        if (!orgRes.ok || cancelled) return
        const orgJson = await orgRes.json()
        const orgId = orgJson.organization?.id
        if (!orgId) return
        const wsRes = await fetch(`/api/organizations/${orgId}/workshops`)
        if (!wsRes.ok || cancelled) return
        const wsJson = await wsRes.json()
        const rows = (wsJson.workshops ?? []) as WorkshopRow[]
        const views = normalizeCatalogWorkshops(slug, rows)
        if (!cancelled) setAllViews(views)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (filterDrawerOpen) {
      setDraftFilters(cloneCatalogFilters(appliedFilters))
    }
  }, [filterDrawerOpen, appliedFilters])

  const featuredView = useMemo(() => {
    const bySlug = allViews.find((v) => v.marketing.slug === 'own-your-digital-presence')
    if (bySlug) return bySlug
    return allViews.find((v) => v.featured) ?? allViews[0] ?? null
  }, [allViews])

  const filtered = useMemo(
    () => filterCatalogWorkshops(allViews, appliedFilters),
    [allViews, appliedFilters]
  )

  const sorted = useMemo(
    () => sortCatalogWorkshops(filtered, sortMode),
    [filtered, sortMode]
  )

  const totalTracks = useMemo(() => distinctTrackCount(allViews), [allViews])

  const clearAll = useCallback(() => {
    const empty = emptyCatalogFilters()
    setAppliedFilters(empty)
    setDraftFilters(empty)
    requestAnimationFrame(() => {
      document.getElementById('digital-lab-catalog')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [])

  const desktopToggle = useCallback((group: CatalogFilterGroupId, id: string) => {
    setAppliedFilters((prev) => toggleFilterSelection(prev, group, id))
  }, [])

  const draftToggle = useCallback((group: CatalogFilterGroupId, id: string) => {
    setDraftFilters((prev) => toggleFilterSelection(prev, group, id))
  }, [])

  const chipRemove = useCallback((group: CatalogFilterGroupId, id: string) => {
    setAppliedFilters((prev) => removeFilterSelection(prev, group, id))
  }, [])

  if (slug !== 'oolite') {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-background">
          <UnifiedNavigation config={navForSlug(slug)} userRole="user" />
          <main className="container mx-auto max-w-lg px-4 py-16 text-center">
            <h1 className="text-2xl font-semibold text-foreground">Digital Lab catalog</h1>
            <p className="mt-4 text-muted-foreground">
              The full Digital Lab workshop catalog is available for{' '}
              <Link href="/o/oolite/workshops/digital-lab" className="text-primary underline">
                Oolite Arts
              </Link>
              .
            </p>
          </main>
        </div>
      </TenantProvider>
    )
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={ooliteConfig} userRole="user" />
        <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <p className="py-24 text-center text-muted-foreground">Loading catalog…</p>
          ) : (
            <>
              <div className="mb-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                <CatalogHero className="h-full" />
                <FeaturedWorkshopCard featured={featuredView} className="h-full" />
              </div>

              <p className="mb-10 max-w-3xl text-sm text-muted-foreground sm:text-base">
                {digitalLabCatalogCopy.sectionIntro}
              </p>

              <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
                <aside className="mb-6 hidden lg:block">
                  <CatalogFilterSidebar filters={appliedFilters} onToggle={desktopToggle} />
                </aside>

                <div id="digital-lab-catalog">
                  <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setFilterDrawerOpen(true)}
                    >
                      <SlidersHorizontal className="h-4 w-4" aria-hidden />
                      {digitalLabCatalogCopy.filterButton}
                    </Button>
                  </div>

                  <CatalogToolbar
                    heading={digitalLabCatalogCopy.resultsHeading}
                    subcopy={digitalLabCatalogCopy.resultsSubcopyTemplate(
                      allViews.length,
                      totalTracks
                    )}
                    sortLabel={digitalLabCatalogCopy.sortLabel}
                    sortMode={sortMode}
                    onSortChange={setSortMode}
                  />

                  <ActiveFilterChips
                    filters={appliedFilters}
                    onRemove={chipRemove}
                    onClearAll={clearAll}
                    clearAllLabel={digitalLabCatalogCopy.clearAllFilters}
                  />

                  {sorted.length === 0 ? (
                    <CatalogEmptyState
                      heading={digitalLabCatalogCopy.emptyHeading}
                      body={digitalLabCatalogCopy.emptyBody}
                      ctaLabel={digitalLabCatalogCopy.clearAllFilters}
                      onClear={clearAll}
                    />
                  ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {sorted.map((view) => (
                        <li key={view.row.id}>
                          <CatalogWorkshopCard view={view} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        <CatalogFilterDrawer
          open={filterDrawerOpen}
          onOpenChange={setFilterDrawerOpen}
          title={digitalLabCatalogCopy.drawerTitle}
          description={digitalLabCatalogCopy.drawerDescription}
          draftFilters={draftFilters}
          onToggleDraft={draftToggle}
          onClearDraft={() => setDraftFilters(emptyCatalogFilters())}
          onApply={() => setAppliedFilters(cloneCatalogFilters(draftFilters))}
          clearLabel={digitalLabCatalogCopy.clearAll}
          applyLabel={digitalLabCatalogCopy.applyFilters}
        />

        <PageFooter
          organizationSlug={slug}
          showGetStarted={true}
          showGuidelines={true}
          showTerms={true}
        />
      </div>
    </TenantProvider>
  )
}
