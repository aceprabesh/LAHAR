/**
 * LAHAR - Product Data
 *
 * Sample product data for frontend prototype.
 * This data should be replaced by PHP/MySQL backend responses.
 *
 * TO CONNECT BACKEND:
 * 1. Remove this data file or keep as fallback
 * 2. Update ProductService.getAll() to call api.get('/products')
 * 3. Update ProductService.getBySlug() to call api.get('/products/:slug', { slug })
 */

const PRODUCTS = [
  {
    id: 1,
    name: "AABHA FLOW DRESS",
    slug: "aabha-flow-dress",
    shortDescription: "Effortless movement in every fold",
    price: 14500,
    originalPrice: null,
    category: "dresses",
    subcategory: "flowing",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80"
    ],
    colors: [
      { name: "Sand", hex: "#D8C7AD" },
      { name: "Terracotta", hex: "#A65D45" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 10,
    featured: true,
    newArrival: true,
    description: "The Aabha Flow Dress moves with you, not against you. Crafted from our signature linen-cotton blend, its relaxed silhouette and subtle A-line create an effortless elegance perfect for warm Nepali afternoons.",
    material: "55% Linen, 45% Cotton. Gentle machine wash cold. Line dry in shade. Iron on medium heat.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Gentle machine wash cold. Line dry in shade. Iron on medium heat.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  },
  {
    id: 2,
    name: "JUNELI WRAP SET",
    slug: "juneli-wrap-set",
    shortDescription: "Two pieces, infinite possibilities",
    price: 18900,
    originalPrice: null,
    category: "sets",
    subcategory: "co-ord",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
    ],
    colors: [
      { name: "Ivory", hex: "#F5F0E8" },
      { name: "Sage", hex: "#7B8068" }
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 8,
    featured: true,
    newArrival: true,
    description: "The Juneli Wrap Set redefines versatility. The adjustable wrap top pairs beautifully with the wide-leg trousers, creating looks that flow from morning chai to evening gatherings with effortless grace.",
    material: "100% Organic Cotton. Hand wash recommended. Dry flat. Cool iron.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Hand wash recommended. Dry flat. Cool iron.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  },
  {
    id: 3,
    name: "LAHAR LINEN TOP",
    slug: "lahar-linen-top",
    shortDescription: "Essential simplicity",
    price: 7500,
    originalPrice: null,
    category: "tops",
    subcategory: "basics",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80"
    ],
    colors: [
      { name: "Charcoal", hex: "#1C1C1A" },
      { name: "Sand", hex: "#D8C7AD" },
      { name: "Ivory", hex: "#F5F0E8" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 15,
    featured: true,
    newArrival: false,
    description: "The essential top your wardrobe deserves. Our signature linen top features a relaxed fit, subtle V-neck, and delicate stitching details that elevate it beyond the ordinary.",
    material: "100% European Linen. Machine wash cold. Tumble dry low. Softens beautifully with each wash.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Machine wash cold. Tumble dry low.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  },
  {
    id: 4,
    name: "RITU WIDE-LEG TROUSER",
    slug: "ritu-wide-leg-trouser",
    shortDescription: "Flowing silhouette, confident stride",
    price: 9800,
    originalPrice: null,
    category: "bottoms",
    subcategory: "trousers",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&q=80"
    ],
    colors: [
      { name: "Sand", hex: "#D8C7AD" },
      { name: "Charcoal", hex: "#1C1C1A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 12,
    featured: true,
    newArrival: false,
    description: "Named after the Nepali word for season, the Ritu Trousers embody adaptability. The high waist and wide-leg silhouette create an elongating effect, while the flowing fabric ensures unrestricted movement.",
    material: "70% Viscose, 30% Linen. Hand wash or gentle machine wash. Line dry. Iron on low.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Hand wash or gentle machine wash. Line dry. Iron on low.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  },
  {
    id: 5,
    name: "NAMUNA PRINTED BLOUSE",
    slug: "namuna-printed-blouse",
    shortDescription: "Heritage reimagined",
    price: 8500,
    originalPrice: 10500,
    category: "tops",
    subcategory: "blouses",
    images: [
      "https://images.unsplash.com/photo-1583396346-8c0a4d8a3e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800&q=80"
    ],
    colors: [
      { name: "Terracotta", hex: "#A65D45" },
      { name: "Sage", hex: "#7B8068" }
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 6,
    featured: false,
    newArrival: true,
    description: "The Namuna Blouse celebrates Nepali craft traditions with a contemporary twist. Block-printed by local artisans, each piece features unique patterns that tell stories of our cultural heritage.",
    material: "100% Cotton with block-print. Hand wash only. Dry in shade. Cool iron.",
    shipping: "Free shipping within Kathmandu. Delivery in 3-5 business days. Free returns within 14 days.",
    care: "Hand wash only. Dry in shade. Cool iron.",
    available: true,
    availableIn: "Kathmandu, Pokhara"
  },
  {
    id: 6,
    name: "SIRA midi dress",
    slug: "sira-midi-dress",
    shortDescription: "Elegance in motion",
    price: 12500,
    originalPrice: null,
    category: "dresses",
    subcategory: "midi",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80"
    ],
    colors: [
      { name: "Ivory", hex: "#F5F0E8" },
      { name: "Sand", hex: "#D8C7AD" }
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 9,
    featured: false,
    newArrival: false,
    description: "The Sira Midi Dress captures the essence of quiet luxury. Its midi length and subtle pleating create a refined silhouette, while the breathable fabric makes it perfect for any occasion.",
    material: "Silk-blend fabric. Dry clean only. Store folded.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Dry clean only.",
    available: true,
    availableIn: "Kathmandu"
  },
  {
    id: 7,
    name: "PASHMINA SHAWL",
    slug: "pashmina-shawl",
    shortDescription: "Wrap yourself in warmth",
    price: 6500,
    originalPrice: null,
    category: "accessories",
    subcategory: "shawls",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
      "https://images.unsplash.com/photo-1584670747417-594a9412fba5?w=800&q=80"
    ],
    colors: [
      { name: "Charcoal", hex: "#1C1C1A" },
      { name: "Sand", hex: "#D8C7AD" },
      { name: "Terracotta", hex: "#A65D45" },
      { name: "Sage", hex: "#7B8068" }
    ],
    sizes: ["One Size"],
    stock: 20,
    featured: false,
    newArrival: true,
    description: "Our Pashmina Shawl is a tribute to Himalayan craftsmanship. Lightweight yet warm, it drapes beautifully and adds an instant polish to any outfit, from casual to formal.",
    material: "Pashmina wool blend (70% wool, 30% cashmere). Dry clean only.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-3 business days. Free returns within 14 days.",
    care: "Dry clean only.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  },
  {
    id: 8,
    name: "KIRAN MAXI SKIRT",
    slug: "kiran-maxi-skirt",
    shortDescription: "Dance through your day",
    price: 11200,
    originalPrice: null,
    category: "bottoms",
    subcategory: "skirts",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
      "https://images.unsplash.com/photo-1562572159-4efd90232581?w=800&q=80"
    ],
    colors: [
      { name: "Sand", hex: "#D8C7AD" },
      { name: "Terracotta", hex: "#A65D45" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 7,
    featured: false,
    newArrival: false,
    description: "The Kiran Maxi Skirt flows with every step. Featuring a flattering waistband and side slit for movement, this maxi skirt transitions effortlessly from day to evening.",
    material: "100% Rayon. Hand wash cold. Line dry. Iron on low.",
    shipping: "Free shipping within Kathmandu. Delivery in 2-4 business days. Free returns within 14 days.",
    care: "Hand wash cold. Line dry. Iron on low.",
    available: true,
    availableIn: "Kathmandu, Pokhara, and major cities"
  }
];

// Product categories
const CATEGORIES = [
  { id: 1, name: "Dresses", slug: "dresses", count: 3 },
  { id: 2, name: "Tops", slug: "tops", count: 3 },
  { id: 3, name: "Bottoms", slug: "bottoms", count: 3 },
  { id: 4, name: "Sets", slug: "sets", count: 1 },
  { id: 5, name: "Accessories", slug: "accessories", count: 1 }
];

// Journal/editorial content
const JOURNAL_ARTICLES = [
  {
    id: 1,
    title: "THE ART OF MOVEMENT",
    slug: "the-art-of-movement",
    category: "Philosophy",
    excerpt: "How the clothes we wear reflect the lives we want to live — and why movement matters more than perfection.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    date: "2026-08-01",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "A STORY IN FABRIC",
    slug: "a-story-in-fabric",
    category: "Craft",
    excerpt: "From Himalayan valleys to your wardrobe — the journey of our signature linen and the artisans who weave it.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    date: "2026-07-15",
    readTime: "7 min read",
    featured: true
  },
  {
    id: 3,
    title: "DRESSING YOUR OWN WAVE",
    slug: "dressing-your-own-wave",
    category: "Style",
    excerpt: "Personal expression isn't about following trends. It's about understanding your own rhythm and letting your style flow.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    date: "2026-07-01",
    readTime: "4 min read",
    featured: true
  }
];

/**
 * Product Service
 * Handles all product-related data operations
 *
 * Currently uses local data, but structured for easy backend integration
 */
const ProductService = {
  /**
   * Get all products
   * @param {object} filters - Optional filters { category, minPrice, maxPrice, size, color, sort }
   */
  getAll: (filters = {}) => {
    let results = [...PRODUCTS];

    // Apply category filter
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    // Apply size filter
    if (filters.size) {
      results = results.filter(p => p.sizes.includes(filters.size));
    }

    // Apply color filter
    if (filters.color) {
      results = results.filter(p =>
        p.colors.some(c => c.name.toLowerCase() === filters.color.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    // Apply featured filter
    if (filters.featured) {
      results = results.filter(p => p.featured);
    }

    // Apply new arrivals filter
    if (filters.newArrivals) {
      results = results.filter(p => p.newArrival);
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => b.newArrival - a.newArrival);
          break;
        case 'name':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // 'featured' - featured items first
          results.sort((a, b) => b.featured - a.featured);
      }
    }

    return results;
  },

  /**
   * Get product by slug
   * @param {string} slug - Product URL slug
   */
  getBySlug: (slug) => {
    return PRODUCTS.find(p => p.slug === slug);
  },

  /**
   * Get product by ID
   * @param {number} id - Product ID
   */
  getById: (id) => {
    return PRODUCTS.find(p => p.id === id);
  },

  /**
   * Get featured products
   */
  getFeatured: () => {
    return PRODUCTS.filter(p => p.featured).slice(0, 4);
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: () => {
    return PRODUCTS.filter(p => p.newArrival);
  },

  /**
   * Get products by category
   * @param {string} categorySlug - Category URL slug
   */
  getByCategory: (categorySlug) => {
    return PRODUCTS.filter(p => p.category === categorySlug);
  },

  /**
   * Get all categories
   */
  getCategories: () => {
    return CATEGORIES;
  },

  /**
   * Get related products (same category, excluding current)
   * @param {string} slug - Current product slug
   * @param {number} limit - Number of related products to return
   */
  getRelated: (slug, limit = 4) => {
    const product = Products.getBySlug(slug);
    if (!product) return [];

    return PRODUCTS
      .filter(p => p.category === product.category && p.slug !== slug)
      .slice(0, limit);
  },

  /**
   * Search products
   * @param {string} query - Search query
   */
  search: (query) => {
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
};

// Export for module use
export { PRODUCTS, CATEGORIES, JOURNAL_ARTICLES, ProductService };
