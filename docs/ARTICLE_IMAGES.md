# Article images – how they’re added

## What the script does (automatic)

When you run:

```bash
npm run generate:article-images
```

the script does two things:

1. **Saves image files** into `public/images/articles/`  
   - One file per article, e.g. `magnesium-deficiency-guide.jpg`, `omega-3-complete-guide.jpg`, `probiotics-gut-health.jpg`.

2. **Updates article data** in `data/articles.json`  
   - Each article’s `featuredImage` is set to the local path, e.g. `/images/articles/magnesium-deficiency-guide.jpg`.

You don’t add the images to the articles manually. The script does it by writing both the files and the JSON.

## Where the site uses `featuredImage`

- **Articles list** (`/articles`) – `ArticleCard` uses `article.featuredImage`.
- **Single article** (`/articles/[slug]`) – `ArticleContent` shows the featured image at the top.
- **SEO** – Open Graph and Twitter cards use `article.featuredImage`.

All of that reads from `data/articles.json`, so once the script has run, the images are already “in” the articles.

## After generating

1. Run the script (with optional `--force` to regenerate all):
   ```bash
   npm run generate:article-images
   # or
   npm run generate:article-images -- --force
   ```
2. Check that:
   - `public/images/articles/*.jpg` exist.
   - `data/articles.json` has `"featuredImage": "/images/articles/<slug>.jpg"` for each article.
3. Restart or refresh your dev server if needed and open `/articles` or an article page – the images should show.

No extra step is required to “add” the generated images to the articles; the script already does it by updating `featuredImage` in `data/articles.json`.
