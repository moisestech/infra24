'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getOrganizationFont, getOrgSlugFromPath } from '@/lib/organization-fonts';

function stripOrgBodyClasses() {
  if (typeof document === 'undefined') return;
  for (const c of [...document.body.classList]) {
    if (c.startsWith('org-')) document.body.classList.remove(c);
  }
}

/**
 * OrganizationFontProvider
 *
 * Applies org fonts from `/o/{slug}` paths. Uses `classList` only so we never
 * overwrite React-managed `body.className` (Inter from root layout) — assigning
 * `document.body.className` directly can strip classes and break navigation/hydration.
 */
export function OrganizationFontProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const orgSlug = getOrgSlugFromPath(pathname);
    const fontConfig = getOrganizationFont(orgSlug);

    const root = document.documentElement;
    root.style.setProperty('--font-organization', fontConfig.fontFamily);
    root.style.setProperty('--font-organization-heading', fontConfig.headingFont || fontConfig.fontFamily);
    root.style.setProperty('--font-organization-body', fontConfig.bodyFont || fontConfig.fontFamily);

    stripOrgBodyClasses();

    if (orgSlug) {
      document.body.classList.add(`org-${orgSlug}`);
      document.body.style.fontFamily = fontConfig.fontFamily;
    } else {
      document.body.style.fontFamily = '';
    }

    return () => {
      stripOrgBodyClasses();
      document.body.style.fontFamily = '';
    };
  }, [pathname]);

  return <>{children}</>;
}
