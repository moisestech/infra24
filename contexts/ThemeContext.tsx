'use client';

/**
 * App theme: `theme` is the stored user preference (light | dark | system).
 * For UI styling (colors, gradients), use `resolvedTheme` so "system" matches `document.documentElement` / Tailwind `dark:`.
 * Use `theme` only when reflecting the explicit choice (e.g. highlighting "System" in settings).
 *
 * A matching blocking script in `app/layout.tsx` paints `html.light` / `html.dark` before React
 * hydrates so marketing pages do not flash the wrong surface.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyResolvedToDocument(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme();
    const resolved = resolveTheme(initial);
    setTheme(initial);
    setResolvedTheme(resolved);
    applyResolvedToDocument(resolved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyResolvedToDocument(resolved);
    localStorage.setItem('theme', theme);
  }, [theme, hydrated]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme !== 'system') return;
      const resolved = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyResolvedToDocument(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
