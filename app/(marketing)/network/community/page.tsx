import type { Metadata } from 'next'
import { CommunityAtlas } from '@/components/dcc/community/CommunityAtlas'

export const metadata: Metadata = {
  title: 'Community Atlas — Find People and Practices',
  description: 'Discover artists and creative practices, explore the community network and interests, and build your own Passport.',
  robots: { index: true, follow: true },
}

export default function CommunityAtlasPage() {
  return <CommunityAtlas />
}
