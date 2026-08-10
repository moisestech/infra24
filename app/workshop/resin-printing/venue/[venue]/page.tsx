import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getResinVenue } from '@/lib/workshop-engine/resin-printing'

type Props = { params: Promise<{ venue: string }> | { venue: string } }

async function resolveParams(params: Props['params']) {
  return await Promise.resolve(params)
}

export async function generateStaticParams() {
  return [{ venue: 'oolite' }, { venue: 'bakehouse' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { venue } = await resolveParams(params)
  const config = getResinVenue(venue)
  if (!config) return { title: 'Venue' }
  return {
    title: `${config.venueName} — Resin venue config`,
    description: `Equipment and safety configuration for ${config.organization}.`,
    alternates: { canonical: `/workshop/resin-printing/venue/${config.id}` },
  }
}

export default async function ResinVenuePage({ params }: Props) {
  const { venue } = await resolveParams(params)
  const config = getResinVenue(venue)
  if (!config) notFound()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Venue configuration
        </p>
        <h1 className="text-3xl font-semibold text-neutral-950">{config.venueName}</h1>
        <p className="text-neutral-700">
          {config.organization} · {config.roomName}
        </p>
        {config.namingNote ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {config.namingNote}
          </p>
        ) : null}
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 text-sm">
        <Field label="Printer" value={config.printerModel} />
        <Field label="Wash & cure" value={config.washCureModel} />
        <Field label="Validated slicer" value={config.validatedSlicer} />
        <Field label="Profile label" value={config.validatedProfileLabel} />
        <Field label="Resin" value={config.resinLabel} />
        <Field label="Safety contact" value={config.safetyContact} />
        <Field
          label="Appointment URL"
          value={config.appointmentUrl ?? 'TBD — enter before publish'}
        />
      </dl>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Zones</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
          {config.zoneNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Stop-work conditions</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
          {config.stopWorkConditions.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <p className="text-sm">
        <Link className="underline" href="/workshop/resin-printing/venue/oolite">
          Oolite
        </Link>
        {' · '}
        <Link className="underline" href="/workshop/resin-printing/venue/bakehouse">
          Bakehouse
        </Link>
        {' · '}
        <Link className="underline" href="/workshop/resin-printing">
          Overview
        </Link>
      </p>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 text-neutral-900">{value}</dd>
    </div>
  )
}
