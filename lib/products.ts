import { Product } from "@/components/ChatInterface";

/**
 * Mock product database for development
 * In production, this will be replaced with Cloudflare KV lookups
 */
export const MOCK_PRODUCTS: Record<string, Product> = {
  "magnesium_glycinate": {
    id: "MAG001",
    title: "Doctor's Best Magnesium Glycinate",
    price: "$18.50",
    image: "https://images.iherb.com/m/DRB-00087-5.jpg",
    description: "High absorption magnesium to support muscle relaxation and sleep quality.",
    category: "Minerals",
  },
  "vitamin_d3": {
    id: "VITD001",
    title: "Now Foods Vitamin D3 5000 IU",
    price: "$7.99",
    image: "https://images.iherb.com/m/NOW-00607-5.jpg",
    description: "Supports bone health, immune function, and mood regulation.",
    category: "Vitamins",
  },
  "ashwagandha": {
    id: "ASH001",
    title: "Himalaya Ashwagandha Root Extract",
    price: "$12.99",
    image: "https://images.iherb.com/m/HIM-00001-5.jpg",
    description: "Adaptogenic herb that helps reduce stress and support adrenal health.",
    category: "Herbs & Botanicals",
  },
  "omega_3_fish_oil": {
    id: "OMG001",
    title: "Nordic Naturals Ultimate Omega",
    price: "$24.99",
    image: "https://images.iherb.com/m/NOR-00607-5.jpg",
    description: "High-quality fish oil supporting heart, brain, and joint health.",
    category: "Omega-3 & Essential Fatty Acids",
  },
  "probiotics": {
    id: "PRO001",
    title: "Garden of Life Dr. Formulated Probiotics",
    price: "$29.99",
    image: "https://images.iherb.com/m/GOL-00001-5.jpg",
    description: "50 billion CFU probiotic blend for digestive and immune health.",
    category: "Probiotics",
  },
  "l_theanine": {
    id: "LTH001",
    title: "Now Foods L-Theanine 200mg",
    price: "$9.99",
    image: "https://images.iherb.com/m/NOW-00001-5.jpg",
    description: "Promotes relaxation and focus without drowsiness.",
    category: "Amino Acids",
  },
  "rhodiola_rosea": {
    id: "RHO001",
    title: "Gaia Herbs Rhodiola Rosea",
    price: "$19.99",
    image: "https://images.iherb.com/m/GAI-00001-5.jpg",
    description: "Adaptogenic herb that supports energy, endurance, and stress response.",
    category: "Herbs & Botanicals",
  },
  "passionflower_extract": {
    id: "PAS001",
    title: "Nature's Way Passionflower",
    price: "$8.99",
    image: "https://images.iherb.com/m/NAT-00001-5.jpg",
    description: "Calming herb that promotes relaxation and restful sleep.",
    category: "Herbs & Botanicals",
  },
  "b_complex_vitamins": {
    id: "BC001",
    title: "Thorne Research B-Complex #12",
    price: "$22.99",
    image: "https://images.iherb.com/m/THO-00001-5.jpg",
    description: "Complete B-vitamin complex for energy metabolism and nervous system support.",
    category: "Vitamins",
  },
  "magnesium_citrate": {
    id: "MAG002",
    title: "Natural Calm Magnesium Citrate",
    price: "$15.99",
    image: "https://images.iherb.com/m/NAT-00002-5.jpg",
    description: "Fast-absorbing magnesium powder for muscle relaxation and sleep.",
    category: "Minerals",
  },
  "melatonin": {
    id: "MEL001",
    title: "Now Foods Melatonin 3mg",
    price: "$6.99",
    image: "https://images.iherb.com/m/NOW-00002-5.jpg",
    description: "Natural sleep aid that helps regulate sleep-wake cycles.",
    category: "Sleep Support",
  },
  "turmeric_curcumin": {
    id: "TUR001",
    title: "Qunol Turmeric Curcumin Complex",
    price: "$16.99",
    image: "https://images.iherb.com/m/QUN-00001-5.jpg",
    description: "Anti-inflammatory support for joint health and overall wellness.",
    category: "Herbs & Botanicals",
  },
  "zinc": {
    id: "ZIN001",
    title: "Thorne Research Zinc Picolinate",
    price: "$9.99",
    image: "https://images.iherb.com/m/THO-00002-5.jpg",
    description: "Essential mineral for immune function and wound healing.",
    category: "Minerals",
  },
  "vitamin_c": {
    id: "VITC001",
    title: "Now Foods Vitamin C 1000mg",
    price: "$8.99",
    image: "https://images.iherb.com/m/NOW-00003-5.jpg",
    description: "Antioxidant support for immune health and collagen production.",
    category: "Vitamins",
  },
  "iron": {
    id: "IRO001",
    title: "Solgar Gentle Iron",
    price: "$11.99",
    image: "https://images.iherb.com/m/SOL-00001-5.jpg",
    description: "Gentle, non-constipating iron for energy and red blood cell production.",
    category: "Minerals",
  },
  "coenzyme_q10": {
    id: "COQ001",
    title: "Qunol CoQ10 100mg",
    price: "$19.99",
    image: "https://images.iherb.com/m/QUN-00002-5.jpg",
    description: "Antioxidant that supports heart health and cellular energy production.",
    category: "Antioxidants",
  },
  "vitamin_e": {
    id: "VITE001",
    title: "Now Foods Vitamin E 400 IU",
    price: "$10.99",
    image: "https://images.iherb.com/m/NOW-00004-5.jpg",
    description: "Powerful antioxidant supporting skin health and immune function.",
    category: "Vitamins",
  },
  "calcium": {
    id: "CAL001",
    title: "Nature Made Calcium 600mg",
    price: "$8.99",
    image: "https://images.iherb.com/m/NAT-00003-5.jpg",
    description: "Essential mineral for strong bones and teeth.",
    category: "Minerals",
  },
  "ginkgo_biloba": {
    id: "GIN001",
    title: "Nature's Way Ginkgo Biloba",
    price: "$12.99",
    image: "https://images.iherb.com/m/NAT-00004-5.jpg",
    description: "Supports cognitive function, memory, and circulation.",
    category: "Herbs & Botanicals",
  },
  "ginseng": {
    id: "GIN002",
    title: "Gaia Herbs Korean Red Ginseng",
    price: "$24.99",
    image: "https://images.iherb.com/m/GAI-00002-5.jpg",
    description: "Adaptogenic herb that supports energy, stamina, and vitality.",
    category: "Herbs & Botanicals",
  },
  "echinacea": {
    id: "ECH001",
    title: "Nature's Way Echinacea",
    price: "$9.99",
    image: "https://images.iherb.com/m/NAT-00005-5.jpg",
    description: "Immune-supporting herb traditionally used during cold season.",
    category: "Herbs & Botanicals",
  },
  "elderberry": {
    id: "ELD001",
    title: "Sambucol Black Elderberry",
    price: "$14.99",
    image: "https://images.iherb.com/m/SAM-00001-5.jpg",
    description: "Immune support supplement with antioxidant properties.",
    category: "Herbs & Botanicals",
  },
  "green_tea_extract": {
    id: "GTE001",
    title: "Now Foods Green Tea Extract",
    price: "$11.99",
    image: "https://images.iherb.com/m/NOW-00005-5.jpg",
    description: "Antioxidant-rich extract supporting metabolism and wellness.",
    category: "Herbs & Botanicals",
  },
  "milk_thistle": {
    id: "MIL001",
    title: "Now Foods Milk Thistle",
    price: "$9.99",
    image: "https://images.iherb.com/m/NOW-00006-5.jpg",
    description: "Supports liver health and detoxification processes.",
    category: "Herbs & Botanicals",
  },
  "glucosamine_chondroitin": {
    id: "GLC001",
    title: "Doctor's Best Glucosamine Chondroitin MSM",
    price: "$22.99",
    image: "https://images.iherb.com/m/DRB-00088-5.jpg",
    description: "Supports joint health, flexibility, and mobility.",
    category: "Joint Support",
  },
  "collagen_peptides": {
    id: "COL001",
    title: "Vital Proteins Collagen Peptides",
    price: "$27.99",
    image: "https://images.iherb.com/m/VIT-00001-5.jpg",
    description: "Supports skin elasticity, hair, nails, and joint health.",
    category: "Beauty & Skin",
  },
  "biotin": {
    id: "BIO001",
    title: "Now Foods Biotin 5000mcg",
    price: "$7.99",
    image: "https://images.iherb.com/m/NOW-00007-5.jpg",
    description: "B-vitamin supporting healthy hair, skin, and nails.",
    category: "Vitamins",
  },
  "saw_palmetto": {
    id: "SAW001",
    title: "Nature's Way Saw Palmetto",
    price: "$13.99",
    image: "https://images.iherb.com/m/NAT-00006-5.jpg",
    description: "Supports prostate health and urinary function.",
    category: "Men's Health",
  },
  "cranberry_extract": {
    id: "CRA001",
    title: "Now Foods Cranberry Extract",
    price: "$10.99",
    image: "https://images.iherb.com/m/NOW-00008-5.jpg",
    description: "Supports urinary tract health and antioxidant protection.",
    category: "Women's Health",
  },
  "evening_primrose_oil": {
    id: "EVE001",
    title: "Now Foods Evening Primrose Oil",
    price: "$12.99",
    image: "https://images.iherb.com/m/NOW-00009-5.jpg",
    description: "Supports hormonal balance and skin health.",
    category: "Women's Health",
  },
  "valerian_root": {
    id: "VAL001",
    title: "Nature's Way Valerian Root",
    price: "$8.99",
    image: "https://images.iherb.com/m/NAT-00007-5.jpg",
    description: "Calming herb that promotes restful sleep.",
    category: "Sleep Support",
  },
  "5_htp": {
    id: "5HT001",
    title: "Now Foods 5-HTP 100mg",
    price: "$11.99",
    image: "https://images.iherb.com/m/NOW-00010-5.jpg",
    description: "Supports serotonin production for mood and sleep.",
    category: "Mood Support",
  },
  "st_johns_wort": {
    id: "STJ001",
    title: "Nature's Way St. John's Wort",
    price: "$9.99",
    image: "https://images.iherb.com/m/NAT-00008-5.jpg",
    description: "Traditional herb supporting emotional wellness.",
    category: "Mood Support",
  },
  "gaba": {
    id: "GAB001",
    title: "Now Foods GABA 500mg",
    price: "$10.99",
    image: "https://images.iherb.com/m/NOW-00011-5.jpg",
    description: "Amino acid that promotes relaxation and calm.",
    category: "Mood Support",
  },
  "tyrosine": {
    id: "TYR001",
    title: "Now Foods L-Tyrosine 500mg",
    price: "$9.99",
    image: "https://images.iherb.com/m/NOW-00012-5.jpg",
    description: "Amino acid supporting focus, energy, and mood.",
    category: "Amino Acids",
  },
  "creatine": {
    id: "CRE001",
    title: "Now Foods Creatine Monohydrate",
    price: "$12.99",
    image: "https://images.iherb.com/m/NOW-00013-5.jpg",
    description: "Supports muscle strength, power, and exercise performance.",
    category: "Sports Nutrition",
  },
  "whey_protein": {
    id: "WHE001",
    title: "Optimum Nutrition Gold Standard Whey",
    price: "$34.99",
    image: "https://images.iherb.com/m/OPT-00001-5.jpg",
    description: "High-quality protein powder for muscle recovery and growth.",
    category: "Sports Nutrition",
  },
  "bcaa": {
    id: "BCA001",
    title: "Now Foods BCAA Powder",
    price: "$18.99",
    image: "https://images.iherb.com/m/NOW-00014-5.jpg",
    description: "Branched-chain amino acids for muscle recovery and endurance.",
    category: "Sports Nutrition",
  },
  "electrolytes": {
    id: "ELE001",
    title: "Ultima Replenisher Electrolyte Powder",
    price: "$16.99",
    image: "https://images.iherb.com/m/ULT-00001-5.jpg",
    description: "Hydration support with essential electrolytes and minerals.",
    category: "Sports Nutrition",
  },
  "prebiotics": {
    id: "PRE001",
    title: "Now Foods Prebiotic Fiber",
    price: "$14.99",
    image: "https://images.iherb.com/m/NOW-00015-5.jpg",
    description: "Feeds beneficial gut bacteria for digestive health.",
    category: "Digestive Health",
  },
  "digestive_enzymes": {
    id: "DIG001",
    title: "Now Foods Super Enzymes",
    price: "$12.99",
    image: "https://images.iherb.com/m/NOW-00016-5.jpg",
    description: "Supports healthy digestion and nutrient absorption.",
    category: "Digestive Health",
  },
  "fiber_supplement": {
    id: "FIB001",
    title: "Metamucil Psyllium Fiber",
    price: "$15.99",
    image: "https://images.iherb.com/m/MET-00001-5.jpg",
    description: "Soluble fiber supporting digestive regularity and heart health.",
    category: "Digestive Health",
  },
  "aloe_vera": {
    id: "ALO001",
    title: "Lily of the Desert Aloe Vera Juice",
    price: "$11.99",
    image: "https://images.iherb.com/m/LIL-00001-5.jpg",
    description: "Supports digestive comfort and overall wellness.",
    category: "Digestive Health",
  },
  "ginger": {
    id: "GIN003",
    title: "Nature's Way Ginger Root",
    price: "$7.99",
    image: "https://images.iherb.com/m/NAT-00009-5.jpg",
    description: "Supports digestive comfort and nausea relief.",
    category: "Digestive Health",
  },
  "peppermint_oil": {
    id: "PEP001",
    title: "Now Foods Peppermint Oil",
    price: "$8.99",
    image: "https://images.iherb.com/m/NOW-00017-5.jpg",
    description: "Supports digestive comfort and fresh breath.",
    category: "Digestive Health",
  },
  "vitamin_k2": {
    id: "VITK001",
    title: "Now Foods Vitamin K2",
    price: "$13.99",
    image: "https://images.iherb.com/m/NOW-00018-5.jpg",
    description: "Supports bone health and calcium utilization.",
    category: "Vitamins",
  },
  "folate": {
    id: "FOL001",
    title: "Thorne Research Folate",
    price: "$16.99",
    image: "https://images.iherb.com/m/THO-00003-5.jpg",
    description: "Essential B-vitamin for cell division and DNA synthesis.",
    category: "Vitamins",
  },
  "selenium": {
    id: "SEL001",
    title: "Now Foods Selenium",
    price: "$6.99",
    image: "https://images.iherb.com/m/NOW-00019-5.jpg",
    description: "Antioxidant mineral supporting immune function and thyroid health.",
    category: "Minerals",
  },
  "chromium": {
    id: "CHR001",
    title: "Now Foods Chromium Picolinate",
    price: "$5.99",
    image: "https://images.iherb.com/m/NOW-00020-5.jpg",
    description: "Mineral supporting healthy blood sugar metabolism.",
    category: "Minerals",
  },
  "alpha_lipoic_acid": {
    id: "ALA001",
    title: "Now Foods Alpha Lipoic Acid",
    price: "$14.99",
    image: "https://images.iherb.com/m/NOW-00021-5.jpg",
    description: "Powerful antioxidant supporting nerve health and blood sugar.",
    category: "Antioxidants",
  },
  "resveratrol": {
    id: "RES001",
    title: "Now Foods Resveratrol",
    price: "$19.99",
    image: "https://images.iherb.com/m/NOW-00022-5.jpg",
    description: "Antioxidant compound found in red wine supporting longevity.",
    category: "Antioxidants",
  },
  "astaxanthin": {
    id: "AST001",
    title: "Now Foods Astaxanthin",
    price: "$24.99",
    image: "https://images.iherb.com/m/NOW-00023-5.jpg",
    description: "Powerful antioxidant supporting skin health and eye function.",
    category: "Antioxidants",
  },
  "n_acetyl_cysteine": {
    id: "NAC001",
    title: "Now Foods NAC 600mg",
    price: "$15.99",
    image: "https://images.iherb.com/m/NOW-00024-5.jpg",
    description: "Supports respiratory health and antioxidant protection.",
    category: "Respiratory Support",
  },
  "quercetin": {
    id: "QUE001",
    title: "Now Foods Quercetin",
    price: "$12.99",
    image: "https://images.iherb.com/m/NOW-00025-5.jpg",
    description: "Bioflavonoid supporting immune function and allergy relief.",
    category: "Immune Support",
  },
  "nettle_leaf": {
    id: "NET001",
    title: "Nature's Way Nettle Leaf",
    price: "$9.99",
    image: "https://images.iherb.com/m/NAT-00010-5.jpg",
    description: "Supports seasonal wellness and urinary tract health.",
    category: "Herbs & Botanicals",
  },
};

