/**
 * Bundle recommendation system
 * Suggests complementary products that work well together
 */

import { Product } from "@/components/ChatInterface";

/**
 * Product bundle definitions
 * Groups of products that work synergistically
 */
export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  category: string;
  products: string[]; // Product slugs
  benefits: string[];
}

/**
 * Predefined wellness bundles
 */
export const WELLNESS_BUNDLES: Record<string, ProductBundle> = {
  "sleep-support": {
    id: "sleep-support",
    name: "Sleep Support Stack",
    description: "A comprehensive stack for better sleep quality and relaxation",
    category: "Sleep & Relaxation",
    products: ["magnesium_glycinate", "l_theanine", "melatonin", "ashwagandha", "valerian_root"],
    benefits: [
      "Promotes deep, restful sleep",
      "Reduces nighttime wake-ups",
      "Supports natural sleep-wake cycle",
      "Calms the nervous system",
      "Improves sleep quality"
    ],
  },
  "energy-vitality": {
    id: "energy-vitality",
    name: "Energy & Vitality Stack",
    description: "Boost energy levels and combat fatigue naturally",
    category: "Energy & Vitality",
    products: ["b_complex", "coenzyme_q10", "iron", "vitamin_d3", "rhodiola_rosea"],
    benefits: [
      "Increases energy production",
      "Reduces fatigue and tiredness",
      "Supports mitochondrial function",
      "Enhances physical performance",
      "Improves mental alertness"
    ],
  },
  "immune-support": {
    id: "immune-support",
    name: "Immune Support Stack",
    description: "Strengthen your immune system with essential nutrients",
    category: "Immune Health",
    products: ["vitamin_d3", "vitamin_c", "zinc", "probiotics", "elderberry"],
    benefits: [
      "Supports immune function",
      "Reduces infection risk",
      "Enhances white blood cell activity",
      "Supports gut health (70% of immune system)",
      "Provides antioxidant protection"
    ],
  },
  "stress-management": {
    id: "stress-management",
    name: "Stress Management Stack",
    description: "Natural support for managing stress and anxiety",
    category: "Stress & Mood",
    products: ["ashwagandha", "magnesium_glycinate", "l_theanine", "rhodiola_rosea", "b_complex"],
    benefits: [
      "Reduces cortisol levels",
      "Promotes calm and relaxation",
      "Supports adrenal health",
      "Improves stress resilience",
      "Balances mood"
    ],
  },
  "heart-health": {
    id: "heart-health",
    name: "Heart Health Stack",
    description: "Support cardiovascular health with evidence-based nutrients",
    category: "Heart Health",
    products: ["omega_3_fish_oil", "coenzyme_q10", "magnesium_glycinate", "vitamin_d3", "garlic"],
    benefits: [
      "Supports healthy cholesterol levels",
      "Reduces inflammation",
      "Improves blood pressure",
      "Supports heart muscle function",
      "Enhances circulation"
    ],
  },
  "brain-health": {
    id: "brain-health",
    name: "Brain Health Stack",
    description: "Optimize cognitive function and brain health",
    category: "Brain & Cognitive",
    products: ["omega_3_fish_oil", "b_complex", "vitamin_d3", "ginkgo_biloba", "phosphatidylserine"],
    benefits: [
      "Supports memory and focus",
      "Enhances cognitive function",
      "Protects brain cells",
      "Improves mental clarity",
      "Supports neurotransmitter production"
    ],
  },
  "digestive-health": {
    id: "digestive-health",
    name: "Digestive Health Stack",
    description: "Support optimal digestion and gut health",
    category: "Digestive Health",
    products: ["probiotics", "digestive_enzymes", "fiber_supplements", "ginger", "peppermint_oil"],
    benefits: [
      "Supports healthy gut microbiome",
      "Improves digestion",
      "Reduces bloating and discomfort",
      "Enhances nutrient absorption",
      "Supports regular bowel movements"
    ],
  },
  "bone-joint": {
    id: "bone-joint",
    name: "Bone & Joint Health Stack",
    description: "Maintain strong bones and flexible joints",
    category: "Bone & Joint",
    products: ["calcium", "vitamin_d3", "magnesium_glycinate", "glucosamine", "collagen"],
    benefits: [
      "Supports bone density",
      "Reduces joint discomfort",
      "Improves flexibility",
      "Enhances calcium absorption",
      "Supports cartilage health"
    ],
  },
};

/**
 * Get bundle by ID
 */
export function getBundleById(bundleId: string): ProductBundle | null {
  return WELLNESS_BUNDLES[bundleId] || null;
}

/**
 * Get all bundles
 */
export function getAllBundles(): ProductBundle[] {
  return Object.values(WELLNESS_BUNDLES);
}

/**
 * Get bundles by category
 */
export function getBundlesByCategory(category: string): ProductBundle[] {
  return Object.values(WELLNESS_BUNDLES).filter(
    (bundle) => bundle.category === category
  );
}

/**
 * Find bundles that include specific products
 */
export function findBundlesWithProducts(productSlugs: string[]): ProductBundle[] {
  return Object.values(WELLNESS_BUNDLES).filter((bundle) =>
    productSlugs.some((slug) => bundle.products.includes(slug))
  );
}

/**
 * Suggest complementary products for existing products
 */
export function suggestComplementaryProducts(
  currentProducts: string[]
): string[] {
  const suggestions: string[] = [];
  const seen = new Set(currentProducts);

  // Find bundles that include current products
  const relevantBundles = findBundlesWithProducts(currentProducts);

  // Collect products from relevant bundles that aren't already in the stack
  relevantBundles.forEach((bundle) => {
    bundle.products.forEach((productSlug) => {
      if (!seen.has(productSlug)) {
        suggestions.push(productSlug);
        seen.add(productSlug);
      }
    });
  });

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

/**
 * Calculate bundle savings (if applicable)
 */
export function calculateBundleSavings(
  bundle: ProductBundle,
  products: Product[]
): number {
  // This would calculate savings if bundle pricing is available
  // For now, return 0 (can be enhanced later)
  return 0;
}
