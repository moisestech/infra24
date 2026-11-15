import type { Metadata } from 'next'
import { CommunityAtlas } from '@/components/dcc/community/CommunityAtlas'

export const metadata: Metadata = {
  title: 'Community Atlas — Preview',
  description: 'Explore the DCC community experience: interests, people and an optional Passport preview.',
  robots: { index: false, follow: false },
}

export default function CommunityAtlasPage() {
  return <CommunityAtlas />
}
