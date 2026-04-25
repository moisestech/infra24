import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dccSiteMeta } from '@/lib/marketing/content'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'
import { VIBE_NET_ART_WORKSHOP_SLUG } from '@/lib/course/vibe-net-art/constants'
import { VCN_GLOSSARY_TERMS } from '@/lib/course/vibe-net-art/glossary'
import { VcnGlossaryPageClient } from '@/components/vcn-course/VcnGlossaryPageClient'

type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateStaticParams() {
  return [{ slug: VIBE_NET_ART_WORKSHOP_SLUG }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  if (slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    return { title: 'Glossary' }
  }
  return {
    title: `Glossary — Vibe Coding & Net Art`,
    description: `Course glossary for ${dccSiteMeta.organizationName} — net art, browser, and tool vocabulary.`,
    alternates: { canonical: `/workshop/${slug}/glossary` },
  }
}

export default async function VcnGlossaryPage({ params, searchParams }: Props) {
  const { slug: raw } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  if (slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    notFound()
  }

  const basePath = `/workshop/${encodeURIComponent(slug)}/`
  const rawTerm = searchParams?.term
  const initialTermSlug =
    typeof rawTerm === 'string' ? rawTerm : Array.isArray(rawTerm) ? rawTerm[0] : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <VcnGlossaryPageClient
        terms={[...VCN_GLOSSARY_TERMS]}
        handbookHref={basePath}
        initialTermSlug={initialTermSlug}
      />
    </div>
  )
}
