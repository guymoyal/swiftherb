# Styles Folder

This folder is for SCSS/CSS files that are imported into your components.

## Usage

Import SCSS files in your components:

```tsx
import '@/styles/variables.scss';
import '@/styles/components.scss';
```

## Next.js SCSS Support

To use SCSS in Next.js:

1. Install Sass: `pnpm add sass`
2. Create `.scss` files in this folder
3. Import them in your components or `app/globals.css`

## Example Structure

```
styles/
├── variables.scss    # SCSS variables
├── mixins.scss       # SCSS mixins
├── components.scss   # Component styles
└── utilities.scss    # Utility classes
```

## Note

- SCSS files here are processed by Next.js and bundled
- Files in `public/scss/` are served as static files (not processed)
- For stylesheets, use this `styles/` folder (recommended)
- For static assets, use `public/images/`
