'use client';

import React from 'react';
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
        light: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209450/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_Blue_2019-01-29_gwaje2.png',
        dark: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_White_2019-01-29_mq3bw6.png',
        highContrast: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_Black_2019-01-29_yx8zao.png',
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

export function OrganizationLogo({
  organizationSlug,
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  className,
  alt,
  priority = false,
}: OrganizationLogoProps) {
  const { theme: currentTheme } = useTheme();
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

  // Determine which logo variant to use
  const logoVariant = orgConfig.logos[variant as keyof typeof orgConfig.logos];
  if (!logoVariant) {
    // Fallback to horizontal if variant not available
    const fallbackVariant = orgConfig.logos.horizontal;
    if (!fallbackVariant) {
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
  }

  // Determine theme
  const effectiveTheme = theme === 'auto' ? currentTheme : theme;
  
  // Select appropriate logo based on theme
  let logoSrc: string;
  let logoSrcSet: string | undefined;
  
  if (effectiveTheme === 'dark') {
    logoSrc = logoVariant.dark;
  } else if (effectiveTheme === 'light') {
    logoSrc = logoVariant.light;
  } else {
    // System theme - use light as default, will be overridden by CSS
    logoSrc = logoVariant.light;
  }

  // Create srcSet for responsive images
  const baseUrl = logoSrc.split('/upload/')[0] + '/upload/';
  const imagePath = logoSrc.split('/upload/')[1];
  
  logoSrcSet = [
    `${baseUrl}w_120/${imagePath} 120w`,
    `${baseUrl}w_180/${imagePath} 180w`,
    `${baseUrl}w_240/${imagePath} 240w`,
    `${baseUrl}w_300/${imagePath} 300w`,
  ].join(', ');

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
          sizeConfig.className,
          // Theme-specific styling
          effectiveTheme === 'dark' ? 'dark:opacity-100 opacity-0' : 'opacity-100 dark:opacity-0'
        )}
        priority={priority}
        sizes="(max-width: 768px) 120px, (max-width: 1024px) 180px, (max-width: 1280px) 240px, 300px"
        onError={() => setImageError(true)}
        // Add a second image for dark theme if using auto theme
        {...(theme === 'auto' && {
          onLoad: (e) => {
            // Preload dark theme image
            if (typeof window !== 'undefined') {
              const darkImg = new window.Image();
              darkImg.src = logoVariant.dark;
            }
          }
        })}
      />
      
      {/* Dark theme image for auto theme */}
      {theme === 'auto' && (
        <Image
          src={logoVariant.dark}
          alt={altText}
          width={sizeConfig.width}
          height={sizeConfig.height}
          className={cn(
            'object-contain transition-opacity duration-200 absolute inset-0',
            sizeConfig.className,
            'opacity-0 dark:opacity-100'
          )}
          priority={priority}
          sizes="(max-width: 768px) 120px, (max-width: 1024px) 180px, (max-width: 1280px) 240px, 300px"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

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