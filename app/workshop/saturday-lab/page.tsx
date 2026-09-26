import type { Metadata } from 'next'
import Image from 'next/image'
import { SaturdayLabCheatSheetDownloads } from '@/components/workshop/SaturdayLabCheatSheetDownloads'
import { SaturdayLabChoosePathCards } from '@/components/workshop/SaturdayLabChoosePathCards'
import { SaturdayLabHubQuickLinks } from '@/components/workshop/SaturdayLabHubQuickLinks'
import { SaturdayLabOutputGoals } from '@/components/workshop/SaturdayLabOutputGoals'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { SaturdayLabSiteMapDiagram } from '@/components/workshop/SaturdayLabSiteMapDiagram'
import { SaturdayLabStarterDownload } from '@/components/workshop/SaturdayLabStarterDownload'
import { getSaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'

const SATURDAY_LAB_HUB_HERO = '/dcc/workshops/saturday-lab/hub-hero.jpg'

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
    images: [{ url: SATURDAY_LAB_HUB_HERO, alt: 'Saturday Lab table: sitemap, phone, QR card, and a laptop with code beside a portfolio' }],
  },
}

export default function SaturdayLabLandingPage() {
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab" showPrint={false}>
      <div className="space-y-10 2xl:space-y-14">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <Image
            src={SATURDAY_LAB_HUB_HERO}
            alt="Saturday Lab table: a printed sitemap and phone on one side, a QR card, and a laptop with code beside the same portfolio"
            width={1600}
            height={900}
            priority
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 1100px"
          />
        </div>

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
