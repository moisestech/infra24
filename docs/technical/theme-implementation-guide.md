# Theme Implementation Guide

## Quick Start: Adding a New Organization Theme

### Step 1: Define Your Color Scheme

Create a color scheme object in `components/BackgroundPattern.tsx`:

```typescript
const yourOrgColorScheme: ColorSchemes = {
  event: {
    primary: 'rgba(34, 197, 94, 0.05)',    // Green background
    secondary: 'rgba(16, 185, 129, 0.05)', // Emerald background
    accent: 'rgba(110, 231, 183, 0.05)',   // Light green background
    pattern: 'rgba(34, 197, 94, 0.9)',     // Strong green pattern
    background: 'rgba(240, 253, 244, 0.12)' // Light green background tint
  },
  urgent: {
    primary: 'rgba(239, 68, 68, 0.05)',    // Red background
    secondary: 'rgba(220, 38, 38, 0.05)',  // Dark red background
    accent: 'rgba(252, 165, 165, 0.05)',   // Light red background
    pattern: 'rgba(239, 68, 68, 0.9)',     // Strong red pattern
    background: 'rgba(254, 242, 242, 0.12)' // Light red background tint
  },
  // Add other announcement types as needed
};
```

### Step 2: Add Organization Logic

Update the `getOrganizationColorScheme` function:

```typescript
const getOrganizationColorScheme = (orgSlug?: string, theme?: any) => {
  if (orgSlug === 'bakehouse') {
    return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
  }
  
  if (orgSlug === 'primary-colors') {
    return primaryColorsScheme;
  }
  
  // Add your organization here
  if (orgSlug === 'your-org-slug') {
    return yourOrgColorScheme;
  }
  
  // Default fallback
  return resolvedTheme === 'dark' ? darkColorSchemes : colorSchemes;
};
```

### Step 3: Test Your Theme

1. Navigate to `/o/your-org-slug/announcements/display`
2. Verify colors appear correctly
3. Test in both light and dark modes
4. Check different announcement types

## Advanced Implementation

### Custom Pattern Selection

Control which patterns your organization uses:

```typescript
const getOrganizationPatterns = (orgSlug: string): PatternType[] => {
  const patternPreferences = {
    'minimalist-gallery': ['grid', 'stripes', 'circles'],
    'playful-studio': ['confetti', 'stars', 'polkadot'],
    'tech-startup': ['voronoi', 'grid', 'bauhaus'],
    'your-org': ['bauhaus', 'memphis', 'voronoi'] // Your custom selection
  };
  
  return patternPreferences[orgSlug] || Object.keys(PatternClasses);
};
```

### Database-Driven Themes

Store theme preferences in the organization's settings:

```sql
-- Update organization settings
UPDATE organizations 
SET settings = jsonb_set(
  settings, 
  '{theme}', 
  '{
    "background_patterns": {
      "enabled": true,
      "default_pattern": "bauhaus",
      "color_scheme": "custom",
      "custom_colors": {
        "primary": "#22C55E",
        "secondary": "#10B981", 
        "accent": "#6EE7B7",
        "background": "#F0FDF4"
      }
    }
  }'::jsonb
)
WHERE slug = 'your-org-slug';
```

### Dynamic Theme Loading

Load themes from the database:

```typescript
const loadOrganizationTheme = async (orgSlug: string) => {
  const { data: org } = await supabase
    .from('organizations')
    .select('settings')
    .eq('slug', orgSlug)
    .single();
    
  return org?.settings?.theme || null;
};
```

## Theme Templates

### Template 1: Minimalist Gallery

```typescript
const minimalistGalleryScheme: ColorSchemes = {
  event: {
    primary: 'rgba(107, 114, 128, 0.05)',   // Gray
    secondary: 'rgba(156, 163, 175, 0.05)', // Light gray
    accent: 'rgba(229, 231, 235, 0.05)',    // Very light gray
    pattern: 'rgba(107, 114, 128, 0.9)',    // Strong gray
    background: 'rgba(249, 250, 251, 0.12)' // Off-white
  }
};
```

### Template 2: Vibrant Studio

```typescript
const vibrantStudioScheme: ColorSchemes = {
  event: {
    primary: 'rgba(236, 72, 153, 0.05)',    // Pink
    secondary: 'rgba(168, 85, 247, 0.05)',  // Purple
    accent: 'rgba(251, 191, 36, 0.05)',     // Yellow
    pattern: 'rgba(236, 72, 153, 0.9)',     // Strong pink
    background: 'rgba(253, 242, 248, 0.12)' // Light pink
  }
};
```

### Template 3: Corporate Professional

