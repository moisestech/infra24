import type { Metadata } from 'next'
import Link from 'next/link'
import { StartSessionButton } from '@/components/workshop-engine/StartSessionButton'
import { JoinSessionForm } from '@/components/workshop-engine/JoinSessionForm'
import { WorkshopModuleCard } from '@/components/workshop-engine/SessionJoinCard'
import {
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
} from '@/lib/workshop-engine/resin-printing'

export const metadata: Metadata = {
  title: 'Intro to 3D Resin Printing for Artists',
  description: RESIN_PRINTING_WORKSHOP.promise,
  alternates: { canonical: '/workshop/resin-printing' },
}

export default function ResinPrintingHubPage() {
  const w = RESIN_PRINTING_WORKSHOP

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {w.durationMinutes} min · up to {w.capacity} · beginner
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          {w.title}
        </h1>
        <p className="max-w-2xl text-lg text-neutral-700">{w.promise}</p>
        <p className="max-w-2xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {w.expectationStatement}
        </p>
        <p className="text-sm text-neutral-600">
          Facilitators: {w.facilitators.join(' · ')} · Shared curriculum for Oolite and
          DCC.MIAMI/Bakehouse (separate venue configs).
        </p>
      </section>

      <section className="flex flex-wrap items-end gap-3">
        <StartSessionButton label="Start live session (facilitator)" />
        <Link
          href="/workshop/resin-printing/modules/welcome"
          className="rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900"
        >
          Browse modules
        </Link>
        <JoinSessionForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-neutral-950">Nine modules</h2>
        <div className="grid gap-3">
          {RESIN_PRINTING_MODULES.map((m) => (
            <WorkshopModuleCard
              key={m.id}
              href={`/workshop/resin-printing/modules/${m.slug}`}
              order={m.order}
              title={m.title}
              minutes={m.estimatedMinutes}
              promise={m.promise}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-4 text-sm">
        <Link className="underline" href="/workshop/resin-printing/resources">
          Resources
        </Link>
        <Link className="underline" href="/workshop/resin-printing/booklet">
          Booklet
        </Link>
        <Link className="underline" href="/workshop/resin-printing/venue/oolite">
          Oolite venue
        </Link>
        <Link className="underline" href="/workshop/resin-printing/venue/bakehouse">
          Bakehouse venue
        </Link>
      </section>
    </div>
  )
}
