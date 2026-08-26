import type { Metadata } from 'next'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Boxes,
  ClipboardCheck,
  DollarSign,
  ExternalLink,
  FileBox,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Palette,
  SlidersHorizontal,
} from 'lucide-react'
import {
  RESIN_BOOKLET_DRAFT_HREF,
  RESIN_GLOSSARY,
  RESIN_RESOURCES,
} from '@/lib/workshop-engine/resin-printing'
import type { WorkshopResource } from '@/lib/workshop-engine/types'
import { weSpace, weTouch, weType } from '@/components/workshop-engine/responsive'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Resources — Resin Printing',
  description:
    'Sample file, slicer, checklist, glossary, and guide links for the resin workshop.',
  alternates: { canonical: '/workshop/resin-printing/resources' },
}

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  'booklet-print-spreads': BookOpen,
  'sample-stl': FileBox,
  'slicer-link': SlidersHorizontal,
  'photon-workshop': SlidersHorizontal,
  'readiness-checklist': ClipboardCheck,
  'fabricate-pricing': DollarSign,
  'fabricate-finishes': Palette,
  'fabricate-quote': Boxes,
  glossary: HelpCircle,
  'media-shot-list': ImageIcon,
}

const STATUS_UI = {
  ready: {
    label: 'Ready',
    card: 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-white',
    pill: 'border-emerald-300 bg-emerald-100 text-emerald-950',
    iconWrap: 'bg-emerald-700 text-white',
  },
  placeholder: {
    label: 'Placeholder',
    card: 'border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white',
    pill: 'border-amber-300 bg-amber-100 text-amber-950',
    iconWrap: 'bg-amber-500 text-amber-950',
  },
} as const

function ResourceCard({ resource }: { resource: WorkshopResource }) {
  const ui = STATUS_UI[resource.status]
  const Icon = RESOURCE_ICONS[resource.id] ?? Layers

  return (
    <li
      className={cn(
        'rounded-2xl border',
        weSpace.cardPad,
        ui.card
      )}
    >
      <div className="flex flex-wrap items-start gap-3 md:gap-4">
        <span
          className={cn(
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12 2xl:h-14 2xl:w-14',
            ui.iconWrap
          )}
        >
          <Icon aria-hidden className="h-5 w-5 md:h-6 md:w-6 2xl:h-7 2xl:w-7" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={cn(weType.cardTitle, 'text-slate-950')}>{resource.title}</h2>
            <span
              className={cn(
                'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide 2xl:text-xs',
                ui.pill
              )}
            >
              {ui.label}
            </span>
          </div>
          <p className={cn(weType.body, 'max-w-[75ch] text-slate-700')}>
            {resource.description}
          </p>
          {resource.href ? (
            <Link
              className={cn(
                weTouch.button,
                'mt-1 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
              )}
              href={resource.href}
              {...(resource.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              Open
              {resource.href.startsWith('http') ? (
                <ExternalLink aria-hidden className="h-4 w-4" />
              ) : null}
            </Link>
          ) : (
            <p className={cn(weType.label, 'font-medium text-amber-900')}>
              TBD — enter before publish
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

export default function ResinResourcesPage() {
  return (
    <div className={cn(weSpace.stack)}>
      <header className="space-y-3">
        <h1 className={weType.display}>Resources</h1>
        <p className={cn(weType.body, 'max-w-[70ch] text-slate-700')}>
          Placeholders remain until the validated slicer, profile, and sample STL are entered
          for the venue. Fabrication rates and finishes live on{' '}
          <Link className="underline underline-offset-2" href="/fabricate">
            /fabricate
          </Link>
          — not inside workshop modules.
        </p>
      </header>

      <ul className="space-y-4 md:space-y-5 2xl:space-y-6">
        {RESIN_RESOURCES.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </ul>

      <section id="glossary" className="space-y-4 md:space-y-5">
        <h2 className={weType.section}>Glossary</h2>
        <dl className="space-y-4 md:space-y-5">
          {RESIN_GLOSSARY.map((entry) => (
            <div
              key={entry.term}
              className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-white px-4 py-4 md:px-5 md:py-5"
            >
              <dt className={cn(weType.cardTitle, 'text-slate-950')}>{entry.term}</dt>
              <dd className={cn(weType.body, 'mt-2 max-w-[70ch] text-slate-700')}>
                {entry.definition}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className={cn(weType.body, 'text-slate-600')}>
        Print-spread guide:{' '}
        <a
          className="font-medium underline underline-offset-2"
          href={RESIN_BOOKLET_DRAFT_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download PDF
        </a>
      </p>
    </div>
  )
}
