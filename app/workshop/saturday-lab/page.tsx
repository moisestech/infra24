import type { Metadata } from 'next'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabCheatSheetDownloads } from '@/components/workshop/SaturdayLabCheatSheetDownloads'
import { SaturdayLabChoosePathCards } from '@/components/workshop/SaturdayLabChoosePathCards'
import { SaturdayLabHubQuickLinks } from '@/components/workshop/SaturdayLabHubQuickLinks'
import { SaturdayLabOutputGoals } from '@/components/workshop/SaturdayLabOutputGoals'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { SaturdayLabSiteMapDiagram } from '@/components/workshop/SaturdayLabSiteMapDiagram'
import { SaturdayLabStarterDownload } from '@/components/workshop/SaturdayLabStarterDownload'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'
import { getSaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'

export const metadata: Metadata = {
  title: 'Saturday Lab — Digital Presence Lab',
  description:
    'Scan the QR code. Choose beginner website or vibe coding. Leave with one clear next step and one working artifact.',
  alternates: { canonical: '/workshop/saturday-lab' },
  openGraph: {
    title: 'Saturday Lab — Digital Presence Lab',
    description:
      'Scan the QR code. Choose beginner website or vibe coding. Leave with one clear next step and one working artifact.',
    url: '/workshop/saturday-lab',
    images: [{ url: SATURDAY_LAB_BANNERS.startHere, alt: 'Saturday Lab — start here' }],
  },
}

export default function SaturdayLabLandingPage() {
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab" showPrint={false}>
      <div className="space-y-10 2xl:space-y-14">
        <SaturdayLabBanner
          banner="startHere"
          alt="Saturday Lab — choose artist website or vibe coding"
          priority
        />

        <SaturdayLabQrBlock />

        <SaturdayLabHubQuickLinks />

        <SaturdayLabCheatSheetDownloads availability={handouts} />

        <SaturdayLabChoosePathCards />

        <SaturdayLabOutputGoals />

        <SaturdayLabStarterDownload />

        <SaturdayLabSiteMapDiagram />
      </div>
    </SaturdayLabShell>
  )
}
