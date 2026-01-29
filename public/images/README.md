# Images Folder

Place your static images here. They will be served at `/images/filename.jpg`

## Usage

### In Components

```tsx
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={50} 
/>
```

### In Regular HTML

```tsx
<img src="/images/hero.jpg" alt="Hero image" />
```

## File Naming

- Use lowercase with hyphens: `my-image.jpg`
- Keep file sizes optimized
- Recommended formats:
  - `.jpg` for photos
  - `.png` for graphics with transparency
  - `.webp` for modern browsers (best compression)
  - `.svg` for icons and logos

## Optimization Tips

1. **Compress images** before adding them
2. **Use Next.js Image component** for automatic optimization
3. **Provide width/height** to prevent layout shift
4. **Use appropriate formats** (WebP when possible)

## Current Files

- `swiftherb-logo.png` - SwiftHerb logo (if exists)
