# Organization Themes Reference

## Overview

The Smart Sign platform supports multiple organization-specific themes, each designed to reflect the unique character and brand identity of different art collectives and organizations. This document provides a comprehensive reference for all available themes.

## Available Themes

### 1. Bakehouse Art Complex - Primary Yellow Palette

**Theme**: Primary Yellow Palette  
**Base Color**: Primary Yellow (`#FFC107`)  
**Philosophy**: Warm, energetic, brand-consistent yellow family

#### Color Variations
- **Primary Yellow** (`#FFC107`) - Base brand color
- **Light Yellow** (`#FFD54F`) - Secondary elements
- **Bright Yellow** (`#FFEB3B`) - Highlights and fun facts
- **Orange-Yellow** (`#FF9800`) - Attention-grabbing announcements
- **Amber-Yellow** (`#FFAB00`) - Promotional content
- **Deep Orange-Yellow** (`#FF6F00`) - Special events and galas

#### Custom Announcement Types
- `attention_artists` - Primary yellow theme
- `attention_public` - Orange-yellow theme
- `fun_fact` - Bright yellow theme
- `promotion` - Amber-yellow theme
- `gala_announcement` - Deep orange-yellow theme

**Test URL**: `http://localhost:3000/o/bakehouse/announcements/carousel`

---

### 2. Primary Colors Art Collective - Clean White Theme

**Theme**: Clean White with Primary Colors  
**Base Color**: Pure White (`#FFFFFF`)  
**Philosophy**: Minimalist design with strong color contrast

#### Color Scheme
- **Background**: Pure white (`rgba(255, 255, 255, 0.98)`)
- **Patterns**: Red, blue, yellow patterns on white backgrounds
- **Focus**: Minimalist design with strong color contrast

**Test URL**: `http://localhost:3000/o/primary-colors/announcements/carousel`

---

### 3. Midnight Gallery - Dark Purple and Blue Theme

**Theme**: Dark Purple and Blue Tones  
**Base Color**: Midnight Blue (`#191970`)  
**Philosophy**: Sophisticated, mysterious, gallery-focused

#### Color Variations
- **Indigo** (`#4B0082`) - Primary pattern color
- **Blue Violet** (`#8A2BE2`) - Secondary elements
- **Dark Slate Blue** (`#483D8B`) - Accent colors
- **Midnight Blue** (`#191970`) - Background base

#### Announcement Type Colors
- **Event**: Indigo background with blue violet patterns
- **Opportunity**: Dark slate blue with indigo patterns
- **Urgent**: Blue violet with enhanced visibility
- **Facility**: Midnight blue with dark slate blue patterns
- **Administrative**: Dark slate blue with subtle patterns

**Test URL**: `http://localhost:3000/o/midnight-gallery/announcements/carousel`

---

### 4. Sunset Studios - Warm Orange and Red Theme

**Theme**: Warm Orange and Red Tones  
**Base Color**: Tomato (`#FF6347`)  
**Philosophy**: Warm, creative, studio-focused

#### Color Variations
- **Red Orange** (`#FF4500`) - Primary pattern color
- **Dark Orange** (`#FF8C00`) - Secondary elements
- **Orange** (`#FFA500`) - Accent colors
- **Tomato** (`#FF6347`) - Background base

#### Announcement Type Colors
- **Event**: Red orange background with strong patterns
- **Opportunity**: Dark orange with red orange patterns
- **Urgent**: Orange with enhanced visibility
- **Facility**: Tomato with dark orange patterns
- **Administrative**: Dark orange with subtle patterns

**Test URL**: `http://localhost:3000/o/sunset-studios/announcements/carousel`

---

### 5. Ocean Workshop - Cool Blue and Teal Theme

**Theme**: Cool Blue and Teal Tones  
**Base Color**: Teal (`#008080`)  
**Philosophy**: Marine-inspired, environmental, flowing

#### Color Variations
- **Deep Sky Blue** (`#00BFFF`) - Primary pattern color
- **Dark Turquoise** (`#00CED1`) - Secondary elements
- **Turquoise** (`#40E0D0`) - Accent colors
- **Teal** (`#008080`) - Background base

#### Announcement Type Colors
- **Event**: Deep sky blue background with strong patterns
- **Opportunity**: Dark turquoise with deep sky blue patterns
- **Urgent**: Turquoise with enhanced visibility
- **Facility**: Teal with dark turquoise patterns
- **Administrative**: Dark turquoise with subtle patterns

**Test URL**: `http://localhost:3000/o/ocean-workshop/announcements/carousel`

---

### 6. Forest Collective - Natural Green and Earth Theme

**Theme**: Natural Green and Earth Tones  
**Base Color**: Dark Olive Green (`#556B2F`)  
**Philosophy**: Eco-friendly, natural, sustainable

#### Color Variations
- **Forest Green** (`#228B22`) - Primary pattern color
- **Olive Drab** (`#6B8E23`) - Secondary elements
- **Yellow Green** (`#9ACD32`) - Accent colors
- **Dark Olive Green** (`#556B2F`) - Background base

#### Announcement Type Colors
- **Event**: Forest green background with strong patterns
- **Opportunity**: Olive drab with forest green patterns
- **Urgent**: Yellow green with enhanced visibility
- **Facility**: Dark olive green with olive drab patterns
- **Administrative**: Olive drab with subtle patterns

