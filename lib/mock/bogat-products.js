/**
 * Mock product data for Bogat & partner materials.
 * Switch back to live API by setting USE_MOCK_DATA = false in:
 *   - app/(user)/bogat/materials/page.jsx
 *   - app/(user)/materials/[slug]/page.jsx
 *
 * Core fields mirror the live API shape exactly.
 * Extended fields (variants, features, featuresList, specifications,
 * materialDetails, components, trustBadges, warranty, vatInclusive)
 * are optional — the detail page degrades gracefully if absent.
 *
 * Image convention: /mock-products/{folder}/primary.jpeg  (hero)
 *                   /mock-products/{folder}/1.jpeg … N.jpeg (gallery)
 */

// ---------------------------------------------------------------------------
// Shared trust-badge sets
// ---------------------------------------------------------------------------
const BOGAT_TRUST_BADGES = [
  { label: "100% Authentic", description: "Genuine products only" },
  { label: "Quality You Can Trust", description: "Carefully selected premium products" },
  { label: "Fast Delivery", description: "Across Abuja & Lagos" },
  { label: "Expert Support", description: "We're here to help you" },
  { label: "Bogat Promise", description: "Premium quality. Timeless style. Trusted by professionals." },
];

const XM_TRUST_BADGES = [
  { label: "100% Authentic", description: "Genuine products only" },
  { label: "Quality You Can Trust", description: "Carefully selected premium products" },
  { label: "Fast Delivery", description: "Across Abuja & Lagos" },
  { label: "Expert Support", description: "We're here to help you" },
  { label: "XM Promise", description: "Premium quality. Timeless style. Trusted by professionals." },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const BOGAT_PRODUCTS = [

  // ── 1. Modern Vanity Set (Bogat) ─────────────────────────────────────────
  {
    id: "bogat-mvs-001",
    slug: "modern-vanity-set",
    sku: "BGT-MVS-001",
    name: "Modern Vanity Set",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathroom-vanity",
    categoryName: "Bathroom Vanity",
    productTypeName: "Product",
    isFeatured: true,

    price: 600000,
    compareAtPrice: null,
    priceDisplay: "₦600,000",
    showPrice: true,
    vatInclusive: false,
    warranty: null,

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/vanity-set/primary.jpeg",
    images: [
      "/mock-products/vanity-set/primary.jpeg",
      "/mock-products/vanity-set/1.jpeg",
      "/mock-products/vanity-set/2.jpeg",
      "/mock-products/vanity-set/3.jpeg",
    ],

    shortDescription:
      "Premium bathroom vanity set with ceramic basin, sintered stone top, and soft-close storage. Available in 60 cm, 80 cm, and 1.2 m.",
    description:
      "The Modern Vanity Set from Bogat by TBM combines luxury materials with smart design. Features a smooth ceramic basin, scratch-resistant sintered stone top, and a spacious wall-mounted cabinet with soft-close hinges. Available in three widths to fit any bathroom layout.",

    tags: ["vanity", "bathroom", "basin", "modern", "bogat", "sintered stone"],
    rating: 4.8,
    reviewCount: 24,
    ratingDistribution: { 5: 75, 4: 15, 3: 7, 2: 2, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Stylish | Functional | Durable",

    variants: [
      { id: "60cm",  label: "60cm Vanity Set", dimensions: "60cm (W) × 48cm (D) × 55cm (H)", price: 600000,  priceDisplay: "₦600,000",   image: null },
      { id: "80cm",  label: "80cm Vanity Set", dimensions: "80cm (W) × 48cm (D) × 55cm (H)", price: 700000,  priceDisplay: "₦700,000",   image: null },
      { id: "120cm", label: "1.2m Vanity Set", dimensions: "120cm (W) × 48cm (D) × 55cm (H)", price: 900000, priceDisplay: "₦900,000",   image: null },
    ],

    features: [
      { icon: "diamond",   label: "Premium Materials",              description: "High-quality & durable" },
      { icon: "waterproof", label: "Waterproof & Moisture Resistant", description: "Built for humid environments" },
      { icon: "sparkles",  label: "Modern Design",                  description: "Sleek, stylish & elegant finish" },
      { icon: "storage",   label: "Spacious Storage",               description: "Large space for essentials" },
      { icon: "shield",    label: "Durable Build",                  description: "Built to last for years" },
    ],

    materialDetails: [
      { label: "Ceramic Basin",     subtitle: "Smooth, durable & easy to clean",      image: "/mock-products/vanity-set/1.jpeg" },
      { label: "Sintered Stone Top", subtitle: "Scratch-resistant, stain-resistant",   image: "/mock-products/vanity-set/2.jpeg" },
      { label: "Spacious Storage",  subtitle: "Keep your bathroom neat & organised",   image: "/mock-products/vanity-set/3.jpeg" },
    ],

    components: [
      { label: "Soft-Close Hinges",  description: "Quiet, smooth & long-lasting",      image: "/mock-products/vanity-set/1.jpeg" },
      { label: "Premium Handles",    description: "Ergonomic & stylish design",         image: "/mock-products/vanity-set/2.jpeg" },
      { label: "Towel Bar",          description: "Integrated bar for convenience",     image: "/mock-products/vanity-set/3.jpeg" },
      { label: "Wall-Mounted Design", description: "Saves space & easy to clean",       image: "/mock-products/vanity-set/primary.jpeg" },
    ],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 2. Wall Mounted Basin Mixer (Bogat) ──────────────────────────────────
  {
    id: "bogat-wmbm-001",
    slug: "wall-mounted-basin-mixer",
    sku: "TBM-WMBM01",
    name: "Wall Mounted Basin Mixer",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathroom-faucets",
    categoryName: "Bathroom Faucets",
    productTypeName: "Product",
    isFeatured: true,

    price: 120000,
    compareAtPrice: null,
    priceDisplay: "₦120,000",
    showPrice: true,
    vatInclusive: false,
    warranty: "1 Year",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/basin-mixer/primary.jpeg",
    images: [
      "/mock-products/basin-mixer/primary.jpeg",
      "/mock-products/basin-mixer/1.jpeg",
      "/mock-products/basin-mixer/2.jpeg",
      "/mock-products/basin-mixer/3.jpeg",
    ],

    shortDescription:
      "A premium wall mounted basin mixer crafted from solid brass with a brushed gold finish. Saves space and adds elegance with smooth single lever control.",
    description:
      "A premium wall mounted basin mixer crafted from solid brass with a brushed gold finish. Designed for modern bathrooms, it saves space and adds elegance with smooth single lever control.",

    tags: ["basin mixer", "faucet", "bathroom", "bogat", "brushed gold", "wall mounted"],
    rating: 4.7,
    reviewCount: 18,
    ratingDistribution: { 5: 70, 4: 20, 3: 7, 2: 2, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Luxury | Minimal | Durable",

    variants: [],

    features: [
      { icon: "diamond",   label: "Premium Brass",               description: "High quality & durable" },
      { icon: "sparkles",  label: "Luxury Finish",               description: "Elegant brushed gold finish" },
      { icon: "waterproof", label: "Smooth Control",              description: "Easy to use single lever" },
      { icon: "storage",   label: "Space Saving",                description: "Wall mounted minimal design" },
      { icon: "shield",    label: "Rust & Corrosion Resistant",  description: "Built to last longer" },
    ],

    specifications: [
      { label: "Model No.",         value: "TBM-WMBM01" },
      { label: "Material",          value: "Solid Brass" },
      { label: "Installation Type", value: "Wall Mounted" },
      { label: "Control Type",      value: "Single Lever" },
      { label: "Finish",            value: "Brushed Gold" },
      { label: "Valve Core",        value: "Ceramic Cartridge" },
      { label: "Water Pressure",    value: "0.05 – 0.75 MPa" },
      { label: "Usage",             value: "Bathrooms / Hotels / Apartments" },
    ],

    dimensions: "200mm reach × 75mm height × 70mm flange diameter × 110mm handle length",

    materialDetails: [
      { label: "Minimalist Design",       subtitle: "Clean lines, modern look",          image: "/mock-products/basin-mixer/1.jpeg" },
      { label: "Smooth Single Lever",     subtitle: "Precise & effortless control",      image: "/mock-products/basin-mixer/2.jpeg" },
      { label: "Perfect for Modern Homes", subtitle: "Luxury meets functionality",       image: "/mock-products/basin-mixer/3.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 3. Modern Vanity Combo (XM Bathroom) ─────────────────────────────────
  {
    id: "xm-mvc-202310",
    slug: "modern-vanity-combo-xm",
    sku: "XM-202310",
    name: "Modern Vanity Combo",
    brandName: "XM Bathroom",
    brandType: "XM",
    categoryId: "bathroom-vanity",
    categoryName: "Bathroom Vanity",
    productTypeName: "Product",
    isFeatured: true,

    price: 850000,
    compareAtPrice: null,
    priceDisplay: "₦850,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "5 Years",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/vanity-combo/primary.jpeg",
    images: [
      "/mock-products/vanity-combo/primary.jpeg",
      "/mock-products/vanity-combo/1.jpeg",
    ],

    shortDescription:
      "Sleek, modern vanity combo with smart LED mirror, soft-close storage, and premium ceramic basin. Available in 60 cm, 80 cm, and 1.2 m.",
    description:
      "Sleek, modern design with premium materials and smart LED features. Perfect for contemporary bathrooms. Includes LED smart mirror with touch control, soft-close doors & drawers, ample storage with open & enclosed shelves, waterproof plywood construction, and premium ceramic basin with marble finish.",

    tags: ["vanity", "bathroom", "LED mirror", "modern", "XM", "combo"],
    rating: 4.9,
    reviewCount: 31,
    ratingDistribution: { 5: 80, 4: 12, 3: 5, 2: 2, 1: 1 },

    collection: "XM Bathroom",
    collectionSubtitle: "Elegance Meets Function",
    tagline: "Luxury | Modern | Functional",

    variants: [
      { id: "60cm",  label: "60CM", dimensions: "600 × 500 × 500mm",  price: 850000,  priceDisplay: "₦850,000",   image: null },
      { id: "80cm",  label: "80CM", dimensions: "800 × 500 × 500mm",  price: 970000,  priceDisplay: "₦970,000",   image: null },
      { id: "120cm", label: "1.2M", dimensions: "1200 × 500 × 500mm", price: 1350000, priceDisplay: "₦1,350,000", image: null },
    ],

    featuresList: [
      "LED smart mirror with touch control",
      "Soft-close doors & drawers",
      "Ample storage with open & enclosed shelves",
      "Waterproof & moisture-resistant plywood",
      "Premium ceramic basin with marble finish",
      "Wall-mounted design for a modern look",
    ],

    features: [
      { icon: "sparkles",  label: "LED Lighting",    description: "Warm & bright ambiance" },
      { icon: "shield",    label: "Soft Close",      description: "Quiet & smooth operation" },
      { icon: "storage",   label: "Ample Storage",   description: "Organise all your essentials" },
      { icon: "diamond",   label: "Wall Mounted",    description: "Space-saving & stylish" },
      { icon: "waterproof", label: "Premium Finish", description: "Elegant gray with gold accents" },
    ],

    specifications: [
      { label: "Brand Name",       value: "XM" },
      { label: "Model Number",     value: "XM-202310" },
      { label: "Style",            value: "Modern" },
      { label: "Type",             value: "Vanity Combo" },
      { label: "Installation",     value: "Wall Mounted" },
      { label: "Main Material",    value: "Plywood" },
      { label: "Basin Material",   value: "Ceramic / Artificial Marble" },
      { label: "Countertop",       value: "Artificial Marble" },
      { label: "Finish",           value: "Lacquer" },
      { label: "Color",            value: "Gray with Gold Accents" },
      { label: "Warranty",         value: "5 Years" },
      { label: "After-sale Service", value: "Online Technical Support, Free Spare Parts" },
    ],

    materialDetails: [
      { label: "Main Cabinet (with Basin)", subtitle: "600 × 500 × 500mm", image: "/mock-products/vanity-combo/primary.jpeg" },
      { label: "LED Mirror Cabinet",        subtitle: "600 × 120 × 700mm", image: "/mock-products/vanity-combo/1.jpeg" },
    ],

    components: [],

    trustBadges: XM_TRUST_BADGES,
  },

  // ── 4. Premium LED Vanity Cabinet (Bogat) ────────────────────────────────
  {
    id: "bogat-lvc-001",
    slug: "premium-led-vanity-cabinet",
    sku: "BGT-LVC-001",
    name: "Premium LED Vanity Cabinet",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathroom-vanity",
    categoryName: "Bathroom Vanity",
    productTypeName: "Product",
    isFeatured: true,

    price: 800000,
    compareAtPrice: null,
    priceDisplay: "₦800,000",
    showPrice: true,
    vatInclusive: false,
    warranty: null,

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/vanity-cabinet/primary.jpeg",
    images: [
      "/mock-products/vanity-cabinet/primary.jpeg",
      "/mock-products/vanity-cabinet/1.jpeg",
      "/mock-products/vanity-cabinet/2.jpeg",
    ],

    shortDescription:
      "Premium wall-mounted vanity cabinet with LED ambient lighting, textured drawer fronts, and a spacious ceramic basin. Available in 60 cm, 80 cm, and 1.2 m.",
    description:
      "A premium wall-mounted vanity cabinet combining a timeless textured finish with smart LED ambient lighting. Featuring spacious drawers for maximum storage, a ceramic basin countertop, and a built-in LED mirror cabinet — designed to elevate any modern bathroom.",

    tags: ["vanity", "bathroom", "LED", "cabinet", "bogat", "premium", "textured"],
    rating: 4.8,
    reviewCount: 19,
    ratingDistribution: { 5: 74, 4: 16, 3: 7, 2: 2, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Stylish | Functional | Durable",

    variants: [
      { id: "60cm",  label: "60cm Vanity Cabinet", dimensions: "60cm (W) × 50cm (D) × 55cm (H)",  price: 800000,  priceDisplay: "₦800,000",   image: null },
      { id: "80cm",  label: "80cm Vanity Cabinet", dimensions: "80cm (W) × 50cm (D) × 55cm (H)",  price: 950000,  priceDisplay: "₦950,000",   image: null },
      { id: "120cm", label: "1.2m Vanity Cabinet", dimensions: "120cm (W) × 50cm (D) × 55cm (H)", price: 1350000, priceDisplay: "₦1,350,000", image: null },
    ],

    features: [
      { icon: "diamond",   label: "Premium Materials",              description: "High-quality & durable" },
      { icon: "waterproof", label: "Waterproof & Moisture Resistant", description: "Built for humid environments" },
      { icon: "sparkles",  label: "Modern Aesthetic",              description: "Sleek, stylish & timeless look" },
      { icon: "storage",   label: "Spacious Storage",              description: "Large drawers for maximum space" },
      { icon: "shield",    label: "Durable Build",                 description: "Built to last for years" },
    ],

    materialDetails: [
      { label: "Textured Cabinet Front",  subtitle: "Elegant pattern, premium finish",     image: "/mock-products/vanity-cabinet/1.jpeg" },
      { label: "LED Ambient Lighting",    subtitle: "Warm glow for a modern atmosphere",   image: "/mock-products/vanity-cabinet/2.jpeg" },
      { label: "Spacious Basin Top",      subtitle: "Ceramic basin with generous countertop", image: "/mock-products/vanity-cabinet/primary.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 5. Smart Wall Hung Toilet (Bogat) ────────────────────────────────────
  {
    id: "bogat-swht-001",
    slug: "smart-wall-hung-toilet",
    sku: "BGT-SWHT-001",
    name: "Smart Wall Hung Toilet",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathroom-toilets",
    categoryName: "Bathroom Toilets",
    productTypeName: "Product",
    isFeatured: true,

    price: 1800000,
    compareAtPrice: null,
    priceDisplay: "₦1,800,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "5 Years",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/hung-toilet/primary.jpeg",
    images: [
      "/mock-products/hung-toilet/primary.jpeg",
      "/mock-products/hung-toilet/1.jpeg",
      "/mock-products/hung-toilet/2.jpeg",
    ],

    shortDescription:
      "Smart wall hung toilet with heated seat, auto open/close lid, warm water washing, air dryer, night light, and foot sensor. Single 1.8m size.",
    description:
      "Experience the perfect blend of innovation, hygiene and luxury. This smart wall hung toilet offers advanced features for ultimate comfort and a cleaner, smarter bathroom.",

    tags: ["toilet", "bathroom", "smart", "bogat", "wall hung", "heated seat"],
    rating: 4.9,
    reviewCount: 14,
    ratingDistribution: { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Modern Design | Intelligent Comfort | Premium Quality",

    variants: [
      { id: "1.8m", label: "1.8m", dimensions: "Standard 1.8m", price: 1800000, priceDisplay: "₦1,800,000", image: null },
    ],

    featuresList: [
      "Wall hung design for a sleek and modern look",
      "Auto open/close lid",
      "Heated seat with adjustable temperature",
      "Warm water washing (front & rear)",
      "Adjustable water temperature & pressure",
      "Air dryer with adjustable temperature",
      "Night light",
      "Foot sensor & remote control operation",
      "Soft close seat & lid",
      "Antibacterial glaze for better hygiene",
      "Energy saving & water efficient",
      "Easy installation with in-wall tank system",
    ],

    features: [
      { icon: "sparkles",  label: "Smart Technology", description: "Advanced functionality" },
      { icon: "waterproof", label: "Ultimate Hygiene", description: "Clean & refreshing" },
      { icon: "diamond",   label: "Premium Comfort",  description: "Heated seat & warm wash" },
      { icon: "storage",   label: "Remote & Sensor",  description: "Easy & touch free control" },
      { icon: "shield",    label: "Durable Quality",  description: "Built to last with premium materials" },
    ],

    materialDetails: [
      { label: "Smart Control Panel", subtitle: "Intuitive touch & remote operation", image: "/mock-products/hung-toilet/1.jpeg" },
      { label: "Wall-Hung Installation", subtitle: "Sleek, space-saving modern look",  image: "/mock-products/hung-toilet/2.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 6. Waterfall Kitchen Faucet (Bogat) ──────────────────────────────────
  {
    id: "bogat-wkf-8801",
    slug: "waterfall-kitchen-faucet",
    sku: "TBM-WF-8801",
    name: "Waterfall Kitchen Faucet",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "kitchen-faucets",
    categoryName: "Kitchen Faucets",
    productTypeName: "Product",
    isFeatured: false,

    price: 155000,
    compareAtPrice: null,
    priceDisplay: "₦155,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "1 Year",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/waterfall-kitchen-faucet/primary.jpeg",
    images: [
      "/mock-products/waterfall-kitchen-faucet/primary.jpeg",
      "/mock-products/waterfall-kitchen-faucet/1.jpeg",
      "/mock-products/waterfall-kitchen-faucet/2.jpeg",
      "/mock-products/waterfall-kitchen-faucet/3.jpeg",
    ],

    shortDescription:
      "Premium waterfall kitchen faucet with flexible neck, 360° rotation, and single lever control. Available in Silver, Gunmetal, and Black.",
    description:
      "Experience the perfect blend of luxury and performance. The wide waterfall spout delivers a smooth, elegant flow while the flexible neck and 360° rotation make every task in the kitchen effortless.",

    tags: ["kitchen faucet", "waterfall", "bogat", "flexible neck", "360 rotation"],
    rating: 4.6,
    reviewCount: 22,
    ratingDistribution: { 5: 65, 4: 22, 3: 8, 2: 3, 1: 2 },

    collection: "Premium Kitchen Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Luxury | Modern | Functional",

    variants: [],

    featuresList: [
      "Wide waterfall flow for a premium look",
      "Flexible neck for easy movement",
      "360° rotation for full sink access",
      "Premium brass construction",
      "Smooth single lever control",
      "Rust & corrosion resistant finish",
      "Easy single-hole installation",
    ],

    features: [
      { icon: "waterproof", label: "Waterfall Flow",              description: "Wide & gentle water flow" },
      { icon: "sparkles",  label: "Flexible Neck",               description: "Easy reach & movement" },
      { icon: "storage",   label: "360° Rotation",               description: "Full sink coverage" },
      { icon: "diamond",   label: "Premium Brass",               description: "High-quality & durable" },
      { icon: "shield",    label: "Rust & Corrosion Resistant",  description: "Long-lasting finish" },
    ],

    specifications: [
      { label: "Model No.",        value: "TBM-WF-8801" },
      { label: "Material",         value: "Brass" },
      { label: "Finish",           value: "Silver / Gunmetal / Black" },
      { label: "Installation",     value: "Deck Mounted" },
      { label: "Function",         value: "Hot & Cold Mixer" },
      { label: "Cartridge",        value: "Ceramic" },
      { label: "Rotation",         value: "360°" },
      { label: "Hole Requirement", value: "Single Hole" },
    ],

    dimensions: "320mm height × 220mm reach (front) | 260mm height × 190mm reach (side) | 50mm base",

    materialDetails: [
      { label: "Flexible Neck",        subtitle: "Bend & adjust with ease",           image: "/mock-products/waterfall-kitchen-faucet/1.jpeg" },
      { label: "Single Lever Control", subtitle: "Smooth hot & cold operation",       image: "/mock-products/waterfall-kitchen-faucet/2.jpeg" },
      { label: "Multi-Color Options",  subtitle: "Silver | Gunmetal | Black",         image: "/mock-products/waterfall-kitchen-faucet/3.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 7. Luxury Freestanding Bathtub (Bogat) ───────────────────────────────
  {
    id: "bogat-lfb-001",
    slug: "luxury-freestanding-bathtub",
    sku: "BGT-LFB-001",
    name: "Luxury Freestanding Bathtub",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathtubs",
    categoryName: "Bathtubs",
    productTypeName: "Product",
    isFeatured: true,

    price: 1200000,
    compareAtPrice: null,
    priceDisplay: "₦1,200,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "3 Years",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/free-standing-bathub/primary.jpeg",
    images: [
      "/mock-products/free-standing-bathub/primary.jpeg",
      "/mock-products/free-standing-bathub/1.jpeg",
      "/mock-products/free-standing-bathub/2.jpeg",
      "/mock-products/free-standing-bathub/3.jpeg",
    ],

    shortDescription:
      "Luxury freestanding bathtub crafted from premium acrylic/artificial stone. Ergonomic curved design for deep soaking comfort. Available in Matte Black and Gloss White.",
    description:
      "A perfect blend of elegance and relaxation. This freestanding bathtub is designed to deliver a spa-like experience and elevate the aesthetics of your bathroom.",

    tags: ["bathtub", "freestanding", "bogat", "luxury", "acrylic", "soaking"],
    rating: 4.9,
    reviewCount: 9,
    ratingDistribution: { 5: 88, 4: 8, 3: 3, 2: 0, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Luxury | Modern | Comfort",

    variants: [],

    featuresList: [
      "Ergonomic curved design",
      "Deep soaking comfort",
      "Premium acrylic/artificial stone material",
      "Smooth & easy-to-clean surface",
      "Scratch & stain resistant",
      "Freestanding installation",
    ],

    features: [
      { icon: "shield",    label: "Premium Build",     description: "Strong & durable" },
      { icon: "sparkles",  label: "Smooth Finish",     description: "Easy to clean surface" },
      { icon: "diamond",   label: "Modern Design",     description: "Elegant & stylish" },
      { icon: "waterproof", label: "Easy Maintenance", description: "Stain resistant & hygienic" },
      { icon: "storage",   label: "Durable Material",  description: "Long lasting performance" },
    ],

    specifications: [
      { label: "Material",      value: "Acrylic / Artificial Stone" },
      { label: "Finish",        value: "Matte Black / Gloss White" },
      { label: "Installation",  value: "Freestanding" },
      { label: "Function",      value: "Soaking Tub" },
      { label: "Usage",         value: "Bathroom / Hotel" },
      { label: "Drain",         value: "Included" },
      { label: "MOQ",           value: "1 Piece" },
    ],

    dimensions: "1700mm (L) × 800mm (W) × 580mm (H)",

    materialDetails: [
      { label: "Sleek Shape",      subtitle: "Elegant curved design for ultimate comfort",            image: "/mock-products/free-standing-bathub/1.jpeg" },
      { label: "Premium Material", subtitle: "High quality acrylic/artificial stone construction",    image: "/mock-products/free-standing-bathub/2.jpeg" },
      { label: "Color Options",    subtitle: "Black | White",                                         image: "/mock-products/free-standing-bathub/3.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 8. Flexible Neck Kitchen Faucet (Bogat) ──────────────────────────────
  {
    id: "bogat-fnkf-2207",
    slug: "flexible-neck-kitchen-faucet",
    sku: "TBM-KF-2207",
    name: "Flexible Neck Kitchen Faucet",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "kitchen-faucets",
    categoryName: "Kitchen Faucets",
    productTypeName: "Product",
    isFeatured: false,

    price: 120000,
    compareAtPrice: null,
    priceDisplay: "₦120,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "1 Year",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/flexible-kitchen-faucet/primary.jpeg",
    images: [
      "/mock-products/flexible-kitchen-faucet/primary.jpeg",
      "/mock-products/flexible-kitchen-faucet/1.jpeg",
      "/mock-products/flexible-kitchen-faucet/2.jpeg",
      "/mock-products/flexible-kitchen-faucet/3.jpeg",
    ],

    shortDescription:
      "Premium flexible neck kitchen faucet with 360° rotation, textured brass body, and smooth water flow. Available in Gold, Chrome, Black, and Black+Red.",
    description:
      "Upgrade your kitchen with this premium flexible neck faucet designed for modern homes. Built with high-quality brass and a durable flexible hose, it combines elegance with everyday functionality.",

    tags: ["kitchen faucet", "flexible neck", "bogat", "360 rotation", "brass"],
    rating: 4.7,
    reviewCount: 16,
    ratingDistribution: { 5: 68, 4: 20, 3: 8, 2: 3, 1: 1 },

    collection: "Premium Kitchen Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Luxury | Modern | Functional",

    variants: [],

    featuresList: [
      "Flexible silicone neck for easy movement",
      "360° rotation for full sink coverage",
      "Premium brass construction",
      "Smooth water flow system",
      "Scratch & corrosion resistant finish",
      "Easy single-hole installation",
    ],

    features: [
      { icon: "diamond",   label: "Premium Brass",       description: "High-quality & durable" },
      { icon: "sparkles",  label: "Luxury Finish",       description: "Stylish modern texture" },
      { icon: "waterproof", label: "Smooth Water Flow",  description: "Efficient & splash-free" },
      { icon: "storage",   label: "360° Rotation",       description: "Flexible usage" },
      { icon: "shield",    label: "Durable Build",       description: "Long-lasting performance" },
    ],

    specifications: [
      { label: "Model No.",        value: "TBM-KF-2207" },
      { label: "Material",         value: "Brass + Silicone Neck" },
      { label: "Finish",           value: "Brush Gold / Chrome / Black" },
      { label: "Installation",     value: "Deck Mounted" },
      { label: "Function",         value: "Hot & Cold Mixer" },
      { label: "Cartridge",        value: "Ceramic" },
      { label: "Rotation",         value: "360°" },
      { label: "Hole Requirement", value: "Single Hole" },
    ],

    dimensions: "480mm height × 50mm base (front) | 230mm height × 220mm reach (side)",

    materialDetails: [
      { label: "Modern Flexible Spout", subtitle: "Easy movement & control",          image: "/mock-products/flexible-kitchen-faucet/1.jpeg" },
      { label: "Textured Body Design",  subtitle: "Unique luxury grip finish",        image: "/mock-products/flexible-kitchen-faucet/2.jpeg" },
      { label: "Multi-Color Options",   subtitle: "Gold | Chrome | Black | Black+Red", image: "/mock-products/flexible-kitchen-faucet/3.jpeg" },
    ],

    components: [],

    trustBadges: BOGAT_TRUST_BADGES,
  },

  // ── 9. Bathroom Accessory Set (Bogat) ────────────────────────────────────
  {
    id: "bogat-bas-001",
    slug: "bathroom-accessory-set",
    sku: "BGT-BAS-001",
    name: "Bathroom Accessory Set",
    brandName: "Bogat",
    brandType: "Bogat",
    categoryId: "bathroom-accessories",
    categoryName: "Bathroom Accessories",
    productTypeName: "Product",
    isFeatured: false,

    price: 250000,
    compareAtPrice: null,
    priceDisplay: "₦250,000",
    showPrice: true,
    vatInclusive: true,
    warranty: "1 Year",

    inStock: true,
    stockQuantity: null,
    trackInventory: false,

    primaryImageUrl: "/mock-products/accessory-set/primary.jpeg",
    images: [
      "/mock-products/accessory-set/primary.jpeg",
      "/mock-products/accessory-set/1.jpeg",
      "/mock-products/accessory-set/2.jpeg",
      "/mock-products/accessory-set/3.jpeg",
    ],

    shortDescription:
      "Complete bathroom accessory set in Black & Gold finish — includes towel rack, towel bar, hooks, corner shelves, toilet paper holder, and toilet brush holder.",
    description:
      "A complete bathroom accessory set designed to bring luxury, organisation, and functionality to your space. Made with premium stainless steel and aluminium for long-lasting beauty and performance.",

    tags: ["bathroom accessories", "towel rack", "bogat", "black gold", "wall mounted"],
    rating: 4.7,
    reviewCount: 28,
    ratingDistribution: { 5: 72, 4: 18, 3: 7, 2: 2, 1: 1 },

    collection: "Premium Bathroom Collection",
    collectionSubtitle: "Designed for Modern Living",
    tagline: "Luxury | Elegant | Durable",

    variants: [],

    featuresList: [
      "Complete set for a modern bathroom",
      "Space-saving design for better organisation",
      "Rust-proof & water-resistant",
      "Premium finish for a luxury look",
      "Easy to install & maintain",
      "Durable construction for long-lasting use",
    ],

    features: [
      { icon: "diamond",   label: "Premium Quality",    description: "High grade materials" },
      { icon: "storage",   label: "Large Capacity",     description: "Extra space for towels & more" },
      { icon: "shield",    label: "Rust Proof",         description: "Corrosion resistant" },
      { icon: "waterproof", label: "Water Resistant",   description: "Built for wet environments" },
      { icon: "sparkles",  label: "Easy Installation",  description: "Strong & secure mounting" },
    ],

    specifications: [
      { label: "Material",      value: "Stainless Steel / Aluminium" },
      { label: "Finish",        value: "Black & Gold" },
      { label: "Installation",  value: "Wall Mounted" },
      { label: "Set Includes",  value: "Towel Rack, Towel Bar, Hooks, Corner Shelves, Toilet Paper Holder, Toilet Brush Holder" },
      { label: "Usage",         value: "Bathrooms / Hotels / Apartments" },
    ],

    dimensions: "Towel Rack: 600×200×230mm | Towel Bar: 400×70mm | Corner Shelf: 220×220×70mm",

    materialDetails: [
      { label: "Multi-Layer Rack",      subtitle: "Large storage for towels & bath items",         image: "/mock-products/accessory-set/1.jpeg" },
      { label: "Multi-Purpose Hooks",   subtitle: "Hang towels, robes & accessories",              image: "/mock-products/accessory-set/2.jpeg" },
      { label: "Space Saving Shelves",  subtitle: "Perfect for corners, neat & organised",         image: "/mock-products/accessory-set/3.jpeg" },
    ],

    components: [
      { label: "Premium Accessories", description: "Complete set for a luxurious bathroom", image: "/mock-products/accessory-set/primary.jpeg" },
    ],

    trustBadges: BOGAT_TRUST_BADGES,
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Returns the full paginated response envelope the listing page expects. */
export function getMockProductList({ page = 1, pageSize = 12 } = {}) {
  const start = (page - 1) * pageSize;
  const items = BOGAT_PRODUCTS.slice(start, start + pageSize);
  return {
    items,
    totalCount: BOGAT_PRODUCTS.length,
    pageNumber: page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(BOGAT_PRODUCTS.length / pageSize)),
    hasPreviousPage: page > 1,
    hasNextPage: start + pageSize < BOGAT_PRODUCTS.length,
  };
}

/** Returns a single product by slug or id, or null. */
export function getMockProductBySlug(slugOrId) {
  return (
    BOGAT_PRODUCTS.find(
      (p) => p.slug === slugOrId || p.id === slugOrId,
    ) ?? null
  );
}

/** Returns similar products from the same category, excluding the given id. */
export function getMockSimilarProducts(categoryId, excludeId, limit = 8) {
  return BOGAT_PRODUCTS.filter(
    (p) => p.categoryId === categoryId && p.id !== excludeId,
  ).slice(0, limit);
}
