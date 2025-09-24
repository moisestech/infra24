'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import { cn } from '@/lib/utils';

interface ThemeButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
}

export function ThemeButton({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: ThemeButtonProps) {
  const { theme } = useOrganizationTheme();

  const getThemeStyles = () => {
    if (!theme) return {};

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.background,
          borderColor: theme.colors.secondary,
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent,
          color: theme.colors.background,
          borderColor: theme.colors.accent,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <Button
      className={cn(
        'transition-colors duration-200',
        className
      )}
      style={themeStyles}
      {...props}
    >
      {children}
    </Button>
  );
}
