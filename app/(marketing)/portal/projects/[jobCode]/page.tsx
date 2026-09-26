import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { PortalUnlinked } from '@/components/dcc/portal/PortalUnlinked'

export const metadata: Metadata = {
  title: 'Project',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function PortalProjectPage({ params }: { params: { jobCode: string } }) {
  const { userId } = auth()
  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/portal/projects/${params.jobCode}`)}`)
  }
  return <PortalUnlinked jobCode={params.jobCode} />
}
