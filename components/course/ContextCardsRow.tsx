import type { Artist, CuratorLens, Institution } from '@/lib/course/types'
import { SectionLabel } from '@/components/course/SectionLabel'
import { ArtistSpotlightCard } from '@/components/course/ArtistSpotlightCard'
import { InstitutionCard } from '@/components/course/InstitutionCard'
import { CuratorLensCard } from '@/components/course/CuratorLensCard'

export type ContextCardsRowProps = {
  artists: Artist[]
  institutions: Institution[]
  curators: CuratorLens[]
  /**
   * `spotlight`: first artist, first institution, first curator in a 3-up grid (compact hero).
   * `full`: default — all entries grouped by column.
   */
  variant?: 'full' | 'spotlight'
}

export function ContextCardsRow({ artists, institutions, curators, variant = 'full' }: ContextCardsRowProps) {
  const hasAny = artists.length || institutions.length || curators.length
  if (!hasAny) return null

  if (variant === 'spotlight') {
    const a = artists[0]
    const i = institutions[0]
    const c = curators[0]
    if (!a && !i && !c) return null
    return (
      <section className="scroll-mt-28 space-y-6" id="context">
        <div className="max-w-3xl">
          <SectionLabel>Context</SectionLabel>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
            Artists, institutions, and critical framing
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {a ? <ArtistSpotlightCard artist={a} /> : <div />}
          {i ? <InstitutionCard institution={i} /> : <div />}
          {c ? <CuratorLensCard lens={c} /> : <div />}
        </div>
      </section>
    )
  }

  return (
    <section className="scroll-mt-28 space-y-6" id="context">
      <div className="max-w-3xl">
        <SectionLabel>Context</SectionLabel>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Artists, institutions, and critical framing
        </h2>
      </div>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {artists.length ? (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {artists.map((artist) => (
              <ArtistSpotlightCard key={artist.name} artist={artist} />
            ))}
          </div>
        ) : null}
        {institutions.length ? (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {institutions.map((institution) => (
              <InstitutionCard key={institution.name} institution={institution} />
            ))}
          </div>
        ) : null}
        {curators.length ? (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {curators.map((lens) => (
              <CuratorLensCard key={lens.name} lens={lens} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
