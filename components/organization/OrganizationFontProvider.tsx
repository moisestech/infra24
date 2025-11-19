'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getOrganizationFont, getOrgSlugFromPath } from '@/lib/organization-fonts';

/**
 * OrganizationFontProvider
 * 
 * Dynamically applies organization-specific fonts based on the URL path.
 * Detects organization slug from paths like /o/oolite and applies the
 * corresponding font family to the document.
 */
export function OrganizationFontProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const orgSlug = getOrgSlugFromPath(pathname);
    const fontConfig = getOrganizationFont(orgSlug);

    // Apply font family to document root as CSS variables
    const root = document.documentElement;
    root.style.setProperty('--font-organization', fontConfig.fontFamily);
    root.style.setProperty('--font-organization-heading', fontConfig.headingFont || fontConfig.fontFamily);
    root.style.setProperty('--font-organization-body', fontConfig.bodyFont || fontConfig.fontFamily);

    // Apply font class and inline style to body for organization pages
    if (orgSlug) {
      // Remove any existing org classes first
      document.body.className = document.body.className.replace(/org-\w+/g, '').trim();
      // Add the new org class
      document.body.classList.add(`org-${orgSlug}`);
      // Apply font family directly to body (this will override the Inter class)
      document.body.style.fontFamily = fontConfig.fontFamily;
    } else {
      // Remove org classes and reset font if not on org page
      document.body.className = document.body.className.replace(/org-\w+/g, '').trim();
      document.body.style.fontFamily = '';
    }

    return () => {
      // Cleanup: remove org class and reset font when component unmounts or pathname changes
      document.body.className = document.body.className.replace(/org-\w+/g, '').trim();
      if (!getOrgSlugFromPath(pathname)) {
        document.body.style.fontFamily = '';
      }
    };
  }, [pathname]);

  return <>{children}</>;
}