```typescript
const corporateScheme: ColorSchemes = {
  event: {
    primary: 'rgba(30, 64, 175, 0.05)',     // Navy
    secondary: 'rgba(59, 130, 246, 0.05)',  // Blue
    accent: 'rgba(147, 197, 253, 0.05)',    // Light blue
    pattern: 'rgba(30, 64, 175, 0.9)',      // Strong navy
    background: 'rgba(239, 246, 255, 0.12)' // Light blue
  }
};
```

## Testing Your Implementation

### 1. Visual Testing

```typescript
// Add to your component for debugging
const debugTheme = (orgSlug: string, theme: any) => {
  console.log('Theme Debug:', {
    organization: orgSlug,
    theme: theme,
    colorScheme: getOrganizationColorScheme(orgSlug, theme),
    patterns: getOrganizationPatterns(orgSlug)
  });
};
```

### 2. Color Validation

```typescript
// Validate color contrast
const validateContrast = (backgroundColor: string, textColor: string) => {
  // Use a contrast checking library
  const contrast = getContrastRatio(backgroundColor, textColor);
  return contrast >= 4.5; // WCAG AA standard
};
```

### 3. Pattern Testing

```typescript
// Test pattern generation
const testPatterns = (orgSlug: string) => {
  const patterns = getOrganizationPatterns(orgSlug);
  patterns.forEach(pattern => {
    console.log(`Testing pattern: ${pattern}`);
    // Generate test pattern and verify it renders
  });
};
```

## Common Issues and Solutions

### Issue 1: Colors Too Bright

**Problem**: Background colors are too prominent
**Solution**: Reduce opacity values

```typescript
// Before (too bright)
primary: 'rgba(34, 197, 94, 0.15)'

// After (better)
primary: 'rgba(34, 197, 94, 0.05)'
```

### Issue 2: Patterns Not Visible

**Problem**: Pattern colors blend with background
**Solution**: Increase pattern opacity or change colors

```typescript
// Before (not visible)
pattern: 'rgba(34, 197, 94, 0.3)'

// After (visible)
pattern: 'rgba(34, 197, 94, 0.9)'
```

### Issue 3: Dark Mode Issues

**Problem**: Colors don't work in dark mode
**Solution**: Create dark mode variants

```typescript
const yourOrgDarkScheme: ColorSchemes = {
  event: {
    primary: 'rgba(34, 197, 94, 0.15)',    // Increased opacity
    secondary: 'rgba(16, 185, 129, 0.12)', // Increased opacity
    accent: 'rgba(110, 231, 183, 0.10)',   // Increased opacity
    pattern: 'rgba(34, 197, 94, 0.7)',     // Reduced opacity
    background: 'rgba(34, 197, 94, 0.25)'  // Increased opacity
  }
};
```

## Performance Considerations

### 1. Color Scheme Caching

```typescript
const colorSchemeCache = new Map<string, ColorSchemes>();

const getCachedColorScheme = (orgSlug: string): ColorSchemes => {
  if (!colorSchemeCache.has(orgSlug)) {
    const scheme = getOrganizationColorScheme(orgSlug);
    colorSchemeCache.set(orgSlug, scheme);
  }
  return colorSchemeCache.get(orgSlug)!;
};
```

### 2. Pattern Preloading

```typescript
const preloadPatterns = (orgSlug: string) => {
  const patterns = getOrganizationPatterns(orgSlug);
  patterns.forEach(pattern => {
    // Preload pattern assets
    const img = new Image();
    img.src = `/patterns/${pattern}.svg`;
  });
};
```

## Deployment Checklist

Before deploying your theme:

- [ ] Test in both light and dark modes
- [ ] Verify all announcement types render correctly
- [ ] Check mobile and desktop responsiveness
- [ ] Validate color contrast ratios
- [ ] Test with color blindness simulators
- [ ] Ensure patterns don't interfere with text
- [ ] Verify performance on slower devices
- [ ] Document your color choices
- [ ] Create backup/default theme

## Maintenance

### Regular Updates

1. **Seasonal Adjustments**: Update colors for seasons/holidays
2. **Brand Evolution**: Update colors when brand changes
3. **Accessibility**: Regular contrast ratio checks
4. **Performance**: Monitor pattern rendering performance

### Monitoring

```typescript
// Track theme usage
const trackThemeUsage = (orgSlug: string, theme: string) => {
  analytics.track('theme_used', {
    organization: orgSlug,
    theme: theme,
    timestamp: new Date().toISOString()
  });
};
```

## Support and Resources

### Documentation
- [Organization Theming System](./organization-theming-system.md)
- [Color Palette Reference](./color-palette-reference.md)

### Tools
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [Palette Generator](https://coolors.co/)

### Community
- Join the development team for theme discussions
- Share your themes with other organizations
- Contribute to the theme template library
