'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrganizationTheme } from '@/lib/themes';

interface OrganizationThemeContextType {
  theme: OrganizationTheme | null;
  setTheme: (theme: OrganizationTheme | null) => void;
  organizationSlug: string | null;
  setOrganizationSlug: (slug: string | null) => void;
}

const OrganizationThemeContext = createContext<OrganizationThemeContextType | undefined>(undefined);

interface OrganizationThemeProviderProps {
  children: ReactNode;
  initialSlug?: string;
  initialTheme?: OrganizationTheme;
}

export function OrganizationThemeProvider({ 
  children, 
  initialSlug, 
  initialTheme 
}: OrganizationThemeProviderProps) {
  const [theme, setTheme] = useState<OrganizationTheme | null>(initialTheme || null);
  const [organizationSlug, setOrganizationSlug] = useState<string | null>(initialSlug || null);

  // Load theme based on organization slug
  useEffect(() => {
    if (organizationSlug) {
      // Load organization-specific theme from API
      const loadTheme = async () => {
        try {
          const response = await fetch(`/api/organizations/by-slug/${organizationSlug}/theme`);
          if (response.ok) {
            const data = await response.json();
            setTheme(data.theme);
          } else {
            console.error('Failed to load organization theme:', response.statusText);
            setTheme(null);
          }
        } catch (error) {
          console.error('Failed to load organization theme:', error);
          setTheme(null);
        }
      };

      loadTheme();
    } else {
      setTheme(null);
    }
  }, [organizationSlug]);

  return (
    <OrganizationThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        organizationSlug, 
        setOrganizationSlug 
      }}
    >
      {children}
    </OrganizationThemeContext.Provider>
  );
}

export function useOrganizationTheme() {
  const context = useContext(OrganizationThemeContext);
  if (context === undefined) {
    throw new Error('useOrganizationTheme must be used within an OrganizationThemeProvider');
  }
  return context;
}
