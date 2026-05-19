import type { DataCategory } from '@/lib/ask-the-place/types'

type DataCategoryListProps = {
  categories: DataCategory[]
}

export function DataCategoryList({ categories }: DataCategoryListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Data categories</p>
      <ul className="mt-3 space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
          >
            <span className="text-sm text-zinc-300">{c.label}</span>
            <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-200">
              {c.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
