import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import './edgezones-proposal-theme.css'
import { EdgeZonesAttributionSeed } from '@/components/marketing/edgezones/EdgeZonesAttributionSeed'
import { EdgeZonesDocumentLang } from '@/components/marketing/edgezones/EdgeZonesDocumentLang'
import { EdgeZonesHashAlias } from '@/components/marketing/edgezones/EdgeZonesHashAlias'
import { EdgeZonesLocaleProvider } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import { EdgeZonesProposalContent } from '@/components/marketing/edgezones/EdgeZonesProposalContent'
import { EdgeZonesProposalShell } from '@/components/marketing/edgezones/EdgeZonesProposalShell'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { fetchEdgeZonesArtists } from '@/lib/marketing/edgezones-artists'
import { getEdgeZonesPortal } from '@/lib/marketing/edgezones-content'
import {
  EDGE_ZONES_LOCALE_COOKIE_KEY,
  resolveEdgeZonesLocale,
} from '@/lib/marketing/edgezones/edgezones-locale'

const path = '/edgezones'

type PageProps = {
  searchParams?: { lang?: string | string[] }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = resolveEdgeZonesLocale({
    searchParams,
    cookieValue: cookieStore.get(EDGE_ZONES_LOCALE_COOKIE_KEY)?.value,
  })
  const portal = getEdgeZonesPortal(locale)
  return {
    ...cdcPageMetadata(path),
    title: portal.metaTitle,
    description: portal.shortDescription,
    robots: { index: false, follow: false },
  }
}

export default async function EdgeZonesPortalPage({ searchParams }: PageProps) {
  const cookieStore = await cookies()
  const locale = resolveEdgeZonesLocale({
    searchParams,
    cookieValue: cookieStore.get(EDGE_ZONES_LOCALE_COOKIE_KEY)?.value,
  })
  const { artists } = await fetchEdgeZonesArtists()
  const host = artists.find((a) => a.roleType === 'Physical host space') ?? null
  const curator = artists.find((a) => a.roleType === 'Curator') ?? null
  const exhibitionArtists = artists.filter(
    (a) => a.roleType !== 'Curator' && a.roleType !== 'Physical host space'
  )

  return (
    <EdgeZonesProposalShell>
      <Suspense fallback={null}>
        <EdgeZonesLocaleProvider initialLocale={locale}>
          <EdgeZonesDocumentLang />
          <DccSignupAttributionCapture />
          <EdgeZonesAttributionSeed />
          <EdgeZonesHashAlias />

          <EdgeZonesProposalContent
            host={host}
            curator={curator}
            artists={exhibitionArtists}
          />
        </EdgeZonesLocaleProvider>
      </Suspense>
    </EdgeZonesProposalShell>
  )
}
