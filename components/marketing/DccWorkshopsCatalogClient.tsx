'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { WorkshopCard } from '@/components/workshops/marketing/WorkshopCard'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { normalizeWorkshopForCatalog } from '@/lib/workshops/normalize-workshop-for-catalog'
import { isExcludedFromDccPublicCatalog } from '@/lib/workshops/workshop-filters'
import { getDccMarketingWorkshopsLandingContent } from '@/lib/marketing/dcc-workshops-landing-content'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'

function sortFeaturedFirst<T extends { featured?: boolean; title: string }>(a: T, b: T) {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
  return a.title.localeCompare(b.title)
}

export function DccWorkshopsCatalogClient() {
  const slug = WORKSHOP_CATALOG_ORG_SLUG
  const [rows, setRows] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const landingCopy = getDccMarketingWorkshopsLandingContent()

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

  /** Published workshops eligible for the public DCC catalog (excludes Oolite studio-only classes). */
  const digitalLabList = useMemo(() => {
    return publishedRows.filter((w) => !isExcludedFromDccPublicCatalog(w)).sort(sortFeaturedFirst)
  }, [publishedRows])

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return digitalLabList
    return digitalLabList.filter((w) => {
      const t = (w.title ?? '').toLowerCase()
      const d = (w.description ?? '').toLowerCase()
      return t.includes(q) || d.includes(q)
    })
  }, [digitalLabList, searchTerm])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
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
  const searchNoHits = searchActive && filtered.length === 0 && !catalogEmpty

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          {landingCopy.heroEyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
          <span className="block">{landingCopy.heroTitle}</span>
          <span className="mt-1 block text-[var(--cdc-teal)]">{landingCopy.heroTitleAccent}</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
          {landingCopy.heroLead}
        </p>
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          This is the public DCC.miami catalog. Listings show published workshops for the configured program org.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={landingCopy.heroPrimaryCta.href}
            className="inline-flex rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {landingCopy.heroPrimaryCta.label}
          </Link>
          <Link
            href={landingCopy.heroSecondaryCta.href}
            className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/80"
          >
            {landingCopy.heroSecondaryCta.label}
          </Link>
        </div>
      </header>

      <section className="mt-14 scroll-mt-24" id="catalog">
        <div className="relative mx-auto max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search workshops…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 shadow-sm focus:border-[var(--cdc-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--cdc-teal)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

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
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                orgSlug={slug}
                catalogSurface="dcc"
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-20 max-w-3xl border-t border-neutral-200 pt-14 text-center dark:border-neutral-800">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl">
          {landingCopy.framingSection.title}
        </h2>
        <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
          {landingCopy.framingSection.body}
        </p>
        <p className="mt-10 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {landingCopy.trustLine}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {landingCopy.trustItems.map((t) => (
            <li
              key={t}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-center text-xs text-neutral-500 dark:text-neutral-500">
        Public Digital Lab series · Digital Culture Center Miami · Catalog shows published workshops
      </p>
    </div>
  )
}
