# SwiftHerb Design System

## Overview
SwiftHerb is an AI-powered pharmacist assistant platform that helps users discover natural health products. The design system emphasizes clarity, accessibility, and a clean, modern aesthetic that builds trust in health-related recommendations.

## Design Philosophy

### Core Principles
1. **Clarity First**: Health information must be clear and easy to understand
2. **Trust Building**: Professional, medical-grade appearance without being clinical
3. **Accessibility**: WCAG-compliant design for all users
4. **Performance**: Fast, responsive interactions
5. **Mobile-First**: Optimized for mobile devices with progressive enhancement

## Color Palette

### Primary Colors
- **Green (Primary Brand Color)**
  - `green-600`: `#16a34a` - Primary buttons, links, accents
  - `green-700`: `#15803d` - Hover states, darker accents
  - `green-800`: `#166534` - Active states
  - `green-50`: `#f0fdf4` - Light backgrounds, subtle highlights
  - `green-100`: `#dcfce7` - Badges, category tags
  - `green-200`: `#bbf7d0` - Borders, secondary elements

### Neutral Colors
- **Gray Scale**
  - `gray-50`: `#f9fafb` - Page backgrounds
  - `gray-100`: `#f3f4f6` - Subtle backgrounds
  - `gray-200`: `#e5e7eb` - Borders, dividers
  - `gray-300`: `#d1d5db` - Disabled states
  - `gray-600`: `#4b5563` - Secondary text
  - `gray-700`: `#374151` - Body text
  - `gray-800`: `#1f2937` - Headings
  - `gray-900`: `#111827` - Primary text

### Semantic Colors
- **White**: `#ffffff` - Cards, backgrounds
- **Black**: `#000000` - Text (with opacity for overlays)
- **Red**: Used sparingly for warnings, delete actions (`red-600`, `red-100`)

## Typography

### Font Family
- **System Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Uses native system fonts for optimal performance and familiarity

### Type Scale
- **H1**: `sr-only` (visually hidden for SEO, semantic structure)
- **H2**: `text-3xl sm:text-4xl font-bold` - Section headers (e.g., "Best Sellers")
- **H3**: `text-lg font-bold` - Product titles, card headings
- **Body**: `text-[15px]` or `text-sm` - Default text size
- **Small**: `text-xs` - Labels, metadata, badges

### Text Styles
- **Line Height**: `leading-tight` for headings, `leading-relaxed` for body
- **Text Clamp**: `.line-clamp-2` utility for truncating product descriptions
- **Text Balance**: `.text-balance` utility for better text wrapping

## Spacing System

### Container Widths
- **Max Width**: `max-w-7xl` (1280px) - Main content containers
- **Padding**: `px-4 sm:px-6 lg:px-8` - Responsive horizontal padding
- **Gap**: `gap-4 sm:gap-5 lg:gap-6` - Grid spacing

### Vertical Spacing
- **Section Padding**: `py-12` - Major sections
- **Card Padding**: `p-4 sm:p-5` - Product cards
- **Button Padding**: `px-4 sm:px-5 py-2 sm:py-2.5` - Primary buttons
- **Input Padding**: `px-4 py-3` - Form inputs

## Layout Patterns

### Grid System
- **Product Grid**: 
  - Mobile: `grid-cols-1`
  - Tablet: `sm:grid-cols-2`
  - Desktop: `lg:grid-cols-3`
  - Large Desktop: `xl:grid-cols-4`
- **Gap**: `gap-4 sm:gap-5 lg:gap-6` - Consistent spacing

### Flexbox Patterns
- **Main Layout**: `flex flex-col min-h-screen` - Full-height page
- **Chat Container**: `flex flex-col h-full min-h-0` - Flexible chat area
- **Card Layout**: `flex flex-col sm:flex-row gap-3 sm:gap-4` - Responsive card content

## Components

### Product Card
**Purpose**: Display product information with image, details, and affiliate link

**Structure**:
- White background (`bg-white`)
- Border (`border border-gray-200`)
- Rounded corners (`rounded-xl`)
- Shadow (`shadow-sm`) with hover elevation (`hover:shadow-xl`)
- Hover transform (`hover:-translate-y-1 hover:scale-[1.02]`)

**Elements**:
- Product image: `w-24 h-24 sm:w-28 sm:h-28` with `rounded-lg`
- Category badge: `px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full`
- Product title: `font-bold text-gray-900 text-lg`
- Description: `text-sm text-gray-600 line-clamp-2`
- Price: `text-2xl font-bold text-green-600`
- CTA Button: Gradient green button with hover effects

### Buttons

**Primary Button** (e.g., "View on iHerb"):
- `bg-gradient-to-r from-green-600 to-green-700`
- `text-white font-semibold rounded-lg`
- Hover: `hover:from-green-700 hover:to-green-800`
- Shadow: `shadow-md hover:shadow-lg`
- Transform: `hover:scale-105 active:scale-95`
- Touch-friendly: `touch-manipulation`

**Secondary Button** (e.g., Reset, Quick Actions):
- `bg-white border border-gray-300` or `border-green-200`
- `text-gray-700` or `text-green-700`
- Hover: `hover:bg-gray-50` or `hover:bg-green-50`
- `rounded-lg shadow-sm hover:shadow-md`

