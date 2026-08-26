import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  CalendarClock,
  Droplets,
  MapPin,
  Printer,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react'
import { getResinVenue } from '@/lib/workshop-engine/resin-printing'
import { RESIN_CONCEPT_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'
import { getVenueAccent } from '@/lib/workshop-engine/resin-printing/theme'
import { WorkshopImagePlaceholder } from '@/components/workshop-engine/WorkshopVisuals'
import { weSpace, weTouch, weType } from '@/components/workshop-engine/responsive'
import { cn } from '@/lib/utils'

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
  const accent = getVenueAccent(config.themeAccentId)

  return (
    <div className={cn(weSpace.stack)}>
      <header
        className={cn(
          'space-y-3 rounded-2xl border',
          weSpace.headerPad,
          accent?.border ?? 'border-slate-200',
          accent ? `bg-gradient-to-br ${accent.gradient}` : 'bg-white'
        )}
      >
        <p
          className={cn(
            weType.meta,
            accent?.chip ?? 'text-slate-500'
          )}
        >
          {accent?.label ?? 'Venue configuration'}
        </p>
        <h1 className={cn(weType.display, accent?.heading ?? 'text-slate-950')}>
          {config.venueName}
        </h1>
        <p className={cn(weType.body, 'text-slate-700')}>
          {config.organization} · {config.roomName}
        </p>
        {config.namingNote ? (
          <p
            className={cn(
              'rounded-xl border border-amber-300 bg-amber-50 text-amber-950',
              weSpace.cardPad,
              weType.body
            )}
          >
            {config.namingNote}
          </p>
        ) : null}
      </header>

      {config.brandMediaId ? (
        <WorkshopImagePlaceholder
          moduleId={config.id === 'oolite' ? 'file-readiness' : 'print-wash-cure'}
          title={`${config.venueName} equipment class`}
          shot={
            config.id === 'oolite'
              ? 'Conceptual portrait of the Photon Mono M7 Max class used in the Oolite Digital Lab session. Not a documentary room photo.'
              : 'Bakehouse / DCC.MIAMI room shot when the space is confirmed — keep placeholder until then.'
          }
          altIntent={
            config.id === 'oolite'
              ? 'Conceptual illustration of a resin printer in the Photon Mono M7 Max class.'
              : `Venue proof image for ${config.organization} — not yet photographed.`
          }
          aspect="landscape 16:9"
          assetId={config.brandMediaId}
          minSize="2400×1350"
          src={
            config.id === 'oolite'
              ? RESIN_CONCEPT_CDN['120-m7-max-equipment-portrait']
              : undefined
          }
          caption={
            config.id === 'oolite'
              ? 'Conceptual — equipment class, not a documentary room photo'
              : undefined
          }
          kind={config.id === 'oolite' ? 'illustration' : 'placeholder'}
        />
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-2 xl:gap-5">
        <Field icon={Printer} label="Printer" value={config.printerModel} />
        <Field icon={Droplets} label="Wash & cure" value={config.washCureModel} />
        <Field icon={SlidersHorizontal} label="Validated slicer" value={config.validatedSlicer} />
        <Field icon={SlidersHorizontal} label="Profile label" value={config.validatedProfileLabel} />
        <Field icon={Droplets} label="Resin" value={config.resinLabel} />
        <Field icon={ShieldAlert} label="Safety contact" value={config.safetyContact} />
        <Field
          icon={CalendarClock}
          label="Appointment URL"
          value={config.appointmentUrl ?? 'TBD — enter before publish'}
        />
      </dl>

      <section
        className={cn(
          'space-y-3 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-white',
          weSpace.cardPad
        )}
      >
        <h2 className={cn(weType.section, 'inline-flex items-center gap-2')}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
            <MapPin aria-hidden className="h-4 w-4" />
          </span>
          Zones
        </h2>
        <ul className={cn(weType.body, 'list-disc space-y-2 pl-5 text-slate-800')}>
          {config.zoneNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section
        className={cn(
          'space-y-3 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-white',
          weSpace.cardPad
        )}
      >
        <h2 className={cn(weType.section, 'inline-flex items-center gap-2')}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-amber-950">
            <AlertTriangle aria-hidden className="h-4 w-4" />
          </span>
          Stop-work conditions
        </h2>
        <ul className={cn(weType.body, 'list-disc space-y-2 pl-5 text-slate-800')}>
          {config.stopWorkConditions.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <p className={cn(weType.body, 'flex flex-wrap gap-x-3 gap-y-2')}>
        <Link
          className={cn(weTouch.button, 'border border-teal-300 bg-teal-50 text-teal-950')}
          href="/workshop/resin-printing/venue/oolite"
        >
          Oolite
        </Link>
        <Link
          className={cn(weTouch.button, 'border border-orange-300 bg-orange-50 text-orange-950')}
          href="/workshop/resin-printing/venue/bakehouse"
        >
          Bakehouse
        </Link>
        <Link
          className={cn(weTouch.button, 'border border-slate-300 bg-white text-slate-900')}
          href="/workshop/resin-printing"
        >
          Overview
        </Link>
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white', weSpace.cardPad)}>
      <dt className={cn(weType.meta, 'inline-flex items-center gap-2 text-slate-500')}>
        <Icon aria-hidden className="h-4 w-4" />
        {label}
      </dt>
      <dd className={cn(weType.body, 'mt-2 text-slate-900')}>{value}</dd>
    </div>
  )
}
