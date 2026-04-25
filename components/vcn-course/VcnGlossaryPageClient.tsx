'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { GlossaryTerm, GlossaryTermType } from '@/lib/course/types'
import { GlossaryEntryCard } from '@/components/glossary/GlossaryEntryCard'
import { BookOpen, Hash } from 'lucide-react'

const types: { id: GlossaryTermType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'art-term', label: 'Art' },
  { id: 'browser-term', label: 'Browser' },
  { id: 'coding-term', label: 'Coding' },
  { id: 'platform-tool', label: 'Platform / tool' },
  { id: 'course-term', label: 'Course' },
]

type Props = {
  terms: GlossaryTerm[]
  handbookHref: string
  /** When opening `/glossary?term=slug`, scroll and emphasize that card (deep link). */
  initialTermSlug?: string | null
}

function firstLetterBucket(term: string): string {
  const ch = term.trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(ch) ? ch : '#'
}

export function VcnGlossaryPageClient({ terms, handbookHref, initialTermSlug }: Props) {
  const glossaryPageHref = `${handbookHref.replace(/\/+$/, '')}/glossary`
  const [q, setQ] = useState('')
  const [type, setType] = useState<GlossaryTermType | 'all'>('all')
  const [highlightSlug, setHighlightSlug] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return terms
      .filter((t) => (type === 'all' ? true : t.type === type))
      .filter((t) => {
        if (!needle) return true
        return (
          t.term.toLowerCase().includes(needle) ||
          t.shortDefinition.toLowerCase().includes(needle) ||
          t.slug.includes(needle)
        )
      })
      .sort((a, b) => a.term.localeCompare(b.term))
  }, [terms, q, type])

  const letterBuckets = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>()
    for (const t of filtered) {
      const L = firstLetterBucket(t.term)
      const arr = map.get(L) ?? []
      arr.push(t)
      map.set(L, arr)
    }
    const letters = [...map.keys()].filter((k) => k !== '#').sort()
    const other = map.get('#')
    return { map, letters, other }
  }, [filtered])

  const showLetterNav = !q.trim() && type === 'all'

  useEffect(() => {
    if (!initialTermSlug?.trim()) return
    const slug = initialTermSlug.trim()
    const exists = terms.some((t) => t.slug === slug)
    if (!exists) return
    const id = `glossary-term-${slug}`
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    if (!el) return
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightSlug(slug)
    }, 150)
    return () => window.clearTimeout(t)
  }, [initialTermSlug, terms])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <BookOpen className="h-5 w-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">Course-wide</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-50">Glossary</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
            Shared vocabulary across net art, browsers, and tools. Lesson chips can link here with{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">?term=slug</code> for a direct jump.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={handbookHref}>← Course handbook</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms…"
          className="max-w-md"
          aria-label="Search glossary"
        />
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Button
              key={t.id}
              type="button"
              size="sm"
              variant={type === t.id ? 'default' : 'outline'}
              onClick={() => setType(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {showLetterNav && letterBuckets.letters.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/80 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900/40">
          <span className="flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Hash className="h-3.5 w-3.5" aria-hidden />
            A–Z
          </span>
          {letterBuckets.letters.map((L) => (
            <a
              key={L}
              href={`#gloss-letter-${L}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold text-primary hover:bg-white hover:shadow-sm dark:hover:bg-neutral-950"
            >
              {L}
            </a>
          ))}
          {letterBuckets.other?.length ? (
            <a
              href="#gloss-letter-other"
              className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-white hover:shadow-sm dark:hover:bg-neutral-950"
            >
              Other
            </a>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No terms match your filters.</p>
      ) : showLetterNav ? (
        <div className="space-y-10">
          {letterBuckets.letters.map((L) => {
            const list = letterBuckets.map.get(L) ?? []
            if (!list.length) return null
            return (
              <section key={L} id={`gloss-letter-${L}`} className="scroll-mt-28 space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{L}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((term) => (
                    <GlossaryEntryCardWrap
                      key={term.slug}
                      term={term}
                      glossaryPageHref={glossaryPageHref}
                      emphasized={highlightSlug === term.slug}
                    />
                  ))}
                </div>
              </section>
            )
          })}
          {letterBuckets.other?.length ? (
            <section id="gloss-letter-other" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Other</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {letterBuckets.other.map((term) => (
                  <GlossaryEntryCardWrap
                    key={term.slug}
                    term={term}
                    glossaryPageHref={glossaryPageHref}
                    emphasized={highlightSlug === term.slug}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((term) => (
            <GlossaryEntryCardWrap
              key={term.slug}
              term={term}
              glossaryPageHref={glossaryPageHref}
              emphasized={highlightSlug === term.slug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GlossaryEntryCardWrap({
  term,
  glossaryPageHref,
  emphasized,
}: {
  term: GlossaryTerm
  glossaryPageHref: string
  emphasized: boolean
}) {
  return (
    <div
      id={`glossary-term-${term.slug}`}
      className={`rounded-3xl ${
        emphasized ? 'ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-background' : ''
      }`}
    >
      <GlossaryEntryCard term={term} glossaryPageHref={glossaryPageHref} />
    </div>
  )
}
