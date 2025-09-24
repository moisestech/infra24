'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import { cn } from '@/lib/utils';

interface ThemeCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'surface' | 'accent';
}

export function ThemeCard({ 
  children, 
  className, 
  title, 
  description, 
  variant = 'default' 
}: ThemeCardProps) {
  const { theme } = useOrganizationTheme();

  const getThemeStyles = () => {
    if (!theme) return {};

    switch (variant) {
      case 'surface':
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent + '10', // 10% opacity
          borderColor: theme.colors.accent + '30', // 30% opacity
        };
      default:
        return {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <Card
      className={cn(
        'transition-colors duration-200',
        className
      )}
      style={themeStyles}
    >
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle 
              style={{ color: theme?.colors.text }}
              className="transition-colors duration-200"
            >
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription 
              style={{ color: theme?.colors.textSecondary }}
              className="transition-colors duration-200"
            >
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent 
        style={{ color: theme?.colors.text }}
        className="transition-colors duration-200"
      >
        {children}
      </CardContent>
    </Card>
  );
}
