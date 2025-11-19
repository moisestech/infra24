/**
 * Organization-specific font configuration
 * Maps organization slugs to their preferred font families
 */

export interface OrganizationFontConfig {
  fontFamily: string;
  headingFont?: string;
  bodyFont?: string;
}

/**
 * Font configurations for different organizations
 */
export const ORGANIZATION_FONTS: Record<string, OrganizationFontConfig> = {
  oolite: {
    fontFamily: 'AtlasGrotesk, system-ui, sans-serif',
    headingFont: 'AtlasGrotesk, system-ui, sans-serif',
    bodyFont: 'AtlasGrotesk, system-ui, sans-serif',
  },
  // Add more organizations as needed
  // bakehouse: {
  //   fontFamily: 'Inter, system-ui, sans-serif',
  //   headingFont: 'Inter, system-ui, sans-serif',
  //   bodyFont: 'Inter, system-ui, sans-serif',
  // },
};

/**
 * Get font configuration for an organization by slug
 * @param orgSlug - Organization slug (e.g., 'oolite', 'bakehouse')
 * @returns Font configuration or default Inter font
 */
export function getOrganizationFont(orgSlug?: string | null): OrganizationFontConfig {
  if (!orgSlug) {
    return {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
    };
  }

  return ORGANIZATION_FONTS[orgSlug] || {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
  };
}

/**
 * Extract organization slug from pathname
 * @param pathname - Current pathname (e.g., '/o/oolite/announcements')
 * @returns Organization slug or null
 */
export function getOrgSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/o\/([^/]+)/);
  return match ? match[1] : null;
}

