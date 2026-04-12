'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface OrganizationLogoProps {
  organizationSlug: string;
  variant?: 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  alt?: string;
  priority?: boolean;
}

// Logo configuration for each organization
const LOGO_CONFIG = {
  oolite: {
    name: 'Oolite Arts',
    colors: {
      primary: '#00B4D8', // Cyan Blue
      secondary: '#FFFFFF', // White
      dark: '#000000', // Black
    },
    logos: {
      horizontal: {
        // Light UI: black logotype (visible on light nav). Dark UI: white logotype.
        light:
          'https://res.cloudinary.com/dkod1at3i/image/upload/v1775673996/Oolite-Arts_Logotype_B_Black_2019-01-29_llhyty.png',
        dark:
          'https://res.cloudinary.com/dkod1at3i/image/upload/v1775674004/Oolite-Arts_Logotype_B_White_2019-01-29_h25lgc.png',
        highContrast:
          'https://res.cloudinary.com/dkod1at3i/image/upload/v1775673996/Oolite-Arts_Logotype_B_Black_2019-01-29_llhyty.png',
      },
    },
  },
  bakehouse: {
    name: 'Bakehouse Arts Center',
    colors: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#D2691E', // Chocolate
      accent: '#F4A460', // Sandy Brown
    },
    logos: {
      horizontal: {
        light: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209450/smart-sign/orgs/bakehouse/bakehouse-logo-primary.png',
        dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/bakehouse/bakehouse-logo-white.png',
        highContrast: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/bakehouse/bakehouse-logo-dark.png',
      },
    },
  },
  madarts: {
    name: 'MadArts',
    colors: {
      primary: '#E91E63', // Pink
      secondary: '#C2185B', // Dark Pink
      accent: '#FF4081', // Light Pink
    },
    logos: {
      horizontal: {
        light: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
        dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055342/smart-sign/orgs/madarts/madarts-logo-white_cy1tt9.png',
        highContrast: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
      },
    },
  },
  // Add more organizations as needed
} as const;

// Size configurations
const SIZE_CONFIG = {
  sm: {
    width: 120,
    height: 40,
    className: 'h-8 w-auto',
  },
  md: {
    width: 180,
    height: 60,
    className: 'h-12 w-auto',
  },
  lg: {
    width: 240,
    height: 80,
    className: 'h-16 w-auto',
  },
  xl: {
    width: 300,
    height: 100,
    className: 'h-20 w-auto',
  },
} as const;

export const OrganizationLogo = memo(function OrganizationLogo({
  organizationSlug,
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  className,
  alt,
  priority = false,
}: OrganizationLogoProps) {
  const { resolvedTheme } = useTheme();
  const [imageError, setImageError] = React.useState(false);
  
  // Get organization config
  const orgConfig = LOGO_CONFIG[organizationSlug as keyof typeof LOGO_CONFIG];
  
  if (!orgConfig || imageError) {
    // Fallback to text if organization not found or image error
    return (
      <div className={cn(
        'flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300',
        SIZE_CONFIG[size].className,
        className
      )}>
        {orgConfig?.name || organizationSlug.toUpperCase()}
      </div>
    );
  }

  let logoVariant = orgConfig.logos[variant as keyof typeof orgConfig.logos];
  if (!logoVariant) {
    logoVariant = orgConfig.logos.horizontal;
  }
  if (!logoVariant) {
    return (
      <div className={cn(
        'flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300',
        SIZE_CONFIG[size].className,
        className
      )}>
        {orgConfig.name}
      </div>
    );
  }

  const effectiveTheme = theme === 'auto' ? resolvedTheme : theme;

  const logoSrc = effectiveTheme === 'dark' ? logoVariant.dark : logoVariant.light;

  const sizeConfig = SIZE_CONFIG[size];
  const altText = alt || `${orgConfig.name} logo`;

  return (
    <div className={cn('relative', className)}>
      <Image
        src={logoSrc}
        alt={altText}
        width={sizeConfig.width}
        height={sizeConfig.height}
        className={cn(
          'object-contain transition-opacity duration-200',
          sizeConfig.className
        )}
        priority={priority}
        sizes="(max-width: 768px) 120px, (max-width: 1024px) 180px, (max-width: 1280px) 240px, 300px"
        onError={() => setImageError(true)}
      />
    </div>
  );
});

// Utility function to get organization colors
export function getOrganizationColors(organizationSlug: string) {
  const orgConfig = LOGO_CONFIG[organizationSlug as keyof typeof LOGO_CONFIG];
  return orgConfig?.colors || {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    dark: '#374151',
  };
}

// Utility function to get organization name
export function getOrganizationName(organizationSlug: string) {
  const orgConfig = LOGO_CONFIG[organizationSlug as keyof typeof LOGO_CONFIG];
  return orgConfig?.name || organizationSlug;
}

// Export logo configuration for use in other components
export { LOGO_CONFIG };