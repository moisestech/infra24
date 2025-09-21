# Infra24 Design System

This document outlines the design system for Infra24, including organization branding, logos, and UI components.

## Organization Branding

### Oolite Arts

**Primary Colors:**
- Cyan Blue: `#00B4D8` (Primary brand color)
- White: `#FFFFFF` (Light theme)
- Black: `#000000` (Dark theme)

**Logo Assets:**

#### Horizontal Logos
- **Cyan Blue Horizontal**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209450/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_Blue_2019-01-29_gwaje2.png`
- **White Horizontal**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_White_2019-01-29_mq3bw6.png`
- **Black Horizontal**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/oolite/Oolite-Arts_Logotype_B_Black_2019-01-29_yx8zao.png`

**Usage Guidelines:**
- Use Cyan Blue logo on light backgrounds
- Use White logo on dark backgrounds
- Use Black logo for high contrast situations
- Maintain aspect ratio and minimum size requirements

### Bakehouse Arts Center

**Primary Colors:**
- Primary: `#8B4513` (Saddle Brown)
- Secondary: `#D2691E` (Chocolate)
- Accent: `#F4A460` (Sandy Brown)

**Logo Assets:**
- **Primary Logo**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209450/smart-sign/orgs/bakehouse/bakehouse-logo-primary.png`
- **White Logo**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/bakehouse/bakehouse-logo-white.png`
- **Dark Logo**: `https://res.cloudinary.com/dck5rzi4h/image/upload/v1758209446/smart-sign/orgs/bakehouse/bakehouse-logo-dark.png`

## Logo Component Usage

### OrganizationLogo Component

```tsx
import { OrganizationLogo } from '@/components/ui/OrganizationLogo';

// Basic usage
<OrganizationLogo 
  organizationSlug="oolite" 
  variant="horizontal" 
  size="md" 
/>

// With custom theme override
<OrganizationLogo 
  organizationSlug="bakehouse" 
  variant="horizontal" 
  size="lg"
  theme="dark"
/>
```

### Props

- `organizationSlug`: The organization's slug (e.g., "oolite", "bakehouse")
- `variant`: Logo variant ("horizontal", "vertical", "icon")
- `size`: Size preset ("sm", "md", "lg", "xl")
- `theme`: Theme override ("light", "dark", "auto")
- `className`: Additional CSS classes

## Theme Integration

The logo component automatically adapts to the current theme:

- **Light Theme**: Uses dark/colored logos
- **Dark Theme**: Uses white/light logos
- **System Theme**: Follows user's system preference

## Responsive Design

Logo sizes are optimized for different screen sizes:

- **Mobile**: 120px width maximum
- **Tablet**: 180px width maximum  
- **Desktop**: 240px width maximum
- **Large Desktop**: 300px width maximum

## Accessibility

- All logos include proper alt text
- High contrast ratios maintained
- Scalable vector graphics where possible
- Screen reader friendly

## File Organization

```
public/
  logos/
    oolite/
      horizontal-blue.png
      horizontal-white.png
      horizontal-black.png
    bakehouse/
      horizontal-primary.png
      horizontal-white.png
      horizontal-dark.png
```

## Cloudinary Integration

All logos are stored in Cloudinary for:
- Automatic optimization
- Responsive delivery
- CDN performance
- Format conversion (WebP, AVIF)

## Brand Guidelines

### Oolite Arts
- Maintain the cyan blue as primary brand color
- Use clean, modern typography
- Emphasize digital arts and technology
- Professional yet approachable tone

### Bakehouse Arts Center
- Warm, community-focused aesthetic
- Traditional arts with modern approach
- Emphasize local community and creativity
- Welcoming and inclusive tone

## Implementation Notes

1. **Performance**: Logos are lazy-loaded and optimized
2. **Caching**: Cloudinary provides automatic caching
3. **Fallbacks**: Graceful fallback to text if images fail
4. **SEO**: Proper alt text and structured data
5. **Analytics**: Logo interaction tracking available

## Future Organizations

When adding new organizations:

1. Create logo assets in multiple variants
2. Upload to Cloudinary with consistent naming
3. Add to design system documentation
4. Update OrganizationLogo component
5. Test across all themes and screen sizes

## Contact

For design system questions or updates, contact the development team.

