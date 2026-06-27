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
      <div className="space-y-10">
        <SaturdayLabBanner
          banner="startHere"
          alt="Saturday Lab — choose artist website or vibe coding"
          priority
        />

        <SaturdayLabQrBlock />

        <blockquote className="rounded-lg border border-neutral-200 bg-white p-4 text-neutral-800">
          <p className="font-medium">Opening line for the room</p>
          <p className="mt-2 text-sm leading-relaxed">
            Everyone has both printed cheat sheets. Choose what you want to leave with by 1 PM.
            Regular artist website → Beginner sheet. Code experiments → Vibe Coding sheet. The QR
            has the full packet, links, prompts, and starter template.
          </p>
        </blockquote>

        <SaturdayLabHubQuickLinks />

        <SaturdayLabCheatSheetDownloads availability={handouts} />

        <SaturdayLabChoosePathCards />

        <SaturdayLabOutputGoals />

        <SaturdayLabStarterDownload />

        <SaturdayLabSiteMapDiagram />

        <details className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <summary className="cursor-pointer font-medium text-neutral-800">
            More on the site (full packets, paths, facilitator)
          </summary>
          <ul className="mt-3 space-y-1 text-sm text-neutral-600">
            <li>
              <a href="/workshop/saturday-lab/beginner" className="underline">
                Full Beginner packet
              </a>
            </li>
            <li>
              <a href="/workshop/saturday-lab/vibe-coding" className="underline">
                Full Vibe Coding packet
              </a>
            </li>
            <li>
              <a href="/workshop/saturday-lab/paths" className="underline">
                Student paths
              </a>
            </li>
            <li>
              <a href="/workshop/saturday-lab/resources" className="underline">
                Prompts library & tutorials
              </a>
            </li>
            <li>
              <a href="/workshop/saturday-lab/exit-ticket" className="underline">
                Exit ticket
              </a>
            </li>
          </ul>
        </details>
      </div>
    </SaturdayLabShell>
  )
}
