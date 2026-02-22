/**
 * Image Generation Utilities
 * 
 * Options:
 * 1. Unsplash API (FREE) - Best for product photos
 * 2. Stable Diffusion API (FREE) - Generate custom images
 * 3. OpenAI DALL-E (PAID) - High quality
 * 4. Replicate API (PAID) - Multiple models
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

/**
 * Generate product image using Unsplash (FREE - Best Option)
 * Unsplash has great supplement/product photos
 */
export async function generateImageWithUnsplash(productName: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("UNSPLASH_ACCESS_KEY not set. Get free key at: https://unsplash.com/developers");
    return null;
  }

  try {
    // Search for product-related images
    const searchQuery = encodeURIComponent(`${productName} supplement product`);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular; // or .small, .thumb, .full
    }

    return null;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}

/**
 * Generate product image using Stable Diffusion (FREE)
 * Requires Stability AI API key (free tier available)
 */
export async function generateImageWithStableDiffusion(productName: string): Promise<string | null> {
  if (!STABILITY_API_KEY) {
    console.warn("STABILITY_API_KEY not set. Get free key at: https://platform.stability.ai");
    return null;
  }

  try {
    const prompt = `professional product photo of ${productName} supplement bottle, white background, studio lighting, high quality`;
    
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.artifacts && data.artifacts.length > 0) {
      // Return base64 image or upload to CDN
      return `data:image/png;base64,${data.artifacts[0].base64}`;
    }

    return null;
  } catch (error) {
    console.error("Error generating image with Stable Diffusion:", error);
    return null;
  }
}

/**
 * Generate product image using OpenAI DALL-E (PAID)
 * High quality but costs money
 */
export async function generateImageWithDALLE(productName: string): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set");
    return null;
  }

  try {
    const prompt = `professional product photo of ${productName} supplement bottle, white background, studio lighting, high quality, product photography`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].url;
    }

    return null;
  } catch (error) {
    console.error("Error generating image with DALL-E:", error);
    return null;
  }
}

/**
 * Smart image generator - tries multiple sources
 * Priority: Unsplash > Stable Diffusion > DALL-E
 */
export async function generateProductImage(productName: string): Promise<string | null> {
  // Option 1: Try Unsplash first (free, fast, real photos)
  const unsplashImage = await generateImageWithUnsplash(productName);
  if (unsplashImage) return unsplashImage;

  // Option 2: Try Stable Diffusion (free, generated)
  const sdImage = await generateImageWithStableDiffusion(productName);
  if (sdImage) return sdImage;

  // Option 3: Try DALL-E (paid, high quality)
  const dalleImage = await generateImageWithDALLE(productName);
  if (dalleImage) return dalleImage;

  // Fallback: Return placeholder
  return `https://via.placeholder.com/300x300/10b981/ffffff?text=${encodeURIComponent(productName)}`;
}

/**
 * Batch generate images for multiple products
 */
export async function generateProductImages(
  products: Array<{ name: string; id: string }>
): Promise<Record<string, string>> {
  const images: Record<string, string> = {};

  // Generate images with delay to respect rate limits
  for (const product of products) {
    const imageUrl = await generateProductImage(product.name);
    if (imageUrl) {
      images[product.id] = imageUrl;
    }
    // Rate limiting: wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return images;
}
