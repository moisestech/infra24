'use client'

import { cn } from '@/lib/utils'

export type MobileTabId = 'ask' | 'recommend' | 'itinerary' | 'map' | 'saved'

const NAV: { id: MobileTabId; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'recommend', label: 'Recommend' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'map', label: 'Map' },
  { id: 'saved', label: 'Saved' },
]

type MobileBottomNavProps = {
  active: MobileTabId
  onChange: (t: MobileTabId) => void
}

export function MobileBottomNav({ active, onChange }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#05070A]/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg justify-between px-1 py-2">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onChange(n.id)}
            className={cn(
              'flex-1 px-1 py-2 text-[10px] font-semibold uppercase tracking-wide',
              active === n.id ? 'text-teal-300' : 'text-zinc-500'
            )}
          >
            {n.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
