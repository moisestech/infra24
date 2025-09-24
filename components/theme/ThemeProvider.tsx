'use client';

import { useEffect } from 'react';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import { generateThemeCSS } from '@/lib/themes';

export function ThemeProvider() {
  const { theme } = useOrganizationTheme();

  useEffect(() => {
    if (theme) {
      // Generate CSS custom properties from theme
      const css = generateThemeCSS(theme);
      
      // Create or update style element
      let styleElement = document.getElementById('organization-theme');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'organization-theme';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = css;
    } else {
      // Remove theme styles if no theme is set
      const styleElement = document.getElementById('organization-theme');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [theme]);

  return null; // This component doesn't render anything
}
