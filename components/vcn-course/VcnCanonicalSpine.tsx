'use client'

import { useMemo, useState } from 'react'
import { Building2, BookMarked, Palette, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Tab = 'artists' | 'institutions' | 'curators' | 'books'

type Props = {
  artists: readonly string[]
  institutions: readonly string[]
  curators: readonly string[]
  books: readonly string[]
}

const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: 'artists', label: 'Artists', icon: Palette },
  { id: 'institutions', label: 'Institutions', icon: Building2 },
  { id: 'curators', label: 'Curators & writers', icon: Users },
  { id: 'books', label: 'Books', icon: BookMarked },
]

export function VcnCanonicalSpine({ artists, institutions, curators, books }: Props) {
  const [tab, setTab] = useState<Tab>('institutions')

  const list = useMemo(() => {
    if (tab === 'artists') return artists
    if (tab === 'institutions') return institutions
    if (tab === 'curators') return curators
    return books
  }, [tab, artists, institutions, curators, books])

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Canonical spine</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Names and sources you will see repeatedly — they anchor the course historically.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={tab === id ? 'default' : 'outline'}
            className={cn('gap-2')}
            onClick={() => setTab(id)}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Button>
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
