import Link from 'next/link'
import {
  BookOpen,
  Download,
  LayoutTemplate,
  Link2,
  Map,
  Sparkles,
  ClipboardList,
} from 'lucide-react'
import { SATURDAY_LAB_FACILITATOR_HREF, SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'

const LINKS = [
  { href: '/workshop/saturday-lab', label: 'Start Here', icon: Map, description: 'Choose your output by 1 PM' },
  {
    href: '/workshop/saturday-lab/beginner',
    label: 'Beginner Website',
    icon: LayoutTemplate,
    description: 'Squarespace, Wix, Cargo, prompts',
  },
  {
    href: '/workshop/saturday-lab/vibe-coding',
    label: 'Vibe Coding',
    icon: Sparkles,
    description: 'CodePen, Replit, Cursor levels',
  },
  {
    href: '/workshop/saturday-lab/beginner',
    label: 'Full Beginner Packet',
    icon: BookOpen,
    description: 'Longer guide with exercises',
  },
  {
    href: '/workshop/saturday-lab/vibe-coding',
    label: 'Full Vibe Packet',
    icon: BookOpen,
    description: 'Glossary, prompts, tool ladder',
  },
  {
    href: SATURDAY_LAB_STARTER_ZIP,
    label: 'Starter Template',
    icon: Download,
    description: 'Download zip for Cursor / Replit',
    download: true,
  },
  {
    href: '/workshop/saturday-lab/resources',
    label: 'Links & Tutorials',
    icon: Link2,
    description: 'YouTube, chapters, prompts library',
  },
  {
    href: '/workshop/saturday-lab/exit-ticket',
    label: 'Exit Ticket',
    icon: ClipboardList,
    description: 'What you made + what you need next',
  },
] as const

export function SaturdayLabHubQuickLinks() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Open from QR — start here
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((item) => {
          const Icon = item.icon
          const className =
            'flex gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm'
          const inner = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                <Icon className="h-5 w-5 text-neutral-700" aria-hidden />
              </span>
              <span>
                <span className="font-semibold text-neutral-950">{item.label}</span>
                <span className="mt-0.5 block text-sm text-neutral-600">{item.description}</span>
              </span>
            </>
          )
          if ('download' in item && item.download) {
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
      <p className="text-xs text-neutral-500">
        Facilitators:{' '}
        <Link href={SATURDAY_LAB_FACILITATOR_HREF} className="underline">
          Run of show
        </Link>
      </p>
    </section>
  )
}
