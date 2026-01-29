# Public Folder

This folder contains static assets that are served directly by Next.js.

## Structure

```
public/
├── images/          # Static images (logos, icons, etc.)
│   └── .gitkeep
├── scss/            # SCSS files (if needed)
│   └── .gitkeep
└── README.md        # This file
```

## Usage

### Images

Images in the `public/images/` folder can be referenced in your code:

```tsx
// In components
<Image src="/images/logo.png" alt="Logo" width={200} height={50} />

// Or in regular img tags
<img src="/images/hero.jpg" alt="Hero" />
```

**Note**: The `/images/` path is relative to the `public` folder. Next.js automatically serves files from `public/` at the root URL.

### SCSS Files

**Important**: SCSS files are typically placed in a `styles` folder at the project root (not in `public`), and imported into components:

```tsx
// In a component file
import '@/styles/custom.scss';
```

However, if you want to organize SCSS files here, you can:

1. Install Sass: `pnpm add sass`
2. Import in your components: `import '/public/scss/styles.scss'`

**Recommended**: Create a `styles` folder at the root level for SCSS files instead.

## Adding Files

- **Images**: Place image files directly in `public/images/`
- **SCSS**: Consider using `styles/` folder at root, or import from `public/scss/` if needed

## File Naming

- Use lowercase with hyphens: `my-image.jpg`, `hero-banner.png`
- Keep file sizes optimized for web
- Use appropriate formats: `.jpg` for photos, `.png` for graphics with transparency, `.webp` for modern browsers
