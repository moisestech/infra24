import Link from 'next/link'
import Image from 'next/image'
import { Globe, Monitor, FolderOpen } from 'lucide-react'
import { SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'
import { SATURDAY_LAB_CHEAT_SHEET_IMAGES } from '@/lib/workshops/saturday-lab-media'

const PATHS = [
  {
    title: 'Beginner Website',
    subtitle: 'Squarespace · Wix · Cargo · Framer',
    icon: Globe,
    href: '/workshop/saturday-lab/beginner',
    printHref: '/workshop/saturday-lab/print/beginner',
    cheatSheetImage: SATURDAY_LAB_CHEAT_SHEET_IMAGES.beginner,
    outputs: 'Sitemap · homepage · bio · project page · platform choice',
    account: 'No account OK (Google Doc) or builder trial',
  },
  {
    title: 'Vibe Level 1',
    subtitle: 'CodePen · Browser',
    icon: Monitor,
    href: '/workshop/saturday-lab/vibe-coding#choose-your-vibe-coding-level',
    printHref: '/workshop/saturday-lab/print/vibe-coding',
    cheatSheetImage: SATURDAY_LAB_CHEAT_SHEET_IMAGES.vibeCoding,
    outputs: 'CodePen sketch · Hello Browser · debug one thing',
    account: 'Optional — fastest start',
  },
  {
    title: 'Vibe Level 2–3',
    subtitle: 'Replit · Cursor',
    icon: FolderOpen,
    href: '/workshop/saturday-lab/vibe-coding',
    printHref: '/workshop/saturday-lab/print/vibe-coding',
    cheatSheetImage: SATURDAY_LAB_CHEAT_SHEET_IMAGES.vibeCoding,
    outputs: 'Replit URL · Cursor starter edit · shareable link',
    account: 'Yes — Replit or Cursor + starter zip',
    extraHref: SATURDAY_LAB_STARTER_ZIP,
    extraLabel: 'Download starter zip',
  },
] as const

export function SaturdayLabChoosePathCards() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Choose your path
      </h2>
      <p className="text-sm text-neutral-600">
        Everyone gets both printed cheat sheets. Pick the path that matches what you want by 1 PM.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {PATHS.map((path) => {
          const Icon = path.icon
          return (
            <article
              key={path.title}
              className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                  <Icon className="h-4 w-4 text-neutral-700" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-950">{path.title}</h3>
                  <p className="text-xs text-neutral-500">{path.subtitle}</p>
                </div>
              </div>
              <p className="flex-1 text-sm text-neutral-600">{path.outputs}</p>
              <p className="mt-2 text-xs text-neutral-500">{path.account}</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <Link href={path.href} className="font-medium underline underline-offset-2">
                  Full packet →
                </Link>
                <Link href={path.printHref} className="text-neutral-600 underline underline-offset-2">
                  Print sheet →
                </Link>
                {'extraHref' in path && path.extraHref ? (
                  <a href={path.extraHref} download className="text-neutral-600 underline underline-offset-2">
                    {path.extraLabel} →
                  </a>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
