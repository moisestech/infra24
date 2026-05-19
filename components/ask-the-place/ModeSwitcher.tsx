import type { AtpMode } from '@/lib/ask-the-place/types'
import { cn } from '@/lib/utils'

const MODES: { id: AtpMode; label: string; hint: string }[] = [
  { id: 'public', label: 'Public', hint: 'Guest / visitor' },
  { id: 'staff', label: 'Staff', hint: 'Concierge / ops' },
  { id: 'leadership', label: 'Leadership', hint: 'Insights / ROI' },
]

type ModeSwitcherProps = {
  value: AtpMode
  onChange: (m: AtpMode) => void
}

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Mode</p>
      <div className="flex rounded-lg border border-white/10 bg-[#0B1118] p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              'flex-1 rounded-md px-2 py-2 text-center text-xs font-medium transition-colors',
              value === m.id
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-zinc-500 hover:text-zinc-200'
            )}
          >
            <span className="block">{m.label}</span>
            <span className="mt-0.5 hidden text-[10px] font-normal text-zinc-500 sm:block">{m.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
