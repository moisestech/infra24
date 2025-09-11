# Bakehouse Primary Yellow Palette

## Overview

The Bakehouse Art Complex uses a cohesive primary yellow color palette that creates visual hierarchy while maintaining strong brand identity. This palette is built around **Primary Yellow** (`#FFC107`) as the foundation color, with carefully selected variations to distinguish between different announcement types.

## Color Philosophy

### Brand Foundation
- **Primary Yellow** (`#FFC107`) serves as the base brand color
- All variations maintain the yellow family while creating visual distinction
- The palette creates warmth and energy appropriate for an art community
- Colors are designed to work well with both light and dark themes

### Visual Hierarchy
The palette uses different yellow tones to create clear visual hierarchy:
1. **Brightest** - Fun facts and highlights
2. **Primary** - Standard announcements and base elements
3. **Orange-Yellow** - Attention-grabbing announcements
4. **Amber** - Promotional content
5. **Deep Orange-Yellow** - Special events and galas

## Color Specifications

### Primary Yellow (`#FFC107`)
- **RGB**: `255, 193, 7`
- **HSL**: `45°, 100%, 51%`
- **Usage**: Base brand color, primary backgrounds
- **Light Mode**: `rgba(255, 193, 7, 0.12)`
- **Dark Mode**: `rgba(255, 193, 7, 0.25)`

### Light Yellow (`#FFD54F`)
- **RGB**: `255, 213, 79`
- **HSL**: `45°, 100%, 65%`
- **Usage**: Secondary elements, light accents
- **Light Mode**: `rgba(255, 213, 79, 0.10)`
- **Dark Mode**: `rgba(255, 213, 79, 0.22)`

### Bright Yellow (`#FFEB3B`)
- **RGB**: `255, 235, 59`
- **HSL**: `54°, 100%, 62%`
- **Usage**: Highlights, fun facts, special content
- **Light Mode**: `rgba(255, 235, 59, 0.15)`
- **Dark Mode**: `rgba(255, 235, 59, 0.30)`

### Orange-Yellow (`#FF9800`)
- **RGB**: `255, 152, 0`
- **HSL**: `36°, 100%, 50%`
- **Usage**: Attention-grabbing announcements
- **Light Mode**: `rgba(255, 152, 0, 0.12)`
- **Dark Mode**: `rgba(255, 152, 0, 0.25)`

### Amber-Yellow (`#FFAB00`)
- **RGB**: `255, 171, 0`
- **HSL**: `40°, 100%, 50%`
- **Usage**: Promotional content, special offers
- **Light Mode**: `rgba(255, 171, 0, 0.12)`
- **Dark Mode**: `rgba(255, 171, 0, 0.25)`

### Deep Orange-Yellow (`#FF6F00`)
- **RGB**: `255, 111, 0`
- **HSL**: `28°, 100%, 50%`
- **Usage**: Special events, galas, high-priority announcements
- **Light Mode**: `rgba(255, 111, 0, 0.12)`
- **Dark Mode**: `rgba(255, 111, 0, 0.25)`

## Announcement Type Mapping

### Attention Artists
- **Primary Color**: Primary Yellow (`#FFC107`)
- **Purpose**: Communications specifically for artists
- **Visual Weight**: Standard importance
- **Pattern**: Primary yellow patterns

### Attention Public
- **Primary Color**: Orange-Yellow (`#FF9800`)
- **Purpose**: Public-facing announcements
- **Visual Weight**: Higher attention
- **Pattern**: Orange-yellow patterns

### Fun Fact
- **Primary Color**: Bright Yellow (`#FFEB3B`)
- **Purpose**: Educational and engaging content
- **Visual Weight**: Highlighted content
- **Pattern**: Bright yellow patterns

### Promotion
- **Primary Color**: Amber-Yellow (`#FFAB00`)
- **Purpose**: Promotional content and offers
- **Visual Weight**: Commercial importance
- **Pattern**: Amber-yellow patterns

### Gala Announcement
- **Primary Color**: Deep Orange-Yellow (`#FF6F00`)
- **Purpose**: Special events and fundraising
- **Visual Weight**: Highest priority
- **Pattern**: Deep orange-yellow patterns

## Implementation Guidelines

### Opacity Values
- **Light Mode Backgrounds**: 0.08 - 0.15 (subtle, readable)
- **Dark Mode Backgrounds**: 0.20 - 0.30 (enhanced visibility)
- **Pattern Elements**: 0.8 - 0.9 (strong visibility)
- **Accent Elements**: 0.08 - 0.10 (subtle highlights)

### Accessibility Considerations
- All colors meet WCAG contrast requirements
- Yellow backgrounds provide sufficient contrast with dark text
- Patterns are designed not to interfere with text readability
- Color-blind users can distinguish between types through pattern variations

### Responsive Design
- Colors scale appropriately across different screen sizes
- Opacity values adjust for different viewing conditions
- Patterns maintain visibility on both mobile and desktop

## Usage Examples

### CSS Implementation
```css
/* Primary Yellow Background */
.bakehouse-primary {
  background-color: rgba(255, 193, 7, 0.12);
}

/* Orange-Yellow Pattern */
.bakehouse-attention {
  background-color: rgba(255, 152, 0, 0.12);
}

/* Bright Yellow Highlight */
.bakehouse-fun-fact {
  background-color: rgba(255, 235, 59, 0.15);
}
```

### Tailwind CSS Classes
```css
/* Custom Bakehouse Colors */
.bg-bakehouse-primary {
  background-color: rgba(255, 193, 7, 0.12);
}

.bg-bakehouse-orange {
  background-color: rgba(255, 152, 0, 0.12);
}

.bg-bakehouse-bright {
  background-color: rgba(255, 235, 59, 0.15);
}
```

## Brand Guidelines

### Do's
- ✅ Use the full range of yellow variations for visual hierarchy
- ✅ Maintain consistent opacity values across implementations
- ✅ Test colors in both light and dark modes
- ✅ Ensure sufficient contrast for accessibility
- ✅ Use patterns to reinforce color distinctions

### Don'ts
- ❌ Mix non-yellow colors into the primary palette
- ❌ Use colors outside the specified opacity ranges
- ❌ Ignore accessibility contrast requirements
- ❌ Use colors that don't align with the yellow family
- ❌ Override the palette without brand approval

## Future Considerations

### Potential Expansions
- Seasonal variations (warmer/cooler yellows)
- Gradient implementations using the palette
- Animation and transition effects
- Print-friendly color variations

### Technical Improvements
- CSS custom properties for easier maintenance
- Automated contrast checking
- Dynamic opacity adjustments based on content
- Integration with design system tools

## Testing and Validation

### Color Testing Checklist
- [ ] All colors meet WCAG AA contrast requirements
- [ ] Colors render consistently across browsers
- [ ] Dark mode variations are properly implemented
- [ ] Patterns remain visible and non-interfering
- [ ] Mobile and desktop rendering is consistent
- [ ] Color-blind accessibility is maintained

### Tools and Resources
- **Contrast Checkers**: WebAIM, Colour Contrast Analyser
- **Color Blindness Simulators**: Coblis, Color Oracle
- **Browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Mobile, tablet, desktop screens
