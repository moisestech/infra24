import type { Metadata } from 'next'
import Link from 'next/link'
import {
  RESIN_HERO_MEDIA,
  RESIN_MODULE_PRIMARY_MEDIA,
  RESIN_MODULE_MEDIA_IDS,
  RESIN_ASSET_PATHS,
} from '@/lib/workshop-engine/resin-printing/media'
import { RESIN_PRINTING_MODULES } from '@/lib/workshop-engine/resin-printing'
import { WorkshopImagePlaceholder } from '@/components/workshop-engine/WorkshopVisuals'

export const metadata: Metadata = {
  title: 'Media shot list — Resin Printing',
  description:
    'Production checklist of stills, kit pack shots, and video loops for the resin workshop.',
  alternates: { canonical: '/workshop/resin-printing/media' },
}

export default function ResinMediaShotListPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
          Production checklist
        </p>
        <h1 className="text-3xl font-semibold text-slate-950">Media shot list</h1>
        <p className="max-w-2xl text-slate-700">
          Asset IDs match curriculum placeholders. Full table with kit shots, class photos,
          video loops, and diagrams:{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            docs/workshops/RESIN_PRINTING_MEDIA_SHOT_LIST.md
          </code>
        </p>
        <Link className="text-sm underline" href="/workshop/resin-printing/resources">
          ← Resources
        </Link>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Hub hero</h2>
        <WorkshopImagePlaceholder
          moduleId="welcome"
          title={RESIN_HERO_MEDIA.title}
          shot={RESIN_HERO_MEDIA.shot}
          altIntent={RESIN_HERO_MEDIA.altIntent}
          aspect={RESIN_HERO_MEDIA.aspect}
          assetId={RESIN_HERO_MEDIA.assetId}
          minSize={RESIN_HERO_MEDIA.minSize}
          src={RESIN_HERO_MEDIA.src}
          caption={RESIN_HERO_MEDIA.caption}
          kind={RESIN_HERO_MEDIA.kind}
        />
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Primary module stills</h2>
        {RESIN_PRINTING_MODULES.map((m) => {
          const media = RESIN_MODULE_PRIMARY_MEDIA[m.id]
          if (!media) return null
          const related = RESIN_MODULE_MEDIA_IDS[m.id] ?? []
          return (
            <div key={m.id} className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Module {String(m.order).padStart(2, '0')} · {m.title}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  Related IDs: {related.join(', ')}
                </p>
              </div>
              <WorkshopImagePlaceholder
                moduleId={m.id}
                title={media.title}
                shot={media.shot}
                altIntent={media.altIntent}
                aspect={media.aspect}
                assetId={media.assetId}
                minSize={media.minSize}
                src={media.src}
                caption={media.caption}
                kind={media.kind}
              />
            </div>
          )
        })}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Diagrams already in the kit</h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Local teaching diagrams from the Oolite session — not documentary photography.
        </p>
        <WorkshopImagePlaceholder
          moduleId="safety-zones"
          title="Zone diagram"
          shot="Clean vs controlled zone graphic used in the Oolite Digital Lab session."
          altIntent="Diagram of clean participant zone versus controlled resin zone."
          aspect="diagram"
          assetId="resin-diagram-zones-01"
          src={RESIN_ASSET_PATHS.zonesDiagram}
          caption="Teaching diagram"
          kind="diagram"
        />
        <WorkshopImagePlaceholder
          moduleId="complete-workflow"
          title="Workflow diagram"
          shot="Model → slice → print → wash → cure graphic from the same curriculum."
          altIntent="Diagram of the five-stage resin printing workflow."
          aspect="diagram"
          assetId="resin-diagram-workflow-01"
          src={RESIN_ASSET_PATHS.workflowDiagram}
          caption="Teaching diagram"
          kind="diagram"
        />
      </section>
    </div>
  )
}
