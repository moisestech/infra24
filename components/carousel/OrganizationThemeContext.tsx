'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrganizationTheme {
  dateTextColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundPattern?: string;
  customStyles?: Record<string, any>;
}

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
      // Load organization-specific theme
      const loadTheme = async () => {
        try {
          // This would typically fetch from an API or database
          // For now, we'll use hardcoded themes
          const themes: Record<string, OrganizationTheme> = {
            'bakehouse': {
              dateTextColor: '#fbbf24',
              primaryColor: '#fbbf24',
              secondaryColor: '#1e40af',
              accentColor: '#dc2626',
              backgroundPattern: 'bright-yellow',
              customStyles: {
                attention_artists: {
                  primary: 'rgba(30, 64, 175, 0.08)',
                  background: 'rgba(251, 191, 36, 0.12)'
                },
                attention_public: {
                  primary: 'rgba(220, 38, 38, 0.08)',
                  background: 'rgba(251, 191, 36, 0.12)'
                },
                fun_fact: {
                  primary: 'rgba(251, 191, 36, 0.12)',
                  background: 'rgba(251, 191, 36, 0.15)'
                }
              }
            },
            'primary-colors': {
              dateTextColor: '#ffffff',
              primaryColor: '#ffffff',
              secondaryColor: '#ef4444',
              accentColor: '#3b82f6',
              backgroundPattern: 'white-primary',
              customStyles: {
                event: {
                  primary: 'rgba(255, 255, 255, 0.95)',
                  background: 'rgba(255, 255, 255, 0.98)'
                }
              }
            }
          };

          const orgTheme = themes[organizationSlug] || null;
          setTheme(orgTheme);
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
