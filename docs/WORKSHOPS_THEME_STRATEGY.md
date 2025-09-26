# Workshops Page Theme Strategy

## Current Issues Identified

### 1. **Main Page Background**
- ❌ Hard-coded `bg-gray-50` in page wrapper
- ❌ Hard-coded gradient `bg-gradient-to-br from-blue-50 to-indigo-100` in component
- ❌ No theme awareness

### 2. **Featured Workshop Cards**
- ❌ Default Card component without theme variants
- ❌ Hard-coded text colors (`text-gray-900`, `text-gray-600`)
- ❌ No dark mode support

### 3. **Workshop Categories Cards**
- ❌ Hard-coded color arrays for badges
- ❌ No theme-aware color system
- ❌ Default Card styling

### 4. **Call to Action Section**
- ❌ Hard-coded `bg-white` background
- ❌ No theme awareness

## Strategy & Implementation Plan

### Phase 1: Create Theme-Aware Utilities
1. **Create theme-aware color system** for workshops
2. **Create theme-aware component variants**
3. **Create organization-specific theme helpers**

### Phase 2: Update Main Page Structure
1. **Replace hard-coded backgrounds** with theme-aware styles
2. **Add useTheme hook** to main page
3. **Create dynamic background gradients** based on organization theme

### Phase 3: Update Components
1. **Create theme-aware Card variants**
2. **Update Featured Workshop cards**
3. **Update Workshop Categories cards**
4. **Update Call to Action section**

### Phase 4: Testing & Refinement
1. **Test dark/light mode switching**
2. **Test with different organizations**
3. **Ensure accessibility compliance**

## Implementation Details

### Theme-Aware Color System
```typescript
// Organization-specific theme colors with dark mode support
const ooliteColors = {
  primary: '#47abc4',
  primaryLight: '#6bb8d1',
  primaryDark: '#3a8ba3',
  primaryAlpha: 'rgba(71, 171, 196, 0.1)',
  primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
  primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  darkPrimary: '#2c5f6f',
  darkSecondary: '#1a1a1a',
  darkSurface: '#2a2a2a',
  darkBorder: '#404040',
}
```

### Dynamic Background System
```typescript
const getThemeStyles = () => {
  const isDark = resolvedTheme === 'dark'
  if (isDark) {
    return {
      background: `linear-gradient(135deg, ${ooliteColors.primaryAlphaDark} 0%, ${ooliteColors.darkSecondary} 50%, ${ooliteColors.primaryAlphaDark} 100%)`,
      cardBg: ooliteColors.darkSurface,
      textPrimary: '#ffffff',
      textSecondary: '#a0a0a0',
    }
  } else {
    return {
      background: `linear-gradient(135deg, ${ooliteColors.primaryAlphaLight} 0%, #ffffff 50%, ${ooliteColors.primaryAlphaLight} 100%)`,
      cardBg: '#ffffff',
      textPrimary: '#1a1a1a',
      textSecondary: '#666666',
    }
  }
}
```

### Component Updates
1. **Replace hard-coded classes** with dynamic styles
2. **Add theme-aware hover states**
3. **Ensure proper contrast ratios**
4. **Add smooth transitions**

## Expected Results

### Light Mode
- ✅ Organization-themed gradient background
- ✅ Clean white cards with subtle shadows
- ✅ Proper contrast ratios
- ✅ Organization brand colors

### Dark Mode
- ✅ Dark gradient background with organization accent
- ✅ Dark cards with proper borders
- ✅ White text with proper contrast
- ✅ Consistent with organization theme

### Accessibility
- ✅ WCAG AA compliance
- ✅ Proper focus states
- ✅ Screen reader friendly
- ✅ Keyboard navigation support
