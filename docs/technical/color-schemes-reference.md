# Color Schemes Reference

This document provides a comprehensive overview of all color schemes used in the announcement carousel system.

## Standard Announcement Types

### 1. **Urgent** 🔴
**Purpose**: Critical announcements requiring immediate attention
- **Light Mode**: Red tones (`rgba(239, 68, 68, 0.05)`)
- **Dark Mode**: Red tones (`rgba(239, 68, 68, 0.15)`)
- **Pattern**: Strong red (`rgba(239, 68, 68, 0.9)`)
- **Use Cases**: Emergency closures, urgent deadlines, critical updates

### 2. **Event** 🟡
**Purpose**: Community events, workshops, meetings
- **Light Mode**: Yellow/amber tones (`rgba(234, 179, 8, 0.05)`)
- **Dark Mode**: Yellow/amber tones (`rgba(234, 179, 8, 0.15)`)
- **Pattern**: Strong yellow (`rgba(234, 179, 8, 0.9)`)
- **Use Cases**: Book clubs, workshops, community gatherings

### 3. **Opportunity** 🔵
**Purpose**: Exhibitions, open calls, opportunities
- **Light Mode**: Primary blue (`rgba(59, 130, 246, 0.12)`)
- **Dark Mode**: Primary blue (`rgba(59, 130, 246, 0.25)`)
- **Pattern**: Strong blue (`rgba(59, 130, 246, 0.9)`)
- **Use Cases**: Art exhibitions, artist opportunities, gallery shows

### 4. **Facility** 🔵
**Purpose**: Building maintenance, facility updates
- **Light Mode**: Blue tones (`rgba(59, 130, 246, 0.05)`)
- **Dark Mode**: Blue tones (`rgba(59, 130, 246, 0.15)`)
- **Pattern**: Strong blue (`rgba(59, 130, 246, 0.9)`)
- **Use Cases**: Maintenance schedules, facility closures, building updates

### 5. **Administrative** ⚫
**Purpose**: General administrative announcements
- **Light Mode**: Gray tones (`rgba(107, 114, 128, 0.05)`)
- **Dark Mode**: Gray tones (`rgba(107, 114, 128, 0.15)`)
- **Pattern**: Strong gray (`rgba(107, 114, 128, 0.9)`)
- **Use Cases**: Policy updates, administrative notices, surveys

## Bakehouse-Specific Custom Types

### 6. **Attention Artists** 🟡
**Purpose**: Artist-specific announcements
- **Light Mode**: Primary yellow (`rgba(255, 193, 7, 0.12)`)
- **Dark Mode**: Primary yellow (`rgba(255, 193, 7, 0.25)`)
- **Pattern**: Strong yellow (`rgba(255, 193, 7, 0.9)`)
- **Use Cases**: Artist opportunities, studio updates, artist-specific news

### 7. **Attention Public** 🟠
**Purpose**: Public-facing announcements
- **Light Mode**: Orange-yellow (`rgba(255, 152, 0, 0.12)`)
- **Dark Mode**: Orange-yellow (`rgba(255, 152, 0, 0.25)`)
- **Pattern**: Strong orange (`rgba(255, 152, 0, 0.9)`)
- **Use Cases**: Public events, community announcements, public exhibitions

### 8. **Fun Fact** 🟡
**Purpose**: Educational or entertaining content
- **Light Mode**: Bright yellow (`rgba(255, 235, 59, 0.15)`)
- **Dark Mode**: Bright yellow (`rgba(255, 235, 59, 0.30)`)
- **Pattern**: Strong bright yellow (`rgba(255, 235, 59, 0.9)`)
- **Use Cases**: Historical facts, educational content, trivia

### 9. **Promotion** 🟡
**Purpose**: Marketing and promotional content
- **Light Mode**: Amber-yellow (`rgba(255, 171, 0, 0.12)`)
- **Dark Mode**: Amber-yellow (`rgba(255, 171, 0, 0.25)`)
- **Pattern**: Strong amber (`rgba(255, 171, 0, 0.9)`)
- **Use Cases**: Marketing campaigns, promotional events, special offers

### 10. **Gala Announcement** 🟠
**Purpose**: Special gala and major event announcements
- **Light Mode**: Deep orange-yellow (`rgba(255, 111, 0, 0.12)`)
- **Dark Mode**: Deep orange-yellow (`rgba(255, 111, 0, 0.25)`)
- **Pattern**: Strong deep orange (`rgba(255, 111, 0, 0.9)`)
- **Use Cases**: Gala events, major fundraisers, special celebrations

## Organization-Specific Themes

### Bakehouse Art Complex
- **Primary Colors**: Yellow-based palette
- **Custom Types**: All Bakehouse-specific types use yellow variations
- **Philosophy**: Warm, welcoming, community-focused

### Midnight Gallery
- **Primary Colors**: Dark purple and indigo tones
- **Philosophy**: Sophisticated, mysterious, high-end art gallery

### Sunset Studios
- **Primary Colors**: Orange and red tones
- **Philosophy**: Energetic, creative, dynamic

### Ocean Workshop
- **Primary Colors**: Blue and teal tones
- **Philosophy**: Calm, professional, maritime-inspired

### Forest Collective
- **Primary Colors**: Green and earth tones
- **Philosophy**: Natural, organic, environmentally conscious

## Color Usage Guidelines

### Light Mode vs Dark Mode
- **Light Mode**: Lower opacity (0.05-0.15) for subtle backgrounds
- **Dark Mode**: Higher opacity (0.15-0.30) for better contrast
- **Patterns**: Always use high opacity (0.8-0.9) for visibility

### Accessibility Considerations
- All color combinations meet WCAG contrast requirements
- Patterns provide visual distinction beyond color alone
- Text remains readable across all color schemes

### Responsive Design
- Colors scale appropriately across different screen sizes
- Patterns maintain visual impact on both portrait and landscape orientations
- Background colors provide sufficient contrast for text overlay

## Implementation Notes

### Color Structure
Each color scheme includes:
- `primary`: Main background color
- `secondary`: Secondary background color
- `accent`: Accent color for highlights
- `pattern`: Color for pattern overlays
- `background`: Overall background color (when applicable)

### Theme Selection
Colors are selected based on:
1. **Organization branding** (Bakehouse = Yellow, Midnight Gallery = Purple)
2. **Content type** (Urgent = Red, Opportunity = Blue)
3. **Visual hierarchy** (Important announcements get stronger colors)
4. **Accessibility** (Sufficient contrast for readability)

### Future Expansion
New color schemes can be added by:
1. Defining new organization-specific schemes
2. Adding new announcement types
3. Creating custom color combinations for special events
4. Implementing seasonal or temporary themes
