'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { WorkshopCard } from '@/components/workshops/marketing/WorkshopCard'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { normalizeWorkshopForCatalog } from '@/lib/workshops/normalize-workshop-for-catalog'
import { isAdultStudioWorkshop } from '@/lib/workshops/workshop-filters'
import { getWorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'
import { WORKSHOP_CATALOG_ORG_SLUG } from '@/lib/marketing/workshops-catalog-org'

type Org = { id: string; name: string; slug: string; banner_image?: string; created_at: string }

function sortFeaturedFirst<T extends { featured?: boolean; title: string }>(a: T, b: T) {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
  return a.title.localeCompare(b.title)
}

export function DccWorkshopsCatalogClient() {
  const slug = WORKSHOP_CATALOG_ORG_SLUG
  const [org, setOrg] = useState<Org | null>(null)
  const [rows, setRows] = useState<WorkshopRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/organizations/by-slug/${encodeURIComponent(slug)}/workshops/public`)
        if (!res.ok || cancelled) return
        const pub = await res.json()
        const o = pub.organization as Org | null
        if (!o?.id || cancelled) return
        setOrg(o)
        const rawList = (pub.workshops || []) as Record<string, unknown>[]
        const normalized = rawList.map((w) =>
          normalizeWorkshopForCatalog(w, { id: o.id, name: o.name, slug: o.slug })
        )
        if (!cancelled) setRows(normalized as unknown as WorkshopRow[])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const landingCopy = getWorkshopsLandingContent(slug)

  const digitalLabList = useMemo(() => {
    return rows
      .filter((w) => !isAdultStudioWorkshop(w) && w.status === 'published')
      .sort(sortFeaturedFirst)
  }, [rows])

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return digitalLabList
    return digitalLabList.filter((w) => {
      const t = (w.title ?? '').toLowerCase()
      const d = (w.description ?? '').toLowerCase()
      return t.includes(q) || d.includes(q)
    })
  }, [digitalLabList, searchTerm])

  const signInOolite = `/sign-in?redirect_url=${encodeURIComponent('/o/oolite/workshops')}`
  const signInDigitalLab = `/sign-in?redirect_url=${encodeURIComponent('/o/oolite/workshops/digital-lab')}`

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
          Public catalog on DCC.miami. Sign in to Oolite for drafts, voting, and the full Digital Lab
          catalog with filters and readiness badges.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={signInOolite}
            className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/80"
          >
            Oolite member catalog
          </Link>
          <Link
            href={signInDigitalLab}
            className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800/80"
          >
            Digital Lab (filters & badges)
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

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-neutral-500">No workshops match your search.</p>
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

      {org?.name ? (
        <p className="mt-12 text-center text-xs text-neutral-500">
          Presented with {org.name}. Catalog shows published Digital Lab workshops.
        </p>
      ) : null}
    </div>
  )
}
