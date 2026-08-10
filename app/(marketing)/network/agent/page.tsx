import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import NetworkAgentPageClient from '@/components/marketing/dcc-network/NetworkAgentPageClient'
import { cdcPageMetadata } from '@/lib/cdc/metadata'

const path = '/network/agent'

export const metadata: Metadata = {
  ...cdcPageMetadata(path),
  robots: { index: false, follow: false },
}

export default function NetworkAgentAdminPage() {
  if (process.env.DCC_NETWORK_ADMIN_ENABLED !== 'true') {
    notFound()
  }

  return <NetworkAgentPageClient />
}
