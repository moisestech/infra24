'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { OrganizationThemeProvider } from '@/components/carousel/OrganizationThemeContext';

function orgSlugFromPathname(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'o' || !parts[1]) return null;
  return parts[1];
}

/**
 * All `/o/:org/...` routes (including static segments like `oolite/`) get org theme.
 * Forces `<html>` to `light` while mounted so Tailwind `dark:` matches org list pages to smart-sign.
 */
export default function OrgSegmentThemeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = orgSlugFromPathname(pathname);
  const previousRootClass = useRef<'light' | 'dark' | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    const hadLight = root.classList.contains('light');
    previousRootClass.current = hadDark ? 'dark' : hadLight ? 'light' : null;
    root.classList.remove('dark', 'light');
    root.classList.add('light');
    return () => {
      root.classList.remove('light', 'dark');
      const prev = previousRootClass.current;
      if (prev) root.classList.add(prev);
    };
  }, []);

  return (
    <OrganizationThemeProvider key={slug ?? 'none'} initialSlug={slug ?? undefined}>
      {children}
    </OrganizationThemeProvider>
  );
}
