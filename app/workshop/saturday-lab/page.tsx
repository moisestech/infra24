import type { Metadata } from 'next'
import { SaturdayLabCheatSheetDownloads } from '@/components/workshop/SaturdayLabCheatSheetDownloads'
import { SaturdayLabChoosePathCards } from '@/components/workshop/SaturdayLabChoosePathCards'
import { SaturdayLabHubQuickLinks } from '@/components/workshop/SaturdayLabHubQuickLinks'
import { SaturdayLabQrBlock } from '@/components/workshop/SaturdayLabQrBlock'
import { SaturdayLabShell } from '@/components/workshop/SaturdayLabShell'
import { SaturdayLabSiteMapDiagram } from '@/components/workshop/SaturdayLabSiteMapDiagram'
import { dccSiteMeta } from '@/lib/marketing/content'
import { getSaturdayLabHandoutAvailability } from '@/lib/workshops/saturday-lab-public-assets'

export const metadata: Metadata = {
  title: 'Saturday Lab — Digital Presence Lab',
  description:
    'Scan the QR code. Choose beginner website or vibe coding. Leave with one clear next step and one working artifact.',
  alternates: { canonical: '/workshop/saturday-lab' },
}

export default function SaturdayLabLandingPage() {
  const handouts = getSaturdayLabHandoutAvailability()

  return (
    <SaturdayLabShell currentPath="/workshop/saturday-lab" showPrint={false}>
      <div className="space-y-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Digital Lab · Scan QR or bookmark this page
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Saturday Lab
          </h1>
          <p className="mt-2 text-neutral-600">
            A lab for artists building digital presence at different levels ·{' '}
            {dccSiteMeta.organizationName}
          </p>
        </div>

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

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            By 1 PM — choose one output
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
              <h3 className="font-semibold text-neutral-950">Beginner</h3>
              <ul className="mt-2 list-inside list-disc text-neutral-700">
                <li>Sitemap</li>
                <li>Homepage draft</li>
                <li>Artist bio</li>
                <li>Project page</li>
                <li>Platform decision</li>
              </ul>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
              <h3 className="font-semibold text-neutral-950">Vibe Coding</h3>
              <ul className="mt-2 list-inside list-disc text-neutral-700">
                <li>CodePen sketch</li>
                <li>Replit prototype</li>
                <li>Cursor starter edit</li>
                <li>Debugged code</li>
                <li>Shareable link</li>
              </ul>
            </div>
          </div>
        </section>

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