/**
 * Normalizes product name to slug format for lookup
 * Removes special characters and converts to lowercase with underscores
 * 
 * @param name - Product name to normalize
 * @returns Normalized slug string
 */
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

/**
 * Calculates similarity score between two strings using Levenshtein distance
 * Returns a score between 0 (no match) and 1 (exact match)
 * 
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  // Check for exact match or substring match
  if (longer.toLowerCase().includes(shorter.toLowerCase())) {
    return 0.8;
  }
  
  // Simple word-based matching
  const longerWords = longer.toLowerCase().split(/\s+/);
  const shorterWords = shorter.toLowerCase().split(/\s+/);
  let matches = 0;
  
  shorterWords.forEach((word) => {
    if (longerWords.some((lw) => lw.includes(word) || word.includes(lw))) {
      matches++;
    }
  });
  
  return matches / Math.max(shorterWords.length, 1);
}

/**
 * Searches for products by name using improved fuzzy matching
 * Tries multiple matching strategies: exact match, partial match, similarity match
 * 
 * @param productNames - Array of product names to search for
 * @returns Array of matched products, ordered by relevance
 */
export function findProductsByName(productNames: string[]): Product[] {
  const foundProducts: Array<{ product: Product; score: number }> = [];
  const seenIds = new Set<string>();

  for (const name of productNames) {
    const normalized = normalizeProductName(name);
    const nameLower = name.toLowerCase();
    
    // Strategy 1: Exact slug match
    if (MOCK_PRODUCTS[normalized] && !seenIds.has(MOCK_PRODUCTS[normalized].id)) {
      foundProducts.push({ product: MOCK_PRODUCTS[normalized], score: 1.0 });
      seenIds.add(MOCK_PRODUCTS[normalized].id);
      continue;
    }

    // Strategy 2: Partial and similarity matching
    for (const [key, product] of Object.entries(MOCK_PRODUCTS)) {
      if (seenIds.has(product.id)) continue;
      
      const productTitleLower = product.title.toLowerCase();
      let score = 0;
      
      // Check if name is in product title
      if (productTitleLower.includes(nameLower)) {
        score = 0.9;
      }
      // Check if product title contains key words from name
      else if (nameLower.split(/\s+/).some((word) => productTitleLower.includes(word))) {
        score = 0.7;
      }
      // Check similarity
      else {
        score = Math.max(
          calculateSimilarity(nameLower, productTitleLower),
          calculateSimilarity(nameLower, key)
        );
      }
      
      // Only add if score is above threshold
      if (score > 0.5) {
        foundProducts.push({ product, score });
        seenIds.add(product.id);
      }
    }
  }

  // Sort by score (highest first) and return products
  return foundProducts
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

/**
 * Gets a product by slug
 */
export function getProductBySlug(slug: string): Product | null {
  return MOCK_PRODUCTS[slug] || null;
}
