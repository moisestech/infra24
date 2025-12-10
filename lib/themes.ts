// Theme management utilities for organization-specific theming

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: string;
  headingFont: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface OrganizationTheme {
  id: string;
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  customStyles?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Predefined theme templates
export const THEME_TEMPLATES: Record<string, Partial<OrganizationTheme>> = {
  'oolite': {
    name: 'Oolite Arts',
    colors: {
      primary: '#47abc4',
      secondary: '#2c5f6f',
      accent: '#6bb6c7',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1a202c',
      textSecondary: '#4a5568',
      border: '#e2e8f0',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#47abc4',
    },
    typography: {
      fontFamily: 'AtlasGrotesk, system-ui, sans-serif',
      headingFont: 'AtlasGrotesk, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: '0.5rem',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  'bakehouse': {
    name: 'Bakehouse Arts',
    colors: {
      primary: '#fbbf24',
      secondary: '#1e40af',
      accent: '#dc2626',
      background: '#ffffff',
      surface: '#fef3c7',
      text: '#1a202c',
      textSecondary: '#4a5568',
      border: '#e2e8f0',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#3b82f6',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: '0.5rem',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  'default': {
    name: 'Default Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1a202c',
      textSecondary: '#4a5568',
      border: '#e2e8f0',
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#3b82f6',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: '0.5rem',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
};

// Generate CSS custom properties from theme
export function generateThemeCSS(theme: OrganizationTheme): string {
  const css = `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-secondary: ${theme.colors.textSecondary};
      --color-border: ${theme.colors.border};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      --color-info: ${theme.colors.info};
      
      --font-family: ${theme.typography.fontFamily};
      --font-family-heading: ${theme.typography.headingFont};
      --font-size-xs: ${theme.typography.fontSize.xs};
      --font-size-sm: ${theme.typography.fontSize.sm};
      --font-size-base: ${theme.typography.fontSize.base};
      --font-size-lg: ${theme.typography.fontSize.lg};
      --font-size-xl: ${theme.typography.fontSize.xl};
      --font-size-2xl: ${theme.typography.fontSize['2xl']};
      --font-size-3xl: ${theme.typography.fontSize['3xl']};
      --font-size-4xl: ${theme.typography.fontSize['4xl']};
      
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      --spacing-2xl: ${theme.spacing['2xl']};
      --spacing-3xl: ${theme.spacing['3xl']};
      
      --border-radius: ${theme.borderRadius};
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
    }
  `;
  
  return css;
}

// Get theme for organization slug
export function getThemeForOrganization(slug: string): Partial<OrganizationTheme> {
  return THEME_TEMPLATES[slug] || THEME_TEMPLATES['default'];
}

// Validate color format
export function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Generate color variations
export function generateColorVariations(baseColor: string): Record<string, string> {
  // This is a simplified version - in a real app you'd use a color library
  return {
    '50': baseColor + '0D', // 5% opacity
    '100': baseColor + '1A', // 10% opacity
    '200': baseColor + '33', // 20% opacity
    '300': baseColor + '4D', // 30% opacity
    '400': baseColor + '66', // 40% opacity
    '500': baseColor, // base color
    '600': baseColor + '99', // 60% opacity
    '700': baseColor + 'B3', // 70% opacity
    '800': baseColor + 'CC', // 80% opacity
    '900': baseColor + 'E6', // 90% opacity
  };
}
