import Link from 'next/link'
import { LANDING_VERTICALS } from '@/lib/ask-the-place/configs'
import { cn } from '@/lib/utils'

const accentBorder: Record<string, string> = {
  champagne: 'hover:border-amber-300/40 hover:shadow-amber-900/20',
  gold: 'hover:border-yellow-300/35',
  teal: 'hover:border-teal-400/40 hover:shadow-teal-900/20',
  violet: 'hover:border-violet-400/40 hover:shadow-violet-900/20',
}

export function VerticalSelector() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LANDING_VERTICALS.map((v) => (
        <Link
          key={v.slug}
          href={`/ask-the-place/${v.slug}`}
          className={cn(
            'group rounded-2xl border border-white/10 bg-[#0B1118] p-6 transition-all',
            accentBorder[v.accent]
          )}
        >
          <h3 className="text-lg font-medium text-white group-hover:text-teal-100">{v.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400">{v.blurb}</p>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-teal-400/80">
            Open demo →
          </p>
        </Link>
      ))}
    </div>
  )
}
