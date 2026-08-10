import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ModuleView } from '@/components/workshop-engine/ParticipantSessionClient'
import {
  RESIN_PRINTING_MODULES,
  getResinModuleBySlug,
  getResinModuleNav,
} from '@/lib/workshop-engine/resin-printing'

type Props = { params: Promise<{ slug: string }> | { slug: string } }

async function resolveParams(params: Props['params']) {
  return await Promise.resolve(params)
}

export async function generateStaticParams() {
  return RESIN_PRINTING_MODULES.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await resolveParams(params)
  const module = getResinModuleBySlug(slug)
  if (!module) return { title: 'Module' }
  return {
    title: `${module.title} — Resin Printing`,
    description: module.promise,
    alternates: { canonical: `/workshop/resin-printing/modules/${module.slug}` },
  }
}

export default async function ResinModulePage({ params }: Props) {
  const { slug } = await resolveParams(params)
  const module = getResinModuleBySlug(slug)
  if (!module) notFound()
  const nav = getResinModuleNav(module.slug)

  return (
    <div className="space-y-8">
      <ModuleView
        module={module}
        showSafetyGate={module.safetyLevel === 'required'}
        showFacilitatorNotes
      />
      <nav className="flex flex-wrap justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
        {nav.prev ? (
          <Link className="underline" href={`/workshop/resin-printing/modules/${nav.prev.slug}`}>
            ← {nav.prev.title}
          </Link>
        ) : (
          <Link className="underline" href="/workshop/resin-printing">
            ← Overview
          </Link>
        )}
        {nav.next ? (
          <Link className="underline" href={`/workshop/resin-printing/modules/${nav.next.slug}`}>
            {nav.next.title} →
          </Link>
        ) : (
          <Link className="underline" href="/workshop/resin-printing/resources">
            Resources →
          </Link>
        )}
      </nav>
    </div>
  )
}
