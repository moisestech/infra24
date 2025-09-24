'use client';

import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';

interface ThemeBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemeBackground({ children, className = '' }: ThemeBackgroundProps) {
  const { theme } = useOrganizationTheme();

  const getBackgroundStyle = () => {
    if (!theme) {
      // Default gradient if no theme
      return {
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
      };
    }

    // Create theme-aware gradient using organization colors
    const primaryColor = theme.colors.primary;
    const secondaryColor = theme.colors.secondary;
    const accentColor = theme.colors.accent;
    const backgroundColor = theme.colors.background;

    // Convert hex to rgba for opacity
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.05)} 0%, ${backgroundColor} 50%, ${hexToRgba(accentColor, 0.05)} 100%)`,
    };
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${className}`}
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  );
}
