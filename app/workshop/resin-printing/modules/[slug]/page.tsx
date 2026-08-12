import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ModuleView } from '@/components/workshop-engine/ParticipantSessionClient'
import { weTouch } from '@/components/workshop-engine/responsive'
import {
  RESIN_PRINTING_MODULES,
  getResinModuleBySlug,
  getResinModuleNav,
} from '@/lib/workshop-engine/resin-printing'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> | { slug: string } }

async function resolveParams(params: Props['params']) {
  return await Promise.resolve(params)
}

export async function generateStaticParams() {
  return RESIN_PRINTING_MODULES.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await resolveParams(params)
  const workshopModule = getResinModuleBySlug(slug)
  if (!workshopModule) return { title: 'Module' }
  return {
    title: `${workshopModule.title} — Resin Printing`,
    description: workshopModule.promise,
    alternates: {
      canonical: `/workshop/resin-printing/modules/${workshopModule.slug}`,
    },
  }
}

export default async function ResinModulePage({ params }: Props) {
  const { slug } = await resolveParams(params)
  const workshopModule = getResinModuleBySlug(slug)
  if (!workshopModule) notFound()
  const nav = getResinModuleNav(workshopModule.slug)

  return (
    <div className="space-y-8">
      <ModuleView
        workshopModule={workshopModule}
        showSafetyGate={workshopModule.safetyLevel === 'required'}
        showFacilitatorNotes
      />
      <nav className="flex flex-wrap justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
        {nav.prev ? (
          <Link
            className={cn(weTouch.button, 'underline')}
            href={`/workshop/resin-printing/modules/${nav.prev.slug}`}
          >
            ← {nav.prev.title}
          </Link>
        ) : (
          <Link className={cn(weTouch.button, 'underline')} href="/workshop/resin-printing">
            ← Overview
          </Link>
        )}
        {nav.next ? (
          <Link
            className={cn(weTouch.button, 'underline')}
            href={`/workshop/resin-printing/modules/${nav.next.slug}`}
          >
            {nav.next.title} →
          </Link>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Link
              className={cn(weTouch.button, 'underline')}
              href="/fabricate/pricing"
            >
              Browse pricing
            </Link>
            <Link
              className={cn(weTouch.button, 'underline')}
              href="/fabricate/finishes"
            >
              Finish levels
            </Link>
            <Link
              className={cn(weTouch.button, 'font-medium underline')}
              href="/fabricate/quote"
            >
              Request quote →
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}
