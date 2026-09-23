import type { ReactNode } from 'react'
import {
  ASSET_PRODUCTION_STATUS_LABEL,
  PRIMARY_HERO_ASSET_IDS,
  THREE_D_SCHOOL_PATH,
  getCurriculumAsset,
  listCurriculumWorkshopSlugs,
} from '@/lib/dcc/education/3d-curriculum'
import { getCurriculumWorkshopBySlug } from '@/lib/dcc/education/3d-curriculum/workshops'
import { CurriculumMedia } from '@/components/dcc/education/3d-curriculum/CurriculumMedia'
import { CurriculumWorkshopCard } from '@/components/dcc/education/3d-curriculum/CurriculumWorkshopCard'

function QASection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-12 border-t border-[var(--cdc-border)] pt-10">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function CurriculumVisualQAGrid() {
  const workshopSlugs = listCurriculumWorkshopSlugs()

  return (
    <div>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
          Development only
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          3D School hero visual QA
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Can you identify the mental model without reading the title? Compare full 16:9 heroes
          against production card crops. Status badges reflect{' '}
          <code className="text-xs">assets.ts</code> — not file existence alone.
        </p>
      </header>

      <QASection title="Hub hero (3D-HERO-001)">
        <div className="mt-6 max-w-4xl">
          <CurriculumMedia assetId="3D-HERO-001" colorTokenId="teal" variant="qa" />
          <p className="mt-2 font-mono text-[11px] text-neutral-500">
            {ASSET_PRODUCTION_STATUS_LABEL[getCurriculumAsset('3D-HERO-001').productionStatus]}
          </p>
        </div>
      </QASection>

      <QASection title="Primary hero family — full 16:9">
        <ul className="mt-6 grid gap-8 lg:grid-cols-2">
          {PRIMARY_HERO_ASSET_IDS.filter((id) => id !== '3D-HERO-001').map((assetId) => {
            const asset = getCurriculumAsset(assetId)
            const workshop = asset.workshopSlug
              ? getCurriculumWorkshopBySlug(asset.workshopSlug)
              : undefined
            return (
              <li key={assetId}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  {assetId}
                  {workshop ? ` · ${workshop.title}` : ''}
                  {asset.visualVerb ? ` · ${asset.visualVerb}` : ''}
                </p>
                <CurriculumMedia
                  assetId={assetId}
                  colorTokenId={workshop?.colorTokenId ?? 'slate'}
                  variant="qa"
                />
              </li>
            )
          })}
        </ul>
      </QASection>

      <QASection title="Production card crops">
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workshopSlugs.map((slug) => {
            const workshop = getCurriculumWorkshopBySlug(slug)
            if (!workshop) return null
            return (
              <li key={slug}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  Card · {workshop.heroAssetId}
                </p>
                <CurriculumWorkshopCard workshop={workshop} />
              </li>
            )
          })}
        </ul>
      </QASection>

      <QASection title="Card-only crop (same heroes, card variant)">
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PRIMARY_HERO_ASSET_IDS.filter((id) => id !== '3D-HERO-001').map((assetId) => {
            const asset = getCurriculumAsset(assetId)
            const workshop = asset.workshopSlug
              ? getCurriculumWorkshopBySlug(asset.workshopSlug)
              : undefined
            return (
              <li key={`card-${assetId}`} className="max-w-sm">
                <CurriculumMedia
                  assetId={assetId}
                  colorTokenId={workshop?.colorTokenId ?? 'slate'}
                  variant="card"
                />
                <p className="mt-2 text-xs text-neutral-500">{asset.alt}</p>
              </li>
            )
          })}
        </ul>
      </QASection>

      <p className="mt-12 text-sm text-neutral-500">
        <a href={THREE_D_SCHOOL_PATH} className="underline-offset-4 hover:underline">
          Back to 3D School
        </a>
      </p>
    </div>
  )
}
