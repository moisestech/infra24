import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/** Semantic surface tokens — pair with `.memory-agent-theme` in globals.css */
export const ma = {
  themeRoot: 'memory-agent-theme min-h-screen text-[var(--ma-text)]',
  subheading: 'text-xs font-medium uppercase tracking-wide text-[var(--ma-text-muted)]',
  heading: 'text-2xl font-semibold tracking-tight text-[var(--ma-text)] md:text-3xl',
  label: 'text-xs font-medium text-[var(--ma-text-muted)]',
  body: 'text-sm text-[var(--ma-text)]',
  bodyMuted: 'text-sm text-[var(--ma-text-muted)]',
  caption: 'text-xs text-[var(--ma-text-muted)]',
  finePrint: 'text-[10px] text-[var(--ma-text-faint)]',
  card: cn(
    'rounded-lg border border-[var(--ma-border-strong)]',
    'bg-[var(--ma-surface)] text-[var(--ma-text)] shadow-sm'
  ),
  cardTinted: cn(
    'rounded-lg border border-[var(--ma-border-strong)]',
    'bg-[var(--ma-card-tint)] text-[var(--ma-text)] shadow-sm'
  ),
  cardInset: cn(
    'rounded-md border border-[var(--ma-border)]',
    'bg-[var(--ma-surface-muted)]'
  ),
  footer: cn(
    'fixed bottom-0 left-0 right-0 border-t border-[var(--ma-border)]',
    'bg-[var(--ma-footer-bg)] p-3 backdrop-blur md:p-4'
  ),
  /** Hero frequency + orb + status — sticks under site nav while chat scrolls */
  vizDock: cn(
    'sticky top-16 z-30 -mx-4 space-y-3 px-4 pb-3 pt-1',
    'border-b border-[var(--ma-border)]',
    'bg-[color-mix(in_srgb,var(--ma-surface)_94%,transparent)]',
    'shadow-[0_10px_28px_-14px_color-mix(in_srgb,var(--ma-text)_18%,transparent)]',
    'backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--ma-surface)_88%,transparent)]'
  ),
  input: cn(
    'ma-ask-input flex-1 border-2',
    'focus-visible:ring-2 focus-visible:ring-[color:var(--ma-primary)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ma-footer-bg)]'
  ),
  selectTrigger: cn(
    'h-10 w-full border-2 border-[var(--ma-input-border)]',
    'bg-[var(--ma-input-bg)] text-[var(--ma-text)] font-medium shadow-sm',
    'hover:bg-[var(--ma-surface-muted)]',
    'focus:ring-2 focus:ring-[color:var(--ma-primary)] focus:ring-offset-2',
    'focus:ring-offset-[var(--ma-surface)]',
    '[&>span]:text-[var(--ma-text)]'
  ),
  selectContent: cn(
    'border-2 border-[var(--ma-input-border)]',
    'bg-[var(--ma-surface)] text-[var(--ma-text)] shadow-lg'
  ),
  selectItem: cn(
    'focus:bg-[color:color-mix(in_srgb,var(--ma-primary)_16%,var(--ma-surface))]',
    'focus:text-[var(--ma-text)]'
  ),
  btnPrimary:
    'gap-1 bg-[color:var(--ma-primary)] text-white hover:bg-[color:var(--ma-secondary)]',
  btnOutline: cn(
    'border-2 border-[var(--ma-input-border)] bg-[var(--ma-surface)]',
    'text-[var(--ma-text)] hover:bg-[var(--ma-surface-muted)]'
  ),
  link: 'text-[color:var(--ma-primary)] hover:underline',
  alertAmber: cn(
    'border-amber-300 bg-amber-50 text-amber-950',
    'dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-50'
  ),
  alertAmberCode: 'rounded bg-[var(--ma-code-bg)] px-1 text-[var(--ma-text)]',
  chip: cn(
    'rounded-full border border-[var(--ma-border)] bg-[var(--ma-surface)]',
    'px-3 py-2 text-left text-xs text-[var(--ma-text)]',
    'hover:border-[color:color-mix(in_srgb,var(--ma-primary)_45%,var(--ma-border))]',
    'hover:bg-[color:color-mix(in_srgb,var(--ma-primary)_10%,var(--ma-surface))]',
    'md:text-sm'
  ),
  resultCard: cn(
    'h-full overflow-hidden transition-[transform,box-shadow,border-color] duration-300',
    'hover:-translate-y-0.5',
    'hover:border-[color:color-mix(in_srgb,var(--ma-primary)_50%,var(--ma-border-strong))]',
    'hover:shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--ma-primary)_45%,transparent)]'
  ),
  userBubble: cn(
    'max-w-[92%] sm:max-w-[85%]',
    'border-[color:color-mix(in_srgb,var(--ma-primary)_55%,var(--ma-border))]',
    'bg-[color-mix(in_srgb,var(--ma-primary)_16%,var(--ma-surface))]',
    'shadow-[0_2px_12px_-4px_color-mix(in_srgb,var(--ma-primary)_35%,transparent)]'
  ),
  assistantBubble: cn(
    'max-w-full border-[var(--ma-border-strong)]',
    'bg-[var(--ma-surface-muted)]',
    'shadow-sm'
  ),
  messageRoleYou:
    'mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--ma-primary)]',
  messageRoleAgent:
    'mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ma-text-muted)]',
  details: cn(
    'rounded-xl border border-[var(--ma-border-strong)]',
    'bg-[var(--ma-surface-muted)] p-4 text-sm text-[var(--ma-text-muted)]'
  ),
} as const

export function buildMemoryAgentBrandVars(args: {
  primary: string
  secondary: string
  accent: string
  surface?: string
}): CSSProperties {
  const { primary, secondary, accent, surface } = args
  const pageBgLight = surface
    ? `linear-gradient(180deg, ${surface} 0%, color-mix(in srgb, ${primary} 10%, white) 38%, rgb(250 250 249) 100%)`
    : `linear-gradient(180deg, color-mix(in srgb, ${primary} 12%, white) 0%, rgb(250 250 249) 42%, rgb(244 244 245) 100%)`
  const pageBgDark = surface
    ? `linear-gradient(180deg, color-mix(in srgb, ${surface} 22%, #09090b) 0%, color-mix(in srgb, ${primary} 20%, #18181b) 40%, #09090b 100%)`
    : `linear-gradient(180deg, color-mix(in srgb, ${primary} 22%, #18181b) 0%, #09090b 50%, #09090b 100%)`

  return {
    '--ma-primary': primary,
    '--ma-secondary': secondary,
    '--ma-accent': accent,
    '--ma-page-bg': pageBgLight,
    '--ma-page-bg-dark': pageBgDark,
  } as CSSProperties
}
