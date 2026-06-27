import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SaturdayLabIcon } from '@/components/workshop/SaturdayLabIcon'
import type { SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'

type OutputItem = { label: string; icon: SaturdayLabIconKey }

const BEGINNER_OUTPUTS: OutputItem[] = [
  { label: 'Sitemap', icon: 'sitemap' },
  { label: 'Homepage draft', icon: 'homepage' },
  { label: 'Artist bio', icon: 'about' },
  { label: 'Project page', icon: 'projects' },
  { label: 'Platform decision', icon: 'path' },
]

const VIBE_OUTPUTS: OutputItem[] = [
  { label: 'CodePen sketch', icon: 'code' },
  { label: 'Replit prototype', icon: 'test' },
  { label: 'Cursor starter edit', icon: 'files' },
  { label: 'Debugged code', icon: 'debug' },
  { label: 'Shareable link', icon: 'publish' },
]

function OutputList({ items, title }: { items: OutputItem[]; title: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
      <h3 className="font-semibold text-neutral-950">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-neutral-700">
            <SaturdayLabIcon icon={item.icon} label={item.label} size={18} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SaturdayLabOutputGoals() {
  return (
    <section className="space-y-3">
      <SaturdayLabBanner banner="outcomes" alt="Done by 1 PM — choose one workshop outcome" />
      <div className="grid gap-4 sm:grid-cols-2">
        <OutputList items={BEGINNER_OUTPUTS} title="Beginner" />
        <OutputList items={VIBE_OUTPUTS} title="Vibe Coding" />
      </div>
    </section>
  )
}
