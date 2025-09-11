# Organization Theming System

## Overview

The Smart Sign platform supports organization-specific theming for background patterns and color palettes. This system allows each organization to have a unique visual identity while maintaining consistency across their announcements and content.

## Architecture

### Core Components

1. **BackgroundPattern Component** (`components/BackgroundPattern.tsx`)
   - Renders organization-specific background patterns
   - Accepts organization slug and theme data
   - Supports both light and dark mode variants

2. **Pattern Factory** (`components/patterns/index.ts`)
   - Manages pattern generation and selection
   - Supports 9 different pattern types
   - Handles pattern randomization and cycling

3. **Color Scheme System**
   - Organization-specific color palettes
   - Announcement type-based color variations
   - Dark/light mode support

## Pattern Types

The system supports 9 distinct pattern types:

| Pattern Type | Description | Visual Style |
|--------------|-------------|--------------|
| `bauhaus` | Generative Bauhaus-inspired geometric shapes | Modern, geometric, colorful |
| `memphis` | Memphis design style patterns | Bold, playful, retro |
| `stripes` | Linear stripe patterns | Clean, directional, structured |
| `circles` | Circular gradient patterns | Organic, flowing, soft |
| `grid` | Grid-based geometric patterns | Structured, technical, precise |
| `stars` | Star and constellation patterns | Celestial, magical, scattered |
| `confetti` | Confetti and celebration patterns | Festive, random, colorful |
| `voronoi` | Voronoi diagram patterns | Natural, cellular, organic |
| `polkadot` | Polka dot fade patterns | Playful, retro, rhythmic |

## Color Palette Structure

### PatternColors Interface

```typescript
interface PatternColors {
  primary: string;    // Main pattern color (high opacity)
  secondary: string;  // Secondary pattern color (medium opacity)
  accent: string;     // Accent pattern color (low opacity)
  pattern: string;    // Primary pattern stroke/fill color
  background?: string; // Background color (optional)
}
```

### Color Opacity Guidelines

- **Primary**: `0.05-0.08` (very subtle background)
- **Secondary**: `0.05-0.06` (subtle background)
- **Accent**: `0.04-0.05` (very subtle background)
- **Pattern**: `0.7-0.9` (strong pattern visibility)
- **Background**: `0.12-0.15` (noticeable background tint)

## Organization-Specific Theming

### Current Implementations

#### 1. Bakehouse Art Complex
- **Theme**: Bright Primary Yellow
- **Background**: `rgba(251, 191, 36, 0.12-0.15)` (Bright yellow)
- **Custom Types**:
  - `attention_artists`: Blue patterns on yellow background
  - `attention_public`: Red patterns on yellow background
  - `fun_fact`: Yellow patterns on brighter yellow background
  - `promotion`: Purple patterns on yellow background
  - `gala_announcement`: Red patterns on yellow background

#### 2. Primary Colors Art Collective
- **Theme**: Clean White with Primary Colors
- **Background**: `rgba(255, 255, 255, 0.98)` (Pure white)
- **Pattern Colors**:
  - Events: Red patterns (`rgba(239, 68, 68, 0.8)`)
  - Opportunities: Blue patterns (`rgba(59, 130, 246, 0.8)`)
  - Urgent: Yellow patterns (`rgba(251, 191, 36, 0.8)`)

### Adding New Organization Themes

To add a new organization theme:

1. **Update BackgroundPattern.tsx**:
   ```typescript
   const getOrganizationColorScheme = (orgSlug?: string, theme?: any) => {
     if (orgSlug === 'your-org-slug') {
       return yourCustomColorScheme;
     }
     // ... existing logic
   };
   ```

2. **Define Color Scheme**:
   ```typescript
   const yourCustomColorScheme: ColorSchemes = {
     event: {
       primary: 'rgba(r, g, b, 0.05)',
       secondary: 'rgba(r, g, b, 0.05)',
       accent: 'rgba(r, g, b, 0.05)',
       pattern: 'rgba(r, g, b, 0.9)',
       background: 'rgba(r, g, b, 0.12)'
     },
     // ... other announcement types
   };
   ```

## Database Integration

### Organization Settings

Organizations can store theme preferences in their `settings` JSONB field:

```sql
-- Example organization settings
{
  "theme": {
    "background_patterns": {
      "enabled": true,
      "default_pattern": "bauhaus",
      "color_scheme": "custom",
      "custom_colors": {
        "primary": "#FF6B6B",
        "secondary": "#4ECDC4", 
        "accent": "#45B7D1",
        "background": "#F7F7F7"
      }
    },
    "announcement_types": {
      "event": {
        "pattern": "circles",
        "colors": {
          "primary": "rgba(255, 107, 107, 0.05)",
          "pattern": "rgba(255, 107, 107, 0.9)"
        }
      }
    }
  }
}
```

