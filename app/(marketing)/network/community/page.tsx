import type { Metadata } from 'next'
import { CommunityAtlas } from '@/components/dcc/community/CommunityAtlas'

export const metadata: Metadata = {
  title: 'Community Atlas — Find People and Practices',
  description: 'Explore DCC Miami artists and practices in a curated preview. Public member profiles require independent consent and review.',
  robots: { index: true, follow: true },
}

export default function CommunityAtlasPage() {
  return <CommunityAtlas />
}
