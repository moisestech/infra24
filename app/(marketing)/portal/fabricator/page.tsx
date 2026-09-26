import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { PortalUnlinked } from '@/components/dcc/portal/PortalUnlinked'

export const metadata: Metadata = {
  title: 'Fabricator portal',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function PortalFabricatorPage() {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in?redirect_url=%2Fportal%2Ffabricator')
  }
  return <PortalUnlinked />
}