**Test URL**: `http://localhost:3000/o/forest-collective/announcements/carousel`

## Theme Implementation

### How Themes Are Applied

1. **Organization Detection**: The system detects the organization slug from the URL
2. **Color Scheme Selection**: Based on the slug, the appropriate color scheme is selected
3. **Pattern Generation**: Background patterns are generated using the theme colors
4. **Component Styling**: All carousel components are styled with the theme colors

### Code Structure

```typescript
// In BackgroundPattern.tsx
const getOrganizationColorScheme = (orgSlug?: string, theme?: any) => {
  if (orgSlug === 'bakehouse') {
    return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
  }
  
  if (orgSlug === 'midnight-gallery') {
    return midnightGalleryScheme;
  }
  
  if (orgSlug === 'sunset-studios') {
    return sunsetStudiosScheme;
  }
  
  if (orgSlug === 'ocean-workshop') {
    return oceanWorkshopScheme;
  }
  
  if (orgSlug === 'forest-collective') {
    return forestCollectiveScheme;
  }
  
  // Default theme
  return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
};
```

## Testing the Themes

### Manual Testing URLs

1. **Bakehouse (Yellow)**: `http://localhost:3000/o/bakehouse/announcements/carousel`
2. **Primary Colors (White)**: `http://localhost:3000/o/primary-colors/announcements/carousel`
3. **Midnight Gallery (Purple/Blue)**: `http://localhost:3000/o/midnight-gallery/announcements/carousel`
4. **Sunset Studios (Orange/Red)**: `http://localhost:3000/o/sunset-studios/announcements/carousel`
5. **Ocean Workshop (Blue/Teal)**: `http://localhost:3000/o/ocean-workshop/announcements/carousel`
6. **Forest Collective (Green/Earth)**: `http://localhost:3000/o/forest-collective/announcements/carousel`

### What to Test

1. **Color Consistency**: Verify that all announcement types use the correct theme colors
2. **Pattern Visibility**: Ensure patterns are visible and don't interfere with text
3. **Dark Mode Support**: Test themes in both light and dark modes
4. **Responsive Design**: Verify themes work across different screen sizes
5. **Accessibility**: Check that colors meet contrast requirements

## Creating New Themes

### Step 1: Define Color Scheme

```typescript
const newThemeScheme: ColorSchemes = {
  event: {
    primary: 'rgba(r, g, b, 0.12)',    // Light mode background
    secondary: 'rgba(r, g, b, 0.10)',  // Secondary background
    accent: 'rgba(r, g, b, 0.08)',     // Accent background
    pattern: 'rgba(r, g, b, 0.8)',     // Strong pattern color
    background: 'rgba(r, g, b, 0.08)'  // Base background
  },
  // ... other announcement types
};
```

### Step 2: Add to Organization Detection

```typescript
if (orgSlug === 'new-organization') {
  return newThemeScheme;
}
```

### Step 3: Create Organization in Database

```javascript
const organization = {
  name: 'New Organization',
  slug: 'new-organization',
  settings: {
    theme: 'new-organization',
    color_scheme: 'custom',
    pattern_preference: 'bauhaus'
  },
  artist_icon: '🎨',
  banner_image: null
};
```

### Step 4: Add Sample Announcements

Create sample announcements to test the theme across different announcement types.

## Best Practices

### Color Selection
- Choose colors that reflect the organization's brand identity
- Ensure sufficient contrast for accessibility
- Use consistent opacity values across the theme
- Test in both light and dark modes

### Pattern Selection
- Match patterns to the organization's aesthetic
- Ensure patterns don't interfere with text readability
- Use strong opacity (0.8-0.9) for pattern visibility
- Consider the organization's artistic style

### Testing
- Test with real announcement content
- Verify across different announcement types
- Check responsive behavior
- Validate accessibility compliance

## Future Enhancements

### Planned Features
1. **Dynamic Theme Generation**: AI-powered theme creation based on organization logos
2. **Seasonal Themes**: Automatic theme adjustments for seasons
3. **User Customization**: Individual user theme preferences
4. **Theme Marketplace**: Community-shared themes
5. **Advanced Patterns**: More sophisticated pattern generation

### Technical Improvements
1. **CSS Custom Properties**: Dynamic CSS variables for themes
2. **Theme Caching**: Performance optimization for theme switching
3. **Gradient Support**: Multi-color gradient patterns
4. **Animation**: Smooth theme transitions
5. **Accessibility Tools**: Built-in contrast checking

## Troubleshooting

### Common Issues

1. **Theme Not Applied**: Check organization slug in URL
2. **Colors Not Visible**: Verify opacity values and contrast
3. **Patterns Too Strong**: Reduce pattern opacity
4. **Dark Mode Issues**: Check dark mode color variants
5. **Performance Issues**: Optimize pattern generation

### Debug Steps

1. Check browser console for errors
2. Verify organization exists in database
3. Test with different announcement types
4. Check theme detection logic
5. Validate color scheme definitions

## Support

For theme-related issues or questions:
1. Check this documentation first
2. Review the color palette reference
3. Test with sample organizations
4. Contact the development team for advanced customization
