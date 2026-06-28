import Link from 'next/link'
import { SaturdayLabIcon } from '@/components/workshop/SaturdayLabIcon'
import { SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'
import type { SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'

const LINKS: {
  href: string
  label: string
  description: string
  icon: SaturdayLabIconKey
  download?: boolean
}[] = [
  {
    href: '/workshop/saturday-lab',
    label: 'Start Here',
    icon: 'path',
    description: 'Choose your output by 1 PM',
  },
  {
    href: '/workshop/saturday-lab/beginner',
    label: 'Beginner Website',
    icon: 'homepage',
    description: 'Squarespace, Wix, Cargo, prompts',
  },
  {
    href: '/workshop/saturday-lab/vibe-coding',
    label: 'Vibe Coding',
    icon: 'code',
    description: 'CodePen, Replit, Cursor levels',
  },
  {
    href: '/workshop/saturday-lab/beginner',
    label: 'Full Beginner Packet',
    icon: 'sitemap',
    description: 'Longer guide with exercises',
  },
  {
    href: '/workshop/saturday-lab/vibe-coding',
    label: 'Full Vibe Packet',
    icon: 'prompt',
    description: 'Glossary, prompts, tool ladder',
  },
  {
    href: SATURDAY_LAB_STARTER_ZIP,
    label: 'Starter Template',
    icon: 'files',
    description: 'Download zip for Cursor / Replit',
    download: true,
  },
  {
    href: '/workshop/saturday-lab/resources',
    label: 'Links & Tutorials',
    icon: 'ai',
    description: 'YouTube, chapters, prompts library',
  },
  {
    href: '/workshop/saturday-lab/exit-ticket',
    label: 'Exit Ticket',
    icon: 'goal',
    description: 'What you made + what you need next',
  },
]

export function SaturdayLabHubQuickLinks() {
  return (
    <section className="space-y-4 2xl:space-y-6">
      <h2 className="sl-section-title text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Open from QR — start here
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-6">
        {LINKS.map((item) => {
          const className =
            'flex flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-center transition hover:border-neutral-400 hover:shadow-sm 2xl:gap-5 2xl:p-8'
          const inner = (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 2xl:h-auto 2xl:w-auto 2xl:rounded-2xl 2xl:p-2">
                <SaturdayLabIcon icon={item.icon} label={item.label} size={22} tripleOnWide />
              </span>
              <span>
                <span className="sl-quick-link-label block font-semibold text-neutral-950">{item.label}</span>
                <span className="sl-quick-link-desc mt-1 block text-sm text-neutral-600">{item.description}</span>
              </span>
            </>
          )
          if (item.download) {
            return (
              <a key={item.label} href={item.href} download className={className}>
                {inner}
              </a>
            )
          }
          return (
            <Link key={item.label} href={item.href} className={className}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
