import Link from 'next/link'
import { SaturdayLabIcon } from '@/components/workshop/SaturdayLabIcon'
import { SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'
import type { SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'

const PATHS: {
  title: string
  subtitle: string
  icon: SaturdayLabIconKey
  href: string
  printHref: string
  outputs: string
  account: string
  extraHref?: string
  extraLabel?: string
}[] = [
  {
    title: 'Beginner Website',
    subtitle: 'Squarespace · Wix · Cargo · Framer',
    icon: 'homepage',
    href: '/workshop/saturday-lab/beginner',
    printHref: '/workshop/saturday-lab/print/beginner',
    outputs: 'Sitemap · homepage · bio · project page · platform choice',
    account: 'No account OK (Google Doc) or builder trial',
  },
  {
    title: 'Vibe Level 1',
    subtitle: 'CodePen · Browser',
    icon: 'test',
    href: '/workshop/saturday-lab/vibe-coding#choose-your-vibe-coding-level',
    printHref: '/workshop/saturday-lab/print/vibe-coding',
    outputs: 'CodePen sketch · Hello Browser · debug one thing',
    account: 'Optional — fastest start',
  },
  {
    title: 'Vibe Level 2–3',
    subtitle: 'Replit · Cursor',
    icon: 'files',
    href: '/workshop/saturday-lab/vibe-coding',
    printHref: '/workshop/saturday-lab/print/vibe-coding',
    outputs: 'Replit URL · Cursor starter edit · shareable link',
    account: 'Yes — Replit or Cursor + starter zip',
    extraHref: SATURDAY_LAB_STARTER_ZIP,
    extraLabel: 'Download starter zip',
  },
]

export function SaturdayLabChoosePathCards() {
  return (
    <section className="space-y-4 2xl:space-y-6">
      <h2 className="sl-section-title text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Choose your path
      </h2>
      <p className="text-sm text-neutral-600 2xl:text-lg">
        Everyone gets both printed cheat sheets. Pick the path that matches what you want by 1 PM.
      </p>
      <div className="grid gap-4 lg:grid-cols-3 2xl:gap-8">
        {PATHS.map((path) => (
          <article
            key={path.title}
            className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 2xl:p-8"
          >
            <div className="mb-3 flex flex-col items-center gap-3 text-center 2xl:mb-4">
              <span className="flex items-center justify-center rounded-full bg-neutral-100 p-3 2xl:p-4">
                <SaturdayLabIcon icon={path.icon} label={path.title} size={20} tripleOnWide />
              </span>
              <div>
                <h3 className="font-semibold text-neutral-950 2xl:text-2xl 2xl:font-bold">{path.title}</h3>
                <p className="text-xs text-neutral-500 2xl:text-base">{path.subtitle}</p>
              </div>
            </div>
            <p className="flex-1 text-sm text-neutral-600 2xl:text-lg">{path.outputs}</p>
            <p className="mt-2 text-xs text-neutral-500 2xl:text-base">{path.account}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm 2xl:mt-5 2xl:text-lg">
              <Link href={path.href} className="font-medium underline underline-offset-2">
                Full packet →
              </Link>
              <Link href={path.printHref} className="text-neutral-600 underline underline-offset-2">
                Print sheet →
              </Link>
              {path.extraHref ? (
                <a href={path.extraHref} download className="text-neutral-600 underline underline-offset-2">
                  {path.extraLabel} →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
