# Theme System Standard

## Overview
This document establishes the standard theme system for the Bakehouse News platform to ensure consistency and prevent confusion between different theme implementations.

## Recommended Theme System: Custom ThemeContext

### Why We Chose Custom ThemeContext Over next-themes

| Feature | Custom ThemeContext | next-themes |
|---------|-------------------|-------------|
| **System Theme Support** | ✅ Full support with automatic detection | ✅ Supported |
| **Three-State Toggle** | ✅ Light → Dark → System → Light | ❌ Only Light ↔ Dark |
| **Customization** | ✅ Full control over implementation | ⚠️ Limited by library |
| **Bundle Size** | ✅ No external dependency | ❌ Additional dependency |
| **Consistency** | ✅ Matches our existing patterns | ❌ Different API |
| **Maintenance** | ✅ We own the code | ❌ External dependency |

### Key Advantages of Custom ThemeContext

1. **Three-State Toggle**: Users can cycle through Light → Dark → System → Light
2. **System Theme Detection**: Automatically detects and follows OS theme preferences
3. **Better UX**: More intuitive for users who want to respect their system settings
4. **No External Dependencies**: Reduces bundle size and potential security vulnerabilities
5. **Full Control**: We can customize behavior exactly as needed

## Implementation Standard

### ✅ CORRECT: Use Custom ThemeContext

```typescript
// Import the custom theme toggle
import { ThemeToggle } from '@/components/ThemeToggle';

// Use the custom theme context
import { useTheme } from '@/contexts/ThemeContext';
```

### ❌ INCORRECT: Don't Use next-themes

```typescript
// DON'T use this
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
```

## Current Usage

### ✅ Components Using Correct Theme System
- `components/ui/Navigation.tsx` - Uses `@/components/ThemeToggle`
- `components/tenant/OoliteNavigation.tsx` - Uses `@/components/ThemeToggle` (fixed)

### ❌ Components to Avoid
- `components/ui/theme-toggle.tsx` - Uses next-themes (deprecated)

## Migration Plan

### Phase 1: Remove next-themes Dependency
1. Remove `next-themes` from package.json
2. Delete `components/ui/theme-toggle.tsx`
3. Update any remaining imports

### Phase 2: Standardize All Components
1. Ensure all navigation components use `@/components/ThemeToggle`
2. Update any custom theme implementations to use `@/contexts/ThemeContext`

## Theme Provider Setup

The app should be wrapped with our custom ThemeProvider:

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Theme Toggle Behavior

### Three-State Cycle
1. **Light Theme**: Manual light mode
2. **Dark Theme**: Manual dark mode  
3. **System Theme**: Follows OS preference (auto-detects changes)

### Icons
- **Sun**: Light theme active
- **Moon**: Dark theme active
- **Monitor**: System theme active

## Best Practices

1. **Always use** `@/components/ThemeToggle` for theme toggles
2. **Always use** `@/contexts/ThemeContext` for theme state
3. **Test** theme switching in all navigation components
4. **Document** any custom theme implementations
5. **Avoid** mixing theme systems in the same app

## Troubleshooting

### Theme Toggle Not Working
1. Check if component is wrapped with `ThemeProvider`
2. Verify import is from `@/components/ThemeToggle`
3. Ensure no conflicts with next-themes

### Theme Not Persisting
1. Check localStorage for 'theme' key
2. Verify ThemeProvider is at the root level
3. Check for multiple theme providers

## Future Considerations

- Consider adding theme-specific CSS variables
- Evaluate adding theme-specific organization branding
- Monitor for any performance issues with system theme detection

---

**Last Updated**: January 2025  
**Maintainer**: Development Team  
**Review Schedule**: Quarterly
