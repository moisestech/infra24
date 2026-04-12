'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ThemePref = 'light' | 'dark' | 'system';

export function MarketingThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycle = () => {
    const order: ThemePref[] = ['light', 'dark', 'system'];
    const i = order.indexOf(theme as ThemePref);
    setTheme(order[(i + 1) % 3]);
  };

  const Icon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;
  const label =
    theme === 'system'
      ? `Theme: System (using ${resolvedTheme})`
      : theme === 'dark'
        ? 'Theme: Dark'
        : 'Theme: Light';

  return (
    <button
      type="button"
      onClick={cycle}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--cdc-border)] bg-white/90 text-neutral-800 shadow-sm transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)] focus-visible:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white',
        className
      )}
    >
      <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
    </button>
  );
}
