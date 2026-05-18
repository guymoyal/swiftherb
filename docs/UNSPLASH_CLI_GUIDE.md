# Unsplash CLI Tool Guide

A flexible command-line tool for generating images using the Unsplash API.

## Setup

1. Get your free Unsplash API key:
   - Go to: https://unsplash.com/developers
   - Register as a developer
   - Create a new application
   - Copy your Access Key

2. Add to your `.env` file:
   ```env
   UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

3. Make sure `tsx` is installed:
   ```bash
   npm install --save-dev tsx
   ```

## Usage

### Generate Custom Image

Search for any image with a custom query:

```bash
npm run unsplash:image "vitamin supplements"
```

**Options:**
- `--orientation <landscape|portrait|squarish>` - Image orientation
- `--size <small|regular|full|raw>` - Image size (default: regular)
- `--output <path>` - Save URL to file
- `--update <file>` - Update existing JSON file with image URL

**Examples:**
```bash
# Landscape image
npm run unsplash:image "health wellness" --orientation landscape

# Save to file
npm run unsplash:image "supplements" --output image-url.txt

# Update JSON file
npm run unsplash:image "product photo" --update data/product.json
```

### Generate Article Image

Generate images optimized for articles (landscape orientation):

```bash
npm run unsplash:article "Benefits of Vitamin D" "nutrition"
```

**Examples:**
```bash
# With category
npm run unsplash:article "How to Improve Sleep" "wellness"

# Without category
npm run unsplash:article "Natural Remedies for Anxiety"

# Save to file
npm run unsplash:article "Article Title" --output article-image.txt
```

### Generate Product Image

Generate images optimized for products (square orientation):

```bash
npm run unsplash:product "Magnesium Glycinate"
```

**Examples:**
```bash
npm run unsplash:product "Omega-3 Fish Oil"
npm run unsplash:product "Probiotics" --size full
```

### Batch Generate Images

Process multiple items from a JSON file:

```bash
npm run unsplash:batch data/articles.json --type article --output results.json
```

**Input JSON Format:**

For articles:
```json
[
  {
    "id": "article-1",
    "title": "Benefits of Vitamin D",
    "category": "nutrition"
  },
  {
    "id": "article-2",
    "title": "Natural Sleep Remedies",
    "category": "wellness"
  }
]
```

For products:
```json
[
  {
    "id": "product-1",
    "title": "Magnesium Glycinate",
    "name": "Magnesium Glycinate"
  },
  {
    "id": "product-2",
    "title": "Omega-3 Fish Oil"
  }
]
```

For custom queries:
```json
[
  {
    "id": "item-1",
    "query": "health supplements"
  },
  {
    "id": "item-2",
    "query": "wellness products"
  }
]
```

**Batch Options:**
- `--type <article|product|custom>` - Type of items to process
- `--output <file>` - Save results to JSON file

**Examples:**
```bash
# Process articles
npm run unsplash:batch data/articles.json --type article --output article-images.json

# Process products
npm run unsplash:batch data/products.json --type product --output product-images.json

# Custom queries
npm run unsplash:batch data/queries.json --type custom --output custom-images.json
```

## Output

### Single Image
The tool outputs the image URL to stdout:
```
🔍 Searching Unsplash for: "vitamin supplements"...
✅ Found image: https://images.unsplash.com/photo-...
   Dimensions: 1920x1080
   Description: Vitamin supplements on white background

📋 Image URL:
https://images.unsplash.com/photo-...
```

### Batch Processing
Results are saved as JSON:
```json
[
  {
    "id": "article-1",
    "query": "Benefits of Vitamin D nutrition",
    "imageUrl": "https://images.unsplash.com/photo-..."
  },
  {
    "id": "article-2",
    "query": "Natural Sleep Remedies wellness",
    "imageUrl": "https://images.unsplash.com/photo-..."
  }
]
```

## Rate Limits

Unsplash allows **50 requests per hour** for free tier. The CLI automatically adds a 1-second delay between requests in batch mode to respect rate limits.

## Image Sizes

- `small` - 400px width
- `regular` - 1080px width (default)
- `full` - Full resolution (may be large)
- `raw` - Original upload size

## Orientations

- `landscape` - Wide images (good for articles)
- `portrait` - Tall images
- `squarish` - Square images (good for products)

## Examples

### Update Article Images
```bash
# Single article
npm run unsplash:article "New Article Title" "category" --update data/articles/article-1.json

# Batch update all articles
npm run unsplash:batch data/articles.json --type article --output article-images.json
```

### Generate Product Images
```bash
# Single product
npm run unsplash:product "New Product Name"

# Batch generate
npm run unsplash:batch data/products.json --type product --output product-images.json
```

### Custom Use Cases
```bash
# Generate hero image
npm run unsplash:image "health wellness hero" --orientation landscape --size full --output hero-image.txt

# Generate thumbnail
npm run unsplash:image "supplement" --orientation squarish --size small --output thumbnail.txt
```

## Troubleshooting

**Error: UNSPLASH_ACCESS_KEY not set**
- Make sure you've added the key to your `.env` file
- Restart your terminal or reload environment variables

**Error: No images found**
- Try a different search query
- Check spelling
- Use more generic terms

**Error: Rate limit exceeded**
- Wait an hour before making more requests
- Use batch mode which automatically adds delays

## Tips

1. **Better Search Results**: Use specific, descriptive queries
   - Good: "vitamin d supplement bottle white background"
   - Bad: "vitamin"

2. **Batch Processing**: Use batch mode for multiple items to respect rate limits

3. **Save Results**: Always use `--output` for batch operations to save results

4. **Update Files**: Use `--update` to automatically update JSON files with image URLs

---

*Last Updated: February 2025*
