'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

export function SohoFunnelThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className={cn(
        'soho-funnel-theme-toggle flex size-9 items-center justify-center rounded-full',
        'border border-[var(--soho-border-strong)] text-[var(--soho-text-muted)]',
        'transition hover:border-[var(--soho-accent-muted)] hover:text-[var(--soho-text)]',
        'hover:shadow-[0_0_20px_-6px_var(--soho-glow)]',
        className
      )}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Dark lounge' : 'Light editorial'}
    >
      {isLight ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
    </button>
  )
}
