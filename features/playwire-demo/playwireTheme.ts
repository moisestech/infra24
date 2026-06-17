/** Playwire-branded tokens for the publisher demo section (scoped via data-theme="playwire"). */
export const pw = {
  wrapper:
    'rounded-2xl border border-[#1a2b4a]/10 bg-gradient-to-b from-[#f8f9fc] to-white dark:from-[#0f1729] dark:to-[#0a1020] dark:border-[#2d4a7c]/30',
  accent: 'text-[#e85d4c] dark:text-[#ff7a6b]',
  accentBg: 'bg-[#e85d4c] hover:bg-[#d14a3a] text-white',
  accentMuted: 'bg-[#e85d4c]/10 text-[#c94a3a] dark:bg-[#e85d4c]/15 dark:text-[#ff9a8f]',
  navy: 'text-[#1a2b4a] dark:text-[#e8edf5]',
  navyMuted: 'text-[#4a5f7f] dark:text-[#94a3b8]',
  card: 'rounded-xl border border-[#1a2b4a]/8 bg-white shadow-sm dark:border-[#2d4a7c]/25 dark:bg-[#141e33]',
  cardActive: 'ring-2 ring-[#e85d4c]/50 border-[#e85d4c]/30',
  stepActive: 'bg-[#e85d4c] text-white',
  stepDone: 'bg-[#1a2b4a] text-white dark:bg-[#2d4a7c]',
  stepIdle: 'bg-[#e8edf5] text-[#4a5f7f] dark:bg-[#1e2d4a] dark:text-[#94a3b8]',
  metricValue: 'text-2xl font-bold tabular-nums text-[#1a2b4a] dark:text-[#f1f5f9] sm:text-3xl',
  metricLabel: 'text-xs font-medium uppercase tracking-wide text-[#4a5f7f] dark:text-[#94a3b8]',
  badge: 'inline-flex items-center rounded-full bg-[#1a2b4a] px-2.5 py-0.5 text-xs font-medium text-white dark:bg-[#2d4a7c]',
  disclaimer:
    'text-xs leading-relaxed text-[#4a5f7f] dark:text-[#64748b] italic border-t border-[#1a2b4a]/8 dark:border-[#2d4a7c]/25 pt-4 mt-6',
} as const;
