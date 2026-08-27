import {
  ARTIST_PRODUCTION_PROOF_CAPTION,
  ARTIST_PRODUCTION_WHY_BODY,
  ARTIST_PRODUCTION_WHY_HEADLINE,
  ARTIST_PRODUCTION_DIFFERENTIATORS,
} from '@/lib/marketing/artist-production-narrative'
import { FabricateSectionMedia } from '@/components/dcc/fabrication/FabricateSectionMedia'
import { cn } from '@/lib/utils'

export function FabricateWhyAndProof({ className }: { className?: string }) {
  return (
    <section
      id="why-dcc"
      className={cn('mb-10 scroll-mt-24 grid gap-6 md:mb-12 md:grid-cols-2 md:items-start xl:mb-14', className)}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          Why DCC
        </p>
        <h2 className="mt-1 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {ARTIST_PRODUCTION_WHY_HEADLINE}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {ARTIST_PRODUCTION_WHY_BODY}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ARTIST_PRODUCTION_DIFFERENTIATORS.map((line) => (
            <li
              key={line}
              className="rounded-full border border-[var(--cdc-border)] px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FabricateSectionMedia mediaId="finishRaw" colorTokenId="slate" />
          <FabricateSectionMedia mediaId="finishFinished" colorTokenId="violet" />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Raw print → finished object. {ARTIST_PRODUCTION_PROOF_CAPTION}
        </p>
      </div>
    </section>
  )
}
