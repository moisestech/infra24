import type { Metadata } from 'next'
import Link from 'next/link'
import { StartSessionButton } from '@/components/workshop-engine/StartSessionButton'
import { JoinSessionForm } from '@/components/workshop-engine/JoinSessionForm'
import { WorkshopModuleCard } from '@/components/workshop-engine/SessionJoinCard'
import { ModuleBanner } from '@/components/workshop-engine/ModuleBanner'
import {
  weSpace,
  weType,
} from '@/components/workshop-engine/responsive'
import {
  BookOpen,
  Building2,
  MonitorPlay,
  Route,
  ShieldCheck,
} from 'lucide-react'
import {
  RESIN_MODULE_BANNERS,
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
} from '@/lib/workshop-engine/resin-printing'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Intro to 3D Resin Printing for Artists',
  description: RESIN_PRINTING_WORKSHOP.promise,
  alternates: { canonical: '/workshop/resin-printing' },
}

export default function ResinPrintingHubPage() {
  const w = RESIN_PRINTING_WORKSHOP

  return (
    <div className={cn(weSpace.stack, '2xl:space-y-14')}>
      <section className="grid min-w-0 items-center gap-6 md:gap-8 lg:grid-cols-[1.05fr_.95fr] 2xl:gap-10">
        <div className="min-w-0 space-y-4 md:space-y-5 2xl:space-y-6">
          <div className="flex flex-wrap gap-2">
            {[
              `${w.durationMinutes} min`,
              `Up to ${w.capacity}`,
              'Beginner',
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-cyan-900 sm:px-3 sm:text-xs 2xl:text-sm"
              >
                {label}
              </span>
            ))}
          </div>
          <h1 className={cn(weType.display, 'max-w-3xl 2xl:max-w-4xl')}>
            {w.title}
          </h1>
          <p className={cn(weType.body, 'max-w-2xl text-base text-slate-700 md:text-lg 2xl:text-xl')}>
            {w.promise}
          </p>
          <p className="flex max-w-2xl gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 md:text-base 2xl:px-5 2xl:py-4 2xl:text-lg">
            <ShieldCheck
              aria-hidden
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-800 md:h-6 md:w-6"
            />
            <span>
              <span className="font-semibold">Workshop boundary:</span>{' '}
              {w.expectationStatement}
            </span>
          </p>
          <p className={cn(weType.label, 'text-slate-600')}>
            Facilitators: {w.facilitators.join(' · ')} · One curriculum,
            configured separately for Oolite and DCC.MIAMI at Bakehouse.
          </p>
        </div>
        <ModuleBanner
          banner={RESIN_MODULE_BANNERS.welcome}
          priority
          decorative={false}
          className="w-full min-w-0 max-w-full"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 2xl:p-6">
        <div className="flex flex-col gap-3 sm:flex-wrap sm:flex-row sm:items-end">
          <StartSessionButton label="Start live session (facilitator)" />
          <Link
            href="/workshop/resin-printing/modules/welcome"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-950 2xl:px-5 2xl:py-3 2xl:text-base"
          >
            Browse modules
          </Link>
          <JoinSessionForm />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 2xl:gap-5">
        {[
          {
            Icon: MonitorPlay,
            color: 'text-cyan-700',
            bg: 'bg-cyan-50 border-cyan-200',
            title: 'Follow the room',
            text: 'TV and participant pages stay synchronized with the facilitator.',
          },
          {
            Icon: Route,
            color: 'text-indigo-700',
            bg: 'bg-indigo-50 border-indigo-200',
            title: 'Choose your pace',
            text: 'Follow class, move independently, then rejoin the live position.',
          },
          {
            Icon: ShieldCheck,
            color: 'text-amber-800',
            bg: 'bg-amber-50 border-amber-300',
            title: 'Safety remains shared',
            text: 'Required safety moments interrupt the flow and stay instructor-led.',
          },
        ].map(({ Icon, color, bg, title, text }) => (
          <div
            key={title}
            className={cn('rounded-2xl border bg-white', weSpace.cardPad, bg)}
          >
            <Icon
              aria-hidden="true"
              className={cn('h-5 w-5 md:h-6 md:w-6 2xl:h-7 2xl:w-7', color)}
            />
            <h2 className={cn('mt-3 md:mt-4', weType.cardTitle)}>{title}</h2>
            <p className={cn('mt-1', weType.body, 'text-slate-600')}>{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 md:space-y-5 2xl:space-y-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-700 sm:text-xs 2xl:text-sm">
            Curriculum
          </p>
          <h2 className={cn('mt-2', weType.section)}>
            Nine modules, one material workflow
          </h2>
          <p className={cn('mt-2 max-w-2xl', weType.body, 'text-slate-600')}>
            Color identifies the kind of attention each module needs; every
            color is paired with an icon and phase label.
          </p>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 2xl:gap-5">
          {RESIN_PRINTING_MODULES.map((m) => (
            <WorkshopModuleCard
              key={m.id}
              href={`/workshop/resin-printing/modules/${m.slug}`}
              moduleId={m.id}
              order={m.order}
              title={m.title}
              minutes={m.estimatedMinutes}
              promise={m.promise}
              safetyLevel={m.safetyLevel}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 2xl:gap-5">
        <Link
          className={cn(
            'group rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white',
            weSpace.cardPad
          )}
          href="/workshop/resin-printing/venue/oolite"
        >
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-800 sm:text-xs 2xl:text-sm">
            <Building2 aria-hidden className="h-3.5 w-3.5" />
            Pilot venue · teal
          </p>
          <h2 className={cn('mt-2', weType.cardTitle, 'group-hover:underline')}>
            Oolite Digital Lab
          </h2>
          <p className={cn('mt-1', weType.body, 'text-slate-600')}>
            Studio 106 equipment, zones, contacts, and appointment pathway.
          </p>
        </Link>
        <Link
          className={cn(
            'group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white',
            weSpace.cardPad
          )}
          href="/workshop/resin-printing/venue/bakehouse"
        >
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-900 sm:text-xs 2xl:text-sm">
            <Building2 aria-hidden className="h-3.5 w-3.5" />
            DCC.MIAMI · copper
          </p>
          <h2 className={cn('mt-2', weType.cardTitle, 'group-hover:underline')}>
            Bakehouse configuration
          </h2>
          <p className={cn('mt-1', weType.body, 'text-slate-600')}>
            Same curriculum with venue-specific equipment and safety details.
          </p>
        </Link>
      </section>

      <section className="flex flex-wrap gap-2 border-t border-slate-200 pt-5 text-sm md:gap-3 md:pt-6 2xl:pt-8 2xl:text-base">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 hover:border-slate-950 md:px-4 md:py-2"
          href="/workshop/resin-printing/resources"
        >
          Resources
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 hover:border-slate-950 md:px-4 md:py-2"
          href="/workshop/resin-printing/booklet"
        >
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          Booklet
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 hover:border-slate-950 md:px-4 md:py-2"
          href="/workshop/resin-printing/media"
        >
          Media shot list
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-cyan-950 hover:border-cyan-800 md:px-4 md:py-2"
          href="/fabricate/pricing"
        >
          Browse pricing
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-cyan-950 hover:border-cyan-800 md:px-4 md:py-2"
          href="/fabricate/finishes"
        >
          Finish levels
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-950 bg-slate-950 px-3 py-1.5 text-white hover:bg-slate-800 md:px-4 md:py-2"
          href="/fabricate/quote"
        >
          Request quote
        </Link>
      </section>
    </div>
  )
}
