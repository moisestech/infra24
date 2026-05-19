import Link from 'next/link'
import { PROSPECT_CONFIGS } from '@/lib/ask-the-place/configs'

type ProspectSelectorProps = {
  currentSlug: string
}

export function ProspectSelector({ currentSlug }: ProspectSelectorProps) {
  const entries = Object.entries(PROSPECT_CONFIGS).filter(([slug]) => slug !== currentSlug).slice(0, 5)
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1118] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Other demos</p>
      <ul className="mt-2 space-y-1">
        {entries.map(([slug, c]) => (
          <li key={slug}>
            <Link href={`/ask-the-place/${slug}`} className="text-xs text-teal-300/90 hover:underline">
              {c.prospectName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