**Show More Button**:
- Same as primary button
- Full-width centered: `text-center`
- Displays remaining count: `Show More (X more available)`

### Chat Interface

**Message Bubbles**:
- User: `bg-green-600 text-white` with `rounded-2xl`
- Assistant: `bg-white text-gray-800 border border-gray-200` with `rounded-2xl`
- Padding: `px-4 py-3`
- Max width: `max-w-[85%] sm:max-w-[75%]` for user messages
- Full width for assistant messages with products

**Input Field**:
- Border: `border border-gray-300`
- Focus: `focus:ring-2 focus:ring-green-500`
- Rounded: `rounded-lg`
- Padding: `px-4 py-3`

**Loading Indicator**:
- Three bouncing dots (`animate-bounce`)
- Green color (`bg-green-500`)
- Staggered animation delays: `0s`, `0.15s`, `0.3s`

### Modal (Reset Confirmation)

**Structure**:
- Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm`
- Container: `bg-white rounded-2xl shadow-2xl max-w-md`
- Icon: `w-16 h-16 bg-red-100 rounded-full` with red icon
- Buttons: Cancel (gray) and Confirm (green gradient)

## Animations

### Fade In
- `@keyframes fadeIn`: Opacity 0→1, translateY 10px→0
- Duration: `0.3s ease-out`
- Usage: `.animate-fadeIn` for new content

### Fade In Up
- `@keyframes fadeInUp`: Opacity 0→1, translateY 20px→0
- Duration: `0.5s ease-out`
- Usage: Product cards with staggered delays (`${index * 0.1}s`)

### Transitions
- **Duration**: `transition-all duration-200` or `duration-300`
- **Easing**: `ease-out` for entrances, default for interactions
- **Hover States**: Smooth color, shadow, and transform transitions

## Responsive Breakpoints

- **sm**: `640px` - Small tablets
- **md**: `768px` - Tablets (not heavily used)
- **lg**: `1024px` - Desktop
- **xl**: `1280px` - Large desktop

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy (`h1`, `h2`, `h3`)
- `sr-only` class for SEO-important but visually hidden content
- `aria-label` for interactive elements
- Semantic sections (`<main>`, `<section>`)

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states: `focus:ring-2 focus:ring-green-500`
- Touch targets: Minimum `44x44px` for mobile

### Screen Reader Support
- Alt text for all images
- Descriptive link text ("View on iHerb →")
- ARIA labels for icon-only buttons

## Performance Optimizations

### Images
- `loading="lazy"` for below-the-fold images
- Fallback placeholder with gradient background
- Error handling with `onError` callback
- Optimized sizes: `w-24 h-24 sm:w-28 sm:h-28`

### Animations
- CSS animations (GPU-accelerated)
- `will-change` implicit through transform properties
- Reduced motion support (can be added)

### Scrolling
- Custom scrollbar styling (thin, subtle)
- Smooth scroll behavior: `scroll-smooth`
- Scrollbar hiding utility: `.scrollbar-hide`

## Design Tokens Summary

```css
/* Colors */
--primary-green: #16a34a
--primary-green-dark: #15803d
--background: #ffffff
--text-primary: #111827
--text-secondary: #4b5563
--border: #e5e7eb

/* Spacing */
--container-max-width: 1280px
--spacing-xs: 0.25rem (4px)
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)
--spacing-lg: 1.5rem (24px)
--spacing-xl: 3rem (48px)

/* Typography */
--font-size-base: 15px
--font-size-sm: 14px
--font-size-xs: 12px
--font-size-lg: 18px
--font-size-2xl: 24px
--font-size-3xl: 30px
--font-size-4xl: 36px

/* Border Radius */
--radius-sm: 0.5rem (8px)
--radius-md: 0.75rem (12px)
--radius-lg: 1rem (16px)
--radius-xl: 1.5rem (24px)
--radius-full: 9999px

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## Usage Guidelines

### When to Use Each Component

1. **Product Cards**: Use for displaying product information in grids (Best Sellers, AI recommendations, bundles)
2. **Primary Buttons**: Use for main CTAs (purchases, primary actions)
3. **Secondary Buttons**: Use for secondary actions (reset, filters, quick actions)
4. **Chat Bubbles**: Use for user/assistant message display
5. **Modals**: Use for confirmations and important dialogs

### Do's and Don'ts

**Do**:
- Use consistent spacing and padding
- Maintain color hierarchy (green for primary actions)
- Ensure sufficient contrast for accessibility
- Test on mobile devices first
- Use semantic HTML elements

**Don't**:
- Mix different button styles for the same action type
- Use colors outside the defined palette
- Skip hover/focus states
- Forget mobile responsiveness
- Overuse animations (keep them subtle)

## Future Enhancements

### Planned Improvements
1. Dark mode support (CSS variables already prepared)
2. Custom color themes for different health categories
3. Enhanced micro-interactions
4. Loading skeleton states
5. Error state designs
6. Empty state illustrations
7. Toast notification system
8. Tooltip component
9. Dropdown menu component
10. Form validation styles

---

*Last Updated: February 2025*
*Design System Version: 1.0*
