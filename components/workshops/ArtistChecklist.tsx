'use client'

import { useMemo, useState } from 'react'

type ArtistChecklistProps = {
  title: string
  description: string
  items: string[]
}

export function ArtistChecklist({ title, description, items }: ArtistChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const progress = useMemo(() => {
    const checkedCount = items.filter((item) => checkedItems[item]).length
    return `${checkedCount}/${items.length}`
  }, [checkedItems, items])

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-700">{description}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-cyan-700">Progress: {progress}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-slate-200 p-3 text-sm">
            <label className="flex cursor-pointer items-start gap-3 text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(checkedItems[item])}
                onChange={(event) =>
                  setCheckedItems((state) => ({
                    ...state,
                    [item]: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-500"
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
