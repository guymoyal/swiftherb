# SCSS Setup Guide

## Folder Structure

```
swiftherb/
├── public/
│   ├── images/          # Static images (served at /images/)
│   └── scss/            # SCSS files (if needed as static files)
├── styles/              # SCSS files (recommended - processed by Next.js)
│   ├── variables.scss   # SCSS variables
│   ├── mixins.scss      # SCSS mixins
│   └── components.scss  # Component styles
└── app/
    └── globals.css      # Global styles (can import SCSS here)
```

## Installation

Sass is already added to `package.json`. Install dependencies:

```bash
pnpm install
```

## Usage

### Option 1: Import SCSS in Components (Recommended)

```tsx
// In any component file
import '@/styles/variables.scss';
import '@/styles/components.scss';

export default function MyComponent() {
  return <div className="custom-card">Content</div>;
}
```

### Option 2: Import in globals.css

```css
/* app/globals.css */
@import '../styles/variables.scss';
@import '../styles/mixins.scss';
@import '../styles/components.scss';

/* Your existing Tailwind imports */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Option 3: Use SCSS Variables in Tailwind

You can use SCSS variables in your Tailwind config:

```js
// tailwind.config.ts
import './styles/variables.scss';

export default {
  theme: {
    extend: {
      colors: {
        primary: '#16a34a', // Use $primary-green from variables.scss
      },
    },
  },
};
```

## Using Images from public/

Images in `public/images/` can be referenced directly:

```tsx
import Image from 'next/image';

// Using Next.js Image component
<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={50} 
/>

// Or regular img tag
<img src="/images/hero.jpg" alt="Hero" />
```

**Note**: The path `/images/logo.png` maps to `public/images/logo.png`

## Example SCSS Files Created

1. **`styles/variables.scss`** - Color variables, spacing, breakpoints
2. **`styles/mixins.scss`** - Reusable mixins (responsive, flexbox, buttons, etc.)
3. **`styles/components.scss`** - Component-specific styles

## Quick Start

1. **Add your images** to `public/images/`
2. **Create SCSS files** in `styles/` folder
3. **Import them** in your components or `globals.css`

## Example: Using Mixins

```scss
// styles/my-component.scss
@import './variables.scss';
@import './mixins.scss';

.my-button {
  @include button-base;
  background: $primary-green;
  
  @include respond-to(md) {
    padding: $spacing-lg;
  }
}
```

Then import in your component:

```tsx
import '@/styles/my-component.scss';
```

## Best Practices

1. **Use `styles/` folder** for SCSS files that need processing
2. **Use `public/images/`** for static images
3. **Keep SCSS modular** - separate variables, mixins, and components
4. **Import only what you need** in each component
5. **Use Tailwind for most styling** - SCSS for custom/complex styles

## Next Steps

1. Run `pnpm install` to install Sass
2. Add your images to `public/images/`
3. Create your SCSS files in `styles/`
4. Import them where needed