### Custom Announcement Types

Organizations can define custom announcement types with specific theming:

```sql
-- Custom announcement types table
CREATE TABLE organization_announcement_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  type_name VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  color_scheme JSONB,
  pattern_preference VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Advanced Theming Features

### 1. Pattern Selection Control

Organizations can control which patterns are used:

```typescript
interface OrganizationPatternSettings {
  allowedPatterns: PatternType[];
  preferredPatterns: PatternType[];
  patternRotation: 'random' | 'sequential' | 'fixed';
  defaultPattern?: PatternType;
}
```

### 2. Dynamic Color Generation

For advanced organizations, the system can generate color schemes based on:

- Organization logo colors
- Brand guidelines
- Seasonal themes
- Event-specific palettes

### 3. Responsive Theming

Different themes for different screen sizes:

```typescript
interface ResponsiveTheme {
  mobile: ColorScheme;
  tablet: ColorScheme;
  desktop: ColorScheme;
  large: ColorScheme;
}
```

## Implementation Examples

### Basic Organization Theme

```typescript
// Add to BackgroundPattern.tsx
if (orgSlug === 'modern-art-gallery') {
  return {
    event: {
      primary: 'rgba(138, 43, 226, 0.05)',    // Purple
      secondary: 'rgba(75, 0, 130, 0.05)',    // Indigo
      accent: 'rgba(147, 112, 219, 0.05)',    // Medium purple
      pattern: 'rgba(138, 43, 226, 0.9)',     // Strong purple
      background: 'rgba(248, 248, 255, 0.12)' // Ghost white
    }
  };
}
```

### Advanced Theme with Pattern Control

```typescript
// Organization-specific pattern selection
const getOrganizationPatterns = (orgSlug: string): PatternType[] => {
  const patternPreferences = {
    'minimalist-gallery': ['grid', 'stripes', 'circles'],
    'playful-studio': ['confetti', 'stars', 'polkadot'],
    'tech-startup': ['voronoi', 'grid', 'bauhaus']
  };
  
  return patternPreferences[orgSlug] || Object.keys(PatternClasses);
};
```

## Best Practices

### Color Selection

1. **Accessibility**: Ensure sufficient contrast ratios
2. **Brand Consistency**: Align with organization's brand guidelines
3. **Readability**: Background colors should not interfere with text
4. **Emotional Impact**: Choose colors that match the organization's tone

### Pattern Selection

1. **Content Type**: Match patterns to announcement types
2. **Visual Hierarchy**: Use simpler patterns for important content
3. **Performance**: Consider pattern complexity for mobile devices
4. **Brand Alignment**: Choose patterns that reflect organization personality

### Theme Testing

1. **Cross-Device**: Test on various screen sizes
2. **Dark Mode**: Ensure themes work in both light and dark modes
3. **Content Variety**: Test with different announcement types
4. **User Feedback**: Gather feedback from organization members

## Future Enhancements

### Planned Features

1. **Theme Editor UI**: Visual interface for organizations to customize themes
2. **Template Library**: Pre-built theme templates for different industries
3. **AI Color Generation**: Automatic color scheme generation from logos
4. **Seasonal Themes**: Automatic theme switching based on seasons/events
5. **User Preferences**: Individual user theme preferences within organizations

### Technical Improvements

1. **Performance Optimization**: Pattern caching and lazy loading
2. **Accessibility**: Enhanced contrast and screen reader support
3. **Animation**: Smooth theme transitions and pattern animations
4. **Export/Import**: Theme sharing between organizations

## Troubleshooting

### Common Issues

1. **Patterns Not Showing**: Check organization slug and theme configuration
2. **Colors Too Bright**: Reduce opacity values in color schemes
3. **Performance Issues**: Limit pattern complexity for mobile devices
4. **Theme Not Applying**: Verify organization settings in database

### Debug Tools

```typescript
// Enable pattern debugging
const debugMode = process.env.NODE_ENV === 'development';

if (debugMode) {
  console.log('Organization Theme:', {
    slug: organizationSlug,
    theme: organizationTheme,
    colorScheme: scheme,
    selectedPattern: currentPattern
  });
}
```

## Conclusion

The organization theming system provides a flexible foundation for creating unique visual identities while maintaining system consistency. The modular architecture allows for easy extension and customization, making it suitable for organizations of all sizes and industries.

For questions or contributions to the theming system, please refer to the development team or create an issue in the project repository.
