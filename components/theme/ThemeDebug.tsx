'use client';

import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';

export function ThemeDebug() {
  const { theme, organizationSlug } = useOrganizationTheme();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <div className="space-y-1">
        <div><strong>Slug:</strong> {organizationSlug || 'none'}</div>
        <div><strong>Theme:</strong> {theme ? 'loaded' : 'not loaded'}</div>
        {theme && (
          <>
            <div><strong>Primary:</strong> {theme.colors.primary}</div>
            <div><strong>Name:</strong> {theme.name}</div>
          </>
        )}
      </div>
    </div>
  );
}
