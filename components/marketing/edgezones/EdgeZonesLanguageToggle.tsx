'use client'

import { cn } from '@/lib/utils'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'
import type { EdgeZonesLocale } from '@/lib/marketing/edgezones/edgezones-locale'

const OPTIONS: { id: EdgeZonesLocale; label: string; aria: string }[] = [
  { id: 'en', label: 'EN', aria: 'English' },
  { id: 'es', label: 'ES', aria: 'Español' },
]

export function EdgeZonesLanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useEdgeZonesLocale()

  return (
    <div className={cn('ez-lang-toggle shrink-0', className)} role="group" aria-label="Language">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cn('ez-lang-btn', locale === option.id && 'ez-lang-btn-active')}
          aria-label={option.aria}
          aria-pressed={locale === option.id}
          onClick={() => setLocale(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
